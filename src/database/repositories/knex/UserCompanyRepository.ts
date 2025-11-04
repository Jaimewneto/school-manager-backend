// CONNECTIONS
import { PoolClient } from "@database/connections/postgres";

// BASE REPOSITORY
import { BaseRepository } from "../base/KnexBaseRepository";
import { iRepository, iRepositoryFindMany, iRepositoryFindOne } from "../base/types";

// TYPES
import { UserCompanyModel, UserCompanyModelInsert, UserCompanyModelUpdate } from "@database/models/UserCompanyModel";

export class UserCompanyRepository
    extends BaseRepository<UserCompanyModel, UserCompanyModelInsert, UserCompanyModelUpdate>
    implements iRepository<UserCompanyModel>
{
    constructor() {
        super({
            table: "user_company",
            primaryKey: "uuid",

            fillableColumns: ["uuid", "user_uuid", "company_uuid", "role_uuid", "updated_at", "deleted_at"],
            selectableColumns: [],

            entityClass: UserCompanyModel,
        });
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

    async create({ data, db }: { data: UserCompanyModelInsert; db?: PoolClient }) {
        const { client, beginTransaction, commitTransaction, rollbackTransaction, releaseConnection } = await this.getWriteConnection(db);

        try {
            await beginTransaction();

            const result = await this.insertRecord({ data, db: client });

            await commitTransaction();

            return result;
        } catch (error) {
            await rollbackTransaction();

            throw error;
        } finally {
            await releaseConnection();
        }
    }

    async update({ uuid, data, db }: { uuid: string; data: UserCompanyModelUpdate; db?: PoolClient }) {
        const { client, beginTransaction, commitTransaction, rollbackTransaction, releaseConnection } = await this.getWriteConnection(db);

        try {
            await beginTransaction();

            const result = await this.updateRecordByPk({ identifier: uuid, data, db: client });

            await commitTransaction();

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

            return result;
        } catch (error) {
            await rollbackTransaction();

            throw error;
        } finally {
            await releaseConnection();
        }
    }
}
