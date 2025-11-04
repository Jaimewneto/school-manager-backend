import type { FastifyRequest, FastifyReply } from "fastify";

// MODELS
import { SalespersonModel } from "@database/models/SalespersonModel";

// UTILS
import RequestUtils from "@utils/request";

// SERVICES
import SalespersonService from "@services/knex/SalespersonService";

// ERRORS
import { NotFoundError } from "@errors/main";

// TYPES
import type { Clause } from "@/types/clause";
import type { SalespersonInsertBodySchemaType, SalespersonParamsSchemaType, SalespersonUpdateBodySchemaType } from "@validations/salesperson";

const ERROR_MESSAGE_NOT_FOUND = "Usuário não encontrado";

const findOneByPk = async (req: FastifyRequest<{ Params: SalespersonParamsSchemaType }>, reply: FastifyReply) => {
    try {
        const { uuid } = req.params;

        const service = new SalespersonService();

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

        const service = new SalespersonService();

        // where
        const where: Clause<SalespersonModel> = { type: "and", conditions: [] };
        const whereOr: Clause<SalespersonModel> = { type: "or", conditions: [] };

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

const createRegister = async (req: FastifyRequest<{ Body: SalespersonInsertBodySchemaType }>, reply: FastifyReply) => {
    try {
        const service = new SalespersonService();

        const result = await service.create(req.body);

        return reply.send(new RequestUtils().GenerateResponseSingleData({ result: result }));
    } catch (e) {
        reply.send(e);
    }
};

const updateRegister = async (
    req: FastifyRequest<{ Params: SalespersonParamsSchemaType; Body: SalespersonUpdateBodySchemaType }>,
    reply: FastifyReply,
) => {
    try {
        const { uuid } = req.params;

        const service = new SalespersonService();

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

const deleteRegister = async (req: FastifyRequest<{ Params: SalespersonParamsSchemaType }>, reply: FastifyReply) => {
    try {
        const { uuid } = req.params;

        const service = new SalespersonService();

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

const APISalespersonControllerV1 = {
    //
    findOneByPk,
    findMany,
    createRegister,
    updateRegister,
    deleteRegister,
};

export default APISalespersonControllerV1;
