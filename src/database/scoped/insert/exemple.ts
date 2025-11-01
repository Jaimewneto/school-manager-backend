/* 
import MainContext from "@/contexts/main";

import { ClienteModel } from "@database/models/ClienteModel";

export const getClienteScopedInsert = (): Partial<ClienteModel> => {
    const user = MainContext.getUser();

    if (!user) return {};

    const data: Partial<ClienteModel> = {};

    if ("company_uuid" in user) {
        data["company_uuid"] = user.company_uuid as string;
    }

    return data;
};
*/
