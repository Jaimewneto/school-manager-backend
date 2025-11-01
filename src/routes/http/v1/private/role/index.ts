import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from "fastify";

import { checkHttpPermission } from "@security/guards";

import APIRoleControllerV1 from "@controllers/api/v1/RoleController";

import { createRegisterSchema, updateRegisterSchema, deleteSchema, findManySchemaGet, findManySchemaPost, findOneByPkSchema } from "./docs";
import { RoleInsertBodySchemaType, RoleParamsSchemaType, RoleUpdateBodySchemaType } from "@validations/role";

const getPermission = checkHttpPermission({ permissions: ["role:read"], mode: "all" });
const listPermission = checkHttpPermission({ permissions: ["role:read"], mode: "all" });
const createPermission = checkHttpPermission({ permissions: ["role:create"], mode: "all" });
const updatePermission = checkHttpPermission({ permissions: ["role:update"], mode: "all" });
const deletePermission = checkHttpPermission({ permissions: ["role:delete"], mode: "all" });

export const V1RoleRouter: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    fastify.get<{ Params: RoleParamsSchemaType }>(
        "/:uuid",
        { ...options, preHandler: [getPermission], schema: findOneByPkSchema },
        APIRoleControllerV1.findOneByPk,
    );

    fastify.get("/", { ...options, preHandler: [listPermission], schema: findManySchemaGet }, APIRoleControllerV1.findMany);
    fastify.post("/findMany", { ...options, preHandler: [listPermission], schema: findManySchemaPost }, APIRoleControllerV1.findMany);

    fastify.post<{ Body: RoleInsertBodySchemaType }>(
        "/",
        { ...options, preHandler: [createPermission], schema: createRegisterSchema },
        APIRoleControllerV1.createRegister,
    );

    fastify.patch<{ Params: RoleParamsSchemaType; Body: RoleUpdateBodySchemaType }>(
        "/:uuid",
        { ...options, preHandler: [updatePermission], schema: updateRegisterSchema },
        APIRoleControllerV1.updateRegister,
    );

    fastify.delete<{ Params: RoleParamsSchemaType }>(
        "/:uuid",
        { ...options, preHandler: [deletePermission], schema: deleteSchema },
        APIRoleControllerV1.deleteRegister,
    );
};
