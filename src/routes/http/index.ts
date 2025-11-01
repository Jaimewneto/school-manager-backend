import { FastifyInstance, FastifyPluginAsync } from "fastify";

import swaggerUI from "@fastify/swagger-ui";

import RequestUtils from "@utils/request";
import V1Router from "./v1";

const MainRouter: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.register(swaggerUI, {
        routePrefix: "/docs",
        uiConfig: {
            layout: "BaseLayout", // Remove o topo com a logo
        },
    });

    fastify.get("/", { schema: { hide: true } }, RequestUtils.GenerateInfoResponse);

    fastify.register(V1Router, { prefix: "/v1" });
};

export default MainRouter;
