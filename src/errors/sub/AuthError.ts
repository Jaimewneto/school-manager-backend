import { IBaseErrorPayload } from "@errors/interfaces";
import { AuthErrorCodes } from "@errors/types";
import { HttpCode } from "@utils/request";

import BaseError from "./BaseError";

export class AuthError extends BaseError {
    public code: AuthErrorCodes;

    public http_code = HttpCode.UNAUTHORIZED;

    constructor(code: AuthErrorCodes, message?: string) {
        super(message || "Erro de autenticação");

        this.name = AuthError.name.trim();
        this.message = message || "Erro de autenticação";
        this.code = code;

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, AuthError.prototype);
    }

    serializeErrors(): IBaseErrorPayload[] {
        return [
            {
                message: this.message,
                code: this.code,
            },
        ];
    }
}

export default AuthError;
