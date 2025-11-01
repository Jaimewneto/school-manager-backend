import { IBaseErrorPayload } from "@errors/interfaces";

export default abstract class BaseError extends Error {
    abstract http_code: number;
    abstract code: string;

    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, BaseError.prototype);
    }

    abstract serializeErrors(): IBaseErrorPayload[];
}
