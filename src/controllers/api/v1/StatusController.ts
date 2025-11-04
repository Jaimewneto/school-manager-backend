// LIBS
import { FastifyRequest, FastifyReply } from "fastify";

// SERVICES
import StatusService from "@services/knex/StatusService";

// UTILS
import RequestUtils from "@utils/request";

const verificarSaude = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        return reply.send(new RequestUtils().GenerateResponseSingleData({ status: true, result: true }));
    } catch (e) {
        reply.send(e);
    }
};

const verificarProntidao = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const service = new StatusService();

        const result = await service.checkReadiness();

        return reply.send(new RequestUtils().GenerateResponseSingleData({ status: true, result: result }));
    } catch (e) {
        reply.send(e);
    }
};

const APIStatusControllerV1 = {
    //
    verificarSaude,
    verificarProntidao,
};

export default APIStatusControllerV1;
