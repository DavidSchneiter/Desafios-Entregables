import express, { Express } from 'express';
import dotenv from 'dotenv';

import { routerCart, routerProducts } from './router'

dotenv.config();
const app: Express = express();

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/productos", routerProducts); 
app.use("/api/carrito", routerCart); 

const server = app.listen(port, () => {
  console.log(`Servidor de exprees ejecutandose en el puerto ${port}`);
});

server.on("error", (error) => console.log(`Erorr en el servidor ${error}`));
