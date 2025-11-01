import * as winston from "winston";
import { PapertrailTransport } from "winston-papertrail-transport";

import os from "os";
import getenv from "getenv";

export const getLevels = () => {
    return {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        trace: 4,
        debug: 5,
        http: 6,
        websocket: 7,
    };
};

export const getColors = () => {
    return {
        fatal: "red",
        error: "red",
        warn: "yellow",
        info: "green",
        trace: "gray",
        debug: "gray",
        http: "magenta",
        websocket: "magenta",
    };
};

export const getFormat = (moduleName: string) => {
    return winston.format.combine(
        winston.format.label({ label: moduleName }),
        winston.format.colorize({ all: true }),
        winston.format.label({ label: moduleName }),
        winston.format.timestamp({ format: "YY-MM-DD HH:mm:ss" }),
        winston.format.printf((info) => {
            return `${info.timestamp} - ${info.label} - ${info.level} - ${info.message}`;
        }),
    );
};

export const getCurrentLevel = (): string => {
    const env = process.env.NODE_ENV || "development";
    const isDevelopment = env === "development";

    return isDevelopment ? "debug" : "warn";
};

export const getTransports = () => {
    const levels = getLevels();

    const transports: (winston.transports.ConsoleTransportInstance | PapertrailTransport)[] = [
        //
        new winston.transports.Console({
            level: "debug",
        }),
    ];

    const papertrailUrl = getenv("PAPERTRAIL_URL", "");
    const papertrailPort = getenv.int("PAPERTRAIL_PORT", 0);
    const papertrailLevel = getenv("PAPERTRAIL_LEVEL", "warn");

    if (papertrailUrl && papertrailPort) {
        transports.push(
            new PapertrailTransport({
                levels,
                host: papertrailUrl,
                port: papertrailPort,
                hostname: os.hostname(),
                level: papertrailLevel,
            }),
        );
    }

    return transports;
};
