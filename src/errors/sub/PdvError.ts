import { IBaseErrorPayload } from "@errors/interfaces";
import { PdvErrorCodes } from "@errors/types";
import { HttpCode } from "@utils/request";

import BaseError from "./BaseError";

export class PdvError extends BaseError {
    public code: PdvErrorCodes;
    public http_code = HttpCode.BAD_REQUEST;

    constructor(code: PdvErrorCodes, message?: string) {
        const message_code = PdvError.getMessageByCode(code);

        super(message || message_code);

        this.name = PdvError.name.trim();
        this.message = message ?? message_code;
        this.code = code;

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, PdvError.prototype);
    }

    static getMessageByCode(code: PdvErrorCodes) {
        switch (code) {
            case "PDV_NOT_INSTALLED":
                return `O PDV ainda não foi instalado`;

            case "PDV_ALREADY_INSTALLED":
                return `O PDV já está instalado`;

            case "PDV_HARDWARE_ID_MISMATCH":
                return `O PDV está instalado em um outro terminal físico`;

            case "PDV_NOT_CONFIGURED_TO_ISSUE_NFCE":
                return `O PDV não está configurado para emitir NFC-e`;

            default:
                return "PDV: Erro desconhecido";
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

export default PdvError;
