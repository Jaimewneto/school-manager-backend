import { OrganizationRepository } from "@database/repositories/OrganizationRepository";

// MODELS
import { OrganizationModelInsert, OrganizationModelUpdate } from "@database/models/OrganizationModel";

// TYPES
import { iRepositoryFindMany, iRepositoryFindOne } from "@database/repositories/base/types";

export class OrganizationService {
    private repository = new OrganizationRepository();

    async findOne(params: iRepositoryFindOne) {
        return this.repository.findOne(params);
    }

    async findOneByPk(uuid: string) {
        return this.repository.findOneByPk(uuid);
    }

    async findMany(params: iRepositoryFindMany) {
        return this.repository.findMany(params);
    }

    async create(data: OrganizationModelInsert) {
        return this.repository.create({ data });
    }

    async update(uuid: string, data: OrganizationModelUpdate) {
        return this.repository.update({ uuid, data });
    }

    async delete(uuid: string) {
        return this.repository.delete(uuid);
    }
}

export default OrganizationService;
