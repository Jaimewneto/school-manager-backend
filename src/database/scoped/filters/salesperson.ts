import MainContext from "@/contexts/main";
import { Clause, Condition } from "@/types/clause";

import { SalespersonModel } from "@database/models/SalespersonModel";

export const getSalespersonScopedFilters = (): Clause | undefined => {
    const user = MainContext.getUser();

    // se não tiver usuário, ele pode estar acessando de rotas públicas, por exemplo
    // para geração de tokens
    if (!user) return undefined;

    const conditions: Condition<SalespersonModel>[] = [];

    // se o token tiver organization_uuid, esse token é de nivel de organização, então ele não pode acessar outras organizações
    if ("organization_uuid" in user) {
        conditions.push({
            field: "organization_uuid",
            operator: "=",
            value: user.organization_uuid as string,
        });
    }

    if (conditions.length === 0) return undefined;

    return { type: "and", conditions };
};
