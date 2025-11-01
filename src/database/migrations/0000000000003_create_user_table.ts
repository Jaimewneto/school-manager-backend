import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("user", (table) => {
        // Criação da tabela
        table.uuid("uuid").notNullable().primary().defaultTo(knex.raw("uuidv7()"));

        table.uuid("organization_uuid").notNullable();

        table.string("name", 121).notNullable();

        table.string("email", 100).notNullable();
        table.string("password_hash", 200).notNullable();

        //! Temos que fazer um atributo posteriormente pra representar o "role" do usuario

        table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("updated_at").notNullable().defaultTo(knex.raw("now()"));
        table.timestamp("deleted_at");

        table
            .foreign("organization_uuid", "user_organization_uuid_fkey") // constraint name
            .references("uuid") // referenced column
            .inTable("organization") // referenced table
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");
    });

    // Indexes and uniques
    await knex.schema.alterTable("user", (table) => {
        table.unique(["uuid"], "user_uuid_unique");
        table.unique(["email"], "user_email_unique");
        table.index(["created_at"], "user_created_at_idx");
        table.index(["updated_at"], "user_updated_at_idx");
        table.index(["deleted_at"], "user_deleted_at_idx");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("user", (table) => {
        table.dropUnique(["uuid"], "user_uuid_unique");
        table.dropUnique(["email"], "user_email_unique");
        table.dropIndex(["created_at"], "user_created_at_idx");
        table.dropIndex(["updated_at"], "user_updated_at_idx");
        table.dropIndex(["deleted_at"], "user_deleted_at_idx");
    });

    await knex.schema.dropTable("user");
}
