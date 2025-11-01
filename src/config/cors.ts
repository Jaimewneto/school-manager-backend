// cors.ts (versão para Fastify)
import { FastifyCorsOptions } from "@fastify/cors";

const corsFactory = (): FastifyCorsOptions => {
    return {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
        maxAge: 86400, // 24 horas
        preflight: true,
        preflightContinue: false,
    };
};

export default corsFactory;
