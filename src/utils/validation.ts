import { z, RefinementCtx } from "zod";

import Utils from "./main";

export const ZodUFEnum = z.enum([
    "AC",
    "AL",
    "AM",
    "AP",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MG",
    "MS",
    "MT",
    "PA",
    "PB",
    "PE",
    "PI",
    "PR",
    "RJ",
    "RN",
    "RO",
    "RR",
    "RS",
    "SC",
    "SE",
    "SP",
    "TO",
    "EX",
]);

const CheckFloatNumber = (value: string | number, precision: number = 15, scale: number = 4, allowNegative: boolean = true) => {
    const integerPartLength = precision - scale;
    const integerRegex = `[0-9]{1,${integerPartLength}}`;
    const decimalRegex = `[0-9]{0,${scale}}`;

    const negativeRegex = allowNegative ? "-?" : "";

    const regexString = `^${negativeRegex}${integerRegex}(\\.${decimalRegex})?$`;

    return new RegExp(regexString).test(value.toString());
};

const CreateDecimalZodValidator = (precision: number = 15, scale: number = 4, allowNegative: boolean = true) => {
    return (value: number, ctx: RefinementCtx) => {
        if (!ValidationUtils.CheckFloatNumber(value, precision, scale, allowNegative)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Verifique o valor do campo "${ctx.path.join(".")}" precisa ser numérico (${precision},${scale}).)`,
            });
        }
    };
};

const CreatePhoneNumberZodValidator = () => {
    return (value: string, ctx: RefinementCtx) => {
        if (!Utils.isPhoneNumber(value)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Verifique o valor do campo "${ctx.path.join(".")}" precisa ser um telefone válido.`,
            });
        }
    };
};

const ValidationUtils = {
    CheckFloatNumber,
    CreateDecimalZodValidator,
    CreatePhoneNumberZodValidator,
};

export default ValidationUtils;
