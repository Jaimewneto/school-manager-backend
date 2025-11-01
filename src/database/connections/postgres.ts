import getenv from "getenv";

import { Pool, PoolClient, PoolConfig, types } from "pg";

const configureTypeParser = () => {
    // !LEMBRETE: VALORES NULL NÃO ENTRAM NO PARSE

    const FormataNumeric = (val: any) => Number(val);

    // DATES
    // types.setTypeParser(types.builtins.DATE, (val) => (val === null ? null : moment(val).format("YYYY-MM-DD")));
    // types.setTypeParser(types.builtins.TIMESTAMP, (val) => (val === null ? null : moment(val).format("YYYY-MM-DD HH:mm:ss")));
    // types.setTypeParser(types.builtins.TIMESTAMPTZ, (val) => (val === null ? null : moment(val).format("YYYY-MM-DD HH:mm:ss")));

    // DINHEIRO E FLOAT
    types.setTypeParser(types.builtins.MONEY, FormataNumeric);
    types.setTypeParser(types.builtins.NUMERIC, FormataNumeric);

    types.setTypeParser(types.builtins.INT4, FormataNumeric);
    types.setTypeParser(types.builtins.INT8, FormataNumeric);
    types.setTypeParser(types.builtins.FLOAT4, FormataNumeric);
    types.setTypeParser(types.builtins.FLOAT8, FormataNumeric);
};

const getPostgresPoolConfig = () => {
    /**
     * Pega os dados de configuração do servidor de produção
     */
    const host = getenv("DB_HOST", "");
    const port = getenv.int("DB_PORT", 0);
    const user = getenv("DB_USERNAME", "");
    const pass = getenv("DB_PASSWORD", "");
    const db = getenv("DB_DATABASE", "");
    const ssl = getenv.bool("DB_SSL", false);

    /**
     * Configurações do pool
     */
    const credentials: PoolConfig = {
        application_name: getenv("API_NAME"),

        user: user,
        host: host,
        password: pass,
        port: port,
        database: db,
        ssl: ssl,

        min: 5,
        max: 25,
    };

    return credentials;
};

/**
 * Pool anexado na memória, para controle de conexões
 */
const DBPool = new Pool(getPostgresPoolConfig());

export const DBPoolClient = async (): Promise<[Pool, PoolClient]> => {
    /**
     * Configura o type parser
     */
    configureTypeParser();

    /**
     * Conecta no banco de dados
     */
    const client = await DBPool.connect();

    /**
     * Retorna a instãncia
     */
    return [DBPool, client];
};

export { Pool, PoolClient };
