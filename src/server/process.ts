import { Logger } from "@logging/index";

const logger = Logger(`api-autoatendimento-v3@${__filename}`);

const exitWithCode = (code: number) => {
    setTimeout(() => {
        logger.info(`Forcing a shutdown with code ${code}`);
        //! não remover, se não o processo não vai parar
        process.exit(0);
    }, 1000).unref();
};

const declareProcessListeners = () => {
    const logger = Logger(`api-retaguarda@${__filename}`);

    process.on("unhandledRejection", (reason: Error | undefined) => {
        logger.error(`Unhandled Exception: ${reason?.message || reason} - ${JSON.stringify(reason, null, 4)}`);

        throw reason;
    });

    process.on("uncaughtException", (error: Error) => {
        logger.error(`Uncaught Exception: ${error.message} - ${JSON.stringify(error, null, 4)}`);
    });

    process.on("SIGTERM", async () => {
        logger.info(`Process ${process.pid} received SIGTERM: Exiting with code 0...`);

        exitWithCode(0);
    });

    process.on("SIGINT", async () => {
        logger.info(`Process ${process.pid} received SIGINT: Exiting with code 0...`);

        exitWithCode(0);
    });
};

export default declareProcessListeners;
