const Contenedor = require("./clase");
const express = require("express");

const app = express();
PORT = 8080;

const container = new Contenedor("productos");

const server = app.listen(PORT, () => {
  console.log(`Servidor de exprees ejecutandose en el puerto ${PORT}`);
});

server.on("error", (error) => console.log(`Erorr en el servidor ${error}`));

app.get("/productos", async (req, res) => {
  res.status(200).json(await container.getAll());
});

app.get("/productoRandom", async (req, res) => {
  const tamaño = await container.getAll();
  res
    .status(200)
    .json(
      await container.getById(Math.floor(Math.random() * tamaño.length + 1))
    );
});
