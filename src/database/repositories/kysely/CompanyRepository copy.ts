import { Kysely } from "kysely";

import { Database } from "@database/kysely/schema";
import { BaseRepository } from "../base/KyselyBaseRepository";
import { Company, CompanyTable, CompanyUpdate, NewCompany } from "@database/kysely/schema/company";

export class CompanyRepository extends BaseRepository<Database, "company", CompanyTable, Company, NewCompany, CompanyUpdate> {
    constructor(db: Kysely<Database>) {
        super(db, "company");
    }

    // If additional methods are needed (beyond the ones in BaseRepository), add them here
}
