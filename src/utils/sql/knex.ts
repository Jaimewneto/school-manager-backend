/* eslint-disable @typescript-eslint/no-unused-vars */
import { Clause, OrderBy } from "@/types/clause";

import SQLClauseUtils from "@utils/sql/clause";

import knex from "@database/connections/knex";

import { Knex } from "knex";
import { SQLUtils } from ".";

/**
 * Condições de Withs (CTEs) adicionais, podendo ser strings ou Knex.Raw.
 */
export type KnexWith = {
    alias: string;
    query: string | Knex.Raw;
};

/**
 * Parâmetros base para construir uma query no Knex.
 */
type BuildKnexBaseQueryParams<T = unknown> = {
    /** Nome da tabela base da query. */
    table: string;
    /** Estrutura de cláusulas avançadas. */
    clause?: Clause<T>;
    /** Condições para uso interno, usando a estrutura do clause */
    where?: Clause<T>;
    /** Scoped filters */
    scopedFilters?: Clause<T>;
    /** Filtros internos usados somente dentro do baseRepository */
    internalFilters?: Knex.Raw[];
    /** Condições de joins adicionais, podendo ser strings ou Knex.Raw. */
    joins?: (string | Knex.Raw)[];
    /** Condições de with adicionais, podendo ser strings ou Knex.Raw. */
    withs?: KnexWith[];
};

/**
 * Parâmetros para construir uma query principal no Knex.
 */
export interface BuildKnexMainQueryParams<T = unknown> extends BuildKnexBaseQueryParams<T> {
    /** Campos a serem selecionados, aceitando strings ou instâncias do Knex.Raw. */
    fields: (string | Knex.Raw)[];

    /** Limite máximo de registros a serem retornados. */
    limit?: number;
    /** Quantidade de registros a serem ignorados (offset). */
    offset?: number;
    /** Regras de ordenação da query. */
    orderBy?: OrderBy<T>[];
    /** Campos adicionais a serem selecionados. */
    additionalFields?: (string | Knex.Raw)[];
}

/**
 * Parâmetros para construir uma query de contagem (`COUNT(*)`) no Knex.
 */
export interface BuildKnexCountQueryParams<T = unknown> extends BuildKnexBaseQueryParams<T> {
    /** Campo a ser utilizado na função de contagem. */
    field?: string;
    /** Alias para o resultado da contagem. */
    alias?: string;
}

/**
 * Parâmetros para construir uma query de inserção no Knex.
 */
export interface BuildKnexInsertQueryParams<T = unknown> {
    /** Nome da tabela base da query. */
    table: string;
    /** Dados a serem inseridos. */
    data: Record<string, any>;
    /** Campos que podem ser preenchidos */
    fillable: string[];
    /** Campos a serem retornados */
    retuning?: (string | Knex.Raw)[];
}

/**
 * Parâmetros para construir uma query de inserção com tratativa de conflitos no Knex.
 */
export interface BuildKnexInsertOnConflictQueryParams<T = unknown> {
    /** Nome da tabela base da query. */
    table: string;
    /** Dados a serem inseridos. */
    insert: Record<string, any>;
    /** Dados a serem atualizados */
    update: Record<string, any>;
    /** Campos que podem ser preenchidos */
    fillable: string[];
    /** Campos a serem retornados */
    retuning?: (string | Knex.Raw)[];
    /** Colunas para checar o conflito */
    conflictColumns: string[];
}

/**
 * Parâmetros para construir uma query de inserção múltipla com tratativa de conflitos no Knex.
 */
export interface BuildKnexInsertManyOnConflictQueryParams<T = unknown> {
    /** Nome da tabela base da query. */
    table: string;
    /** Dados a serem inseridos (múltiplos registros). */
    insert: Record<string, any>[];
    /** Campos que podem ser preenchidos. */
    fillable: string[];
    /** Campos a serem retornados. */
    retuning?: (string | Knex.Raw)[];
    /** Colunas para checar o conflito. */
    conflictColumns: string[];
}

