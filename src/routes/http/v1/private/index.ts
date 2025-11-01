/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from "fastify";

import { authGuardFastifyPlugin, authContextFastifyPlugin } from "@auth/plugins";

import { V1CompanyRouter } from "./company";
import { V1OrganizationRouter } from "./organization";

const V1PrivateRouter: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    // Schema base com segurança
    fastify.addHook("onRoute", (routeOptions) => {
        routeOptions.schema = {
            ...(routeOptions.schema || {}),

            // adiciona a segurança
            security: [{ Bearer: [] }],
        };
    });

    fastify.register(authGuardFastifyPlugin);
    fastify.register(authContextFastifyPlugin);

    fastify.register(V1OrganizationRouter, { prefix: "/organizacao" });
    fastify.register(V1CompanyRouter, { prefix: "/emitente" });
};

export default V1PrivateRouter;
