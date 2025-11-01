export interface RetaguardaIssuer {
    uuid: string;

    razao_social: string;
    fantasia?: string | null;
    cnpj: string;
    ie?: string | null;
    nfse_im?: string | null;
    responsavel?: string | null;

    email?: string | null;
    website?: string | null;
    telefone?: string | null;
    celular?: string | null;
    fax?: string | null;

    cep: string | null;
    uf: string | null;
    cidade: string | null;
    endereco: string | null;
    numero: string | null;
    bairro: string | null;
    complemento?: string | null;

    optante_simples: boolean;
    aliquota_icms_simples?: number;

    nfce_habilitada: string | null;
    nfce_ambiente: string | null;
    nfce_csc_id: string | null;
    nfce_csc: string | null;
    nfce_serie?: string | null;
    nfce_num_prox_nf?: number | null;
    nfce_contingencia?: boolean;
    nfce_contingencia_data?: Date | string | null;
    nfce_contingencia_motivo?: string | null;

    dfe_habilitado?: boolean;

    mdfe_habilitado?: string;
    mdfe_ambiente?: string;
    mdfe_api_emissao?: string;
    mdfe_serie?: number | null;
    mdfe_proximo_numero?: number;
    rntrc?: string | null;
    mdfe_contingencia?: boolean;
    mdfe_contingencia_data?: Date | string | null;
    mdfe_contingencia_motivo?: string | null;
    mdfe_wbm_bearer_access_token?: string | null;

    nfe_habilitada?: string | null;
    nfe_ambiente?: string | null;
    versao_api_nf?: string;
    nfe_orientacao_danfe?: string | null;
    nfe_exclusao_icms_pis_cofins?: boolean;
    nfe_aliq_retencao_irrf?: number;
    nfe_serie?: string | null;
    nfe_num_prox_nfe?: number | null;
    nfe_num_prox_nfe_preview?: number | null;
    nfe_cert_pfx: string | null;
    nfe_cert_senha: string | null;
    nfe_cert_dados?: string | null;
    nfe_cert_validade?: string | Date | null;
    nfe_token?: string | null;
    nfe_contingencia_data?: Date | string | null;
    nfe_contingencia_motivo?: string | null;
    nfe_wbm_consumer_key?: string | null;
    nfe_wbm_consumer_secret?: string | null;
    nfe_wbm_access_token?: string | null;
    nfe_wbm_access_secret?: string | null;

    utiliza_nfse_v2?: boolean;
    nfse_razao_social?: string | null;
    nfse_fantasia?: string | null;
    nfse_token?: string | null;
    nfse_token_homologacao?: string | null;
    nfse_provedor?: string | null;
    nfse_client_id?: string | null;
    nfse_client_secret?: string | null;
    nfse_campos_provedor?: string | null;
    nfse_padrao_nacional?: boolean;
    nfse_aedf?: string | null;
    nfse_habilitada?: string;
    nfse_emissor?: string | null;
    nfse_ambiente?: string;
    nfse_serie?: string | null;
    nfse_login?: string | null;
    nfse_senha?: string | null;
    nfse_dados_emissor?: string | null;

    neogrid_login?: string | null;
    neogrid_senha?: string | null;

    atualizado_em?: Date;
    ultima_modificacao?: Date;

    industria?: boolean;
    cooperativa?: boolean;
    locacao_habilitada?: boolean;
    utiliza_self_checkout?: boolean;

    inbox_delivery?: boolean;
    linvix_shopping?: boolean;

    url_erp?: string | null;
    versao?: string | null;
    limite_usuarios?: number | null;
    bloqueado?: boolean;

    logo_base64?: string | null;
    url_foto_orig?: string | null;
    url_foto_red?: string | null;
    url_foto_small?: string | null;

    whatsapp_habilitado?: boolean;
    whatsapp_limite_conexoes?: number;
}
