import { Logger } from "@logging/index";

//import io from "@config/socket"; //! Por hora não estamos usando
import { v1Namespace, webRTCNamespace } from "@config/socket/namespaces";

const logger = Logger(`api-autoatendimento-v3@${__filename}`);

const closeSocketConnections = async () => {
    logger.info(`Disconnecting all websocket clients...`);

    await v1Namespace.local.disconnectSockets();
    await webRTCNamespace.local.disconnectSockets();

    // await io.close(); //! Por hora não estamos usando
};

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

        await closeSocketConnections();

        exitWithCode(0);
    });

    process.on("SIGINT", async () => {
        logger.info(`Process ${process.pid} received SIGINT: Exiting with code 0...`);

        await closeSocketConnections();

        exitWithCode(0);
    });
};

export default declareProcessListeners;
