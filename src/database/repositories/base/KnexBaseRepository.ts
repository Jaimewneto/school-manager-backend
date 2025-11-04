import { Clause } from "@/types/clause";

// DATABASE
import knex from "@database/connections/knex";
import { DBPoolClient, PoolClient } from "@database/connections/postgres";

// TYPES
import {
    iRepositoryFetchMany,
    iRepositoryFetchOne,
    iRepositoryFetchOneByPk,
    iRepositoryInsertManyOnConflictRecord,
    iRepositoryInsertOnConflictRecord,
    iRepositoryInsertRecord,
    iRepositoryTransactionParams,
    iRepositoryUpdateRecords,
    iRepositoryUpdateRecordByPk,
} from "./types";

// UTILS
import KnexUtils, { BuildKnexMainQueryParams } from "@utils/sql/knex";

export abstract class BaseRepository<
    TableModel extends Record<string, any> = Record<string, any>,
    TableModelInsert extends Record<string, any> = TableModel,
    TableModelUpdate extends Record<string, any> = TableModel,
> {
    private table: string;
    private primaryKey: string;

    private softDelete: boolean = true;
    private softDeleteColumn: string = "deletado_em";

    private updatedAt: boolean = true;
    private updatedAtColumn: string = "atualizado_em";

    private fillableColumns: string[] = [];
    private selectableColumns: string[] = [];

    private entityClass: any;

    constructor({
        table,
        primaryKey,

        softDelete = true,
        softDeleteColumn = "deletado_em" as any,

        updatedAt = true,
        updatedAtColumn = "atualizado_em" as any,

        fillableColumns = [],
        selectableColumns = [],

        entityClass,
    }: {
        table: string;
        primaryKey: keyof TableModel;

        softDelete?: boolean;
        softDeleteColumn?: keyof TableModel;

        updatedAt?: boolean;
        updatedAtColumn?: keyof TableModel;

        fillableColumns?: Array<keyof TableModel>;
        selectableColumns?: Array<keyof TableModel>;

        entityClass?: any;
    }) {
        this.table = table;
        this.primaryKey = primaryKey as any;

        this.softDelete = softDelete;
        this.softDeleteColumn = softDeleteColumn as any;

        this.updatedAt = updatedAt;
        this.updatedAtColumn = updatedAtColumn as any;

        this.fillableColumns = fillableColumns as string[];
        this.selectableColumns = selectableColumns as string[];

        this.entityClass = entityClass;
    }

    public async fetchOne(params: iRepositoryFetchOne<TableModel>): Promise<TableModel | null> {
        const {
            db,

            // pega os campos que foram enviados da classe pai
            fields = this.selectableColumns,

            where,
            clause,

            orderBy = [],
            withs = [],
            joins = [],
            additionalFields = [],

            showDeleted = false,
        } = params;

        const scopedFilters = this.getScopedFilters();

        const internalFilters: BuildKnexMainQueryParams["internalFilters"] = [];

        if (this.softDelete && !showDeleted) {
            internalFilters.push(knex.raw(`"${this.table}"."${this.softDeleteColumn}" IS NULL`));
        }

        // Monta a query
        const mainQuery = KnexUtils.BuildKnexMainQuery({
            table: this.table,
            limit: 1,

            withs,
            joins,

            where,
            clause,
            scopedFilters,
            internalFilters,

            orderBy,

            fields,
            additionalFields,
        });

        // Gera a SQL final
        const mainSql = KnexUtils.KnexQueryToNative(mainQuery);

        const res = await db.query(mainSql.sql, mainSql.values);

        if (res?.rows?.length === 0) {
            return null;
        }

        const result = this.entityClass ? new this.entityClass(res.rows[0]) : res.rows[0];

        return result;
    }

    public async fetchOneByPk(params: iRepositoryFetchOneByPk) {
        return await this.fetchOne({
            ...params,
            showDeleted: params.showDeleted === true,
            orderBy: [{ field: this.primaryKey, direction: "desc" }],
            clause: {
                type: "and",
                conditions: [
                    //
                    { field: `${this.table}.${this.primaryKey}`, operator: "=", value: params.identifier },
                ],
            },
        });
    }

    public async fetchMany(params: iRepositoryFetchMany<TableModel>): Promise<[TableModel[], number]> {
        const {
            db,

            // pega os campos que foram enviados da classe pai
            fields = this.selectableColumns,

            where,
            clause,

            orderBy = [],
            withs = [],
            joins = [],
            additionalFields = [],

            skip,
            take,
        } = params;

        const scopedFilters = this.getScopedFilters();

        const internalFilters: BuildKnexMainQueryParams["internalFilters"] = [];

        if (this.softDelete) {
            internalFilters.push(knex.raw(`"${this.table}"."${this.softDeleteColumn}" IS NULL`));
        }

        const mainQuery = KnexUtils.BuildKnexMainQuery({
            table: this.table,
            limit: take,
            offset: skip,

            withs,
            joins,

            where,
            clause,
            scopedFilters,
            internalFilters,

            orderBy,

            fields,
            additionalFields,
        });

        const countQuery = KnexUtils.BuildKnexCountQuery({
            table: this.table,
            withs,
            joins,

            where,
            clause,
            scopedFilters,
            internalFilters,
        });

        // Gera a SQL final
        const mainSql = KnexUtils.KnexQueryToNative(mainQuery);
        const countSql = KnexUtils.KnexQueryToNative(countQuery);

        // executa as consultas no banco de dados
        const res = await db.query(mainSql.sql, mainSql.values);
        const count = await db.query(countSql.sql, countSql.values);

        // retorna a entidade
        const results = this.entityClass ? res.rows.map((item: any) => new this.entityClass(item)) : res.rows;

        return [results, Number(count.rows[0].contagem)];
    }

    public async insertRecord(params: iRepositoryInsertRecord<TableModelInsert>): Promise<TableModel> {
        const { data, db } = params;

        try {
            const scopedInsert = this.getScopedInsert();

            const payload = {
                ...(data as Record<string, any>),
                ...scopedInsert, // precisa sobrescrever possíveis campos do data
            };

            const insertQuery = KnexUtils.BuildKnexInsertQuery({
                table: this.table,
                data: payload,
                fillable: this.fillableColumns,
                retuning: [this.primaryKey],
            });

            const insertSql = KnexUtils.KnexQueryToNative(insertQuery);

            const { rows } = await db.query(insertSql.sql, insertSql.values);

            const result = await this.fetchOneByPk({
                db,
                identifier: rows[0][this.primaryKey],
            });

            return result!;
        } catch (e) {
            throw e;
        }
    }

    public async insertOnConflictRecord(
        params: iRepositoryInsertOnConflictRecord<TableModelInsert>,
    ): Promise<{ result: TableModel; created: boolean; updated: boolean }> {
        const { insert, update, conflictColumns, db } = params;

        try {
            const insertQuery = KnexUtils.BuildKnexInsertOnConflictQuery({
                table: this.table,
                insert: insert as Record<string, any>,
                update: update as Record<string, any>,

                conflictColumns: conflictColumns,

                fillable: this.fillableColumns,
                retuning: [this.primaryKey],
            });

            const insertSql = KnexUtils.KnexQueryToNative(insertQuery);

            const {
                rows: [result],
            } = await db.query(insertSql.sql, insertSql.values);

            const isCreated = result?.is_record_created === true;
            const isUpdated = !isCreated;

            const createdRecord = await this.fetchOneByPk({
                db,
                identifier: result[this.primaryKey],
            });

            return {
                result: createdRecord!,
                created: isCreated,
                updated: isUpdated,
            }!;
        } catch (e) {
            throw e;
        }
    }

    public async insertManyOnConflictRecord(
        params: iRepositoryInsertManyOnConflictRecord<TableModelInsert>,
    ): Promise<{ result: TableModel; created: boolean; updated: boolean }[]> {
        const { values: insert, conflictColumns, db } = params;

        try {
            const insertQuery = KnexUtils.BuildKnexInsertManyOnConflictQuery({
                table: this.table,
                insert: insert as Record<string, any>[],

                conflictColumns: conflictColumns,

                fillable: this.fillableColumns,
                retuning: ["*"], // precisa retornar * por causa da classe
            });

            const insertSql = KnexUtils.KnexQueryToNative(insertQuery);

            const { rows } = await db.query(insertSql.sql, insertSql.values);

            const result = [];

            for (const row of rows) {
                const isCreated = row?.is_record_created === true;
                const isUpdated = !isCreated;

                result.push({
                    result: (this.entityClass ? new this.entityClass(row) : row) as TableModel,
                    created: isCreated,
                    updated: isUpdated,
                });
            }

            return result;
        } catch (e) {
            throw e;
        }
    }

    //! Tomar cuidado ao usar essa função! (Pode afetar mais de um registro)
    public async updateRecords(params: iRepositoryUpdateRecords<TableModelUpdate>): Promise<TableModel[]> {
        const { data, where, db } = params;

        try {
            const scopedFilters = this.getScopedFilters();

            if (this.updatedAt && this.updatedAtColumn) {
                (data as Record<string, any>)[this.updatedAtColumn] = knex.raw("now()");
            }

            const updateQuery = KnexUtils.BuildKnexUpdateByClauseQuery({
                table: this.table,
                data: data as Record<string, any>,
                fillable: this.fillableColumns,
                retuning: [this.primaryKey],
                clause: where,
                scopedFilters,
            });

            const updateSql = KnexUtils.KnexQueryToNative(updateQuery);

            const { rows } = await db.query(updateSql.sql, updateSql.values);

            return rows;
        } catch (e) {
            throw e;
        }
    }

    public async updateRecordByPk(params: iRepositoryUpdateRecordByPk<TableModelUpdate>): Promise<TableModel> {
        const { data, identifier, db } = params;

        try {
            const scopedFilters = this.getScopedFilters();

            const where: Clause = {
                type: "and",
                conditions: [
                    //
                    { field: this.primaryKey, operator: "=", value: identifier },
                ],
            };

            if (this.updatedAt && this.updatedAtColumn) {
                (data as Record<string, any>)[this.updatedAtColumn] = knex.raw("now()");
            }

            const updateQuery = KnexUtils.BuildKnexUpdateByClauseQuery({
                table: this.table,
                data: data as Record<string, any>,
                fillable: this.fillableColumns,
                retuning: [this.primaryKey],
                clause: where,
                scopedFilters,
            });

            const updateSql = KnexUtils.KnexQueryToNative(updateQuery);

            const { rows } = await db.query(updateSql.sql, updateSql.values);

            const result = await this.fetchOneByPk({
                db,
                identifier: rows[0][this.primaryKey],
            });

            return result!;
        } catch (e) {
            throw e;
        }
    }

    public async removeRecordByPk(params: iRepositoryFetchOneByPk): Promise<TableModel> {
        const { identifier, db } = params;

        try {
            /**
             * Pega os filtros escopados
             */
            const scopedFilters = this.getScopedFilters();

            /**
             * Monta o clause para poder localizar o registro a ser excluído
             */
            const clause: Clause = {
                type: "and",
                conditions: [{ field: this.primaryKey, operator: "=", value: identifier }],
            };

            /**
             * Se for soft delete, é um update
             */
            if (this.softDelete && this.softDeleteColumn) {
                // monta os dados para o update
                const data: Record<string, any> = {
                    [this.softDeleteColumn]: knex.raw("now()"),
                };

                // se tiver também coluna de atualizado em, marca ela como atualizada
                if (this.updatedAt && this.updatedAtColumn) {
                    data[this.updatedAtColumn] = knex.raw("now()");
                }

                const updateQuery = KnexUtils.BuildKnexUpdateByClauseQuery({
                    table: this.table,
                    data: data as Record<string, any>,

                    fillable: this.fillableColumns,
                    retuning: [this.primaryKey],

                    clause,
                    scopedFilters,
                });

                const updateSql = KnexUtils.KnexQueryToNative(updateQuery);

                const { rows } = await db.query(updateSql.sql, updateSql.values);

                const result = await this.fetchOneByPk({
                    db,
                    showDeleted: true,
                    identifier: rows[0][this.primaryKey],
                });

                return result!;
            }

            /**
             * !HARD DELETE
             */

            // localiza o registro antes de deletar
            const resultBeforeDelete = await this.fetchOneByPk({ db, identifier });

            const deleteQuery = KnexUtils.BuildKnexDeleteByClauseQuery({ table: this.table, clause, scopedFilters });

            const deleteSql = KnexUtils.KnexQueryToNative(deleteQuery);

            await db.query(deleteSql.sql, deleteSql.values);

            return resultBeforeDelete!;
        } catch (e) {
            throw e;
        }
    }

    protected getScopedFilters(): Clause | undefined {
        // fallback padrão: sem escopo
        // essa função precisa ser definida individualmente em cada repositório, de acordo com o token JWT
        return undefined;
    }

    protected getScopedInsert(): Partial<TableModel> {
        // fallback padrão: sem escopo
        // essa função precisa ser definida individualmente em cada repositório, de acordo com o token JWT
        return {};
    }

    public transaction = async <T>(handle: iRepositoryTransactionParams<T>) => {
        const [, client] = await DBPoolClient();
        try {
            await client.query("BEGIN");

            const result = await handle(client);

            await client.query("COMMIT");

            return result;
        } catch (e) {
            await client.query("ROLLBACK");
            throw e;
        } finally {
            client.release();
        }
    };

    public async getWriteConnection(paramClient: PoolClient | null = null) {
        /**
         * Se o client é passado externamente, o controle da transação é feito fora também
         */
        if (paramClient) {
            return {
                client: paramClient,
                beginTransaction: async () => {},
                commitTransaction: async () => {},
                rollbackTransaction: async () => {},
                releaseConnection: async () => {},
            };
        }

        const [, client] = await DBPoolClient();
        return {
            client,
            beginTransaction: async () => {
                await client.query("BEGIN");
            },
            commitTransaction: async () => {
                await client.query("COMMIT");
            },
            rollbackTransaction: async () => {
                await client.query("ROLLBACK");
            },
            releaseConnection: async () => {
                client.release();
            },
        };
    }

    public async getReadConnection(paramClient: PoolClient | null = null) {
        /**
         * Se o client é passado externamente, o release da conneection é feito fora também
         */
        if (paramClient) {
            return {
                client: paramClient,
                releaseConnection: async () => {},
            };
        }

        const [, client] = await DBPoolClient();
        return {
            client,
            releaseConnection: async () => {
                client.release();
            },
        };
    }
}
