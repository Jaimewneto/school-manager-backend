/* eslint-disable @typescript-eslint/no-unused-vars */

// LIBS
import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from "fastify";

// ROUTES
import { V1AuthRouter } from "./auth";
import { V1StatusRouter } from "./status";

const V1PublicRouter: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    fastify.register(V1AuthRouter, { prefix: "/auth" });
    fastify.register(V1StatusRouter, { prefix: "/status" });
};

export default V1PublicRouter;
