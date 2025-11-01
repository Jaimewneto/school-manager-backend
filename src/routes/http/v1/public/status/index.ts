// LIBS
import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from "fastify";

// CONTROLLER
import APIStatusControllerV1 from "@controllers/api/v1/StatusController";

// DOCS
import { healthCheckSchema, readinessCheckSchema } from "./docs";

export const V1StatusRouter: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    fastify.get("/health", { ...options, schema: healthCheckSchema }, APIStatusControllerV1.verificarSaude);
    fastify.get("/ready", { ...options, schema: readinessCheckSchema }, APIStatusControllerV1.verificarProntidao);
};
