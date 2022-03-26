import cors from "cors";
import express from "express";
import { knex } from "./database/connection";
import { Container } from "./models/Container";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/containers", async (request, response) => {
  const { client, container_number, type, status, category } = request.body;

  const containerAlreadyExists = await knex("containers").where(
    "container_number",
    container_number
  );

  if (containerAlreadyExists.length) {
    return response.status(400).json({ error: "Contêiner já existe." });
  }

  const container = new Container();

  Object.assign(container, {
    client,
    container_number,
    type,
    status,
    category,
  });

  try {
    await knex("containers").insert(container);

    return response.status(201).send();
  } catch (error) {
    return response.status(400).json({ error: error });
  }
});

app.get("/containers", async (request, response) => {
  const containers = await knex("containers").select("*");

  return response.status(200).json(containers);
});

app.put("/containers/:id", async (request, response) => {
  const { id } = request.params;
  const { client, container_number, type, status, category } = request.body;

  try {
    await knex("containers")
      .where("id", id)
      .update({ client, container_number, type, status, category });
    return response.status(204).send();
  } catch (error) {
    return response.status(400).json({ error: error });
  }
});

app.delete("/containers/:id", async (request, response) => {
  const { id } = request.params;

  try {
    await knex("containers").where("id", id).del();
    return response.status(204).send();
  } catch (error) {
    return response.status(400).json({ error: error });
  }
});

app.post("/movements", async (request, response) => {
  const { container_id, type, start_hour, end_hour } = request.body;

  console.log("entered");

  console.log(start_hour, end_hour);

  try {
    await knex("movements").insert({
      container_id,
      type,
      start_hour,
      end_hour,
    });

    return response.status(201).send();
  } catch (error) {
    return response.status(400).json({ error: error });
  }
});

app.get("/movements", async (request, response) => {
  const movements = await knex("movements").select("*");

  return response.status(200).json(movements);
});

app.put("/movements/:id", async (request, response) => {
  const { id } = request.params;
  const { container_id, type, start_hour, end_hour } = request.body;

  try {
    await knex("movements")
      .where("id", id)
      .update({ container_id, type, start_hour, end_hour });
    return response.status(204).send();
  } catch (error) {
    return response.status(400).json({ error: error });
  }
});

app.delete("/movements/:id", async (request, response) => {
  const { id } = request.params;

  try {
    await knex("movements").where("id", id).del();
    return response.status(204).send();
  } catch (error) {
    return response.status(400).json({ error: error });
  }
});

app.get("/movements/types/:type/", async (request, response) => {
  const { type } = request.params;

  try {
    const movements = await knex("movements").where("type", type);
    return response.status(200).json(movements);
  } catch (error) {
    return response.status(400).json({ error });
  }
});

app.get("/movements/clients/:client", async (request, response) => {
  const { client } = request.params;

  try {
    const clientContainers = await knex("containers").where("client", client);

    const containersIds = clientContainers.map((container) => container.id);

    console.log(containersIds);

    const movements = await knex
      .select("*")
      .from("movements")
      .whereIn("container_id", containersIds);

    console.log(movements);

    return response.status(200).json(movements);
  } catch (error) {
    return response.status(400).json({ error });
  }
});

app.listen("3333", () => console.log("Server started."));
