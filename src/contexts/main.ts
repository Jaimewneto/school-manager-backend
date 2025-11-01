import { JwtPayload } from "@auth/types";
import { AsyncLocalStorage } from "async_hooks";

export type StorageData = {
    user: JwtPayload;
    websocket_id?: string;
};

/**
 * Inicializa o storage no contexto global
 */
const storage = new AsyncLocalStorage<StorageData>();

/**
 * Inicializa o async storage
 * Tudo que acontecer após a função passada no callback terá acesso a informação do async storage
 */
const run = (payload: StorageData, callback: () => unknown) => {
    return storage.run(payload, callback);
};

const getUser = () => {
    return storage.getStore()?.user;
};

const getWebsocketId = (): string | undefined => {
    return storage.getStore()?.websocket_id;
};

export const MainContext = {
    storage,
    run,

    getUser,
    getWebsocketId,
};

export default MainContext;
