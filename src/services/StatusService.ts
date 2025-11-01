// DBCLIENT
import { DBPoolClient } from "@database/connections/postgres";

// REDIS
import { RedisClientPool /* , IoRedisClientPool */ } from "@config/redis";

// WEBSOCKET
import { io } from "@config/socket";

export class StatusService {
    checkReadiness = async (): Promise<boolean> => {
        const isDBReady = await this.checkDBConnection();
        const isRedisReady = await this.checkRedisConnection();
        const isIoRedisReady = await this.checkIoRedisConnection();
        const isWebSocketReady = await this.checkWebSocketConnection();

        return isDBReady && isRedisReady && isIoRedisReady && isWebSocketReady;
    };

    private checkDBConnection = async (): Promise<boolean> => {
        const [, client] = await DBPoolClient();

        try {
            if (client) {
                return true;
            }
            return false;
        } catch (error) {
            return false;
        } finally {
            if (client) {
                client.release();
            }
        }
    };

    private checkRedisConnection = async (): Promise<boolean> => {
        const redis = await RedisClientPool();

        if (redis) return true;

        return false;
    };

    private checkIoRedisConnection = async (): Promise<boolean> => {
        // const redis = await IoRedisClientPool();

        // if (redis) return true;

        return false;
    };

    private checkWebSocketConnection = async (): Promise<boolean> => {
        return io && io.engine ? true : false;
    };
}

export default StatusService;
