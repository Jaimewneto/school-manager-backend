import { z } from "zod";

import { OrganizationModelInsert } from "@database/models/OrganizationModel";

import { CheckSchema } from "@/types/validation";

export const OrganizationParamsSchema = z.object({
    uuid: z.string().uuid(),
});

export const OrganizationCreateSchema = z.object({
    uuid: z.string().uuid().optional(),
    name: z.string().min(3).max(255),
} satisfies CheckSchema<OrganizationModelInsert>);

export const OrganizationUpdateSchema = OrganizationCreateSchema;

export type OrganizationParamsSchemaType = z.infer<typeof OrganizationParamsSchema>;
export type OrganizationInsertBodySchemaType = z.infer<typeof OrganizationCreateSchema>;
export type OrganizationUpdateBodySchemaType = z.infer<typeof OrganizationUpdateSchema>;
