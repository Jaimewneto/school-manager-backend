import { FastifySchema } from "fastify";

import { BadRequestResponseSchema, NotFoundResponseSchema, UnauthorizedResponseSchema } from "@docs/errors/defaults";
import { UserCreateSchema, UserParamsSchema, UserUpdateSchema } from "@validations/user";
import { ClauseSortSchema } from "@validations/clause";

import { DocsSummaryEnum } from "@docs/enums";

const DEFAULT_TAG = "User";

export const findOneByPkSchema: FastifySchema = {
    params: UserParamsSchema,
    tags: [DEFAULT_TAG],
    summary: DocsSummaryEnum.findOneByPk,
    response: {
        400: { ...BadRequestResponseSchema },
        401: { ...UnauthorizedResponseSchema },
        404: { ...NotFoundResponseSchema },
    },
};

export const findManySchemaGet: FastifySchema = {
    tags: [DEFAULT_TAG],
    summary: DocsSummaryEnum.findMany,
    response: {
        400: { ...BadRequestResponseSchema },
        401: { ...UnauthorizedResponseSchema },
    },
};

export const findManySchemaPost: FastifySchema = {
    body: ClauseSortSchema,
    tags: [DEFAULT_TAG],
    summary: DocsSummaryEnum.findManyPost,
    response: {
        400: { ...BadRequestResponseSchema },
        401: { ...UnauthorizedResponseSchema },
    },
};

export const createRegisterSchema: FastifySchema = {
    body: UserCreateSchema,
    tags: [DEFAULT_TAG],
    summary: DocsSummaryEnum.createRegister,
    response: {
        400: { ...BadRequestResponseSchema },
        401: { ...UnauthorizedResponseSchema },
        404: { ...NotFoundResponseSchema },
    },
};

export const updateRegisterSchema: FastifySchema = {
    params: UserParamsSchema,
    body: UserUpdateSchema,
    tags: [DEFAULT_TAG],
    summary: DocsSummaryEnum.updateRegister,
    response: {
        400: { ...BadRequestResponseSchema },
        401: { ...UnauthorizedResponseSchema },
        404: { ...NotFoundResponseSchema },
    },
};

export const deleteSchema: FastifySchema = {
    params: UserParamsSchema,
    tags: [DEFAULT_TAG],
    summary: DocsSummaryEnum.deleteRegister,
    response: {
        400: { ...BadRequestResponseSchema },
        401: { ...UnauthorizedResponseSchema },
        404: { ...NotFoundResponseSchema },
    },
};
