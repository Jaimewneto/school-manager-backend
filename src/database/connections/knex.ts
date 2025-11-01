import path from "path";
import getenv from "getenv";

import KNEX, { Knex } from "knex";

const knex = KNEX({
    client: "pg",
});

export const getKnexConfig = (production = false): Knex.Config => {
    const host = getenv("DB_HOST", "");
    const port = getenv.int("DB_PORT", 0);
    const user = getenv("DB_USERNAME", "");
    const pass = getenv("DB_PASSWORD", "");
    const db = getenv("DB_DATABASE", "");
    const ssl = getenv.bool("DB_SSL", false);

    return {
        client: "postgresql",

        connection: {
            host: host,
            port: port,
            database: db,
            user: user,
            password: pass,
            ssl: ssl,
        },

        migrations: {
            schemaName: "knex",
            database: "knex_migrations",
            tableName: "migrations",
            directory: path.resolve(production ? "dist" : "src", "database", "migrations"),
            extension: production ? "js" : "ts",
        },

        seeds: {
            directory: path.resolve(production ? "dist" : "src", "database", "seeds"),
        },
    };
};

export default knex;
