import getenv from "getenv";

const ProductionMap = ["production", "produção", "producao", "prod", "prd"];
// const Development = ["development", "desenvolvimento", "desenvolvimento", "dev", "dev"];

export const isProduction = (): boolean => {
    const env = getenv.string("NODE_ENV", "development");

    return ProductionMap.includes(env);
};

export const getEnvironment = (): string => {
    return getenv.string("NODE_ENV", "development");
};

export const getJWTEnvironment = () => {
    return {
        JWT_SECRET: getenv.string("JWT_SECRET"),
        JWT_ALGORITHM: getenv.string("JWT_ALGORITHM", "HS256") as any,
    };
};

export const getApiNameEnv = (): string => {
    return getenv.string("API_NAME", "API AUTO ATENDIMENTO V3");
};

export const getApiUrlEnv = (): string => {
    return getenv.string("API_URL");
};

export const getApiPortEnv = (): number => {
    return getenv.int("API_PORT", 3000);
};

export const EnvironmentUtils = {
    isProduction,
    getEnvironment,
    getJWTEnvironment,

    getApiNameEnv,
    getApiUrlEnv,
    getApiPortEnv,
};

export default EnvironmentUtils;
