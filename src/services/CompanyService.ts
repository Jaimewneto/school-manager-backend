import { CompanyRepository } from "@database/repositories/CompanyRepository";

// MODELS
import { CompanyModelInsert, CompanyModelUpdate } from "@database/models/CompanyModel";

// TYPES
import { iRepositoryFindMany, iRepositoryFindOne } from "@database/repositories/base/types";

export class CompanyService {
    private repository = new CompanyRepository();

    async findOne(params: iRepositoryFindOne) {
        return this.repository.findOne(params);
    }

    async findOneByPk(uuid: string) {
        return this.repository.findOneByPk(uuid);
    }

    async findMany(params: iRepositoryFindMany) {
        return this.repository.findMany(params);
    }

    async create(data: CompanyModelInsert) {
        return this.repository.create({ data });
    }

    async update(uuid: string, data: CompanyModelUpdate) {
        return this.repository.update({ uuid, data });
    }

    async delete(uuid: string) {
        return this.repository.delete(uuid);
    }
}

export default CompanyService;
