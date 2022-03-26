import Knex from "knex";

export const knex = Knex({
  client: "pg",
  version: "7.2",
  connection: {
    port: 5432,
    user: "postgres",
    password: "123456",
    database: "porto",
  },
});
