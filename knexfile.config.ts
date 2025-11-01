import dotenv from "dotenv";

import { getKnexConfig } from "./src/database/connections/knex";

dotenv.config({ path: ".env" });

export const config = {
    main: getKnexConfig(false),
};

module.exports = config;

// create-migration:dev: npx knex migrate:make migration_name -x ts --knexfile src/database/migrations/knexfile.ts --env development

// migrate:dev: npx knex migrate:latest --knexfile src/database/knexfile.ts --env development
// rollback:dev: npx knex migrate:rollback --knexfile src/database/knexfile.ts --env development

// create-seed:dev: npx knex seed:make seeder_name -x ts --knexfile src/database/knexfile.ts --env development
// seed:dev: npx knex seed:run --knexfile src/database/knexfile.ts --env development
