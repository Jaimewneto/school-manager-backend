import { OrderBy } from "./orderBy";
import { Select } from "./select";
import { Where } from "./where";

export interface QueryOne<T = undefined, TableName extends string | undefined = undefined> {
    select: Select<T, TableName>;
    where: Where<T, TableName>;
}

export interface QueryMany<T = undefined, TableName extends string | undefined = undefined> {
    select?: Select<T, TableName>;
    where?: Where<T, TableName>;
    orderBy?: OrderBy<T, TableName>[];
    limit?: number;
    offset?: number;
}
