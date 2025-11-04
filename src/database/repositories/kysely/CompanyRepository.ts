import { Kysely } from "kysely";

import { BaseRepository } from "../base/KyselyBaseRepository";

import { Database } from "@database/kysely/schema";
import { Company, CompanyTable, CompanyUpdate, CompanyCreate } from "@database/kysely/schema/company";

const tableName = "company";

export class CompanyRepository extends BaseRepository<Database, typeof tableName, CompanyTable, Company, CompanyCreate, CompanyUpdate> {
    constructor(db: Kysely<Database>) {
        super(db, tableName);
    }

    // If additional methods are needed (beyond the ones in BaseRepository), add them here
}
