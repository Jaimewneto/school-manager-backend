/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyRequest, FastifyReply } from "fastify";

import { AuthError, NoPermissionV2Error } from "@errors/main";
import { checkPermissionByRole } from "./utils";

import { CheckPermissionMode, CheckPermissionStructure } from "@/types/check-permission";

type CheckPermissionParams = {
    mode?: CheckPermissionMode;
    permissions: CheckPermissionStructure[];
};

export const checkHttpPermission = (params: CheckPermissionParams) => {
    const { permissions, mode = "any" } = params;

    return async (req: FastifyRequest, reply: FastifyReply) => {
        const user = req.user;

        if (!user) {
            throw new AuthError("NO_PROVIDED_TOKEN", "Token não fornecido");
        }

        const missingPermissions = permissions.filter((p) => {
            return !checkPermissionByRole(user.role, p);
        });

        const hasAtLeastOnePermission = missingPermissions.length < permissions.length;

        if (mode === "any" && !hasAtLeastOnePermission) {
            throw new NoPermissionV2Error(permissions, missingPermissions, mode);
        }

        if (mode === "all" && missingPermissions.length > 0) {
            throw new NoPermissionV2Error(permissions, missingPermissions, mode);
        }
    };
};
