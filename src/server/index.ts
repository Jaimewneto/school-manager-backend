import getenv from "getenv";

import setupFastify from "@/config/fastify";

import { app } from "@/config/app";

import { Logger } from "@logging/index";

import declareProcessListeners from "./process";

const logger = Logger(`api-autoatendimento-v3@${__filename}`);

const startServer = async () => {
    const port = getenv.int("PORT", 3000);

    try {
        await setupFastify();

        await app.listen({ port, host: "0.0.0.0" });

        await declareProcessListeners();

        logger.info(`All set. Application server listening on port ${port}`);
    } catch (err) {
        logger.error("Erro ao iniciar servidor:", err);
        process.exit(1);
    }
};

export default startServer;
