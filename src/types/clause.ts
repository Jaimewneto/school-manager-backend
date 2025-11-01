/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
// lembrar de adicionar os operadores no validador de schemas em src/validation/clause.ts

import { Knex } from "knex";

export type PostgresComparisonOperators =
    | "="
    | "!="
    | "<>"
    | ">"
    | ">="
    | "<"
    | "<="
    | "LIKE"
    | "NOT LIKE"
    | "ILIKE"
    | "NOT ILIKE"
    | "IN"
    | "NOT IN"
    | "IS"
    | "IS NOT"
    | "BETWEEN"
    | "NOT BETWEEN"
    | "SIMILAR TO"
    | "NOT SIMILAR TO";

type ValueTypes = string | number | boolean | bigint | null;

export type SmartField<T> = keyof T extends string ? keyof T | (string & {}) : string;

export interface Condition<T = unknown> {
    field: SmartField<T> | Knex.Raw;
    operator: Lowercase<PostgresComparisonOperators> | Uppercase<PostgresComparisonOperators>;
    value: ValueTypes | ValueTypes[];
    unaccent?: boolean;
}

export interface Clause<T = unknown> {
    type: "and" | "or";
    conditions: (Condition<T> | Clause<T>)[];
}

export interface BaseOrderBy<T = unknown> {
    field: keyof T | string;
    direction: "asc" | "desc";
}

export interface RawOrderBy<T = unknown> {
    raw?: string;
}

export type OrderBy<T = unknown> = BaseOrderBy<T> & RawOrderBy<T>;

/**
 * Exemplo de uso:
 * const example: Clause[] = [
 *     {
 *         type: "or",
 *         conditions: [
 *             {
 *                 type: "and",
 *                 conditions: [
 *                     { field: "condicao1", operator: "=", value: "value1" },
 *                     { field: "condicao2", operator: "=", value: "value2" },
 *                 ],
 *             },
 *             {
 *                 type: "and",
 *                 conditions: [
 *                     { field: "condicao3", operator: "=", value: "value3" },
 *                     { field: "condicao4", operator: "=", value: "value4" },
 *                 ],
 *             },
 *         ],
 *     },
 * ];
 *
 * const example2: Clause[] = [
 *     {
 *         type: "or",
 *         conditions: [
 *             { field: "condicao1", operator: "=", value: "value1" },
 *             { field: "condicao2", operator: "=", value: "value2" },
 *             {
 *                 type: "and",
 *                 conditions: [
 *                     { field: "condicao3", operator: "=", value: "value3" },
 *                     { field: "condicao4", operator: "=", value: "value4" },
 *                 ],
 *             },
 *         ],
 *     },
 * ];
 */
