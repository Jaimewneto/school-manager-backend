import "@/dotenv";
import knex from "knex";

import { getKnexConfig } from "@database/connections/knex";

import { Logger } from "@logging/main";

const logger = Logger(`api-autoatendimento-v3@${__filename}`);

async function migrate() {
    const db = knex(getKnexConfig(true));

    let success = false;

    try {
        console.info("Running migrations...");

        const [batchNo, log]: [number, string[]] = await db.migrate.latest();

        if (log.length > 0) {
            console.info(`✔ Batch ${batchNo} executed with ${log.length} migrations:`);
            log.forEach((file) => console.info(`↪ ${file}`));
        } else {
            console.info("No migrations were executed.");
        }

        success = true;
    } catch (error: any) {
        logger.error(error.message || error);
        console.error(error.message || error);
        throw error;
    } finally {
        process.exit(success ? 0 : 1);
    }
}

migrate();
