import { Buffer } from "buffer";

const onlyNumbers = (val: string) => {
    return val.replace(/\D/g, "");
};

/**
 * sleep function
 * @param {integer} time
 * @returns
 */
const sleep = async (time: number) => new Promise((r) => setTimeout(r, time));

const isUUID = (value: string): boolean => {
    // Regular expression to check if string is a valid UUID
    const regexExpr = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

    return regexExpr.test(value);
};

const isULID = (value: string): boolean => {
    // Regular expression to check if string is a valid ULID
    const regexExpr = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/i;

    return regexExpr.test(value);
};

const isBase64 = (str = "") => {
    try {
        // remove espaços
        str = str.trim();
        // verifica em branco
        if (!str) return false;
        // decodifica
        const str_decodificado = Buffer.from(str, "base64").toString();
        // codifica
        const str_codificado = Buffer.from(str_decodificado).toString("base64");
        // retorna a validação
        return str_codificado == str;
    } catch (error) {
        return false;
    }
};

const isJSONString = (value: string) => {
    try {
        JSON.parse(value);
    } catch (e) {
        return false;
    }
    return true;
};

const isPhoneNumber = (value: string) => {
    return new RegExp(/^(?:(?:\(?[1-9][0-9]\)?)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/).test(value);
};

const isURIComponentString = (str = "") => {
    try {
        // remove espaços
        str = str.trim();
        // verifica em branco
        if (!str) return false;
        // decodifica
        const str_decodificado = decodeURIComponent(str);
        // codifica
        const str_codificado = encodeURIComponent(str_decodificado);
        // retorna a validação
        return str_codificado == str;
    } catch (error) {
        return false;
    }
};

const isObject = (value: any) => {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isCommaSeparatedList = (csl: string): boolean => {
    const regexExpr = /([^,]+)/gi;

    return regexExpr.test(csl);
};

const isStringAnInteger = (input: string): boolean => {
    return /^-?\d+$/.test(input);
};

const capitalize = (s: string) => (s && s[0].toUpperCase() + s.slice(1)) || "";

const formatTotal = (val: number | string) => {
    const numberVal = Number(val);
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(numberVal);
};

const Utils = {
    onlyNumbers,
    capitalize,
    sleep,

    isUUID,
    isULID,
    isBase64,
    isObject,
    isJSONString,
    isPhoneNumber,
    isCommaSeparatedList,
    isURIComponentString,
    isStringAnInteger,

    formatTotal,
};

export default Utils;
