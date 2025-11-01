import { IBaseErrorPayload } from "@errors/interfaces";

export default abstract class BaseError extends Error {
    abstract http_code: number;
    abstract code: string;

    public ignore_sentry: boolean = false;

    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, BaseError.prototype);
    }

    abstract serializeErrors(): IBaseErrorPayload[];

    public isSentryIgnored() {
        return this.ignore_sentry;
    }
}
