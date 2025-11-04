import "@/dotenv";

import { SignJWT } from "jose";

import { TokenRole } from "@security/roles";

import { CompanyTokenPayload } from "@auth/types";

import { getJWTEnvironment } from "@utils/environment";

import { CompanyRepository } from "@database/repositories/knex/CompanyRepository";

const run = async () => {
    const empresaRepository = new CompanyRepository();

    const [pdvList] = await empresaRepository.findMany({ take: 1 });

    if (!pdvList.length) {
        throw new Error("Nenhuma empresa encontrada para gerar o token");
    }

    const { uuid: company_uuid } = pdvList[0];

    const { JWT_SECRET, JWT_ALGORITHM } = getJWTEnvironment();

    const payload: CompanyTokenPayload = {
        sub: "system",
        role: TokenRole.COMPANY_ADMIN,
        company_uuid: company_uuid,
    };

    const token = await new SignJWT({
        role: payload.role,
        company_uuid: payload.company_uuid,
    })
        .setProtectedHeader({ alg: JWT_ALGORITHM })
        .setSubject(payload.sub)
        .setIssuer("system")
        .sign(new TextEncoder().encode(JWT_SECRET));

    console.info(token);
};

run();
