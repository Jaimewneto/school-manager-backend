import { RequiredField, GenerateInsertType, GenerateUpdateType, Timestamp } from "./base/types";

export class PartyPhoneModel {
    public uuid!: string;

    public organization_uuid!: RequiredField<string>;
    public party_uuid!: RequiredField<string>;

    public phone!: RequiredField<string>;

    public description!: string;

    public is_primary!: RequiredField<boolean>;

    public created_at!: Timestamp;
    public updated_at!: Timestamp;
    public deleted_at!: Timestamp | null;

    constructor(data: Partial<PartyPhoneModel>) {
        Object.assign(this, data);
    }
}

export type PartyPhoneModelInsert = GenerateInsertType<PartyPhoneModel, "created_at" | "updated_at" | "deleted_at">;
export type PartyPhoneModelUpdate = GenerateUpdateType<PartyPhoneModel, "created_at" | "updated_at" | "deleted_at">;