export interface BuildKnexUpdateByClauseQueryParams<T = unknown> {
    /** Nome da tabela base da query. */
    table: string;
    /** Clause para poder encontrar o registro a ser atualizado */
    clause: Clause<T>;
    /** Scoped filters */
    scopedFilters?: Clause<T>;
    /** Dados a serem inseridos. */
    data: Record<string, any>;
    /** Campos que podem ser preenchidos */
    fillable: string[];
    /** Campos a serem retornados */
    retuning?: (string | Knex.Raw)[];
}

export interface BuildKnexDeleteByClauseQueryParams<T = unknown> {
    /** Nome da tabela base da query. */
    table: string;
    /** Clause para poder encontrar o registro a ser deletado */
    clause: Clause<T>;
    /** Scoped filters */
    scopedFilters?: Clause<T>;
}

const ParseClauseObject = (query: Knex.QueryBuilder, clause: Clause): Knex.QueryBuilder => {
    return SQLClauseUtils.KnexBuildClause(query, clause);
};

/**
 * Constrói uma query principal utilizando Knex QueryBuilder.
 */
const BuildKnexMainQuery = <T>({
    fields,
    table,
    withs,
    limit,
    offset,
    orderBy,

    where,
    clause,
    scopedFilters,
    internalFilters,

    joins,
    additionalFields,
}: BuildKnexMainQueryParams<T>): Knex.QueryBuilder => {
    const queryBuilder = knex(table);

    // adiciona o prefixo da tabela no field
    fields = fields.map((field) => {
        if (typeof field === "string") {
            if (field.includes(".")) {
                return knex.raw(field);
            }
            return knex.raw(`${table}.${field}`);
        }

        return knex.raw(field); // Retorna o campo original se não for string
    });

    if (fields.length === 0) {
        fields.push(knex.raw(`${table}.*`));
    }

    if (additionalFields) {
        for (const field of additionalFields) {
            fields.push(knex.raw(field));
        }
    }

    queryBuilder.select(fields); // Aplica os selects

    ProcessWithsConditions(queryBuilder, withs); // Processa as condições `with`
    ProcessJoinsConditions(queryBuilder, joins); // Processa as condições `join`

    ProcessWhereConditions(queryBuilder, where); // Processa as condições `where`
    ProcessClauseConditions(queryBuilder, clause); // Processa a estrutura do `clause`
    ProcessScopedFiltersConditions(queryBuilder, scopedFilters); // Processa a estrutura do `scopedFilters`
    ProcessInternalFiltersConditions(queryBuilder, internalFilters); // Processa a estrutura do `internalFilters`

    ProcessOrderByConditions(queryBuilder, orderBy); // Processa as condições `orderBy`

    if (limit) queryBuilder.limit(limit); // Adiciona limite, se especificado
    if (offset) queryBuilder.offset(offset); // Adiciona deslocamento, se especificado

    return queryBuilder;
};

/**
 * Constrói uma query de contagem (`COUNT(*)`) utilizando Knex QueryBuilder.
 */
const BuildKnexCountQuery = <T>({
    table,

    withs,
    joins,
    where,
    clause,
    scopedFilters,
    internalFilters,

    field = "*",
    alias = "contagem",
}: BuildKnexCountQueryParams<T>): Knex.QueryBuilder => {
    const queryBuilder = knex(table).count(`${field} as ${alias}`); // Inicializa o QueryBuilder

    ProcessWithsConditions(queryBuilder, withs); // Processa as condições `with`
    ProcessJoinsConditions(queryBuilder, joins); // Processa as condições `join`

    ProcessWhereConditions(queryBuilder, where); // Processa as condições `where`
    ProcessClauseConditions(queryBuilder, clause); // Processa a estrutura do `clause`
    ProcessScopedFiltersConditions(queryBuilder, scopedFilters); // Processa a estrutura do `scopedFilters`
    ProcessInternalFiltersConditions(queryBuilder, internalFilters); // Processa a estrutura do `internalFilters`

    return queryBuilder;
};

/**
 * Converte um Knex QueryBuilder para o formato "nativo" utilizado pelo `node-pg`.
 *
 * @param queryBuilder Instância do Knex QueryBuilder.
 * @returns Objeto contendo a SQL e os valores associados.
 */
const KnexQueryToNative = (queryBuilder: Knex.QueryBuilder) => {
    const nativeQuery = queryBuilder.toSQL().toNative(); // Converte a query para o formato nativo
    return {
        sql: nativeQuery.sql,
        values: nativeQuery.bindings as any[], // Retorna a SQL e os valores
    };
};

