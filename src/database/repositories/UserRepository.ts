// SCOPED FILTERS
import { getUserScopedFilters } from "@database/scoped/filters";

// CONNECTIONS
import { PoolClient } from "@database/connections/postgres";

// BASE REPOSITORY
import { BaseRepository } from "./base/BaseRepository";
import { iRepository, iRepositoryFindMany, iRepositoryFindOne } from "./base/types";

// TYPES
import { UserModel, UserModelInsert, UserModelUpdate } from "@database/models/UserModel";

// EVENTS
import AppEventEmitter from "@events/emitter";
import { UserCreatedEvent, UserUpdatedEvent, UserDeletedEvent } from "@events/emitters/user";

export class UserRepository extends BaseRepository<UserModel, UserModelInsert, UserModelUpdate> implements iRepository<UserModel> {
    constructor() {
        super({
            table: "user",
            primaryKey: "uuid",

            fillableColumns: ["uuid", "name", "email", "password_hash", "updated_at", "deleted_at"],
            selectableColumns: [],

            entityClass: UserModel,
        });
    }

    protected getScopedFilters() {
        return getUserScopedFilters();
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

    async create({ data, db }: { data: UserModelInsert; db?: PoolClient }) {
        const { client, beginTransaction, commitTransaction, rollbackTransaction, releaseConnection } = await this.getWriteConnection(db);

        try {
            await beginTransaction();

            const result = await this.insertRecord({ data, db: client });

            AppEventEmitter.emitEvent(new UserCreatedEvent(result));

            await commitTransaction();

            return result;
        } catch (error) {
            await rollbackTransaction();

            throw error;
        } finally {
            await releaseConnection();
        }
    }

    async update({ uuid, data, db }: { uuid: string; data: UserModelUpdate; db?: PoolClient }) {
        const { client, beginTransaction, commitTransaction, rollbackTransaction, releaseConnection } = await this.getWriteConnection(db);

        try {
            await beginTransaction();

            const result = await this.updateRecordByPk({ identifier: uuid, data, db: client });

            await commitTransaction();

            AppEventEmitter.emitEvent(new UserUpdatedEvent(result));

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

            AppEventEmitter.emitEvent(new UserDeletedEvent(result));

            return result;
        } catch (error) {
            await rollbackTransaction();

            throw error;
        } finally {
            await releaseConnection();
        }
    }
}
