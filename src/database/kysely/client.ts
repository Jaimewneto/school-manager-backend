import "dotenv/config";

import { Pool } from "pg";

import { Kysely, PostgresDialect } from "kysely";

import { Database } from "./schema";

export const client = new Kysely<Database>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.DATABASE_URL,
        }),
    }),
});
