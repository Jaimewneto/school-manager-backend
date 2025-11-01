import { ZodError, ZodIssue } from "zod";
import { HttpCode } from "@utils/request";
import BaseError from "./BaseError";

export class ClauseValidationError extends BaseError {
    public http_code = HttpCode.BAD_REQUEST;
    public code = "CLAUSE_VALIDATION_ERROR";

    constructor(
        public error: ZodError,
        message = "",
    ) {
        super(message || "Existem parâmetros inválidos associados ao clause");

        this.name = ClauseValidationError.name.trim();

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, ClauseValidationError.prototype);
    }

    serializeErrors() {
        return this.error.issues.map((issue: ZodIssue) => {
            return {
                message: issue.message,
                type: "field",
                field: issue.path.join("."),
            };
        });
    }
}

export default ClauseValidationError;
