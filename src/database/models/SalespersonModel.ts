import { RequiredField, GenerateInsertType, GenerateUpdateType, Timestamp } from "./base/types";

export class SalespersonModel {
    public uuid!: string;

    public organization_uuid!: RequiredField<string>;
    public user_uuid!: string | null;

    public name!: RequiredField<string>;

    public created_at!: Timestamp;
    public updated_at!: Timestamp;
    public deleted_at!: Timestamp | null;

    constructor(data: Partial<SalespersonModel>) {
        Object.assign(this, data);
    }
}

export type SalespersonModelInsert = GenerateInsertType<SalespersonModel, "created_at" | "updated_at" | "deleted_at">;
export type SalespersonModelUpdate = GenerateUpdateType<SalespersonModel, "created_at" | "updated_at" | "deleted_at">;
