// Declara um símbolo único para a marca.
// Esse símbolo é usado para "brandear" os tipos e identificar quais campos foram explicitamente marcados como obrigatórios.
// Não é necessário exportá-lo, pois é apenas um identificador interno.
declare const requiredFieldSymbol: unique symbol;

/**
 * Wrapper que marca o campo como obrigatório.
 *
 * Ele recebe um tipo T e o "embrulha" adicionando uma propriedade opcional readonly identificada pelo símbolo.
 * Isso não altera o valor em tempo de execução, mas serve para que o sistema de tipos saiba que esse campo foi marcado.
 *
 * Exemplo:
 *   public id: RequiredField<number>;
 *   // O tipo "id" será tratado como obrigatório no tipo gerado.
 */
export type RequiredField<T> = T & { readonly [requiredFieldSymbol]?: true };

/**
 * Função auxiliar para verificar se uma propriedade foi marcada como obrigatória.
 *
 * Recebe um tipo T e uma chave K (que deve ser uma propriedade de T).
 * Se o tipo da propriedade T[K] estender { [requiredFieldSymbol]?: true }, retorna true; caso contrário, retorna false.
 * Essa verificação permite diferenciar os campos "marcados" (obrigatórios) dos demais.
 */
type IsRequired<T, K extends keyof T> = T[K] extends { [requiredFieldSymbol]?: true } ? true : false;

/**
 * Helper para extrair o tipo interno do RequiredField.
 *
 * Se T for do tipo RequiredField<U>, ele extrai U; caso contrário, retorna T.
 * Assim, obtemos o tipo "desembrulhado" para uso posterior.
 */
type UnwrapRequiredField<T> = T extends RequiredField<infer U> ? U : T;

/**
 * GenerateInsertType<T, OmittedKeys>
 *
 * Gera um tipo para operações de inserção (insert) a partir de uma classe ou interface T,
 * permitindo também omitir determinadas chaves.
 *
 * O tipo final é construído da seguinte forma:
 *   1. Aplica Omit<T, OmittedKeys> para remover as chaves especificadas.
 *   2. Para as propriedades restantes marcadas como obrigatórias (usando RequiredField):
 *      - São mantidas como obrigatórias no tipo final.
 *      - O tipo de cada propriedade é obtido "desembrulhando" com o helper UnwrapRequiredField.
 *   3. Para as demais propriedades:
 *      - São tornadas opcionais (usando o operador '?'), permitindo que não sejam informadas.
 *
 * @template T - O tipo original a partir do qual o tipo de inserção será gerado.
 * @template OmittedKeys - (Opcional) Chaves de T que devem ser omitidas no tipo resultante.
 *                        Deve ser uma das chaves de T (extends keyof T). O valor padrão é `undefined`,
 *                        o que significa que nenhuma chave será omitida se nenhuma for especificada.
 *
 * Exemplo:
 *   export class Exemplo {
 *     public id: RequiredField<number>;
 *     public nome: string;
 *     public descricao: RequiredField<string>;
 *   }
 *
 *   Gera um tipo para inserção omitindo a chave 'id'
 *   type ExemploInsert = GenerateInsertType<Exemplo, 'id'>;
 *   Resultado:
 *   {
 *     nome?: string;
 *     descricao: string;
 *   }
 */
export type GenerateInsertType<T, OmittedKeys extends keyof T = any> = {
    // Para as chaves restantes (após o Omit) que foram marcadas como obrigatórias (RequiredField),
    // inclui a propriedade K como obrigatória, com o tipo desembrulhado via UnwrapRequiredField.
    [K in keyof Omit<T, OmittedKeys> as IsRequired<T, K> extends true ? K : never]: UnwrapRequiredField<T[K]>;
} & {
    // Para as demais chaves (não marcadas como obrigatórias),
    // inclui a propriedade K de forma opcional.
    [K in keyof Omit<T, OmittedKeys> as IsRequired<T, K> extends true ? never : K]?: T[K];
};

/**
 * GenerateUpdateType<T, OmittedKeys>
 *
 * Gera um tipo para operações de atualização (update) a partir de uma classe ou interface T.
 *
 * Esse tipo é construído em duas etapas:
 *   1. Omit<T, OmittedKeys> - Remove as propriedades especificadas em OmittedKeys de T.
 *   2. Partial<...> - Torna todas as propriedades restantes opcionais.
 *
 * Isso é útil para operações de update, onde nem todos os campos precisam ser enviados e certos campos (por exemplo, IDs) podem ser omitidos.
 *
 * @template T - O tipo original a partir do qual o tipo de atualização será gerado.
 * @template OmittedKeys - (Opcional) Chaves de T que devem ser omitidas no tipo resultante.
 *                        Deve ser uma das chaves de T (extends keyof T). O valor padrão é `undefined`,
 *                        o que significa que nenhuma chave será omitida se nenhuma for especificada.
 *
 * Exemplo:
 *   interface Usuario {
 *     id: number;
 *     nome: string;
 *     email: string;
 *     senha: string;
 *   }
 *
 *   Cria um tipo para atualização onde a propriedade 'id' é omitida e os demais campos são opcionais.
 *   type UsuarioUpdate = GenerateUpdateType<Usuario, 'id'>;
 *
 *   O tipo UsuarioUpdate será equivalente a:
 *   {
 *     nome?: string;
 *     email?: string;
 *     senha?: string;
 *   }
 */
export type GenerateUpdateType<T, OmittedKeys extends keyof T = any> = Partial<{
    [K in keyof Omit<T, OmittedKeys>]: UnwrapRequiredField<T[K]>;
}>;

export type Int8 = bigint;

export type Timestamp = Date | string;
