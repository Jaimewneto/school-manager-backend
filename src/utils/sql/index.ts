import { Knex } from "knex";

import knex from "@database/connections/knex";

export class RawValue extends String {}

export class SQLUtils {
    public static filterFieldsByFillable = ({
        data = {},
        fillable = [],
    }: {
        data: Record<string, any>;
        fillable?: (string | Knex.Raw | RawValue)[];
    }) => {
        // se não passar o fillable, ele retorna os dados sem filtrar
        if (fillable?.length === 0) return data;

        const filteredData: Record<string, any> = {};

        for (const [key, value] of Object.entries(data)) {
            if (fillable.includes(key) && value !== undefined) {
                if (value instanceof RawValue) {
                    filteredData[key] = knex.raw(value.toString());
                } else {
                    filteredData[key] = value;
                }
            }
        }

        return filteredData;
    };
}
