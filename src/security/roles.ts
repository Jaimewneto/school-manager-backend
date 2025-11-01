export enum TokenRole {
    SYSTEM_OWNER = "system_owner", // acesso completo irrestrito
    // ORGANIZATION_ADMIN = "organization_admin", // acesso completo a uma organização, e tudo que está abaixo dela
    ORGANIZATION_ADMIN = "organization_admin", // acesso a leitura de relatórios
    COMPANY_ADMIN = "company_admin", // acesso completo a uma empresa, e tudo que está abaixo dela
    // POS_TERMINAL = "pos_terminal", // ponto de venda
    // END_USER = "end_user", // cliente final (app)
    // SERVICE_ACCOUNT = "service_account", // conta de serviço
}

export type TokenRoles = `${TokenRole}`;
