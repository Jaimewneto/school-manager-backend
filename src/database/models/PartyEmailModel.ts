import { RequiredField, GenerateInsertType, GenerateUpdateType, Timestamp } from "./base/types";

export class PartyEmailModel {
    public uuid!: string;

    public organization_uuid!: RequiredField<string>;
    public party_uuid!: RequiredField<string>;

    public email!: RequiredField<string>;

    public description!: string;

    public is_primary!: RequiredField<boolean>;

    public created_at!: Timestamp;
    public updated_at!: Timestamp;
    public deleted_at!: Timestamp | null;

    constructor(data: Partial<PartyEmailModel>) {
        Object.assign(this, data);
    }
}

export type PartyEmailModelInsert = GenerateInsertType<PartyEmailModel, "created_at" | "updated_at" | "deleted_at">;
export type PartyEmailModelUpdate = GenerateUpdateType<PartyEmailModel, "created_at" | "updated_at" | "deleted_at">;