/**
 * Aplica uma cláusula avançada a um Knex QueryBuilder.
 */
const ProcessClauseConditions = <T>(query: Knex.QueryBuilder, clause?: Clause<T>): Knex.QueryBuilder => {
    if (!clause) return query;
    return SQLClauseUtils.KnexBuildClause(query, clause);
};

/**
 * Processa as condições scopedfilters em um Knex QueryBuilder.
 * Adiciona as condições processadas ao QueryBuilder.
 *
 * @param queryBuilder Instância do Knex QueryBuilder onde as condições serão aplicadas.
 * @param scopedFilters Objeto {@link Clause} representando as condições scopedfilters.
 */
const ProcessScopedFiltersConditions = <T>(queryBuilder: Knex.QueryBuilder, scopedFilters?: Clause<T>): Knex.QueryBuilder => {
    if (!scopedFilters) return queryBuilder;
    return SQLClauseUtils.KnexBuildClause(queryBuilder, scopedFilters);
};

/**
 * Processa as condições where em um Knex QueryBuilder.
 * Adiciona as condições processadas ao QueryBuilder.
 *
 * @param queryBuilder Instância do Knex QueryBuilder onde as condições serão aplicadas.
 * @param where Objeto {@link Clause} representando as condições where.
 */
const ProcessWhereConditions = <T>(queryBuilder: Knex.QueryBuilder, where?: Clause<T>): Knex.QueryBuilder => {
    if (!where) return queryBuilder;
    return SQLClauseUtils.KnexBuildClause(queryBuilder, where);
};

/**
 * Processa as condições internas em um Knex QueryBuilder.
 * Adiciona as condições processadas ao QueryBuilder.
 *
 * @param QueryBuilder Instância do Knex QueryBuilder onde as condições serão aplicadas.
 * @param internalFilters Array de Knex.Raw representando as condições internas.
 */
const ProcessInternalFiltersConditions = (queryBuilder: Knex.QueryBuilder, internalFilters?: Knex.Raw[]): Knex.QueryBuilder => {
    if (!internalFilters) return queryBuilder;
    for (const filter of internalFilters) {
        queryBuilder.whereRaw(filter);
    }
    return queryBuilder;
};

/**
 * Processa e aplica condições de ordenação (`ORDER BY`) a um Knex QueryBuilder.
 *
 * @param queryBuilder Instância do Knex QueryBuilder onde as condições serão aplicadas.
 * @param orders Array de objetos representando as condições de ordenação. Cada objeto deve conter o campo (`field`) e a direção (`direction`).
 */
const ProcessOrderByConditions = <T>(queryBuilder: Knex.QueryBuilder, orders?: OrderBy<T>[]): Knex.QueryBuilder => {
    if (!Array.isArray(orders) || orders.length === 0) return queryBuilder;

    // Itera sobre cada condição de ordenação no array `orders`
    orders.forEach((order) => {
        if (order.raw) {
            queryBuilder.orderByRaw(knex.raw(order.raw));
            return;
        }

        // Aplica a condição de ordenação ao QueryBuilder
        queryBuilder.orderBy(order.field, order.direction);
    });

    // Retorna a instância do QueryBuilder para encadeamento ou execução posterior
    return queryBuilder;
};

/**
 * Processa condições de join em um Knex QueryBuilder.
 */
const ProcessJoinsConditions = (query: Knex.QueryBuilder, joins: (string | Knex.Raw)[] | undefined): Knex.QueryBuilder => {
    if (!Array.isArray(joins)) return query;

    // Itera sobre cada condição de join no array `joins`
    joins.forEach((join) => {
        if (knex.raw("")?.constructor === join?.constructor) {
            query.join(join as Knex.Raw);
            return;
        }

        if (typeof join === "string") {
            query.joinRaw(join);
            return;
        }

        throw new Error(`Unsupported join type: ${typeof join}`);
    });

    return query;
};

/**
 * Processa condições With em um Knex QueryBuilder.
 */
