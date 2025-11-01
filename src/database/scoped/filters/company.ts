import MainContext from "@/contexts/main";
import { Clause, Condition } from "@/types/clause";

import { CompanyModel } from "@database/models/CompanyModel";

export const getCompanyScopedFilters = (): Clause | undefined => {
    const user = MainContext.getUser();

    // se não tiver usuário, ele pode estar acessando de rotas públicas, por exemplo
    // para geração de tokens
    if (!user) return undefined;

    const conditions: Condition<CompanyModel>[] = [];

    // se o token tiver organization_uuid, esse token é de nivel de organização, então ele não pode acessar outras organizações
    if ("organization_uuid" in user) {
        conditions.push({
            field: "organization_uuid",
            operator: "=",
            value: user.organization_uuid as string,
        });
    }

    // se o token tiver company_uuid, ele pode somente acessar esta empresa, tokens gerados na ponta, por exemplo pdv, empresa, são escopados
    if ("company_uuid" in user) {
        conditions.push({
            field: "uuid",
            operator: "=",
            value: user.company_uuid as string,
        });
    }

    if (conditions.length === 0) return undefined;

    return { type: "and", conditions };
};
