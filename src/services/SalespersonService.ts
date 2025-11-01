import { SalespersonRepository } from "@database/repositories/SalespersonRepository";

// MODELS
import { SalespersonModelInsert, SalespersonModelUpdate } from "@database/models/SalespersonModel";

// TYPES
import { iRepositoryFindMany, iRepositoryFindOne } from "@database/repositories/base/types";

export class SalespersonService {
    private repository = new SalespersonRepository();

    async findOne(params: iRepositoryFindOne) {
        return this.repository.findOne(params);
    }

    async findOneByPk(uuid: string) {
        return this.repository.findOneByPk(uuid);
    }

    async findMany(params: iRepositoryFindMany) {
        return this.repository.findMany(params);
    }

    async create(data: SalespersonModelInsert) {
        return this.repository.create({ data });
    }

    async update(uuid: string, data: SalespersonModelUpdate) {
        return this.repository.update({ uuid, data });
    }

    async delete(uuid: string) {
        return this.repository.delete(uuid);
    }
}

export default SalespersonService;
