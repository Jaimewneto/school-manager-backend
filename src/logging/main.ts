import * as winston from "winston";

import { getColors, getCurrentLevel, getFormat, getLevels, getTransports } from "./base";

winston.addColors(getColors());

export const Logger = (moduleName: string): winston.Logger => {
    const format = getFormat(moduleName);

    const transports = getTransports();

    return winston.createLogger({
        level: getCurrentLevel(),
        levels: getLevels(),
        format,
        transports,
    });
};
