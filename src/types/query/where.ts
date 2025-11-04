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

/** Prefixo opcional para multi-tabela */
export type SmartFieldMulti<T extends Record<string, any>> = {
    [K in keyof T]: `${K & string}.${Extract<keyof T[K], string>}`;
}[keyof T];

/** Prefixo opcional para single-table */
export type SmartFieldSingle<T, TableName extends string> = `${TableName}.${Extract<keyof T, string>}` | Extract<keyof T, string>;

/** Field livre para modo sem tipo */
export type SmartFieldAny = string;

/** Condition & Clause sem validação */
interface ConditionAny {
    field: SmartFieldAny;
    operator: Lowercase<PostgresComparisonOperators> | Uppercase<PostgresComparisonOperators>;
    value: ValueTypes | ValueTypes[];
    unaccent?: boolean;
}

interface ClauseAny {
    junction: "and" | "or";
    conditions: (ConditionAny | ClauseAny)[];
}

/** Condition/Clause para single table */
interface ConditionSingle<T, TableName extends string> {
    field: SmartFieldSingle<T, TableName>;
    operator: Lowercase<PostgresComparisonOperators> | Uppercase<PostgresComparisonOperators>;
    value: ValueTypes | ValueTypes[];
    unaccent?: boolean;
}

interface ClauseSingle<T, TableName extends string> {
    junction: "and" | "or";
    conditions: (ConditionSingle<T, TableName> | ClauseSingle<T, TableName>)[];
}

/** Condition/Clause para multi-table */
interface ConditionMulti<T extends Record<string, any>> {
    field: SmartFieldMulti<T>;
    operator: Lowercase<PostgresComparisonOperators> | Uppercase<PostgresComparisonOperators>;
    value: ValueTypes | ValueTypes[];
    unaccent?: boolean;
}

interface ClauseMulti<T extends Record<string, any>> {
    junction: "and" | "or";
    conditions: (ConditionMulti<T> | ClauseMulti<T>)[];
}

export type Condition<T extends Record<string, any>> = ConditionSingle<T, keyof T & string> | ConditionMulti<T> | ConditionAny;

export type Where<T = undefined, TableName extends string | undefined = undefined> =
    T extends MultiTable<infer M>
        ? ClauseMulti<M>
        : T extends Record<string, any>
          ? ClauseSingle<T, TableName extends string ? TableName : never>
          : ClauseAny;

// Wrapper to use multle tables
export type MultiTable<T extends Record<string, any>> = {
    __multi: true;
    __tables: T;
};

/* 
Exemplo de uso

Passando um "TableMap"
type TableMap = {
    clientes: ClienteModel;
    pedidos: PedidoModel;
  };
  
const clause: Clause<TableMap> = {
    type: "and",
    conditions: [
        {
            field: "clientes.empresa_uuid",
            operator: "=",
            value: "",
        },
        {
            field: "pedidos.emitente_uuid",
            operator: "=",
            value: "",
        },
    ]
}

Passando uma só tabela:
const clause: Clause<ClienteModel, "clientes"> = {
    type: "and",
    conditions: [
        {
            field: "clientes.empresa_uuid",
            operator: "=",
            value: "",
        },
    ]
}

Não passando nenhum generics:
const clause: Clause = {
    type: "and",
    conditions: [
        {
            field: "clientes.empresa_uuid", // Pode passar qualquer combinação de tabela.campo
            operator: "=",
            value: "",
        },
    ]
}

 */
