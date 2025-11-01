// LIBS
import { FastifySchema } from "fastify";

// DOCS
import { BadRequestResponseSchema, UnauthorizedResponseSchema } from "@docs/errors/defaults";

const DEFAULT_TAG = "Status da API";

export const healthCheckSchema: FastifySchema = {
    tags: [DEFAULT_TAG],
    summary: "Verificar a saúde da API",
    response: {
        400: { ...BadRequestResponseSchema },
        401: { ...UnauthorizedResponseSchema },
    },
};

export const readinessCheckSchema: FastifySchema = {
    tags: [DEFAULT_TAG],
    summary: "Verificar a prontidão da API",
    response: {
        400: { ...BadRequestResponseSchema },
        401: { ...UnauthorizedResponseSchema },
    },
};
