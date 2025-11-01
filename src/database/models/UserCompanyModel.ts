import { RequiredField, GenerateInsertType, GenerateUpdateType, Timestamp } from "./base/types";

export class UserCompanyModel {
    public uuid!: string;

    public user_uuid!: RequiredField<string>;
    public company_uuid!: RequiredField<string>;
    public role_uuid!: RequiredField<string>;

    public created_at!: Timestamp;
    public updated_at!: Timestamp;
    public deleted_at!: Timestamp | null;

    constructor(data: Partial<UserCompanyModel>) {
        Object.assign(this, data);
    }
}

export type UserCompanyModelInsert = GenerateInsertType<UserCompanyModel, "created_at" | "updated_at" | "deleted_at">;
export type UserCompanyModelUpdate = GenerateUpdateType<UserCompanyModel, "created_at" | "updated_at" | "deleted_at">;
