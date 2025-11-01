import * as webSocketFactory from "./factory";

// !dont add dependency for app.ts or http.ts into this file,
// !because QueueController will break application

webSocketFactory.applyWsConnectionWithRedis();

export const io = webSocketFactory.getWebsocketServer();

export default io;
