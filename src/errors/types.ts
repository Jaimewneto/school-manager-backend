import { IBaseErrorPayload } from "./interfaces";

// Manter em ordem alfabética
import AuthError from "./sub/AuthError";
import BaseError from "./sub/BaseError";
import ClauseValidationError from "./sub/ClauseValidationError";
import NoPermissionV2Error from "./sub/NoPermissionV2Error";
import NotFoundError from "./sub/NotFoundError";
import PdvError from "./sub/PdvError";
import SortValidationError from "./sub/SortValidationError";
import ZodPayloadValidationError from "./sub/ZodPayloadValidationError";
import InvoiceError from "./sub/InvoiceError";

export type AuthErrorCodes =
    | "NO_PROVIDED_TOKEN"
    | "INVALID_TOKEN"
    | "INVALID_TOKEN_ROLE"
    | "EXPIRED_TOKEN"
    | "INVALID_REFRESH_TOKEN"
    | "INVALID_REFRESH_TOKEN_AUDIENCE"
    | "EXPIRED_REFRESH_TOKEN"
    | "MALFORMATTED_TOKEN"
    | "INVALID_CREDENTIALS"
    | "SWAGGER_INVALID_CREDENTIALS";

export type PdvErrorCodes = "PDV_ALREADY_INSTALLED" | "PDV_NOT_INSTALLED" | "PDV_HARDWARE_ID_MISMATCH" | "PDV_NOT_CONFIGURED_TO_ISSUE_NFCE";

export type WalletErrorCodes = "CART_LIMIT_REACHED" | "WRONG_CARD_PASSWORD" | "INSUFFICIENT_FUNDS";

export type InvoiceErrorCodes = "INVOICE_ISSUE_ERROR" | "SEQUENCE_NOT_FOUND" | "ISSUER_NOT_CONFIGURED";

// Manter em ordem alfabética
export type ErrorType =
    | BaseError
    | AuthError
    | ClauseValidationError
    | Error
    | NoPermissionV2Error
    | NotFoundError
    | PdvError
    | SortValidationError
    | ZodPayloadValidationError
    | InvoiceError;

export type ErrorResponse = {
    http_code: number;
    status: boolean;
    error: boolean;
    name: string;
    message: string;
    code?: string;
    errors?: IBaseErrorPayload[];
};
