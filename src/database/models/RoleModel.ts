import { RequiredField, GenerateInsertType, GenerateUpdateType, Timestamp } from "./base/types";

export class RoleModel {
    public uuid!: string;

    public organization_uuid!: RequiredField<string>;

    public description!: RequiredField<string>;

    public sales_read!: RequiredField<boolean>;
    public sales_write!: RequiredField<boolean>;
    public sales_delete!: RequiredField<boolean>;

    public finances_read!: RequiredField<boolean>;
    public finances_write!: RequiredField<boolean>;
    public finances_delete!: RequiredField<boolean>;

    // Continuar de acordo com as demais permissoes

    public created_at!: Timestamp;
    public updated_at!: Timestamp;
    public deleted_at!: Timestamp | null;

    constructor(data: Partial<RoleModel>) {
        Object.assign(this, data);
    }
}

export type RoleModelInsert = GenerateInsertType<RoleModel, "created_at" | "updated_at" | "deleted_at">;
export type RoleModelUpdate = GenerateUpdateType<RoleModel, "created_at" | "updated_at" | "deleted_at">;
