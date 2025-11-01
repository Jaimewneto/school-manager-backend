import { RequiredField, GenerateInsertType, GenerateUpdateType, Timestamp } from "./base/types";

export class OrganizationModel {
    public uuid!: string;

    public name!: RequiredField<string>;

    public created_at!: Timestamp;
    public updated_at!: Timestamp;
    public deleted_at!: Timestamp | null;

    constructor(data: Partial<OrganizationModel>) {
        Object.assign(this, data);
    }
}

export type OrganizationModelInsert = GenerateInsertType<OrganizationModel, "created_at" | "updated_at" | "deleted_at">;
export type OrganizationModelUpdate = GenerateUpdateType<OrganizationModel, "created_at" | "updated_at" | "deleted_at">;
