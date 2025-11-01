import { RoleRepository } from "@database/repositories/RoleRepository";

// MODELS
import { RoleModelInsert, RoleModelUpdate } from "@database/models/RoleModel";

// TYPES
import { iRepositoryFindMany, iRepositoryFindOne } from "@database/repositories/base/types";

export class RoleService {
    private repository = new RoleRepository();

    async findOne(params: iRepositoryFindOne) {
        return this.repository.findOne(params);
    }

    async findOneByPk(uuid: string) {
        return this.repository.findOneByPk(uuid);
    }

    async findMany(params: iRepositoryFindMany) {
        return this.repository.findMany(params);
    }

    async create(data: RoleModelInsert) {
        return this.repository.create({ data });
    }

    async update(uuid: string, data: RoleModelUpdate) {
        return this.repository.update({ uuid, data });
    }

    async delete(uuid: string) {
        return this.repository.delete(uuid);
    }
}

export default RoleService;
