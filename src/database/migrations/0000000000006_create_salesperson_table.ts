import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("salesperson", (table) => {
        // Criação da tabela
        table.uuid("uuid").notNullable().primary().defaultTo(knex.raw("uuidv7()"));

        table.uuid("organization_uuid").notNullable();
        table.uuid("user_uuid");

        table.string("name", 121).notNullable();

        table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("updated_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("deleted_at");

        table
            .foreign("organization_uuid", "salesperson_organization_uuid_fkey") // constraint name
            .references("uuid") // referenced column
            .inTable("organization") // referenced table
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");

        table
            .foreign("user_uuid", "salesperson_user_uuid_fkey") // constraint name
            .references("uuid") // referenced column
            .inTable("user") // referenced table
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");
    });

    // Indexes and uniques
    await knex.schema.alterTable("salesperson", (table) => {
        table.unique(["uuid"], "salesperson_uuid_unique");
        table.index(["created_at"], "salesperson_created_at_idx");
        table.index(["updated_at"], "salesperson_updated_at_idx");
        table.index(["deleted_at"], "salesperson_deleted_at_idx");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("salesperson", (table) => {
        table.dropUnique(["uuid"], "salesperson_uuid_unique");
        table.dropIndex(["created_at"], "salesperson_created_at_idx");
        table.dropIndex(["updated_at"], "salesperson_updated_at_idx");
        table.dropIndex(["deleted_at"], "salesperson_deleted_at_idx");
    });

    await knex.schema.dropTable("salesperson");
}
