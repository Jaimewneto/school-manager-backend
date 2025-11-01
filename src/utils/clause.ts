import { ZodError } from "zod";
import { Buffer } from "buffer";

import Utils from "./main";

import { ClauseZodSchema, OrderByArraySchema } from "@validations/clause";

import { Clause, OrderBy } from "@/types/clause";

import { SortValidationError, ClauseValidationError } from "@/errors/main";

export class ClauseUtils {
    /**
     * Recebe uma string para filtrar os dados
     * Esse parâmetro pode recebido como base64 ou como json normal codificado como URI
     */
    static extractClauseParams = (initialString: any) => {
        try {
            if (!initialString) {
                return undefined;
            }

            // verifica se já não é um objeto pronto
            if (Utils.isObject(initialString)) {
                return ClauseZodSchema.parse(initialString) as Clause;
            }

            const decodedString = this.decodeString(initialString);

            const parsedObject = Utils.isJSONString(decodedString) ? JSON.parse(decodedString) : decodedString;

            return (ClauseZodSchema.parse(parsedObject) || undefined) as Clause;
        } catch (error) {
            if (error instanceof ZodError) {
                throw new ClauseValidationError(error);
            }
            throw error;
        }
    };

    /**
     * Recebe uma string para ordenar os dados
     * Esse parâmetro pode recebido como base64 ou como json normal codificado como URI
     */
    static extractSortingParams = (initialString?: any) => {
        try {
            if (!initialString) {
                return [];
            }

            // verifica se já não é uma array
            if (Array.isArray(initialString)) {
                return OrderByArraySchema.parse(initialString) as OrderBy<unknown>[];
            }

            const decodedString = this.decodeString(initialString);

            const parsedObject = Utils.isJSONString(decodedString) ? JSON.parse(decodedString) : decodedString;

            return (OrderByArraySchema.parse(parsedObject) || []) as OrderBy<unknown>[];
        } catch (error) {
            if (error instanceof ZodError) {
                throw new SortValidationError(error);
            }
            throw error;
        }
    };

    private static decodeString(input: any): string {
        // se for um base 64, decodifica o base 64
        if (Utils.isBase64(input)) {
            return Buffer.from(input, "base64").toString();
        }

        // se for um parâmetro codificado com encodeURIComponent, decodifica
        if (Utils.isURIComponentString(input)) {
            return decodeURIComponent(input);
        }

        // se for uma string simplesmente retorna
        return input;
    }
}

export default ClauseUtils;
