import { z } from "zod";

export const CompanyAuthSchema = z.object({
    client_id: z.string().min(1, "client_id é obrigatório"),
    client_secret: z.string().min(1, "client_secret é obrigatório"),
});

export const CompanyRefreshSchema = z.object({
    refresh_token: z.string().min(1, "refresh_token é obrigatório"),
});

export type CompanyAuthInput = z.infer<typeof CompanyAuthSchema>;
export type CompanyRefreshInput = z.infer<typeof CompanyRefreshSchema>;
