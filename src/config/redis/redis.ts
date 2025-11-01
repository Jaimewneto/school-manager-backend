import { RedisClientType, createClient } from "redis";

import { getRedisConfigs } from "@config/redis/base";

let Pool: RedisClientType;

export const RedisClientPool = async () => {
    /**
     * Se já estiver aberto
     */
    if (Pool && Pool.isOpen) {
        return Pool;
    }

    /**
     * Configurações do redis
     */
    const configs = getRedisConfigs();

    /**
     * Cria o cliente redis
     */
    Pool = createClient(configs);

    /**
     * Conecta o redis
     */
    await Pool.connect();

    /**
     * Retorna o cliente Redis
     */
    return Pool;
};

export const RedisClient = async () => {
    /**
     * Configurações do redis
     */
    const configs = getRedisConfigs();

    /**
     * Cria o cliente redis
     */
    const client = createClient(configs);

    /**
     * Conecta o redis
     */
    await client.connect();

    /**
     * Retorna o cliente Redis
     */
    return client;
};
