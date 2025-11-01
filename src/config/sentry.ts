import getenv from "getenv";
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

import { FastifyInstance, FastifyRequest } from "fastify";

import { getEnvironment, isProduction } from "@utils/environment";
import { getProjectVersion } from "@utils/project";

export const configureSentry = () => {
    const production = isProduction();

    const sentryDSN = getenv("SENTRY_DSN_URL", "");
    const sentryProjectName = getenv("SENTRY_PROJECT_NAME", "");

    if (!sentryDSN || !sentryProjectName) return;

    Sentry.init({
        dsn: sentryDSN,
        integrations: [
            // enable Application Not Responding (ANR)
            // Sentry.anrIntegration({ captureStackTrace: true, anrThreshold: 10000 }),

            // enable HTTP calls tracing
            Sentry.httpIntegration(),

            // profilling
            nodeProfilingIntegration(),
        ],

        // configure the release
        release: sentryProjectName + "@" + getProjectVersion(),

        // configure environment
        environment: getEnvironment(),

        // Performance Monitoring
        tracesSampleRate: !production ? 1 : 0.25, // 0.25 = 25%

        // Set sampling rate for profiling - this is relative to tracesSampleRate
        profilesSampleRate: !production ? 1 : 0.25, // 0.25 = 25%
    });
};

export const configureBaseSentryErrorStructure = (error: Error | any, scope = "") => {
    // Tenta localizar o response do axios
    const response_axios = error?.response?.data || false;
    // Tenta localizar o response da api
    const response_api = error?.response || false;

    // Identifica a response
    const response = (response_axios || response_api) ?? {};

    return {
        extra: {
            response: response,
            response_s: JSON.stringify(response, null, 4),

            // error into json format
            json_error: JSON.stringify(error, null, 4) ?? "",
        },
        tags: { scope: scope },
    };
};

export const captureException = (error: Error | any, scope = "") => {
    const errorStructure = configureBaseSentryErrorStructure(error, scope);

    // Envia a exception para o Sentry.
    Sentry.captureException(error, errorStructure);
};

export const captureFastifyException = (error: Error | any, req: FastifyRequest) => {
    if (error?.isSentryIgnored?.() === true || error?.ignore_sentry === true) {
        return;
    }

    Sentry.withScope((scope) => {
        const base = configureBaseSentryErrorStructure(error, "fastify");

        scope.setExtras({
            fastify: { url: req.originalUrl, method: req.method, headers: req.headers, params: req.params, query: req.query, body: req.body },

            ...base.extra,
        });

        scope.setTags({ ...base.tags });

        // Captura o erro
        Sentry.captureException(error);
    });
};

export const setupFastifyErrorHandler = (app: FastifyInstance) => {
    Sentry.setupFastifyErrorHandler(app, {
        shouldHandleError(error, request) {
            captureFastifyException(error, request as any);

            return false;
        },
    });
};

export * as Sentry from "@sentry/node";

export default configureSentry;
