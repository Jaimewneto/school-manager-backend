import { FastifyRequest } from "fastify";
import rateLimit from "@fastify/rate-limit";
import fastifyPlugin from "fastify-plugin";
import { IoRedisClientPool } from "@config/redis";
import RequestsError from "@errors/sub/RequestError";

type RateLimiterOptions = {
    max?: number;
    ban?: number;
    timeWindow?: number;
    hook?: string;
    cache?: number;
    allowList?: string[];
    redis?: any;
    nameSpace?: string;
    continueExceeding?: boolean;
    skipOnError?: boolean;
    keyGenerator?: (req: FastifyRequest) => string;
    errorResponseBuilder?: (req: FastifyRequest) => any;
    enableDraftSpec?: boolean;
    addHeadersOnExceeding?: {
        [key: string]: string;
    };
    addHeaders?: {
        [key: string]: string;
    };
};

const ApiRateLimiterMiddleware = fastifyPlugin(async (fastify, options: RateLimiterOptions) => {
    const {
        max = 1000,
        ban = -1,
        timeWindow = 60000,
        hook = "onRequest",
        cache = 1000,
        allowList = [],
        redis = await IoRedisClientPool(),
        nameSpace = "fastify-rate-limit-",
        continueExceeding = false,
        skipOnError = false,
        keyGenerator = (req: FastifyRequest) => req.ip,
        errorResponseBuilder = (_req: FastifyRequest) => {
            return new RequestsError();
        },
        enableDraftSpec = false,
        addHeadersOnExceeding = {
            "x-ratelimit-limit": true,
            "x-ratelimit-remaining": true,
            "x-ratelimit-reset": true,
        },
        addHeaders = {
            "x-ratelimit-limit": true,
            "x-ratelimit-remaining": true,
            "x-ratelimit-reset": true,
            "retry-after": true,
        },
    } = options;

    const rateLimitConfig: any = {
        max,
        ban,
        timeWindow,
        hook,
        cache,
        allowList,
        redis,
        nameSpace,
        continueExceeding,
        skipOnError,
        keyGenerator,
        errorResponseBuilder,
        enableDraftSpec,
        addHeadersOnExceeding,
        addHeaders,
    };

    await fastify.register(rateLimit, rateLimitConfig);
});

export default ApiRateLimiterMiddleware;
