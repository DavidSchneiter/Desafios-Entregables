const express = require("express");
const { engine } = require("express-handlebars");
const Contenedor = require("./clase.js");

const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(customParseFormat);

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const container = new Contenedor("productos");
const containerMsg = new Contenedor("mensajes");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const PORT = process.env.PORT || 8080;

app.use(express.static("../public"));

httpServer.listen(PORT, () => console.log(`Running on port: ${PORT}`));

io.on("connection", (socket) => {
  sendProducts(socket);
  sendMessages(socket);

  socket.on("new product", (newProduct) => {
    saveProduct(newProduct);
  });

  socket.on("new message", (newMessage) => {
    saveMessage(newMessage);
  });
});

const sendProducts = async (socket) => {
  const allProducts = await container.getAll();
  socket.emit("all products", allProducts);
};

const saveProduct = async (newProduct) => {
  await container.save(newProduct);
  const allProduct = await container.getAll();
  io.sockets.emit("all products", allProduct);
};

const sendMessages = async (socket) => {
  const allMessage = await containerMsg.getAll();
  socket.emit("all message", allMessage);
};

const saveMessage = async (message) => {
  const date = new Date();
  const dateFormated = dayjs(date).format("DD/MM/YYYY hh:mm:ss");
  const newMessage = { ...message, date: `${dateFormated} hs` };
  await containerMsg.save(newMessage);
  const allMessage = await containerMsg.getAll();
  io.sockets.emit("all message", allMessage);
};
