import type { FastifyRequest, FastifyReply } from "fastify";

// MODELS
import { UserModel } from "@database/models/UserModel";

// UTILS
import RequestUtils from "@utils/request";

// SERVICES
import UserService from "@services/knex/UserService";

// ERRORS
import { NotFoundError } from "@errors/main";

// TYPES
import type { Clause } from "@/types/clause";
import type { UserInsertBodySchemaType, UserParamsSchemaType, UserUpdateBodySchemaType } from "@validations/user";

const ERROR_MESSAGE_NOT_FOUND = "Usuário não encontrado";

const findOneByPk = async (req: FastifyRequest<{ Params: UserParamsSchemaType }>, reply: FastifyReply) => {
    try {
        const { uuid } = req.params;

        const service = new UserService();

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

        const service = new UserService();

        // where
        const where: Clause<UserModel> = { type: "and", conditions: [] };
        const whereOr: Clause<UserModel> = { type: "or", conditions: [] };

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

const createRegister = async (req: FastifyRequest<{ Body: UserInsertBodySchemaType }>, reply: FastifyReply) => {
    try {
        const service = new UserService();

        const result = await service.create(req.body);

        return reply.send(new RequestUtils().GenerateResponseSingleData({ result: result }));
    } catch (e) {
        reply.send(e);
    }
};

const updateRegister = async (req: FastifyRequest<{ Params: UserParamsSchemaType; Body: UserUpdateBodySchemaType }>, reply: FastifyReply) => {
    try {
        const { uuid } = req.params;

        const service = new UserService();

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

const deleteRegister = async (req: FastifyRequest<{ Params: UserParamsSchemaType }>, reply: FastifyReply) => {
    try {
        const { uuid } = req.params;

        const service = new UserService();

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

const APIUserControllerV1 = {
    //
    findOneByPk,
    findMany,
    createRegister,
    updateRegister,
    deleteRegister,
};

export default APIUserControllerV1;
