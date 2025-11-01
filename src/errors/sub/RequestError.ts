import BaseError from "./BaseError";

import { IBaseErrorPayload } from "@errors/interfaces";

import { HttpCode } from "@utils/request";

export class RequestsError extends BaseError {
    public code = "TOO_MANY_REQUESTS";

    public http_code = HttpCode.TOO_MANY_REQUESTS;

    constructor(message: string = "Muitas requisições por segundo, tente novamente mais tarde") {
        super(message);

        Object.setPrototypeOf(this, RequestsError.prototype);
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

export default RequestsError;
