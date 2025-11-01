import getenv from "getenv";

export const getRedisConfigs = () => {
    /**
     * Pega os dados de configuração do servidor redis
     */
    const host = getenv("REDIS_HOST", "redis");
    const port = getenv.int("REDIS_PORT", 6379);
    const user = getenv("REDIS_USERNAME", "");
    const pass = getenv("REDIS_PASSWORD", "");
    const db = getenv.int("REDIS_DB", 1);
    const tls = getenv.bool("REDIS_TLS", false);

    const configs = {
        username: user,
        password: pass,
        database: db,
        socket: {
            tls: tls,
            host: host,
            port: port,

            timeout: 10 * 1000,
            connectTimeout: 10 * 1000,
        },
    };

    return configs;
};

export const getIoRedisConfigs = () => {
    const tlsEnabled = getenv.bool("REDIS_TLS", false);

    return {
        host: getenv("REDIS_HOST", "127.0.0.1"),
        port: getenv.int("REDIS_PORT", 6379),
        username: getenv("REDIS_USERNAME", ""),
        password: getenv("REDIS_PASSWORD", ""),
        db: getenv.int("REDIS_DB", 1),
        tls: tlsEnabled ? {} : undefined, // Se `tls` for true, passa um objeto vazio (padrão do ioredis)
    };
};
