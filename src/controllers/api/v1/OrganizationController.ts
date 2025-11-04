import { FastifyRequest, FastifyReply } from "fastify";

// UTILS
import RequestUtils from "@utils/request";

// SERVICES
import OrganizationService from "@services/knex/OrganizationService";

// ERRORS
import { NotFoundError } from "@errors/main";

// TYPES
import { OrganizationInsertBodySchemaType, OrganizationParamsSchemaType, OrganizationUpdateBodySchemaType } from "@validations/organization";

const ERROR_MESSAGE_NOT_FOUND = "Organização não encontrada";

const findOneByPk = async (req: FastifyRequest<{ Params: OrganizationParamsSchemaType }>, reply: FastifyReply) => {
    try {
        const { uuid } = req.params;

        const service = new OrganizationService();

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
        const { limit, page, skip, take, sort, clause } = new RequestUtils().GeneratePaginationData(req);

        const service = new OrganizationService();

        const [results, count] = await service.findMany({
            skip,
            take,
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

const createRegister = async (req: FastifyRequest<{ Body: OrganizationInsertBodySchemaType }>, reply: FastifyReply) => {
    try {
        const service = new OrganizationService();

        const result = await service.create({
            ...req.body,
        });

        return reply.send(new RequestUtils().GenerateResponseSingleData({ result: result }));
    } catch (e) {
        reply.send(e);
    }
};

const updateRegister = async (
    req: FastifyRequest<{ Params: OrganizationParamsSchemaType; Body: OrganizationUpdateBodySchemaType }>,
    reply: FastifyReply,
) => {
    try {
        const { uuid } = req.params;

        const service = new OrganizationService();

        const exists = await service.findOneByPk(uuid);

        if (!exists) {
            throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND);
        }

        const result = await service.update(uuid, {
            ...req.body,
        });

        return reply.send(new RequestUtils().GenerateResponseSingleData({ result: result }));
    } catch (e) {
        reply.send(e);
    }
};

const deleteRegister = async (req: FastifyRequest<{ Params: OrganizationParamsSchemaType }>, reply: FastifyReply) => {
    try {
        const { uuid } = req.params;

        const service = new OrganizationService();

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

const APIOrganizationControllerV1 = {
    //
    findOneByPk,
    findMany,
    createRegister,
    updateRegister,
    deleteRegister,
};

export default APIOrganizationControllerV1;
