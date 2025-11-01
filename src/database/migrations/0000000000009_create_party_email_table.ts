import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("party_email", (table) => {
        // Criação da tabela
        table.uuid("uuid").notNullable().primary().defaultTo(knex.raw("uuidv7()"));

        table.uuid("organization_uuid").notNullable();
        table.uuid("party_uuid");

        table.string("email", 121).notNullable();

        table.string("description", 121);

        table.boolean("is_primary").notNullable();

        table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("updated_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("deleted_at");

        table
            .foreign("organization_uuid", "party_email_organization_uuid_fkey") // constraint name
            .references("uuid") // referenced column
            .inTable("organization") // referenced table
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");

        table
            .foreign("party_uuid", "party_email_party_uuid_fkey") // constraint name
            .references("uuid") // referenced column
            .inTable("party") // referenced table
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");
    });

    // Indexes and uniques
    await knex.schema.alterTable("party_email", (table) => {
        table.unique(["uuid"], "party_email_uuid_unique");
        table.index(["created_at"], "party_email_created_at_idx");
        table.index(["updated_at"], "party_email_updated_at_idx");
        table.index(["deleted_at"], "party_email_deleted_at_idx");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("party_email", (table) => {
        table.dropUnique(["uuid"], "party_email_uuid_unique");
        table.dropIndex(["created_at"], "party_email_created_at_idx");
        table.dropIndex(["updated_at"], "party_email_updated_at_idx");
        table.dropIndex(["deleted_at"], "party_email_deleted_at_idx");
    });

    await knex.schema.dropTable("party_email");
}
