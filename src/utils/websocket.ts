import { captureException } from "@config/sentry";

import { generateErrorResponse } from "@errors/utils";

import { Clause, OrderBy } from "@/types/clause";

import { ClauseUtils } from "@utils/clause";
import { ResponseUtils } from "@utils/response";

type GeneratePaginationDataDefaults<T = unknown> = {
    limit?: number;
    page?: number;
    sort?: OrderBy<T>[];
    clause?: Clause<T>;
};

export class WebsocketUtils {
    limit = 200;

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

    GeneratePaginationData = (req: any, defaults?: GeneratePaginationDataDefaults) => {
        // mescla os padrões
        defaults = { ...this.DEFAULTS, ...defaults };

        // PAGINATION
        const limit = Number(req?.limit ? req?.limit : defaults.limit);
        const page = Number(req?.page ? req?.page : defaults.page);
        const query: any = req?.query ?? false;

        const skip = (page - 1) * limit;
        const take = limit;

        // PEGA OS PARÂMETROS DE SORTING E FILTERING
        const clause = ClauseUtils.extractClauseParams(req?.clause || defaults.clause);
        const sort = ClauseUtils.extractSortingParams(req?.sort || defaults.sort);

        return { query, limit, page, skip, take, clause, sort };
    };

    GenerateErrorResponse = (err: Error | any) => {
        // se for pra ignorar o sentry
        if (!err.ignore_sentry) {
            // captura a exception no sentry
            captureException(err, "Websockets");
        }

        return generateErrorResponse(err);
    };
}

export default WebsocketUtils;
