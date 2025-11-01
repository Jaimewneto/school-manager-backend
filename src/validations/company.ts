import { z } from "zod";

import { CompanyModelInsert } from "@database/models/CompanyModel";

import { CheckSchema } from "@/types/validation";

import ValidationUtils, { ZodUFEnum } from "@utils/validation";

export const CompanyParamsSchema = z.object({
    uuid: z.string().uuid(),
});

export const CompanyCreateSchema = z.object({
    uuid: z.string().uuid().optional(),
    organization_uuid: z.string().uuid(),

    legal_name: z.string().min(3).max(110),
    trade_name: z.string().min(3).max(110).nullable().optional(),

    tax_id: z.string().min(11).max(18).superRefine(ValidationUtils.CreateDocumentZodValidator()),
    city_tax_id: z.string().max(14).nullable().optional(),

    street: z.string().min(3).max(60),
    number: z.string().max(6),
    address_line_2: z.string().max(60).nullable().optional(),
    district: z.string().min(3).max(35),
    city: z.string().min(3).max(45),
    state: ZodUFEnum,
    zipcode: z.string().max(9),

    // telefone: z.string().superRefine(ValidationUtils.CreatePhoneNumberZodValidator()),
    // celular: z.string().superRefine(ValidationUtils.CreatePhoneNumberZodValidator()).nullable().optional(),
    // fax: z.string().superRefine(ValidationUtils.CreatePhoneNumberZodValidator()).nullable().optional(),
    // email: z.string().email().nullable().optional(),
    // website: z.string().max(120).nullable().optional(),

    digital_certificate_pfx: z.string().nullable().optional(),
    digital_certificate_password: z.string().nullable().optional(),
    digital_certificate_data: z.string().nullable().optional(),
    digital_certificate_expiration: z.coerce.date().nullable().optional(),

    invoice_env: z.enum(["D", "P"]),
    invoice_csc_id: z.string().nullable().optional(),
    invoice_csc: z.string().nullable().optional(),
} satisfies CheckSchema<CompanyModelInsert>);

export const CompanyUpdateSchema = CompanyCreateSchema.partial();

export type CompanyParamsSchemaType = z.infer<typeof CompanyParamsSchema>;
export type CompanyInsertBodySchemaType = z.infer<typeof CompanyCreateSchema>;
export type CompanyUpdateBodySchemaType = z.infer<typeof CompanyUpdateSchema>;
