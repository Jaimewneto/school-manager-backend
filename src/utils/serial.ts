import crypto from "crypto";

export const SerialUtils = {
    generate: () => {
        // Gera os primeiros dígitos do serial
        const primeiraParte = crypto.randomBytes(3).toString("hex").toUpperCase();

        // Gera os últimos dígitos do serial
        const segundaParte = crypto.randomBytes(3).toString("hex").toUpperCase();

        return `${primeiraParte}-${segundaParte}`;
    },
};

export default SerialUtils;
