import { TokenRole } from "./roles";
import { Permission, rolePermissions } from "./rbac";

/**
 * Verifica se uma determinada role possui permissão para executar uma ação específica.
 * Suporta curingas como '*', 'modulo:*' e 'modulo:submodulo:*', com hierarquia baseada em ':'
 *
 * @param role - A role do token (ex: company_admin, system_owner, etc.)
 * @param permission - A permissão requerida (ex: cliente:relatorio:gerar)
 * @returns boolean - true se a role tiver permissão, false caso contrário
 */
export const checkPermissionByRole = (role: TokenRole, permission: Permission) => {
    const allowed = rolePermissions[role];

    // Se a role não tiver permissões definidas, nega acesso
    if (!allowed) return false;

    // Se tiver acesso total (curinga '*'), permite tudo
    if (allowed.includes("*")) return true;

    // Quebra a permissão solicitada em partes, por exemplo: 'cliente:relatorio:gerar' → ['cliente', 'relatorio', 'gerar']
    const requestedParts = permission.split(":");

    return allowed.some((perm) => {
        // Match exato: se a permissão permitida for igual à solicitada, permite
        if (perm === permission) return true;

        // Quebra a permissão da role em partes
        const allowedParts = perm.split(":");

        // Verifica se o último nível da permissão permitida é um curinga '*'
        // Isso permite padrões como 'cliente:*' ou 'cliente:relatorio:*'
        if (allowedParts[allowedParts.length - 1] === "*") {
            // Compara parte a parte até o nível do curinga
            for (let i = 0; i < allowedParts.length - 1; i++) {
                if (allowedParts[i] !== requestedParts[i]) return false;
            }

            // Se todos os níveis anteriores ao '*' forem iguais, então é permitido
            return true;
        }

        // Se nenhuma condição for satisfeita, não permite
        return false;
    });
};
