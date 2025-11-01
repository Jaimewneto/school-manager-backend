import { CheckPermissionMode, CheckPermissionStructure } from "@/types/check-permission";

interface IBaseErrorPayload {
    message: string;
    location?: string;
    field?: string;
    code?: string; // Código do erro
    stack_trace?: string[];

    // permissões v2
    permission?: {
        mode: CheckPermissionMode;
        required: CheckPermissionStructure[];
        missing: CheckPermissionStructure[];
    };
}

interface IErrorPayload {
    status: number;
    name: string;
    errors: (IBaseErrorPayload | string)[];
}

export { IBaseErrorPayload, IErrorPayload };
