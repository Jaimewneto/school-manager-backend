// Fastify
import { FastifyRequest, FastifyReply } from "fastify";

// utils
import { OSUtils } from "@utils/os";
import { ProjectUtils } from "@utils/project";
import { EnvironmentUtils } from "@utils/environment";

// TYPES
import { Clause, OrderBy } from "@/types/clause";

// UTILS
import { ClauseUtils } from "@utils/clause";
import { ResponseUtils } from "@utils/response";

type GeneratePaginationDataDefaults<T = unknown> = {
    limit?: number;
    page?: number;
    sort?: OrderBy<T>[];
    clause?: Clause<T>;
};

export class RequestUtils {
    public limit = 200;

    protected readonly DEFAULTS: GeneratePaginationDataDefaults = {
        limit: this.limit,
        page: 1,

        sort: [],
        clause: undefined,
    };

    constructor(limit = 200) {
        this.limit = limit;
    }

    GenerateResponseSingleData = ResponseUtils.GenerateResponseSingleData;
    GenerateResponsePaginationData = ResponseUtils.GenerateResponsePaginationData;

    GeneratePaginationData = (req: FastifyRequest, defaults?: GeneratePaginationDataDefaults) => {
        // MESCLA OS PADRÕES
        defaults = { ...this.DEFAULTS, ...defaults };

        // PAGINATION
        const qry = req.query as any;
        const body = req.body as any;

        const limit: number = qry?.limit ? parseInt(qry.limit.toString()) : defaults.limit!;
        const page: number = qry?.page ? parseInt(qry.page.toString()) : defaults.page!;
        const query: any = qry?.query ?? false;
        const skip = (page - 1) * limit;
        const take = limit;

        /**
         * Pega os parâmetros de sorting e filtering
         */
        const clause = ClauseUtils.extractClauseParams(qry?.clause || body?.clause);
        const sort = ClauseUtils.extractSortingParams(qry?.sort || body?.sort);

        return {
            query,
            limit,
            page,
            skip,
            take,
            clause,
            sort,
        };
    };

    static GenerateInfoResponse = (req: FastifyRequest, reply: FastifyReply) => {
        try {
            return reply.code(HttpCode.OK).send({
                message: EnvironmentUtils.getApiNameEnv(),
                version: ProjectUtils.getProjectVersion(),
                hostname: OSUtils.getOsHostname(),
                client_ip: req.ip,
            });
        } catch (e: Error | any) {
            return reply.code(HttpCode.INTERNAL_SERVER_ERROR).send(e.toString());
        }
    };
}

enum HttpCode {
    CREATED = 201,
    OK = 200,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
}

export default RequestUtils;
export { HttpCode };
