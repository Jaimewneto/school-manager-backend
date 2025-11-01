import { FastifyInstance, FastifyPluginAsync } from "fastify";

import V1PublicRouter from "./public";
import V1PrivateRouter from "./private";

const V1Router: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.register(V1PublicRouter, { prefix: "/public" });
    fastify.register(V1PrivateRouter, { prefix: "/private" });
};

export default V1Router;
