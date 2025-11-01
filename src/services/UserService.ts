import { UserRepository } from "@database/repositories/UserRepository";

// MODELS
import { UserModelInsert, UserModelUpdate } from "@database/models/UserModel";

// TYPES
import { iRepositoryFindMany, iRepositoryFindOne } from "@database/repositories/base/types";

export class UserService {
    private repository = new UserRepository();

    async findOne(params: iRepositoryFindOne) {
        return this.repository.findOne(params);
    }

    async findOneByPk(uuid: string) {
        return this.repository.findOneByPk(uuid);
    }

    async findMany(params: iRepositoryFindMany) {
        return this.repository.findMany(params);
    }

    async create(data: UserModelInsert) {
        return this.repository.create({ data });
    }

    async update(uuid: string, data: UserModelUpdate) {
        return this.repository.update({ uuid, data });
    }

    async delete(uuid: string) {
        return this.repository.delete(uuid);
    }
}

export default UserService;
