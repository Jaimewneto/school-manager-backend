import * as winston from "winston";

import { getColors, getCurrentLevel, getLevels, getTransports } from "./base";

winston.addColors(getColors());

export const FastifyLogger = (): winston.Logger => {
    const format = winston.format.json();

    const transports = getTransports();

    return winston.createLogger({
        level: getCurrentLevel(),
        levels: getLevels(),
        format,
        transports,
    });
};
