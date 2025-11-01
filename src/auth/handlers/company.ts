/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify";

import { CompanyAuth } from "@auth/strategies/company";

import { CompanyAuthInput, CompanyRefreshInput } from "@auth/schemas/company.schema";

import RequestUtils from "@utils/request";

/**
 * Handler de autenticação para a role `TokenRole.COMPANY_ADMIN`
 */
export async function companyLoginFastifyHandler(request: FastifyRequest<{ Body: CompanyAuthInput }>, reply: FastifyReply) {
    const { client_id, client_secret } = request.body;

    const auth = new CompanyAuth();

    // valida credenciais
    const result = await auth.validateCredentials({ client_id, client_secret });

    // gera tokens
    const { token: accessToken } = await auth.generateToken(result);
    const { token: refreshToken } = await auth.generateRefreshToken(result);

    return reply.send(
        new RequestUtils().GenerateResponseSingleData({
            result: {
                access_token: accessToken,
                refresh_token: refreshToken,
            },
        }),
    );
}

/**
 * Handler de atualização do token para a role `TokenRole.COMPANY_ADMIN`
 */
export async function companyRefreshTokenFastifyHandler(request: FastifyRequest<{ Body: CompanyRefreshInput }>, reply: FastifyReply) {
    const { refresh_token } = request.body;

    const auth = new CompanyAuth();

    // valida credenciais
    const result = await auth.decodeRefreshToken(refresh_token);

    // gera tokens
    const { token: accessToken } = await auth.generateToken(result);
    const { token: refreshToken } = await auth.generateRefreshToken(result);

    return reply.send(
        new RequestUtils().GenerateResponseSingleData({
            result: {
                access_token: accessToken,
                refresh_token: refreshToken,
            },
        }),
    );
}
