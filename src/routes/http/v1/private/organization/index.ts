import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from "fastify";

import { checkHttpPermission } from "@security/guards";

import APIOrganizationControllerV1 from "@controllers/api/v1/OrganizationController";

import { createRegisterSchema, updateRegisterSchema, deleteSchema, findManySchemaGet, findManySchemaPost, findOneByPkSchema } from "./docs";
import { OrganizationInsertBodySchemaType, OrganizationParamsSchemaType, OrganizationUpdateBodySchemaType } from "@validations/organization";

const getPermission = checkHttpPermission({ permissions: ["organization:read"], mode: "all" });
const listPermission = checkHttpPermission({ permissions: ["organization:read"], mode: "all" });
const createPermission = checkHttpPermission({ permissions: ["organization:create"], mode: "all" });
const updatePermission = checkHttpPermission({ permissions: ["organization:update"], mode: "all" });
const deletePermission = checkHttpPermission({ permissions: ["organization:delete"], mode: "all" });

export const V1OrganizationRouter: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    // Registra as rotas
    fastify.get<{ Params: OrganizationParamsSchemaType }>(
        "/:uuid",
        { ...options, preHandler: [getPermission], schema: findOneByPkSchema },
        APIOrganizationControllerV1.findOneByPk,
    );

    fastify.get("/", { ...options, preHandler: [listPermission], schema: findManySchemaGet }, APIOrganizationControllerV1.findMany);
    fastify.post("/findMany", { ...options, preHandler: [listPermission], schema: findManySchemaPost }, APIOrganizationControllerV1.findMany);

    fastify.post<{ Body: OrganizationInsertBodySchemaType }>(
        "/",
        { ...options, preHandler: [createPermission], schema: createRegisterSchema },
        APIOrganizationControllerV1.createRegister,
    );

    fastify.patch<{ Params: OrganizationParamsSchemaType; Body: OrganizationUpdateBodySchemaType }>(
        "/:uuid",
        { ...options, preHandler: [updatePermission], schema: updateRegisterSchema },
        APIOrganizationControllerV1.updateRegister,
    );

    fastify.delete<{ Params: OrganizationParamsSchemaType }>(
        "/:uuid",
        { ...options, preHandler: [deletePermission], schema: deleteSchema },
        APIOrganizationControllerV1.deleteRegister,
    );
};
