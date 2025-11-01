import { RequiredField, GenerateInsertType, GenerateUpdateType, Timestamp } from "./base/types";

import { PartyEmailModel } from "./PartyEmailModel";
import { PartyPhoneModel } from "./PartyPhoneModel";

export class PartyModel {
    public uuid!: string;

    public organization_uuid!: RequiredField<string>;

    public is_customer!: RequiredField<boolean>;
    public is_supplier!: RequiredField<boolean>;
    public is_carrier!: RequiredField<boolean>;

    public legal_name!: RequiredField<string>;
    public trade_name!: string;
    public tax_id!: RequiredField<string>; // CPF/CNPJ
    public state_registration!: string; // RG/IE
    public notes!: string;

    public is_active!: boolean; // Mantemos isso? (é muito retaguarda isso)

    public created_at!: Timestamp;
    public updated_at!: Timestamp;
    public deleted_at!: Timestamp | null;

    // Relations
    public emails: PartyEmailModel[] = [];
    public phones: PartyPhoneModel[] = [];

    constructor(data: Partial<PartyModel>) {
        const { emails, phones, ...rest } = data;

        Object.assign(this, rest);

        if (emails) this.emails = emails.map((email) => new PartyEmailModel(email));
        if (phones) this.phones = phones.map((phone) => new PartyPhoneModel(phone));
    }
}

export type PartyModelInsert = GenerateInsertType<PartyModel, "created_at" | "updated_at" | "deleted_at">;
export type PartyModelUpdate = GenerateUpdateType<PartyModel, "created_at" | "updated_at" | "deleted_at">;
