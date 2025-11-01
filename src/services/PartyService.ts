// MODELS
import { PartyModelInsert, PartyModelUpdate } from "@database/models/PartyModel";

// REPOSITORIES
import { PartyRepository } from "@database/repositories/PartyRepository";
import { PartyEmailRepository } from "@database/repositories/PartyEmailRepository";
import { PartyPhoneRepository } from "@database/repositories/PartyPhoneRepository";

// TYPES
import { iRepositoryFindMany, iRepositoryFindOne } from "@database/repositories/base/types";
import { NotFoundError } from "@errors/main";

export class PartyService {
    private repository = new PartyRepository();
    private partyEmailRepository = new PartyEmailRepository();
    private partyPhoneRepository = new PartyPhoneRepository();

    async findOne(params: iRepositoryFindOne) {
        return this.repository.findOne(params);
    }

    async findOneByPk(uuid: string) {
        return this.repository.findOneByPk(uuid);
    }

    async findMany(params: iRepositoryFindMany) {
        return this.repository.findMany(params);
    }

    async create(data: PartyModelInsert) {
        const { client, beginTransaction, commitTransaction, rollbackTransaction, releaseConnection } = await this.repository.getWriteConnection();

        try {
            await beginTransaction();

            const created = await this.repository.create({ data, db: client });

            if (data.emails && data.emails.length > 0) {
                for (const email of data.emails) {
                    await this.partyEmailRepository.create({ data: { ...email, party_uuid: created.uuid }, db: client });
                }
            }

            if (data.phones && data.phones.length > 0) {
                for (const phone of data.phones) {
                    await this.partyPhoneRepository.create({ data: { ...phone, party_uuid: created.uuid }, db: client });
                }
            }

            await commitTransaction();

            return await this.findOneByPk(created.uuid);
        } catch (error) {
            await rollbackTransaction();

            throw error;
        } finally {
            await releaseConnection();
        }
    }

    async update(uuid: string, data: PartyModelUpdate) {
        const { client, beginTransaction, commitTransaction, rollbackTransaction, releaseConnection } = await this.repository.getWriteConnection();

        try {
            await beginTransaction();

            const previousParty = await this.findOneByPk(uuid);

            if (!previousParty) throw new NotFoundError();

            const updated = await this.repository.update({ uuid, data, db: client });

            if (data.emails) {
                if (data.emails.length == 0) {
                    for (const email of previousParty.emails) {
                        await this.partyEmailRepository.delete(email.uuid, client);
                    }
                } else {
                    for (const email of data.emails) {
                        const exists = previousParty.emails.find((e) => e.uuid === email.uuid);

                        if (exists) {
                            await this.partyEmailRepository.update({ uuid: email.uuid, data: email, db: client });

                            continue;
                        }

                        await this.partyEmailRepository.create({ data: { ...email, party_uuid: updated.uuid }, db: client });
                    }
                }
            }

            if (data.phones) {
                if (data.phones.length == 0) {
                    for (const phone of previousParty.phones) {
                        await this.partyPhoneRepository.delete(phone.uuid, client);
                    }
                } else {
                    for (const phone of data.phones) {
                        const exists = previousParty.phones.find((p) => p.uuid === phone.uuid);

                        if (exists) {
                            await this.partyPhoneRepository.update({ uuid: phone.uuid, data: phone, db: client });

                            continue;
                        }

                        await this.partyPhoneRepository.create({ data: { ...phone, party_uuid: updated.uuid }, db: client });
                    }
                }
            }

            await commitTransaction();

            return await this.findOneByPk(updated.uuid);
        } catch (error) {
            await rollbackTransaction();

            throw error;
        } finally {
            await releaseConnection();
        }
    }

    async delete(uuid: string) {
        return this.repository.delete(uuid);
    }
}

export default PartyService;
