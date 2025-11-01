// import { createClient } from "redis";
import { Server as WebSocketServer } from "socket.io";
// import { createAdapter } from "@socket.io/redis-streams-adapter";

import { Logger } from "@logging/index";
// import { getRedisConfigs } from "@config/redis/base";

import { isProduction } from "@utils/environment";

const logger = Logger(`api-retaguarda@${__filename}`);

const origins = [];

const webSocketServer: WebSocketServer = (() => {
    logger.info("Creating websocket instance...");

    // Adiciona a origin do painel de monitoramento
    origins.push("https://socket-admin-ui.web.app");

    // Adiciona a origin dos ERPs linvix
    origins.push(/^https?:\/\/([a-z0-9-]+\.)*(linvix\.com)$/i);

    // Se estiver em desenvolvimento permite conexão com o WS admin pelo localhost
    if (!isProduction()) {
        origins.push("http://localhost");
        origins.push("http://localhost:3000");
        origins.push("http://localhost:5173");
    }

    return new WebSocketServer({
        cors: {
            origin: origins,
            methods: ["GET", "POST"],
            credentials: true,
        },
        connectionStateRecovery: {
            maxDisconnectionDuration: 2 * 60 * 1000, // the backup duration of the sessions and the packets
            skipMiddlewares: true, // whether to skip middlewares upon successful recovery
        },
        pingInterval: 5000,
        pingTimeout: 10000,
    });
})();

const applyWsConnectionWithRedis = async () => {
    /* logger.info("Connection websocket to Redis client...");

    const redisClient = createClient({
        ...getRedisConfigs(),
    });

    try {
        // Conecta no redis (somente com redis 4.x)
        await redisClient.connect();

        // passa o adapter
        webSocketServer.adapter(createAdapter(redisClient));
    } catch (error: Error | any) {
        logger.error(`Connection to redis failed: ${error.message} - ${JSON.stringify(error, null, 4)}`);
    } */
};

const getWebsocketServer = () => webSocketServer;

export { getWebsocketServer, applyWsConnectionWithRedis, webSocketServer };
