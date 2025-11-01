import { RequiredField, GenerateInsertType, GenerateUpdateType, Timestamp } from "./base/types";

export class SalespersonCompanyModel {
    public uuid!: string;

    public salesperson_uuid!: RequiredField<string>;
    public company_uuid!: RequiredField<string>;

    public created_at!: Timestamp;
    public updated_at!: Timestamp;
    public deleted_at!: Timestamp | null;

    constructor(data: Partial<SalespersonCompanyModel>) {
        Object.assign(this, data);
    }
}

export type SalespersonCompanyModelInsert = GenerateInsertType<SalespersonCompanyModel, "created_at" | "updated_at" | "deleted_at">;
export type SalespersonCompanyModelUpdate = GenerateUpdateType<SalespersonCompanyModel, "created_at" | "updated_at" | "deleted_at">;
