import { Server as WebSocketServer } from "socket.io";

import fastify, { FastifyInstance } from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import fastifySwagger from "@fastify/swagger";

import { jsonSchemaTransform, validatorCompiler } from "fastify-type-provider-zod";

import corsFactory from "./cors";

// LOGGER
import { Logger } from "@logging/main";

// MIDDLEWARES
import ErrorHandlerMiddleware from "@middlewares/error-handler";
import ApiRateLimiterMiddleware from "@middlewares/rate-limiter";

// ROUTES
import MainRouter from "@routes/http";

// UTILS
import EnvironmentUtils from "@utils/environment";
import ProjectUtils from "@utils/project";

const logger = Logger(`api-autoatendimento-v3@${__filename}`);

const app: FastifyInstance = fastify({
    logger: !EnvironmentUtils.isProduction(),
    trustProxy: ["loopback", "linklocal", "uniquelocal"],

    keepAliveTimeout: 60000, // 60 segundos
    requestTimeout: 0, // evita timeout automático
}).withTypeProvider();

const applySwaggerOpenAPI = async () => {
    logger.info("Setting up application Swagger documentation...");

    // REGISTRA SWAGGER PRIMEIRO
    await app.register(fastifySwagger, {
        transform: jsonSchemaTransform,
        openapi: {
            components: {
                securitySchemes: {
                    Bearer: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                        description:
                            "Token JWT usado para autenticação do tipo Bearer. <br /> Deve ser enviado no cabeçalho <strong>Authorization</strong> como <strong>Bearer <seu_token></strong>",
                    },
                },
            },

            servers: [
                {
                    url: EnvironmentUtils.getApiUrlEnv(),
                    description: EnvironmentUtils.getEnvironment(),
                },
            ],
            info: {
                title: EnvironmentUtils.getApiNameEnv(),
                version: ProjectUtils.getProjectVersion(),
                // description: "Documentação REST",
            },
        },
    });

    app.setValidatorCompiler(validatorCompiler);
};

const applyRoutes = async () => {
    logger.info("Setting up application REST routing...");

    await app.register(MainRouter);
};

const applyBodyParsing = async () => {
    logger.info("Setting up application body parsing capabilities...");

    app.addContentTypeParser("application/json", { parseAs: "string", bodyLimit: 20 * 1024 * 1024 }, (req, body: string, done) => {
        try {
            const parsed = JSON.parse(body);
            done(null, parsed);
        } catch (err: Error | any) {
            done(err, undefined);
        }
    });

    await app.register(fastifyFormbody, { bodyLimit: 20 * 1024 * 1024 });
};

const applyCookieParser = async () => {
    logger.info("Setting up application cookie parsing capabilities...");

    await app.register(fastifyCookie);
};

const applyCorsOptions = async () => {
    logger.info("Setting up application CORS options...");

    await app.register(fastifyCors, corsFactory());
};

const applyWebsocketServer = async (io: WebSocketServer) => {
    logger.info("Setting up WebSocket server...");

    io.attach(app.server);

    app.decorate("io", io);

    app.addHook("preClose", (done) => {
        io.local.disconnectSockets(true);
        done();
    });

    app.addHook("onClose", (fastify: FastifyInstance, done) => {
        io.close();
        done();
    });
};

const applyErrorMiddleware = async () => {
    logger.info("Setting up error handler middleware...");

    app.setErrorHandler(ErrorHandlerMiddleware);
};

const applyRateLimiter = async () => {
    logger.info("Setting up rate limiter middleware...");

    await app.register(ApiRateLimiterMiddleware);
};

export {
    //
    app,
    applySwaggerOpenAPI,
    applyRoutes,
    applyBodyParsing,
    applyCorsOptions,
    applyErrorMiddleware,
    applyWebsocketServer,
    applyCookieParser,
    applyRateLimiter,
};
