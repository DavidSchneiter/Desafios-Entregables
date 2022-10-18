const express = require("express");
const { engine } = require("express-handlebars");
const { routerApi } = require("./router/productsRouter.js");
const { viewsApi } = require("./router/viewsRouter.js");

const app = express();

PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main.hbs",
  })
);

app.set("view engine", "hbs");
app.set("views", "../views");

app.use("/api/productos", routerApi);
app.use("/", viewsApi);

const server = app.listen(PORT, () => {
  console.log(`Servidor de exprees ejecutandose en el puerto ${PORT}`);
});

server.on("error", (error) => console.log(`Erorr en el servidor ${error}`));
