import { z } from "zod";

import { RoleModelInsert } from "@database/models/RoleModel";

import { CheckSchema } from "@/types/validation";

export const RoleParamsSchema = z.object({
    uuid: z.string().uuid(),
});

export const RoleCreateSchema = z.object({
    uuid: z.string().uuid().optional(),
    organization_uuid: z.string().uuid(),

    description: z.string().min(3).max(255),
    sales_read: z.boolean(),
    sales_write: z.boolean(),
    sales_delete: z.boolean(),

    finances_read: z.boolean(),
    finances_write: z.boolean(),
    finances_delete: z.boolean(),
} satisfies CheckSchema<RoleModelInsert>);

export const RoleUpdateSchema = RoleCreateSchema;

export type RoleParamsSchemaType = z.infer<typeof RoleParamsSchema>;
export type RoleInsertBodySchemaType = z.infer<typeof RoleCreateSchema>;
export type RoleUpdateBodySchemaType = z.infer<typeof RoleUpdateSchema>;
