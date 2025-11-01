import { z } from "zod";

import { UserModelInsert } from "@database/models/UserModel";

import { CheckSchema } from "@/types/validation";

export const UserParamsSchema = z.object({
    uuid: z.string().uuid(),
});

export const UserCreateSchema = z.object({
    uuid: z.string().uuid().optional(),

    organization_uuid: z.string().uuid(),

    name: z.string().min(3).max(121),

    email: z.string().email(),
    password_hash: z.string().min(6).max(255),
} satisfies CheckSchema<UserModelInsert>);

export const UserUpdateSchema = UserCreateSchema.partial();

export type UserParamsSchemaType = z.infer<typeof UserParamsSchema>;
export type UserInsertBodySchemaType = z.infer<typeof UserCreateSchema>;
export type UserUpdateBodySchemaType = z.infer<typeof UserUpdateSchema>;
