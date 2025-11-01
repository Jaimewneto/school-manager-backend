/* eslint-disable @typescript-eslint/no-unused-vars */
import { jwtVerify, errors as JoseErrors } from "jose";

import { JwtPayload, TokenValidator } from "@auth/types";
import { getKey } from "@auth/utils";

import { AuthError } from "@errors/main";

import { TokenRole } from "@security/roles";

import { getJWTEnvironment } from "@utils/environment";

import { CompanyValidator } from "./rules/company";

export const tokenValidators: Partial<Record<TokenRole, TokenValidator>> = {
    [TokenRole.COMPANY_ADMIN]: CompanyValidator,
};

export async function validateToken<T = JwtPayload>(token: string): Promise<T> {
    try {
        const { JWT_SECRET, JWT_ALGORITHM } = getJWTEnvironment();

        const { payload } = await jwtVerify(token, getKey(JWT_SECRET), {
            algorithms: [JWT_ALGORITHM],
        });

        return payload as T;
    } catch (error) {
        if (error instanceof JoseErrors.JWTExpired) {
            throw new AuthError("EXPIRED_TOKEN", "Token de autenticação expirado");
        }

        throw error;
    }
}

export const checkBaseTokenStructure = (headerToken: string | undefined) => {
    if (!headerToken) {
        throw new AuthError("NO_PROVIDED_TOKEN", "Token não fornecido");
    }

    const parts = (headerToken || "").split(" ");

    if (parts.length != 2) {
        throw new AuthError("INVALID_TOKEN", "Token inválido");
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        throw new AuthError("MALFORMATTED_TOKEN", "Token mal formatado");
    }

    if (!/^[A-Za-z0-9_-]+?\.[A-Za-z0-9_-]+?\.[A-Za-z0-9_-]+$/i.test(token)) {
        throw new AuthError("MALFORMATTED_TOKEN", "Token mal formatado");
    }

    return token;
};
