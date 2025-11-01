import { RequiredField, GenerateInsertType, GenerateUpdateType, Timestamp } from "./base/types";

export class UserModel {
    public uuid!: string;

    public organization_uuid!: RequiredField<string>;

    public name!: RequiredField<string>;

    public email!: RequiredField<string>;
    public password_hash!: RequiredField<string>;

    public created_at!: Timestamp;
    public updated_at!: Timestamp;
    public deleted_at!: Timestamp | null;

    constructor(data: Partial<UserModel>) {
        Object.assign(this, data);
    }
}

export type UserModelInsert = GenerateInsertType<UserModel, "created_at" | "updated_at" | "deleted_at">;
export type UserModelUpdate = GenerateUpdateType<UserModel, "created_at" | "updated_at" | "deleted_at">;
