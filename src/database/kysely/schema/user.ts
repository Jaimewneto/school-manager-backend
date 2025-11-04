import {
    //
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from "kysely";

export interface UserTable {
    id: Generated<string>;
    company_id: string;
    name: string;
    email: string;
    password: string;
    created_at: ColumnType<Date, string | undefined, never>;
    updated_at: ColumnType<Date, string | undefined, undefined | Date>;
    deleted_at: ColumnType<Date, string | undefined, Date>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
