// SCOPED FILTERS
import { getOrganizationScopedFilters } from "@database/scoped/filters";

// CONNECTIONS
import { PoolClient } from "@database/connections/postgres";

// BASE REPOSITORY
import { BaseRepository } from "../base/KnexBaseRepository";
import { iRepository, iRepositoryFindMany, iRepositoryFindOne } from "../base/types";

// TYPES
import { OrganizationModel, OrganizationModelInsert, OrganizationModelUpdate } from "@database/models/OrganizationModel";

// EVENTS
import AppEventEmitter from "@events/emitter";
import { OrganizationCreatedEvent, OrganizationUpdatedEvent, OrganizationDeletedEvent } from "@events/emitters/organization";

export class OrganizationRepository
    extends BaseRepository<OrganizationModel, OrganizationModelInsert, OrganizationModelUpdate>
    implements iRepository<OrganizationModel>
{
    constructor() {
        super({
            table: "organization",
            primaryKey: "uuid",

            fillableColumns: ["uuid", "name", "updated_at", "deleted_at"],
            selectableColumns: [],

            entityClass: OrganizationModel,
        });
    }

    protected getScopedFilters() {
        return getOrganizationScopedFilters();
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

    async create({ data, db }: { data: OrganizationModelInsert; db?: PoolClient }) {
        const { client, beginTransaction, commitTransaction, rollbackTransaction, releaseConnection } = await this.getWriteConnection(db);

        try {
            await beginTransaction();

            const result = await this.insertRecord({ data, db: client });

            AppEventEmitter.emitEvent(new OrganizationCreatedEvent(result));

            await commitTransaction();

            return result;
        } catch (error) {
            await rollbackTransaction();

            throw error;
        } finally {
            await releaseConnection();
        }
    }

    async update({ uuid, data, db }: { uuid: string; data: OrganizationModelUpdate; db?: PoolClient }) {
        const { client, beginTransaction, commitTransaction, rollbackTransaction, releaseConnection } = await this.getWriteConnection(db);

        try {
            await beginTransaction();

            const result = await this.updateRecordByPk({ identifier: uuid, data, db: client });

            await commitTransaction();

            AppEventEmitter.emitEvent(new OrganizationUpdatedEvent(result));

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

            AppEventEmitter.emitEvent(new OrganizationDeletedEvent(result));

            return result;
        } catch (error) {
            await rollbackTransaction();

            throw error;
        } finally {
            await releaseConnection();
        }
    }
}
