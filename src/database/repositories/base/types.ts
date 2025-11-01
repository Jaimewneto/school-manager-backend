import { PoolClient } from "@database/connections/postgres";

import { Clause, OrderBy } from "@/types/clause";

import { BuildKnexMainQueryParams } from "@utils/sql/knex";

export type DatabaseClient = PoolClient;

type iRepositoryBaseKnexMainQuery<Entity = unknown> = {
    additionalFields?: BuildKnexMainQueryParams["additionalFields"];
    joins?: BuildKnexMainQueryParams["joins"];
    withs?: BuildKnexMainQueryParams["withs"];
    fields?: BuildKnexMainQueryParams["fields"];

    where?: Clause<Entity>;
    clause?: Clause<Entity>;
    orderBy?: OrderBy<Entity>[];

    db: DatabaseClient;
};

export interface iRepositoryFetchOne<Entity = unknown> extends iRepositoryBaseKnexMainQuery<Entity> {
    showDeleted?: boolean;
}

export interface iRepositoryFetchOneByPk {
    additionalFields?: BuildKnexMainQueryParams["additionalFields"];
    joins?: BuildKnexMainQueryParams["joins"];
    withs?: BuildKnexMainQueryParams["withs"];
    fields?: BuildKnexMainQueryParams["fields"];

    showDeleted?: boolean;
    identifier: string | number | bigint;
    db: DatabaseClient;
}

export interface iRepositoryFetchMany<Entity = unknown> extends iRepositoryBaseKnexMainQuery<Entity> {
    skip?: number;
    take?: number;
}

export interface iRepositoryInsertRecord<Entity = unknown> {
    data: Entity;
    db: DatabaseClient;
}

export interface iRepositoryInsertOnConflictRecord<Entity = unknown> {
    insert: Entity;
    update: Entity;

    conflictColumns: string[];

    db: DatabaseClient;
}

export interface iRepositoryInsertManyOnConflictRecord<Entity = unknown> {
    values: Entity[];

    conflictColumns: string[];

    db: DatabaseClient;
}

export interface iRepositoryUpdateRecords<Entity = unknown> {
    data: Partial<Entity>;
    where: Clause<Entity>; // Não deixei opcional aqui pra não fazer o famoso "update sem where"
    db: DatabaseClient;
}

export interface iRepositoryUpdateRecordByPk<Entity = unknown> {
    identifier: string | number | bigint;
    data: Partial<Entity>;
    db: DatabaseClient;
}

export interface iRepositoryFindOne<Entity = unknown> extends Omit<iRepositoryFetchOne<Entity>, "db"> {
    db?: DatabaseClient;
}
export interface iRepositoryFindMany<Entity = unknown> extends Omit<iRepositoryFetchMany<Entity>, "db"> {
    db?: DatabaseClient;
}

export interface iRepository<Entity> {
    findOne(params: iRepositoryFindOne): Promise<Entity | null>;
    findOneByPk(identifier: string | number, db?: DatabaseClient): Promise<Entity | null>;
    findMany(params: iRepositoryFindMany<Entity>): Promise<[Entity[], number]>;
}

export type iRepositoryTransactionParams<R> = (client: DatabaseClient) => Promise<R>;
