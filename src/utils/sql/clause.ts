import { Clause, Condition } from "@/types/clause";

import Utils from "@utils/main";

import { Knex } from "knex";

const KnexBuildCondition = (query: Knex.QueryBuilder, condition: Condition): Knex.QueryBuilder => {
    if (Array.isArray(condition.value)) {
        return query.whereRaw(`?? ${condition.operator} (${condition.value.map(() => "?").join(", ")})`, [condition.field, ...condition.value]);
    }

    if (condition.unaccent && typeof condition.value === "string" && !Utils.isUUID(condition.value)) {
        return query.whereRaw(`unaccent(??) ${condition.operator} unaccent(?)`, [condition.field, condition.value]);
    }

    if (condition.value === null) {
        return query.whereNull(condition.field as string);
    }

    if (typeof condition.value === "boolean") {
        return query.where(condition.field as string, condition.operator, condition.value);
    }

    return query.where(condition.field as any, condition.operator, condition.value as any);
};

const KnexBuildClause = (query: Knex.QueryBuilder, clause: Clause): Knex.QueryBuilder => {
    if (!clause?.type) return query;

    const method = clause.type === "and" ? "andWhere" : "orWhere";

    return query.where(function () {
        clause.conditions.forEach((condition) => {
            // esse this, refere-se ao `query.where(function () {` que está na acima antes do clause.conditions
            this[method]((builder) => {
                if ("field" in condition) {
                    KnexBuildCondition(builder, condition as Condition);
                } else {
                    KnexBuildClause(builder, condition as Clause);
                }
            });
        });
    });
};

const SQLClauseUtils = {
    KnexBuildCondition,
    KnexBuildClause,
};

export default SQLClauseUtils;
