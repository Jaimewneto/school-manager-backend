import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("role", (table) => {
        // Criação da tabela
        table.uuid("uuid").notNullable().primary().defaultTo(knex.raw("uuidv7()"));

        table.uuid("organization_uuid").notNullable();

        table.string("description", 121).notNullable();

        table.boolean("sales_read").notNullable().defaultTo(true);
        table.boolean("sales_write").notNullable().defaultTo(true);
        table.boolean("sales_delete").notNullable().defaultTo(true);

        table.boolean("finances_read").notNullable().defaultTo(true);
        table.boolean("finances_write").notNullable().defaultTo(true);
        table.boolean("finances_delete").notNullable().defaultTo(true);

        table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("updated_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("deleted_at");

        table
            .foreign("organization_uuid", "role_organization_uuid_fkey") // constraint name
            .references("uuid") // referenced column
            .inTable("organization") // referenced table
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");
    });

    // Indexes and uniques
    await knex.schema.alterTable("role", (table) => {
        table.unique(["uuid"], "role_uuid_unique");
        table.index(["created_at"], "role_created_at_idx");
        table.index(["updated_at"], "role_updated_at_idx");
        table.index(["deleted_at"], "role_deleted_at_idx");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("role", (table) => {
        table.dropUnique(["uuid"], "role_uuid_unique");
        table.dropIndex(["created_at"], "role_created_at_idx");
        table.dropIndex(["updated_at"], "role_updated_at_idx");
        table.dropIndex(["deleted_at"], "role_deleted_at_idx");
    });

    await knex.schema.dropTable("role");
}
