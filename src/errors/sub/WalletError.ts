import { IBaseErrorPayload } from "@errors/interfaces";
import { WalletErrorCodes } from "@errors/types";
import { HttpCode } from "@utils/request";

import BaseError from "./BaseError";

export class WalletError extends BaseError {
    public code: WalletErrorCodes;
    public http_code = HttpCode.BAD_REQUEST;

    constructor(code: WalletErrorCodes, message?: string) {
        const message_code = WalletError.getMessageByCode(code);

        super(message || message_code);

        this.name = WalletError.name.trim();
        this.message = message ?? message_code;
        this.code = code;

        // configura para ignorar o report de erros no sentry
        this.ignore_sentry = true;

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, WalletError.prototype);
    }

    static getMessageByCode(code: WalletErrorCodes) {
        switch (code) {
            case "CART_LIMIT_REACHED":
                return `Numero de cartões atingiu o limite`;

            case "WRONG_CARD_PASSWORD":
                return `Senha inválida`;

            case "INSUFFICIENT_FUNDS":
                return `Saldo insuficiente para realizar a transação`;

            default:
                return "Carteira: Erro desconhecido";
        }
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

export default WalletError;
