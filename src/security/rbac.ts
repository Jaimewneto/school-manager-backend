import { TokenRole } from "./roles";

const DEF_READ = "read";
const DEF_CREATE = "create";
const DEF_UPDATE = "update";
const DEF_DELETE = "delete";
//const DEF_ISSUE = "issue";

export const Permissions = {
    // Organization
    ORGANIZATION_ALL: `organization:*`,
    ORGANIZATION_READ: `organization:${DEF_READ}`,
    ORGANIZATION_CREATE: `organization:${DEF_CREATE}`,
    ORGANIZATION_UPDATE: `organization:${DEF_UPDATE}`,
    ORGANIZATION_DELETE: `organization:${DEF_DELETE}`,

    // Company
    COMPANY_ALL: `company:*`,
    COMPANY_READ: `company:${DEF_READ}`,
    COMPANY_CREATE: `company:${DEF_CREATE}`,
    COMPANY_UPDATE: `company:${DEF_UPDATE}`,
    COMPANY_DELETE: `company:${DEF_DELETE}`,

    // User
    USER_ALL: `user:*`,
    USER_READ: `user:${DEF_READ}`,
    USER_CREATE: `user:${DEF_CREATE}`,
    USER_UPDATE: `user:${DEF_UPDATE}`,
    USER_DELETE: `user:${DEF_DELETE}`,

    // Role
    ROLE_ALL: `role:*`,
    ROLE_READ: `role:${DEF_READ}`,
    ROLE_CREATE: `role:${DEF_CREATE}`,
    ROLE_UPDATE: `role:${DEF_UPDATE}`,
    ROLE_DELETE: `role:${DEF_DELETE}`,

    // Salesperson
    SALESPERSON_ALL: `salesperson:*`,
    SALESPERSON_READ: `salesperson:${DEF_READ}`,
    SALESPERSON_CREATE: `salesperson:${DEF_CREATE}`,
    SALESPERSON_UPDATE: `salesperson:${DEF_UPDATE}`,
    SALESPERSON_DELETE: `salesperson:${DEF_DELETE}`,

    // Configurações
    // CONFIG_ALL: `config:*`,
    // CONFIG_READ: `config:${DEF_READ}`,
    // CONFIG_CREATE: `config:${DEF_CREATE}`,
    // CONFIG_UPDATE: `config:${DEF_UPDATE}`,
    // CONFIG_DELETE: `config:${DEF_DELETE}`,

    // Lojas
    // STORE_ALL: `loja:*`,
    // STORE_READ: `loja:${DEF_READ}`,
    // STORE_CREATE: `loja:${DEF_CREATE}`,
    // STORE_UPDATE: `loja:${DEF_UPDATE}`,
    // STORE_DELETE: `loja:${DEF_DELETE}`,

    // Clientes
    // CUSTOMER_ALL: `cliente:*`,
    // CUSTOMER_READ: `cliente:${DEF_READ}`,
    // CUSTOMER_CREATE: `cliente:${DEF_CREATE}`,
    // CUSTOMER_UPDATE: `cliente:${DEF_UPDATE}`,
    // CUSTOMER_DELETE: `cliente:${DEF_DELETE}`,

    // Produtos + Quantidade
    // PRODUCT_ALL: `produto:*`,
    // PRODUCT_READ: `produto:${DEF_READ}`,
    // PRODUCT_CREATE: `produto:${DEF_CREATE}`,
    // PRODUCT_UPDATE: `produto:${DEF_UPDATE}`,
    // PRODUCT_DELETE: `produto:${DEF_DELETE}`,

    // Estoque
    // PRODUCT_INVENTORY_ALL: `estoque:*`,
    // PRODUCT_INVENTORY_READ: `estoque:${DEF_READ}`,
    // PRODUCT_INVENTORY_CREATE: `estoque:${DEF_CREATE}`,
    // PRODUCT_INVENTORY_UPDATE: `estoque:${DEF_UPDATE}`,
    // PRODUCT_INVENTORY_DELETE: `estoque:${DEF_DELETE}`,

    // Pontos de Venda
    // POINT_OF_SALE_ALL: `pdv:*`,
    // POINT_OF_SALE_READ: `pdv:${DEF_READ}`,
    // POINT_OF_SALE_CREATE: `pdv:${DEF_CREATE}`,
    // POINT_OF_SALE_UPDATE: `pdv:${DEF_UPDATE}`,
    // POINT_OF_SALE_DELETE: `pdv:${DEF_DELETE}`,

    // Vendas
    // ORDER_ALL: `venda:*`,
    // ORDER_READ: `venda:${DEF_READ}`,
    // ORDER_CREATE: `venda:${DEF_CREATE}`,
    // ORDER_UPDATE: `venda:${DEF_UPDATE}`,
    // ORDER_DELETE: `venda:${DEF_DELETE}`,

    // Carteira
    // WALLET_ALL: `carteira:*`,
    // WALLET_READ: `carteira:${DEF_READ}`,
    // WALLET_CREATE: `carteira:${DEF_CREATE}`,
    // WALLET_UPDATE: `carteira:${DEF_UPDATE}`,
    // WALLET_DELETE: `carteira:${DEF_DELETE}`,
    // WALLET_ADD_FUNDS: `carteira:adicionar-credito`,
    // WALLET_PAY_ORDER: `carteira:pagar-venda`,

    // Carteira
    // WALLET_CARD_ALL: `carteira-cartao:*`,
    // WALLET_CARD_READ: `carteira-cartao:${DEF_READ}`,
    // WALLET_CARD_CREATE: `carteira-cartao:${DEF_CREATE}`,
    // WALLET_CARD_UPDATE: `carteira-cartao:${DEF_UPDATE}`,
    // WALLET_CARD_DELETE: `carteira-cartao:${DEF_DELETE}`,

    // // Transações TEF
    // TRANSACTION_READ: `transacao_tef:${DEF_READ}`,
    // TRANSACTION_CREATE: `transacao_tef:${DEF_CREATE}`,
    // TRANSACTION_UPDATE: `transacao_tef:${DEF_UPDATE}`,
    // TRANSACTION_DELETE: `transacao_tef:${DEF_DELETE}`,

    // Relatórios
    // REPORT_ALL: "relatorio:*",
    // REPORT_VIEW: "relatorio:view",

    // Nota
    // INVOICE_ALL: `nota:*`,
    // INVOICE_READ: `nota:${DEF_READ}`,
    // INVOICE_ISSUE: `nota:${DEF_ISSUE}`,
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions] | "*";

