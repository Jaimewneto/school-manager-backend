export type WSJoinData = {
    dispositivo: string;
    emitente: string;
    database: string;
    usuario: string;
    versao: string;
    local: string;
};

export type WSSetConnectedUserData = {
    dispositivo: string;
    emitente: string;
    usuario: string;
    versao: string;
    local: string;
};

export type WSCallbackFunction<T = unknown> = (data: T) => void;

export type { Socket, Server } from "socket.io";
