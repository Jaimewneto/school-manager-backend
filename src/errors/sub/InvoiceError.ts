import { IBaseErrorPayload } from "@errors/interfaces";
import { InvoiceErrorCodes } from "@errors/types";
import { HttpCode } from "@utils/request";

import BaseError from "./BaseError";

export class InvoiceError extends BaseError {
    public code: InvoiceErrorCodes;
    public http_code = HttpCode.BAD_REQUEST;
    public errors?: any[];

    constructor(code: InvoiceErrorCodes, message?: string, errors?: any[]) {
        const message_code = InvoiceError.getMessageByCode(code);

        super(message || message_code);

        this.name = InvoiceError.name.trim();
        this.message = message ?? message_code;
        this.code = code;
        this.errors = errors ? InvoiceError.parseErrors(errors, code) : undefined;

        // configura para ignorar o report de erros no sentry
        this.ignore_sentry = true;

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, InvoiceError.prototype);
    }

    static getMessageByCode(code: InvoiceErrorCodes) {
        switch (code) {
            case "INVOICE_ISSUE_ERROR":
                return `Erro ao emitir nota fiscal`;

            case "SEQUENCE_NOT_FOUND":
                return `Número sequencial de nota fiscal não encontrado`;

            case "ISSUER_NOT_CONFIGURED":
                return `Emitente não configurado para emissão de NFCe`;

            default:
                return "NFCe: Erro desconhecido";
        }
    }

    static parseErrors(errors: any[], code: string): IBaseErrorPayload[] {
        return errors.map((err) => ({
            message: err?.descricao && err?.erro ? `${err.descricao} - ${err.erro}` : "Erro desconhecido",
            code: code,
        }));
    }

    serializeErrors(): IBaseErrorPayload[] {
        const errorsArray = this.errors ?? [
            {
                message: this.message,
                code: this.code,
            },
        ];

        return errorsArray;
    }
}

export default InvoiceError;
