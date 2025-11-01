import { IBaseErrorPayload } from "@errors/interfaces";
import { HttpCode } from "@utils/request";

import BaseError from "./BaseError";
import { CheckPermissionMode, CheckPermissionStructure } from "@/types/check-permission";

export class NoPermissionV2Error extends BaseError {
    public code: string = "NO_PERMISSION";

    public mode: CheckPermissionMode;
    public missing_permissions: CheckPermissionStructure[];
    public required_permissions: CheckPermissionStructure[];

    public http_code = HttpCode.UNAUTHORIZED;

    constructor(required: CheckPermissionStructure[], missing: CheckPermissionStructure[], mode: CheckPermissionMode, message?: string) {
        super(message ?? "Você não tem permissão para acessar este recurso");

        this.name = NoPermissionV2Error.name.trim();

        // preenche os dados
        this.mode = mode;
        this.missing_permissions = missing;
        this.required_permissions = required;

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, NoPermissionV2Error.prototype);
    }

    serializeErrors(): IBaseErrorPayload[] {
        return [
            {
                code: this.code,
                message: this.message,
                permission: {
                    mode: this.mode,
                    missing: this.missing_permissions,
                    required: this.required_permissions,
                },
            },
        ];
    }
}

export default NoPermissionV2Error;
