import "@/dotenv";

import { SignJWT } from "jose";

import { TokenRole } from "@security/roles";

import { SystemOwnerTokenPayload } from "@auth/types";

import { getJWTEnvironment } from "@utils/environment";

const run = async () => {
    const { JWT_SECRET, JWT_ALGORITHM } = getJWTEnvironment();

    const payload: SystemOwnerTokenPayload = {
        sub: "system",
        role: TokenRole.SYSTEM_OWNER,
    };

    const token = await new SignJWT({
        role: payload.role,
    })
        .setProtectedHeader({ alg: JWT_ALGORITHM })
        .setSubject(payload.sub)
        .setIssuer("system")
        .sign(new TextEncoder().encode(JWT_SECRET));

    console.info(token);
};

run();
