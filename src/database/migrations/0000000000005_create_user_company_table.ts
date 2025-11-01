import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("user_company", (table) => {
        // Criação da tabela
        table.uuid("uuid").notNullable().primary().defaultTo(knex.raw("uuidv7()"));

        table.uuid("user_uuid").notNullable();
        table.uuid("company_uuid").notNullable();
        table.uuid("role_uuid").notNullable();

        table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("updated_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("deleted_at");

        table
            .foreign("user_uuid", "user_company_user_uuid_fkey") // constraint name
            .references("uuid") // referenced column
            .inTable("user") // referenced table
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");

        table
            .foreign("company_uuid", "user_company_company_uuid_fkey") // constraint name
            .references("uuid") // referenced column
            .inTable("company") // referenced table
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");

        table
            .foreign("role_uuid", "user_company_role_uuid_fkey") // constraint name
            .references("uuid") // referenced column
            .inTable("role") // referenced table
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");
    });

    // Indexes and uniques
    await knex.schema.alterTable("user_company", (table) => {
        table.unique(["uuid"], "user_company_uuid_unique");
        table.unique(["user_uuid", "company_uuid"], "user_company_user_uuid_company_uuid_unique"); // A tuple constraint for user/company (user can only have one role per company)
        table.index(["user_uuid"], "user_company_user_uuid_idx"); // As we'll aways need to fetch a user's role, we'll create an index for it
        table.index(["created_at"], "user_company_created_at_idx");
        table.index(["updated_at"], "user_company_updated_at_idx");
        table.index(["deleted_at"], "user_company_deleted_at_idx");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("user_company", (table) => {
        table.dropUnique(["uuid"], "user_company_uuid_unique");
        table.dropIndex(["user_uuid"], "user_company_user_uuid_idx");
        table.dropIndex(["created_at"], "user_company_created_at_idx");
        table.dropIndex(["updated_at"], "user_company_updated_at_idx");
        table.dropIndex(["deleted_at"], "user_company_deleted_at_idx");
    });

    await knex.schema.dropTable("user_company");
}
