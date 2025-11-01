import { ZodFastifySchemaValidationError, hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { ZodPayloadValidationError, ZodPayloadValidationErrorLocation } from "@errors/main";

/**
 * Converte erros externos em erros internos da aplicação
 */
export const convertToInternalError = (err: unknown): Error => {
    // verifica se o erro veio de fastify-type-provider-zod
    if (hasZodFastifySchemaValidationErrors(err)) {
        return new ZodPayloadValidationError(
            err.validation as ZodFastifySchemaValidationError[],
            err.validationContext as ZodPayloadValidationErrorLocation,
        );
    }

    return err as Error;
};
