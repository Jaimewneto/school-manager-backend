import { v7 as uuid } from "uuid";

import { SignJWT, jwtVerify, errors as JoseErrors } from "jose";

// ERRORS
import { AuthError, NotFoundError } from "@errors/main";

// REPOSITORIES
import { CompanyRepository } from "@database/repositories/CompanyRepository";

// AUTH
import { AuthStrategy, AuthResult, CompanyTokenPayload } from "@auth/types";
import { CompanyAuthUtils, getKey } from "@auth/utils";

// SECURITY
import { TokenRole } from "@security/roles";

// UTILS
import { getJWTEnvironment } from "@utils/environment";

const REFRESH_TOKEN_AUDIENCE = "refresh-company";

export class CompanyAuth implements AuthStrategy<CompanyTokenPayload> {
    async validateCredentials({ client_id, client_secret }: { client_id: string; client_secret: string }): Promise<AuthResult<CompanyTokenPayload>> {
        const repository = new CompanyRepository();

        const company = await repository.findOneByClientCredential({ client_id });

        if (!company) throw new NotFoundError("Empresa não encontrada");

        // valida se o hash informado, corresponde ao hash salvo no banco de dados
        if (!(await CompanyAuthUtils.compare(client_secret, company.client_secret))) {
            throw new AuthError("INVALID_CREDENTIALS", "Credenciais inválidas");
        }

        const payload: CompanyTokenPayload = {
            role: TokenRole.COMPANY_ADMIN,

            sub: company.uuid,
            company_uuid: company.uuid,
        };

        return { payload };
    }

    async generateToken({ payload }: AuthResult<CompanyTokenPayload>): Promise<{ token: string; tokenData: CompanyTokenPayload }> {
        const { JWT_SECRET, JWT_ALGORITHM } = getJWTEnvironment();

        const iat = Math.floor(Date.now() / 1000);
        const exp = iat + 60 * 60 * 24 * 7; // 7 dias

        const token = await new SignJWT({
            jti: uuid(),

            // pega somente os dados necessários
            // quando faz o refresh token, ele passa iat, e exp pra cá, e não pode passar por causa do expiresIn nas options

            role: payload.role,

            company_uuid: payload.company_uuid,
        })
            .setProtectedHeader({ alg: JWT_ALGORITHM })
            .setIssuedAt(iat)
            .setExpirationTime(exp)
            .setSubject(payload.sub)
            .sign(getKey(JWT_SECRET));

        const tokenData = (await this.decodeToken(token)).payload;

        return { token, tokenData };
    }

    async generateRefreshToken({ payload }: AuthResult<CompanyTokenPayload>): Promise<{ token: string; tokenData: CompanyTokenPayload }> {
        const { JWT_SECRET, JWT_ALGORITHM } = getJWTEnvironment();

        const iat = Math.floor(Date.now() / 1000);
        const exp = iat + 60 * 60 * 24 * 30; // 30 dias

        const token = await new SignJWT({
            jti: uuid(),
            role: payload.role,

            company_uuid: payload.company_uuid,
        })
            .setProtectedHeader({ alg: JWT_ALGORITHM })
            .setAudience(REFRESH_TOKEN_AUDIENCE) // importante gerar o audience, ele é usado para checar se é um token de refresh
            .setIssuedAt(iat)
            .setExpirationTime(exp)
            .setSubject(payload.sub)
            .sign(getKey(JWT_SECRET));

        const tokenData = (await this.decodeRefreshToken(token)).payload;

        return { token, tokenData };
    }

    async decodeToken(token: string): Promise<{ payload: CompanyTokenPayload }> {
        try {
            const { JWT_SECRET, JWT_ALGORITHM } = getJWTEnvironment();

            const { payload } = await jwtVerify(token, getKey(JWT_SECRET), {
                algorithms: [JWT_ALGORITHM],
            });

            if (payload.role !== TokenRole.COMPANY_ADMIN) {
                throw new AuthError("INVALID_TOKEN_ROLE", "Role do token de autenticação inválida");
            }

            return { payload: payload as CompanyTokenPayload };
        } catch (error) {
            if (error instanceof JoseErrors.JWTExpired) {
                throw new AuthError("EXPIRED_TOKEN", "Token de autenticação expirado");
            }

            throw error;
        }
    }

    async decodeRefreshToken(token: string): Promise<{ payload: CompanyTokenPayload }> {
        try {
            const { JWT_SECRET, JWT_ALGORITHM } = getJWTEnvironment();
            const { payload } = await jwtVerify(token, getKey(JWT_SECRET), {
                algorithms: [JWT_ALGORITHM],
                audience: REFRESH_TOKEN_AUDIENCE,
            });

            if (payload.role !== TokenRole.COMPANY_ADMIN) {
                throw new AuthError("INVALID_TOKEN_ROLE", "Role do token de autenticação inválida");
            }

            return { payload: payload as CompanyTokenPayload };
        } catch (error) {
            if (error instanceof JoseErrors.JWTExpired) {
                throw new AuthError("EXPIRED_REFRESH_TOKEN", "Refresh token expirado");
            }

            if (error instanceof JoseErrors.JWTClaimValidationFailed && error.claim === "aud") {
                throw new AuthError("INVALID_REFRESH_TOKEN_AUDIENCE", "Audience do refresh token inválida, esperado: " + REFRESH_TOKEN_AUDIENCE);
            }

            throw error;
        }
    }
}
