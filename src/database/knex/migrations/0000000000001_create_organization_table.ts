import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("organization", (table) => {
        table.uuid("uuid").notNullable().primary().defaultTo(knex.raw("uuidv7()"));

        table.string("name", 200).notNullable();

        table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("updated_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("deleted_at");
    });

    // Índices e constraints
    await knex.schema.alterTable("organization", (table) => {
        table.index(["created_at"], "organization_created_at_idx");
        table.index(["updated_at"], "organization_updated_at_idx");
        table.index(["deleted_at"], "organization_deleted_at_idx");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("organization", (table) => {
        table.dropUnique(["uuid"], "organization_uuid_unique");
        table.dropIndex(["created_at"], "organization_created_at_idx");
        table.dropIndex(["updated_at"], "organization_updated_at_idx");
        table.dropIndex(["deleted_at"], "organization_deleted_at_idx");
    });

    await knex.schema.dropTable("organization");
}
