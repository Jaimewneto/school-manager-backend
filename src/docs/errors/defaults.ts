// Schema para resposta de erro
import { z } from "zod";

const BadRequestResponseSchema = z
    .object({
        status: z.boolean().default(false),
        error: z.boolean().default(true),
        code: z.enum(["CLAUSE_VALIDATION_ERROR", "PAYLOAD_VALIDATION_ERROR"]).optional(),
        name: z.enum(["ClauseValidationError", "SortValidationError", "ZodPayloadValidationError"]).optional(),
        message: z.string().default("Existem parâmetros inválidos associados a requisição"),
        http_code: z.number().default(400),
        errors: z
            .array(
                z.object({
                    message: z.string().default("Você deve informar o identificador como um UUID v4"),
                    type: z.string().default("field"),
                    field: z.string().default("emitente_uuid"),
                }),
            )
            .optional(),
    })
    .describe("Requisição mal-formada.");

const UnauthorizedResponseSchema = z
    .object({
        status: z.boolean().default(false),
        error: z.boolean().default(true),
        code: z.enum(["NO_PROVIDED_TOKEN", "INVALID_TOKEN", "MALFORMATTED_TOKEN", "INVALID_CREDENTIALS", "SWAGGER_INVALID_CREDENTIALS"]).optional(),
        name: z.enum(["AuthError"]).optional(),
        message: z.string().default("Token não fornecido"),
        http_code: z.number().default(401),
        errors: z
            .array(
                z.object({
                    message: z.string().default("Token não fornecido"),
                    code: z.string().default("NO_PROVIDED_TOKEN"),
                }),
            )
            .optional(),
    })
    .describe("Usuário ou serviço não autorizado.");

const NotFoundResponseSchema = z
    .object({
        status: z.boolean().default(false),
        error: z.boolean().default(true),
        code: z.enum(["NOT_FOUND"]).optional(),
        name: z.enum(["NotFoundError"]).optional(),
        message: z.string().default("Registro não encontrado"),
        http_code: z.number().default(404),
        errors: z
            .array(
                z.object({
                    message: z.string().default("Registro não encontrado"),
                    code: z.string().default("NOT_FOUND"),
                }),
            )
            .optional(),
    })
    .describe("Registro não encontrado.");

export {
    //
    BadRequestResponseSchema,
    UnauthorizedResponseSchema,
    NotFoundResponseSchema,
};
