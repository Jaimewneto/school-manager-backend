import { ZodFastifySchemaValidationError } from "fastify-type-provider-zod";

import { HttpCode } from "@utils/request";
import BaseError from "./BaseError";

export type ZodPayloadValidationErrorLocation = "params" | "query" | "body" | "headers" | "clause" | "sort";

export class ZodPayloadValidationError extends BaseError {
    public http_code = HttpCode.BAD_REQUEST;
    public code = "PAYLOAD_VALIDATION_ERROR";

    constructor(
        public error: ZodFastifySchemaValidationError[],
        public location?: ZodPayloadValidationErrorLocation,
        message = "",
    ) {
        super(message || "Existem parâmetros inválidos associados a requisição");

        this.name = ZodPayloadValidationError.name.trim();

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, ZodPayloadValidationError.prototype);
    }

    serializeErrors() {
        return this.error.map((error: ZodFastifySchemaValidationError) => {
            return {
                location: this.location || "unknown",
                message: error.message,
                type: "field",
                field: error.params.issue.path.join("."),
            };
        });
    }
}

export default ZodPayloadValidationError;
