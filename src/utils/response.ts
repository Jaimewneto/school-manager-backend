import os from "os";

export class ResponseUtils {
    public static GenerateResponseSingleData = <T = any>({
        status = true, //
        requested = true,
        result,
    }: {
        status?: boolean;
        requested?: boolean;
        result: T;
    }) => {
        return {
            status,
            requested,
            result,
        };
    };

    public static GenerateResponsePaginationData = <T = any>({
        //
        status = true,
        requested = true,

        page,
        count,
        limit,
        results,
    }: {
        status?: boolean;
        requested?: boolean;
        page: number;
        count: number;
        limit: number;
        results: T[];
    }) => {
        return {
            status,
            requested: requested === true,
            metadata: {
                page: {
                    current: page,
                    total: Math.ceil(count / limit),
                },
                limit: limit,
                total: count,
                hostname: os.hostname(),
            },
            results: results,
        };
    };
}
