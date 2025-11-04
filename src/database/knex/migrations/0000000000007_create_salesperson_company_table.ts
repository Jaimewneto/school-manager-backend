import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("salesperson_company", (table) => {
        // Criação da tabela
        table.uuid("uuid").notNullable().primary().defaultTo(knex.raw("uuidv7()"));

        table.uuid("salesperson_uuid").notNullable();
        table.uuid("company_uuid").notNullable();

        table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("updated_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("deleted_at");

        table
            .foreign("salesperson_uuid", "salesperson_company_salesperson_uuid_fkey") // constraint name
            .references("uuid") // referenced column
            .inTable("salesperson") // referenced table
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");

        table
            .foreign("company_uuid", "salesperson_company_company_uuid_fkey") // constraint name
            .references("uuid") // referenced column
            .inTable("company") // referenced table
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");
    });

    // Indexes and uniques
    await knex.schema.alterTable("salesperson_company", (table) => {
        table.unique(["uuid"], "salesperson_company_uuid_unique");
        table.unique(["salesperson_uuid", "company_uuid"], "salesperson_company_salesperson_uuid_company_uuid_unique"); // A tuple constraint for salesperson/company (salesperson can only have one register per company)
        table.index(["salesperson_uuid"], "salesperson_company_salesperson_uuid_idx"); // As we'll aways need to fetch a salesperson's companies, we'll create an index for it
        table.index(["created_at"], "salesperson_company_created_at_idx");
        table.index(["updated_at"], "salesperson_company_updated_at_idx");
        table.index(["deleted_at"], "salesperson_company_deleted_at_idx");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("salesperson_company", (table) => {
        table.dropUnique(["uuid"], "salesperson_company_uuid_unique");
        table.dropIndex(["salesperson_uuid"], "salesperson_company_salesperson_uuid_idx");
        table.dropIndex(["created_at"], "salesperson_company_created_at_idx");
        table.dropIndex(["updated_at"], "salesperson_company_updated_at_idx");
        table.dropIndex(["deleted_at"], "salesperson_company_deleted_at_idx");
    });

    await knex.schema.dropTable("salesperson_company");
}
