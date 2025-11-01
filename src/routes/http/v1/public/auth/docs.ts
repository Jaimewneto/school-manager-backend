import { FastifySchema } from "fastify";

import { BadRequestResponseSchema, UnauthorizedResponseSchema } from "@docs/errors/defaults";

import { CompanyAuthSchema, CompanyRefreshSchema } from "@auth/schemas/company.schema";

const DEFAULT_TAG = "Autenticação";

export const companyAuthSchema: FastifySchema = {
    body: CompanyAuthSchema,
    tags: [DEFAULT_TAG],
    summary: "Efetuar autenticação a nível de empresa",
    response: {
        400: { ...BadRequestResponseSchema },
        401: { ...UnauthorizedResponseSchema },
    },
};

export const companyRefreshTokenAuthSchema: FastifySchema = {
    body: CompanyRefreshSchema,
    tags: [DEFAULT_TAG],
    summary: "Efetuar atualização do token JWT a nível de empresa",
    response: {
        400: { ...BadRequestResponseSchema },
        401: { ...UnauthorizedResponseSchema },
    },
};
