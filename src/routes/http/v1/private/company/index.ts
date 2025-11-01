import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from "fastify";

import { checkHttpPermission } from "@security/guards";

import APICompanyControllerV1 from "@controllers/api/v1/CompanyController";

import { createRegisterSchema, updateRegisterSchema, deleteSchema, findManySchemaGet, findManySchemaPost, findOneByPkSchema } from "./docs";
import { CompanyInsertBodySchemaType, CompanyParamsSchemaType, CompanyUpdateBodySchemaType } from "@validations/company";

const getPermission = checkHttpPermission({ permissions: ["company:read"], mode: "all" });
const listPermission = checkHttpPermission({ permissions: ["company:read"], mode: "all" });
const createPermission = checkHttpPermission({ permissions: ["company:create"], mode: "all" });
const updatePermission = checkHttpPermission({ permissions: ["company:update"], mode: "all" });
const deletePermission = checkHttpPermission({ permissions: ["company:delete"], mode: "all" });

export const V1CompanyRouter: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    fastify.get<{ Params: CompanyParamsSchemaType }>(
        "/:uuid",
        { ...options, preHandler: [getPermission], schema: findOneByPkSchema },
        APICompanyControllerV1.findOneByPk,
    );

    fastify.get("/", { ...options, preHandler: [listPermission], schema: findManySchemaGet }, APICompanyControllerV1.findMany);
    fastify.post("/findMany", { ...options, preHandler: [listPermission], schema: findManySchemaPost }, APICompanyControllerV1.findMany);

    fastify.post<{ Body: CompanyInsertBodySchemaType }>(
        "/",
        { ...options, preHandler: [createPermission], schema: createRegisterSchema },
        APICompanyControllerV1.createRegister,
    );

    fastify.patch<{ Params: CompanyParamsSchemaType; Body: CompanyUpdateBodySchemaType }>(
        "/:uuid",
        { ...options, preHandler: [updatePermission], schema: updateRegisterSchema },
        APICompanyControllerV1.updateRegister,
    );

    fastify.delete<{ Params: CompanyParamsSchemaType }>(
        "/:uuid",
        { ...options, preHandler: [deletePermission], schema: deleteSchema },
        APICompanyControllerV1.deleteRegister,
    );
};
