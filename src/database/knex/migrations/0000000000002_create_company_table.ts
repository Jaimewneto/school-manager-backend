import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("company", (table) => {
        table.uuid("uuid").notNullable().primary().defaultTo(knex.raw("uuidv7()"));

        table.uuid("organization_uuid").notNullable();

        table.string("legal_name", 110).notNullable();
        table.string("trade_name", 110);

        table.string("tax_id", 14).notNullable(); // CNPJ
        table.string("city_tax_id", 20); // IE

        table.string("street", 60).notNullable();
        table.string("number", 6).notNullable();
        table.string("address_line_2", 60);
        table.string("district", 35).notNullable();
        table.string("city", 45).notNullable();
        table.string("state", 2).notNullable();
        table.string("zipcode", 8).notNullable();
        table.string("ibge_code", 7);

        table.text("digital_certificate_pfx");
        table.text("digital_certificate_password");
        table.text("digital_certificate_data");
        table.timestamp("digital_certificate_expiration");

        table.string("invoice_env", 1);
        table.text("invoice_csc_id");
        table.text("invoice_csc");
        table.string("invoice_api_token");

        table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("updated_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("deleted_at");

        table
            .foreign("organization_uuid", "company_organization_uuid_fkey") // constraint name
            .references("uuid") // referenced column
            .inTable("organization") // referenced table
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");
    });

    // Indexes and uniques
    await knex.schema.alterTable("company", (table) => {
        table.unique(["uuid"], "company_uuid_unique");
        table.unique(["tax_id"], "company_tax_id_unique");
        table.index(["legal_name"], "company_legal_name_idx");
        table.index(["trade_name"], "company_trade_name_idx");
        table.index(["created_at"], "company_created_at_idx");
        table.index(["updated_at"], "company_updated_at_idx");
        table.index(["deleted_at"], "company_deleted_at_idx");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("company", (table) => {
        table.dropUnique(["uuid"], "company_uuid_unique");
        table.dropUnique(["tax_id"], "company_tax_id_unique");
        table.dropIndex(["legal_name"], "company_legal_name_idx");
        table.dropIndex(["trade_name"], "company_trade_name_idx");
        table.dropIndex(["created_at"], "company_created_at_idx");
        table.dropIndex(["updated_at"], "company_updated_at_idx");
    });

    await knex.schema.dropTable("company");
}
