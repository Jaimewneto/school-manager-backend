import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("party", (table) => {
        // Criação da tabela
        table.uuid("uuid").notNullable().primary().defaultTo(knex.raw("uuidv7()"));

        table.uuid("organization_uuid").notNullable();

        table.boolean("is_customer").notNullable().defaultTo(false);
        table.boolean("is_supplier").notNullable().defaultTo(false);
        table.boolean("is_carrier").notNullable().defaultTo(false);

        table.string("legal_name", 121).notNullable();
        table.string("trade_name", 121);

        table.string("tax_id", 14).notNullable(); // CNPJ
        table.string("state_registration", 14); // IE

        table.string("notes", 255);

        table.boolean("is_active").notNullable().defaultTo(true);

        table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("updated_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("deleted_at");

        table
            .foreign("organization_uuid", "party_organization_uuid_fkey") // constraint name
            .references("uuid") // referenced column
            .inTable("organization") // referenced table
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");
    });

    // Indexes and uniques
    await knex.schema.alterTable("party", (table) => {
        table.unique(["uuid"], "party_uuid_unique");
        table.index(["created_at"], "party_created_at_idx");
        table.index(["updated_at"], "party_updated_at_idx");
        table.index(["deleted_at"], "party_deleted_at_idx");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("party", (table) => {
        table.dropUnique(["uuid"], "party_uuid_unique");
        table.dropIndex(["created_at"], "party_created_at_idx");
        table.dropIndex(["updated_at"], "party_updated_at_idx");
        table.dropIndex(["deleted_at"], "party_deleted_at_idx");
    });

    await knex.schema.dropTable("party");
}
