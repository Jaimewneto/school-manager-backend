import { RequiredField, GenerateInsertType, GenerateUpdateType, Timestamp } from "./base/types";

import { UFs } from "@/types/uf";

export class CompanyModel {
    public uuid!: string;

    public organization_uuid!: RequiredField<string>;

    public legal_name!: RequiredField<string>;
    public trade_name!: string | null;

    public tax_id!: RequiredField<string>;
    public city_tax_id!: string | null;

    public street!: RequiredField<string>;
    public number!: RequiredField<string>;
    public address_line_2!: string | null;
    public district!: RequiredField<string>;
    public city!: RequiredField<string>;
    public state!: UFs;
    public zipcode!: RequiredField<string>;
    public ibge_code!: string;

    // public telefone!: RequiredField<string>;
    // public celular!: string | null;
    // public fax!: string | null;
    // public email!: string | null;

    // public website!: string | null;

    public digital_certificate_pfx!: string | null;
    public digital_certificate_password!: string | null;
    public digital_certificate_data!: string | null;
    public digital_certificate_expiration!: Timestamp | null;

    public invoice_env!: RequiredField<"P" | "D">;
    public invoice_csc_id!: string | null;
    public invoice_csc!: string | null;
    public invoice_api_token!: string;

    public client_id!: string;
    public client_secret!: string;

    public created_at!: Timestamp;
    public updated_at!: Timestamp;
    public deleted_at!: Timestamp | null;

    constructor(data: Partial<CompanyModel>) {
        Object.assign(this, data);
    }
}

export type CompanyModelInsert = GenerateInsertType<CompanyModel, "created_at" | "updated_at" | "deleted_at">;
export type CompanyModelUpdate = GenerateUpdateType<CompanyModel, "created_at" | "updated_at" | "deleted_at">;
