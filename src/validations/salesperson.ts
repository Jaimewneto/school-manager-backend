import { z } from "zod";

import { SalespersonModelInsert } from "@database/models/SalespersonModel";

import { CheckSchema } from "@/types/validation";

export const SalespersonParamsSchema = z.object({
    uuid: z.string().uuid(),
});

export const SalespersonCreateSchema = z.object({
    uuid: z.string().uuid().optional(),

    organization_uuid: z.string().uuid(),
    user_uuid: z.string().uuid().optional().nullable(),

    name: z.string().min(3).max(121),
} satisfies CheckSchema<SalespersonModelInsert>);

export const SalespersonUpdateSchema = SalespersonCreateSchema.partial();

export type SalespersonParamsSchemaType = z.infer<typeof SalespersonParamsSchema>;
export type SalespersonInsertBodySchemaType = z.infer<typeof SalespersonCreateSchema>;
export type SalespersonUpdateBodySchemaType = z.infer<typeof SalespersonUpdateSchema>;
