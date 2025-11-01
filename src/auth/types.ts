import type { JWTPayload } from "jose";

import { TokenRole, TokenRoles } from "@/security";

export type iOrganizacao = { organization_uuid: string };
export type iEmpresa = { company_uuid: string };
export type iLoja = { loja_uuid: string };
export type iPDV = { pdv_uuid: string };

export type TokenAudience = string | string[];

/**
 * Dados do payload do token
 */
interface BaseTokenPayload extends JWTPayload {
    sub: string;
    role: TokenRoles;

    iat?: number | undefined;
    exp?: number | undefined;
    aud?: string | string[] | undefined;
    jti?: string | undefined;
}

export interface SystemOwnerTokenPayload extends BaseTokenPayload {
    sub: "system";
    role: TokenRole.SYSTEM_OWNER;
}

export interface OrganizationTokenPayload extends BaseTokenPayload, iOrganizacao {
    role: TokenRole.ORGANIZATION_ADMIN;
}

export interface CompanyTokenPayload extends BaseTokenPayload, iEmpresa {
    role: TokenRole.COMPANY_ADMIN;
}

// export interface POSTerminalTokenPayload extends BaseTokenPayload, iEmpresa, iLoja, iPDV {
//     role: TokenRole.POS_TERMINAL;

//     serial: string;
//     hwid: string;
// }

export type JwtPayload = SystemOwnerTokenPayload | OrganizationTokenPayload | CompanyTokenPayload;

/** Resultado após validação do AuthStrategy */
export interface AuthResult<T extends JwtPayload = JwtPayload> {
    payload: T;
}

/**
 * Interface padrão para estratégias de autenticação.
 *
 * Essa interface define o contrato que cada fluxo de autenticação (ex: email/senha, PDV, client_credentials)
 * deve seguir. Ela garante que todas as estratégias possam:
 * - Validar as credenciais de entrada (ex: email/senha, numero_serie/hardware_id)
 * - Gerar um token JWT com os dados apropriados
 * - (Opcional) Gerar um refresh token com dados persistentes
 *
 * A interface é genérica e aceita um tipo de payload específico (`T extends JwtPayload`),
 * permitindo que cada estratégia utilize claims personalizados com tipagem forte.
 *
 * @template T - Payload do JWT específico da estratégia (ex: CompanyTokenPayload, POSTerminalTokenPayload, etc)
 */
export interface AuthStrategy<T extends JwtPayload = JwtPayload> {
    /**
     * Valida as credenciais fornecidas pelo cliente durante o processo de login/autenticação inicial.
     *
     * Se as credenciais forem válidas, retorna um `AuthResult` contendo o payload completo do token.
     * Caso contrário, deve lançar um erro com a mensagem adequada.
     *
     * @param input - Dados enviados pelo cliente para autenticação (ex: { email, senha } ou { numero_serie, hardware_id })
     * @returns AuthResult<T> - Payload tipado para ser usado na geração do JWT
     */
    validateCredentials(input: any): Promise<AuthResult<T>>;

    /**
     * Gera o token JWT de acesso com base no payload validado anteriormente.
     *
     * @param result - Objeto com o payload tipado da estratégia
     * @returns object - Objeto com o token JWT de acesso e seus dados decodificados
     */
    generateToken(result: AuthResult<T>): Promise<{ token: string; tokenData: T }>;

    /**
     * (Opcional) Gera o refresh token com base no payload.
     *
     * Pode ser usado para criar um segundo token mais duradouro que será trocado por access tokens futuros.
     * Nem todas as estratégias exigem isso (ex: client_credentials pode não precisar).
     *
     * @param result - Payload tipado da estratégia
     * @returns object - Objeto com o token JWT de refresh e seus dados decodificados
     */
    generateRefreshToken?(result: AuthResult<T>): Promise<{ token: string; tokenData: T }>;

    /**
     * Decodifica o token JWT de acesso e retorna o payload tipado da estratégia.
     *
     * @param token - Token JWT de acesso a ser decodificado
     * @returns Payload decodificado do tipo T
     *
     * @example
     * const payload = strategy.decodeToken(accessToken);
     * console.log(payload.sub); // ID do usuário
     */
    decodeToken(token: string): Promise<AuthResult<T>>;

    /**
     * Decodifica o token JWT de refresh e retorna o payload tipado da estratégia.
     *
     * @param token - Token JWT de refresh a ser decodificado
     * @returns Payload decodificado do tipo T
     *
     * @example
     * const payload = strategy.decodeRefreshToken(refreshToken);
     * console.log(payload.sub); // ID do usuário
     */
    decodeRefreshToken?(token: string): Promise<AuthResult<T>>;
}

/**
 * Interface padrão para validação contextual de tokens JWT.
 * É executada após o token ser verificado (assinatura/expiração),
 * e serve para garantir que o conteúdo do token ainda é válido no contexto do sistema.
 */
export interface TokenValidator<T extends JwtPayload = JwtPayload> {
    validate(payload: T): Promise<void>;
}
