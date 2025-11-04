import { Kysely, Insertable, Selectable, Updateable, InsertObject, UpdateQueryBuilder, ReferenceExpression } from "kysely";

// TYPES
import { Where } from "@/types/query/where";
import { QueryMany } from "@/types/query";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

// UTILS
import { applyWhereToQuery } from "@/utils/sql/where";
import { Database } from "@database/kysely/schema";

export class BaseRepository<
    TDatabase extends Database,
    TTable extends Extract<keyof TDatabase, string>,
    TSchema = TDatabase[TTable],
    TSelectable extends Selectable<TSchema> = Selectable<TSchema>,
    TInsertable extends Insertable<TSchema> = Insertable<TSchema>,
    TUpdateable extends Updateable<TSchema> = Updateable<TSchema>,
> {
    constructor(
        protected db: Kysely<TDatabase>,
        protected tableName: TTable,
    ) {}

    async findOne<T = undefined, TableName extends string | undefined = undefined>(
        where: Where<T extends undefined ? TSchema : T, TableName>,
    ): Promise<TSelectable | null> {
        const query = applyWhereToQuery(this.db.selectFrom(this.tableName), where);

        return query.selectAll().executeTakeFirst() as Promise<TSelectable | null>;
    }

    async findMany<T = undefined, TableName extends string | undefined = undefined>(
        params?: QueryMany<T extends undefined ? TSchema : T, TableName>,
    ): Promise<TSelectable[]> {
        const query = applyWhereToQuery(this.db.selectFrom(this.tableName), params?.where);

        // Aqui você poderia aplicar select, orderBy, limit, offset se quiser também

        return query.selectAll().execute() as Promise<TSelectable[]>;
    }

    async create(data: TInsertable) {
        return this.db
            .insertInto(this.tableName)
            .values(data as InsertObject<TDatabase, TTable>)
            .returningAll()
            .executeTakeFirstOrThrow();
    }

    async updateById(id: string, data: TUpdateable) {
        const query = this.db.updateTable(this.tableName) as unknown as UpdateQueryBuilder<TDatabase, TTable, TTable, TSelectable>;

        return query
            .set(data as UpdateObjectExpression<TDatabase, TTable, TTable>)
            .where("id" as ReferenceExpression<TDatabase, TTable>, "=", id)
            .returningAll()
            .executeTakeFirstOrThrow();
    }

    async deleteById(id: string) {
        const query = this.db.updateTable(this.tableName) as unknown as UpdateQueryBuilder<TDatabase, TTable, TTable, TSelectable>;

        return query
            .set({ deleted_at: new Date() } as unknown as UpdateObjectExpression<TDatabase, TTable, TTable>)
            .where("id" as ReferenceExpression<TDatabase, TTable>, "=", id)
            .returningAll()
            .executeTakeFirstOrThrow();
    }
}
