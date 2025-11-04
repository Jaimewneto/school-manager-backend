// DBCLIENT
import { DBPoolClient } from "@database/connections/postgres";

export class StatusService {
    checkReadiness = async (): Promise<boolean> => {
        const isDBReady = await this.checkDBConnection();

        return isDBReady;
    };

    private checkDBConnection = async (): Promise<boolean> => {
        const [, client] = await DBPoolClient();

        try {
            if (client) {
                return true;
            }
            return false;
        } catch (error) {
            return false;
        } finally {
            if (client) {
                client.release();
            }
        }
    };
}

export default StatusService;
