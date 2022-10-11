const Contenedor = require("./clase");
const express = require("express");
const multer = require("multer");
const { Router } = express;

const app = express();
const routerApi = Router();
PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const container = new Contenedor("productos");

const server = app.listen(PORT, () => {
  console.log(`Servidor de exprees ejecutandose en el puerto ${PORT}`);
});

server.on("error", (error) => console.log(`Erorr en el servidor ${error}`));

routerApi.get("/", async (req, res) => {
  res.status(200).json(await container.getAll());
});

routerApi.get("/:id", async (req, res) => {
  const product = await container.getById(req.params.id);
  if (product.length === 0) {
    return res.status(404).json({ error: "producto no encontrado" });
  }
  res.status(200).json(await container.getById(req.params.id));
});

routerApi.post("/", async (req, res) => {
  const { title, price, thumbnail, id } = req.body;
  const product = {
    title,
    price,
    thumbnail,
    id,
  };
  res.status(200).json(await container.save(product));
});

routerApi.put("/:id", async (req, res) => {
  let resp = await container.getById(req.params.id);
  let product = resp[0];

  if (product.length === 0 || !product) {
    return res.status(404).json({ error: "producto no encontrado" });
  }

  await container.deleteById(req.params.id);

  const { title, price, thumbnail } = req.body;

  product = {
    title: title ? title : product.title,
    price: price ? price : product.price,
    thumbnail: thumbnail ? thumbnail : product.thumbnail,
    id: parseInt(req.params.id),
  };
  res.status(200).json(await container.save(product));
});

routerApi.delete("/:id", async (req, res) => {
  const product = await container.getById(req.params.id);
  if (product.length === 0 || !product) {
    return res.status(404).json({ error: "producto no encontrado" });
  }
  const resp = await container.deleteById(req.params.id);
  res.status(200).json(resp);
});

app.use("/api/productos", routerApi);
