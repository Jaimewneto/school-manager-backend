import { ZodType } from "zod";

/**
 * CheckSchema é um tipo genérico que recebe um tipo/interface como parâmetro
 * e valida se o z.object gerado possui as mesmas chaves (com seus respectivos tipos)
 * do tipo/interface passado como parâmetro.
 */
export type CheckSchema<T> = {
    [K in keyof T]: ZodType<T[K], any, any>;
};

/**
 * Exemplo de uso:
 *
 * const OrganizacaoCreateSchema = z.object({
 *      nome: z.string().min(3).max(255),
 * } satisfies CheckSchema<OrganizacaoModelInsert>);
 *
 *
 * Se OrganizacaoModelInsert esperar mais atributos (não opcionais), o TypeScript irá reclamar.
 *
 * Se um atributo que não existe em OrganizacaoModelInsert for adicionada, o typescript irá reclamar.
 *
 * Se o atributo "nome" não for uma string em OrganizacaoModelInsert, o typescript irá reclamar.
 *
 */

// TODO: Pensar numa maneira boa de lidar com os atributos que representam relacionamentos (atualmente não está bom)
