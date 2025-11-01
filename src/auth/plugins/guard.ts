import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

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

export const authGuardFastifyPlugin = fp(guardPlugin, {
    name: "auth-guard-plugin",
});

export default authGuardFastifyPlugin;
