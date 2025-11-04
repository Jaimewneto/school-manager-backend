// SCOPED FILTERS
import { getCompanyScopedFilters } from "@database/scoped/filters";

// CONNECTIONS
import { DBPoolClient, PoolClient } from "@database/connections/postgres";

// BASE REPOSITORY
import { BaseRepository } from "../base/KnexBaseRepository";
import { iRepository, iRepositoryFindMany, iRepositoryFindOne } from "../base/types";

// MODELS
import { CompanyModel, CompanyModelInsert, CompanyModelUpdate } from "@/database/models/CompanyModel";

// EVENTS
import AppEventEmitter from "@events/emitter";
import { CompanyCreatedEvent, CompanyUpdatedEvent, CompanyDeletedEvent } from "@events/emitters/company";

export type CompanyRepositoryConstructorParams = {
    sendEvents?: boolean;
};

export class CompanyRepository extends BaseRepository<CompanyModel, CompanyModelInsert, CompanyModelUpdate> implements iRepository<CompanyModel> {
    protected sendEvents = true;

    constructor({ sendEvents = true }: CompanyRepositoryConstructorParams = {}) {
        super({
            table: "company",
            primaryKey: "uuid",

            fillableColumns: [
                "uuid",
                "organization_uuid",
                "legal_name",
                "trade_name",
                "tax_id",
                "city_tax_id",
                "street",
                "number",
                "address_line_2",
                "district",
                "city",
                "state",
                "zipcode",
                "digital_certificate_pfx",
                "digital_certificate_password",
                "digital_certificate_data",
                "digital_certificate_expiration",
                "invoice_env",
                "invoice_csc_id",
                "invoice_csc",
                "invoice_api_token",
                "client_id",
                "client_secret",
                "updated_at",
                "deleted_at",
            ],
            selectableColumns: [],

            entityClass: CompanyModel,
        });

        this.sendEvents = sendEvents;
    }

    protected getScopedFilters() {
        return getCompanyScopedFilters();
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

    async create({ data, db }: { data: CompanyModelInsert; db?: PoolClient }) {
        const { client, beginTransaction, commitTransaction, rollbackTransaction, releaseConnection } = await this.getWriteConnection(db);

        try {
            await beginTransaction();

            const result = await this.insertRecord({ data, db: client });

            AppEventEmitter.emitEvent(new CompanyCreatedEvent(result));

            await commitTransaction();

            return result;
        } catch (error) {
            await rollbackTransaction();

            throw error;
        } finally {
            await releaseConnection();
        }
    }

    async update({ uuid, data, db }: { uuid: string; data: CompanyModelUpdate; db?: PoolClient }) {
        const { client, beginTransaction, commitTransaction, rollbackTransaction, releaseConnection } = await this.getWriteConnection(db);

        try {
            await beginTransaction();

            const result = await this.updateRecordByPk({ identifier: uuid, data, db: client });

            await commitTransaction();

            AppEventEmitter.emitEvent(new CompanyUpdatedEvent(result));

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

            AppEventEmitter.emitEvent(new CompanyDeletedEvent(result));

            return result;
        } catch (error) {
            await rollbackTransaction();

            throw error;
        } finally {
            await releaseConnection();
        }
    }

    async findOneByClientCredential({ client_id }: { client_id: string }) {
        const [, db] = await DBPoolClient();

        try {
            return await this.fetchOne({
                db: db,
                orderBy: [],
                clause: {
                    type: "and",
                    conditions: [
                        { field: "client_id", operator: "=", value: client_id, unaccent: false },

                        // !não uso client_secret aqui, pois usamos bcrypt para comparar a secret
                        // { field: "client_secret", operator: "=", value: client_secret, unaccent: false },
                    ],
                },
            });
        } finally {
            db.release();
        }
    }
}
