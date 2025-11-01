// SCOPED FILTERS
import { getSalespersonScopedFilters } from "@database/scoped/filters";

// CONNECTIONS
import { PoolClient } from "@database/connections/postgres";

// BASE REPOSITORY
import { BaseRepository } from "./base/BaseRepository";
import { iRepository, iRepositoryFindMany, iRepositoryFindOne } from "./base/types";

// TYPES
import { SalespersonModel, SalespersonModelInsert, SalespersonModelUpdate } from "@database/models/SalespersonModel";

// EVENTS
import AppEventEmitter from "@events/emitter";
import { SalespersonCreatedEvent, SalespersonUpdatedEvent, SalespersonDeletedEvent } from "@events/emitters/salesperson";

export class SalespersonRepository
    extends BaseRepository<SalespersonModel, SalespersonModelInsert, SalespersonModelUpdate>
    implements iRepository<SalespersonModel>
{
    constructor() {
        super({
            table: "salesperson",
            primaryKey: "uuid",

            fillableColumns: [
                //
                "uuid",
                "organization_uuid",
                "user_uuid",
                "name",
                "updated_at",
                "deleted_at",
            ],
            selectableColumns: [],

            entityClass: SalespersonModel,
        });
    }

    protected getScopedFilters() {
        return getSalespersonScopedFilters();
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

    async create({ data, db }: { data: SalespersonModelInsert; db?: PoolClient }) {
        const { client, beginTransaction, commitTransaction, rollbackTransaction, releaseConnection } = await this.getWriteConnection(db);

        try {
            await beginTransaction();

            const result = await this.insertRecord({ data, db: client });

            AppEventEmitter.emitEvent(new SalespersonCreatedEvent(result));

            await commitTransaction();

            return result;
        } catch (error) {
            await rollbackTransaction();

            throw error;
        } finally {
            await releaseConnection();
        }
    }

    async update({ uuid, data, db }: { uuid: string; data: SalespersonModelUpdate; db?: PoolClient }) {
        const { client, beginTransaction, commitTransaction, rollbackTransaction, releaseConnection } = await this.getWriteConnection(db);

        try {
            await beginTransaction();

            const result = await this.updateRecordByPk({ identifier: uuid, data, db: client });

            await commitTransaction();

            AppEventEmitter.emitEvent(new SalespersonUpdatedEvent(result));

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

            AppEventEmitter.emitEvent(new SalespersonDeletedEvent(result));

            return result;
        } catch (error) {
            await rollbackTransaction();

            throw error;
        } finally {
            await releaseConnection();
        }
    }
}
