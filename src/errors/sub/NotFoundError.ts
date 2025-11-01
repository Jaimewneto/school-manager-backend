import { HttpCode } from "@utils/request";
import { IBaseErrorPayload } from "@errors/interfaces";

import BaseError from "./BaseError";

export class NotFoundError extends BaseError {
    public code = "NOT_FOUND";
    public http_code = HttpCode.NOT_FOUND;

    constructor(message?: string) {
        super(message || "Registro não encontrado");

        this.name = NotFoundError.name.trim();

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors(): IBaseErrorPayload[] {
        return [{ message: this.message }];
    }
}

export default NotFoundError;
