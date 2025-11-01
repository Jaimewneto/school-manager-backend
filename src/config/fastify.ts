// fastify.ts
import * as appFactory from "./app";

// import io from "@config/socket"; //! Por hora não estamos usando

const setupFastify = async () => {
    await appFactory.applyErrorMiddleware(); // !should be first config

    await appFactory.applySentry(); // !should be second config, after error middleware

    await appFactory.applyBodyParsing();

    await appFactory.applyCorsOptions();
    await appFactory.applyCookieParser();
    await appFactory.applyRateLimiter();

    await appFactory.applySwaggerOpenAPI();
    await appFactory.applyRoutes();
};

// Exporta como uma função para ser usada em outros lugares
export default setupFastify;
