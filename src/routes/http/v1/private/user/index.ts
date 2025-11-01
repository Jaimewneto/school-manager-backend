import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from "fastify";

import { checkHttpPermission } from "@security/guards";

import APIUserControllerV1 from "@controllers/api/v1/UserController";

import { createRegisterSchema, updateRegisterSchema, deleteSchema, findManySchemaGet, findManySchemaPost, findOneByPkSchema } from "./docs";
import { UserInsertBodySchemaType, UserParamsSchemaType, UserUpdateBodySchemaType } from "@validations/user";

const getPermission = checkHttpPermission({ permissions: ["user:read"], mode: "all" });
const listPermission = checkHttpPermission({ permissions: ["user:read"], mode: "all" });
const createPermission = checkHttpPermission({ permissions: ["user:create"], mode: "all" });
const updatePermission = checkHttpPermission({ permissions: ["user:update"], mode: "all" });
const deletePermission = checkHttpPermission({ permissions: ["user:delete"], mode: "all" });

export const V1UserRouter: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    fastify.get<{ Params: UserParamsSchemaType }>(
        "/:uuid",
        { ...options, preHandler: [getPermission], schema: findOneByPkSchema },
        APIUserControllerV1.findOneByPk,
    );

    fastify.get("/", { ...options, preHandler: [listPermission], schema: findManySchemaGet }, APIUserControllerV1.findMany);
    fastify.post("/findMany", { ...options, preHandler: [listPermission], schema: findManySchemaPost }, APIUserControllerV1.findMany);

    fastify.post<{ Body: UserInsertBodySchemaType }>(
        "/",
        { ...options, preHandler: [createPermission], schema: createRegisterSchema },
        APIUserControllerV1.createRegister,
    );

    fastify.patch<{ Params: UserParamsSchemaType; Body: UserUpdateBodySchemaType }>(
        "/:uuid",
        { ...options, preHandler: [updatePermission], schema: updateRegisterSchema },
        APIUserControllerV1.updateRegister,
    );

    fastify.delete<{ Params: UserParamsSchemaType }>(
        "/:uuid",
        { ...options, preHandler: [deletePermission], schema: deleteSchema },
        APIUserControllerV1.deleteRegister,
    );
};
