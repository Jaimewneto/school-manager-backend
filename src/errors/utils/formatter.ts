import { ErrorResponse } from "@errors/types";
import { HttpCode } from "@utils/request";
import { isProduction } from "@utils/environment";
import BaseError from "@errors/sub/BaseError";

export const sanitizeErrorStack = (error: Error): string[] => (error.stack ? error.stack.trim().split("\n") : []);

export const generateErrorResponse = (err: Error) => {
    const isProd = isProduction();

    const isBaseError = err instanceof BaseError;

    const httpCode = isBaseError ? err.http_code : HttpCode.INTERNAL_SERVER_ERROR;
    const code = isBaseError ? err.code : undefined;

    return {
        status: false,
        error: true,

        name: err.name,
        code: code as any,
        message: isBaseError ? err.message : "Ocorreu um erro desconhecido",

        http_code: httpCode,

        errors: (err as any).serializeErrors?.() ?? [
            {
                message: err.message,

                // gera o stack trace apenas em ambiente de desenvolvimento
                ...(!isProd && {
                    stack_trace: sanitizeErrorStack(err),
                }),
            },
        ],
    } satisfies ErrorResponse;
};
