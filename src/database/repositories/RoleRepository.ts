// SCOPED FILTERS
import { getRoleScopedFilters } from "@database/scoped/filters";

// CONNECTIONS
import { PoolClient } from "@database/connections/postgres";

// BASE REPOSITORY
import { BaseRepository } from "./base/BaseRepository";
import { iRepository, iRepositoryFindMany, iRepositoryFindOne } from "./base/types";

// TYPES
import { RoleModel, RoleModelInsert, RoleModelUpdate } from "@database/models/RoleModel";

// EVENTS
import AppEventEmitter from "@events/emitter";
import { RoleCreatedEvent, RoleUpdatedEvent, RoleDeletedEvent } from "@events/emitters/role";

export class RoleRepository extends BaseRepository<RoleModel, RoleModelInsert, RoleModelUpdate> implements iRepository<RoleModel> {
    constructor() {
        super({
            table: "role",
            primaryKey: "uuid",

            fillableColumns: [
                //
                "uuid",
                "organization_uuid",
                "description",
                "sales_read",
                "sales_write",
                "sales_delete",
                "finances_read",
                "finances_write",
                "finances_delete",
                "updated_at",
                "deleted_at",
            ],
            selectableColumns: [],

            entityClass: RoleModel,
        });
    }

    protected getScopedFilters() {
        return getRoleScopedFilters();
    }

    async findOne(params: iRepositoryFindOne) {
        const { client, releaseConnection } = await this.getReadConnection(params.db);

        try {
            return await this.fetchOne({ ...params, db: client });
        } finally {
            await releaseConnection();
        }
    }

    async findOneByPk(identifier: string | number, db?: PoolClient) {
        const { client, releaseConnection } = await this.getReadConnection(db);

        try {
            return await this.fetchOneByPk({ identifier, db: client });
        } finally {
            await releaseConnection();
        }
    }

    async findMany(params: iRepositoryFindMany) {
        const { client, releaseConnection } = await this.getReadConnection(params.db);

        try {
            return await this.fetchMany({ ...params, db: client });
        } finally {
            await releaseConnection();
        }
    }

    async create({ data, db }: { data: RoleModelInsert; db?: PoolClient }) {
        const { client, beginTransaction, commitTransaction, rollbackTransaction, releaseConnection } = await this.getWriteConnection(db);

        try {
            await beginTransaction();

            const result = await this.insertRecord({ data, db: client });

            AppEventEmitter.emitEvent(new RoleCreatedEvent(result));

            await commitTransaction();

            return result;
        } catch (error) {
            await rollbackTransaction();

            throw error;
        } finally {
            await releaseConnection();
        }
    }

    async update({ uuid, data, db }: { uuid: string; data: RoleModelUpdate; db?: PoolClient }) {
        const { client, beginTransaction, commitTransaction, rollbackTransaction, releaseConnection } = await this.getWriteConnection(db);

        try {
            await beginTransaction();

            const result = await this.updateRecordByPk({ identifier: uuid, data, db: client });

            await commitTransaction();

            AppEventEmitter.emitEvent(new RoleUpdatedEvent(result));

            return result;
        } catch (error) {
            await rollbackTransaction();

            throw error;
        } finally {
            await releaseConnection();
        }
    }

    async delete(uuid: string, db?: PoolClient) {
        const { client, beginTransaction, commitTransaction, rollbackTransaction, releaseConnection } = await this.getWriteConnection(db);

        try {
            await beginTransaction();

            const result = await this.removeRecordByPk({ identifier: uuid, db: client });

            await commitTransaction();

            AppEventEmitter.emitEvent(new RoleDeletedEvent(result));

            return result;
        } catch (error) {
            await rollbackTransaction();

            throw error;
        } finally {
            await releaseConnection();
        }
    }
}
