import type { FastifyRequest, FastifyReply } from "fastify";

// MODELS
import { CompanyModel } from "@database/models/CompanyModel";

// UTILS
import RequestUtils from "@utils/request";

// SERVICES
import CompanyService from "@services/knex/CompanyService";

// ERRORS
import { NotFoundError } from "@errors/main";

// TYPES
import type { Clause } from "@/types/clause";
import type { CompanyInsertBodySchemaType, CompanyParamsSchemaType, CompanyUpdateBodySchemaType } from "@validations/company";

const ERROR_MESSAGE_NOT_FOUND = "Company não encontrado";

const findOneByPk = async (req: FastifyRequest<{ Params: CompanyParamsSchemaType }>, reply: FastifyReply) => {
    try {
        const { uuid } = req.params;

        const service = new CompanyService();

        const result = await service.findOneByPk(uuid);

        if (!result) {
            throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND);
        }

        return reply.send(new RequestUtils().GenerateResponseSingleData({ status: true, result: result }));
    } catch (e) {
        reply.send(e);
    }
};

const findMany = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { limit, page, skip, take, sort, clause, query } = new RequestUtils().GeneratePaginationData(req);

        const service = new CompanyService();

        // where
        const where: Clause<CompanyModel> = { type: "and", conditions: [] };
        const whereOr: Clause<CompanyModel> = { type: "or", conditions: [] };

        if (query) {
            const generalQuery = `%${query.replace(" ", "%")}%`;

            whereOr.conditions.push({ field: "emitente.razao_social", operator: "ilike", value: generalQuery });
            whereOr.conditions.push({ field: "emitente.fantasia", operator: "ilike", value: generalQuery });
            whereOr.conditions.push({ field: "emitente.cnpj", operator: "ilike", value: generalQuery });
        }

        if (whereOr.conditions.length > 0) {
            where.conditions.push(whereOr);
        }

        const [results, count] = await service.findMany({
            skip,
            take,
            where: where,
            clause: clause,
            orderBy: sort,
        });

        return reply.send(
            new RequestUtils().GenerateResponsePaginationData({
                page,
                count,
                limit,
                results,
            }),
        );
    } catch (e) {
        reply.send(e);
    }
};

const createRegister = async (req: FastifyRequest<{ Body: CompanyInsertBodySchemaType }>, reply: FastifyReply) => {
    try {
        const service = new CompanyService();

        const result = await service.create(req.body);

        return reply.send(new RequestUtils().GenerateResponseSingleData({ result: result }));
    } catch (e) {
        reply.send(e);
    }
};

const updateRegister = async (req: FastifyRequest<{ Params: CompanyParamsSchemaType; Body: CompanyUpdateBodySchemaType }>, reply: FastifyReply) => {
    try {
        const { uuid } = req.params;

        const service = new CompanyService();

        const exists = await service.findOneByPk(uuid);

        if (!exists) {
            throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND);
        }

        const result = await service.update(uuid, req.body);

        return reply.send(new RequestUtils().GenerateResponseSingleData({ result: result }));
    } catch (e) {
        reply.send(e);
    }
};

const deleteRegister = async (req: FastifyRequest<{ Params: CompanyParamsSchemaType }>, reply: FastifyReply) => {
    try {
        const { uuid } = req.params;

        const service = new CompanyService();

        const exists = await service.findOneByPk(uuid);

        if (!exists) {
            throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND);
        }

        const result = await service.delete(uuid);

        return reply.send(new RequestUtils().GenerateResponseSingleData({ result: result }));
    } catch (e) {
        reply.send(e);
    }
};

const APICompanyControllerV1 = {
    //
    findOneByPk,
    findMany,
    createRegister,
    updateRegister,
    deleteRegister,
};

export default APICompanyControllerV1;