const ProcessWithsConditions = (query: Knex.QueryBuilder, withs?: KnexWith[]): Knex.QueryBuilder => {
    if (!Array.isArray(withs)) return query;

    // Itera sobre cada condição de join no array `joins`
    withs.forEach((w) => {
        if (knex.raw("")?.constructor === w.query?.constructor) {
            query.with(w.alias, w.query as Knex.Raw);
            return;
        }

        if (typeof w.query === "string") {
            query.with(w.alias, knex.raw(w.query));
            return;
        }

        throw new Error(`Unsupported with query type: ${typeof w}`);
    });

    return query;
};

const BuildKnexInsertQuery = ({
    table,
    data,

    fillable = [],
    retuning = [],
}: BuildKnexInsertQueryParams): Knex.QueryBuilder => {
    // returning
    if (retuning.length === 0) {
        retuning.push("*");
    }

    const query = knex(table) //
        .insert(SQLUtils.filterFieldsByFillable({ data, fillable }))
        .returning(retuning);

    return query;
};

const BuildKnexInsertOnConflictQuery = ({
    //
    table,

    insert,
    update,

    fillable,

    retuning = [],

    conflictColumns = [],
}: BuildKnexInsertOnConflictQueryParams): Knex.QueryBuilder => {
    // returning
    if (retuning.length === 0) {
        retuning.push("*");
    }

    // retorna se o registro foi inserido ou atualizado
    retuning.push(knex.raw(`(xmax = 0) AS is_record_created`));

    const query = knex(table) //
        .insert(SQLUtils.filterFieldsByFillable({ data: insert, fillable: fillable }))
        .onConflict(conflictColumns)
        .merge(SQLUtils.filterFieldsByFillable({ data: update, fillable: fillable }))
        .returning(retuning);

    return query;
};

const BuildKnexInsertManyOnConflictQuery = <T>({
    table,
    insert,
    fillable,
    retuning = [],
    conflictColumns,
}: BuildKnexInsertManyOnConflictQueryParams<T>): Knex.QueryBuilder => {
    if (retuning.length === 0) {
        retuning.push("*");
    }

    retuning.push(knex.raw(`(xmax = 0) AS is_record_created`));

    const query = knex(table)
        .insert(insert.map((item) => SQLUtils.filterFieldsByFillable({ data: item, fillable })))
        .onConflict(conflictColumns)
        .merge() // aplica automaticamente EXCLUDED.coluna para os campos
        .returning(retuning);

    return query;
};

const BuildKnexUpdateByClauseQuery = ({
    table,
    data,

    clause,
    scopedFilters,

    fillable = [],
    retuning = [],
}: BuildKnexUpdateByClauseQueryParams): Knex.QueryBuilder => {
    // returning
    if (retuning.length === 0) {
        retuning.push("*");
    }

    // cria o Knex.QueryBuilder
    const queryBuilder = knex(table);

    // aplica o update
    queryBuilder.update(SQLUtils.filterFieldsByFillable({ data, fillable }));

    // processa as condições `clause`
    ProcessClauseConditions(queryBuilder, clause);

    // processa as condições `scopedFilters`
    ProcessScopedFiltersConditions(queryBuilder, scopedFilters);

    return queryBuilder.returning(retuning);
};

const BuildKnexDeleteByClauseQuery = ({ table, clause, scopedFilters }: BuildKnexDeleteByClauseQueryParams): Knex.QueryBuilder => {
    // cria o Knex.QueryBuilder
    const queryBuilder = knex(table);

    // aplica o delete
    queryBuilder.delete();

    // processa as condições `clause`
    ProcessClauseConditions(queryBuilder, clause);

    // processa as condições `scopedFilters`
    ProcessScopedFiltersConditions(queryBuilder, scopedFilters);

    return queryBuilder;
};

const KnexUtils = {
    ProcessJoinsConditions,
    ProcessWhereConditions,
    ProcessClauseConditions,
    ProcessOrderByConditions,

    ParseClauseObject,

    BuildKnexMainQuery,
    BuildKnexCountQuery,

    BuildKnexInsertQuery,
    BuildKnexInsertOnConflictQuery,
    BuildKnexInsertManyOnConflictQuery,
    BuildKnexUpdateByClauseQuery,
    BuildKnexDeleteByClauseQuery,

    KnexQueryToNative,
};

export default KnexUtils;
