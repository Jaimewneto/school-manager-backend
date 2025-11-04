import {
    //
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from "kysely";

export interface CompanyTable {
    id: Generated<string>;
    name: string;
    //document: string;
    created_at: ColumnType<Date, string | undefined, never>;
    updated_at: ColumnType<Date, string | undefined, undefined | Date>;
    deleted_at: ColumnType<Date, string | undefined, Date>;
}

export type Company = Selectable<CompanyTable>;
export type CompanyCreate = Insertable<CompanyTable>;
export type CompanyUpdate = Updateable<CompanyTable>;
