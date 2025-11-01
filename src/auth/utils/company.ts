import { randomBytes } from "crypto";
import { hash, compare } from "bcryptjs";

export class CompanyAuthUtils {
    static async generateClientId(companyUuid: string) {
        const timestamp = Date.now().toString(36); // base36 para encurtar
        return `${companyUuid}_${timestamp}_${randomBytes(8).toString("hex")}`;
    }

    static async generateClientSecret() {
        const secret = randomBytes(32).toString("hex"); // 64 caracteres
        const hashed = await hash(secret, 10);

        return {
            client_secret: secret,
            client_secret_hashed: hashed,
        };
    }
    static async compare(clientSecret: string, hashedSecret: string) {
        return await compare(clientSecret, hashedSecret);
    }
}
