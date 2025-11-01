import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

import { Socket, ExtendedError } from "socket.io";

import { JwtPayload } from "@auth/types";
import { checkBaseTokenStructure, tokenValidators, validateToken } from "@auth/validators";

const guardPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.addHook("onRequest", async (request) => {
        const authHeader = request.headers.authorization || request.cookies?.dev_authorization;

        // Valida a estrutura base do token
        const token = checkBaseTokenStructure(authHeader);

        // Delega verificação da assinatura e expiração
        const payload: JwtPayload = await validateToken(token);

        // Validação contextual baseada na role
        const validator = tokenValidators[payload.role];

        if (validator) {
            await validator.validate(payload);
        }

        // Injeta o payload validado no request
        request.user = payload;
    });
};

export const wsGuardPlugin = async (socket: Socket, next: (err?: ExtendedError) => void) => {
    try {
        // Valida a estrutura base do token
        const token = checkBaseTokenStructure(socket.handshake.auth.token);

        // Delega verificação da assinatura e expiração
        const payload: JwtPayload = await validateToken(token);

        // Validação contextual baseada na role
        const validator = tokenValidators[payload.role];

        if (validator) {
            await validator.validate(payload);
        }

        // Injeta o payload validado no request
        socket.data.user = payload;

        next();
    } catch (error: Error | any) {
        // coloca para receber no lado do cliente
        error.data = JSON.parse(JSON.stringify(error));

        // passa o erro para o error handler
        next(error);
    }
};

export const authGuardFastifyPlugin = fp(guardPlugin, {
    name: "auth-guard-plugin",
});

export default authGuardFastifyPlugin;
