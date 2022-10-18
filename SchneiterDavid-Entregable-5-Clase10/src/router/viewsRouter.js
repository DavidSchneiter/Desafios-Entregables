const Contenedor = require("../clase.js");
const express = require("express");
const { Router } = express;

const container = new Contenedor("productos");

const viewsApi = Router();

viewsApi.get("/", (req, res) => {
  res.render("forms");
});

viewsApi.post("/productos", async (req, res) => {
  const { title, price, thumbnail } = req.body;

  await container.save({ title, price, thumbnail });

  res.redirect("/");
});

viewsApi.get("/productos", async (req, res) => {
  const productos = await container.getAll();
  res.render("table", { products: productos });
});

module.exports = { viewsApi };
