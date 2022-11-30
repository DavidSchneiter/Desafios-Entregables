const express = require("express");
const Contenedor = require("./clase.js");
const MockService = require("./mock/mockService");
const mockProduct = new MockService();
const normalizr = require("normalizr");
const normalizar = normalizr.normalize;
const desnormalizar = normalizr.denormalize;

const autorSchema = new normalizr.schema.Entity(
  "autor",
  {},
  { idAttribute: "alias" }
);
const textSchema = new normalizr.schema.Entity("text");
const dateSchema = new normalizr.schema.Entity("date");

const mensajesSchema = new normalizr.schema.Entity("mensaje", {
  autor: autorSchema,
  text: textSchema,
  date: dateSchema,
});

const contenedorMensajes = new normalizr.schema.Entity("contenedor", {
  mensajes: mensajesSchema,
});

const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(customParseFormat);

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const container = new Contenedor("productos-test");
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
  for (let i = 1; i <= 5; i++) {
    await container.save(mockProduct.getAll());
  }
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

  const msgDesnormalizado = allMessage.map((a) =>
    desnormalizar(a.result, mensajesSchema)
  );
  console.log(msgDesnormalizado);
  socket.emit("all message", allMessage);
};

const saveMessage = async (message) => {
  const date = new Date();
  const dateFormated = dayjs(date).format("DD/MM/YYYY hh:mm:ss");
  // const newMessage = { ...mensaje, date: `${dateFormated} hs` };
  const mensaje = {
    autor: {
      id: message.email,
      nombre: message.nombre,
      apellido: message.apellido,
      edad: message.edad,
      alias: message.alias,
      avatar: message.avatar,
    },
    text: message.mensaje,
    date: `${dateFormated} hs`,
  };
  const msgNormalizado = normalizar(mensaje, [contenedorMensajes]);

  await containerMsg.save(msgNormalizado);
  const allMessage = await containerMsg.getAll();
  io.sockets.emit("all message", allMessage);
};
