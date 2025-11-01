import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from "fastify";

import { companyLoginFastifyHandler, companyRefreshTokenFastifyHandler } from "@auth/handlers/company";

import { companyAuthSchema, companyRefreshTokenAuthSchema } from "./docs";

export const V1AuthRouter: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    fastify.post("/company/token", { ...options, schema: companyAuthSchema }, companyLoginFastifyHandler);
    fastify.post("/company/refresh", { ...options, schema: companyRefreshTokenAuthSchema }, companyRefreshTokenFastifyHandler);
};