export const rolePermissions: Record<TokenRole, Permission[]> = {
    [TokenRole.SYSTEM_OWNER]: ["*"],

    // O visualizador de relatórios da organização pode somente gerar os relatórios, e ler todos os dados abaixo
    [TokenRole.ORGANIZATION_ADMIN]: [
        Permissions.ORGANIZATION_READ,
        Permissions.ORGANIZATION_UPDATE,

        // tem todas as permissões de cada entidade
        Permissions.COMPANY_ALL,
        Permissions.USER_ALL,
        Permissions.ROLE_ALL,
        Permissions.SALESPERSON_ALL,
        // Permissions.ISSUER_READ,
        // Permissions.CONFIG_READ,
        // Permissions.STORE_READ,
        // Permissions.CUSTOMER_READ,
        // Permissions.PRODUCT_READ,
        // Permissions.PRODUCT_INVENTORY_READ,
        // Permissions.POINT_OF_SALE_READ,
        // Permissions.ORDER_READ,

        // Permissions.REPORT_VIEW,
    ],

    // O administrador da empresa tem acesso completo, exceto de leitura ao nível superior (organização)
    [TokenRole.COMPANY_ADMIN]: [
        // tem todas as permissões de cada entidade
        Permissions.COMPANY_ALL,
        Permissions.USER_ALL,
        Permissions.ROLE_ALL,
        Permissions.SALESPERSON_ALL,
        // Permissions.ISSUER_ALL,
        // Permissions.CONFIG_ALL,
        // Permissions.STORE_ALL,
        // Permissions.CUSTOMER_ALL,
        // Permissions.PRODUCT_ALL,
        // Permissions.PRODUCT_INVENTORY_ALL,
        // Permissions.POINT_OF_SALE_ALL,
        // Permissions.ORDER_ALL,
        // Permissions.WALLET_ALL,
        // Permissions.WALLET_CARD_ALL,
        // Permissions.INVOICE_ALL,

        // Permissions.REPORT_ALL,
    ],

    // O ponto de venda, pode ler todas as informações
    // [TokenRole.POS_TERMINAL]: [
    //     Permissions.ORGANIZATION_READ,
    //     Permissions.COMPANY_READ,
    //     Permissions.ISSUER_READ,
    //     Permissions.CONFIG_READ,
    //     Permissions.STORE_READ,
    //     Permissions.CUSTOMER_READ,
    //     Permissions.CUSTOMER_CREATE,
    //     Permissions.PRODUCT_READ,
    //     Permissions.PRODUCT_INVENTORY_READ,
    //     Permissions.POINT_OF_SALE_READ,

    //     Permissions.WALLET_READ,
    //     Permissions.WALLET_CARD_READ,
    //     Permissions.WALLET_PAY_ORDER,

    //     // permissões de nfce
    //     Permissions.INVOICE_ALL,

    //     // permissões de criação
    //     Permissions.ORDER_ALL,
    // ],

    // O cliente final pode apenas ler seus dados
    // [TokenRole.END_USER]: [
    //     Permissions.COMPANY_READ,

    //     // pode movimentar todos os cartões
    //     Permissions.WALLET_CARD_ALL,

    //     // leitura
    //     Permissions.ORDER_READ,
    // ],
};
