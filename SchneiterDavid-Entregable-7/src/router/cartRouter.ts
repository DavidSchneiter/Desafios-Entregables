import { CartContenedor, Contenedor } from "../clase";  
import { Request, Response, Router} from 'express';
import { CartContainer, ObjectContainer } from "../interfaces";
import { getTime } from "../utils";
import { body } from "express-validator";
import { fieldValidator } from "../middlewares";

const containerCart = new CartContenedor("carrito");
const containerProducts = new Contenedor("productos");

export const routerCart:Router = Router();

routerCart.get("/", async (req: Request, res:Response) => {
  res.status(200).json(await containerCart.getAll());
});

routerCart.post("/", async (req: Request, res: Response) => {
  const cart:CartContainer = { timestamp: getTime(), productos: [] };
  res.status(200).json(await containerCart.save(cart));
})

routerCart.delete("/:id", async (req: Request, res: Response) => {
  const product = await containerCart.getById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }
  const resp = await containerCart.deleteById(req.params.id);
  res.status(200).json(resp);
})

routerCart.get("/:id", async (req: Request, res: Response) => {
  const productosCart = await containerCart.getById(req.params.id);
  res.status(200).json(productosCart.productos);
});

routerCart.post("/:cartId/productsId", async (req: Request, res: Response) => {
  const { productsId } = req.body;
  let cart:CartContainer = await containerCart.getById(req.params.cartId)
  if (!cart) {
    return res.status(404).json({ error: "Cart no encontrado"})
  }
  const product:ObjectContainer = await containerProducts.getById(productsId);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  cart.productos.push(product)
  await containerCart.deleteById(req.params.cartId);
  res.status(200).json(await containerCart.save(cart));
});

routerCart.delete("/:cartId/productsId/:id_prod", async (req: Request, res: Response) => {
  let cart: CartContainer = await containerCart.getById(req.params.cartId)
  if (!cart) {
    return res.status(404).json({ error: "Cart no encontrado" })
  }
  const newCart = await containerCart.deleteProdById(req.params.id_prod, cart.productos)
  console.log(typeof newCart)
  cart = {
    ...cart,
    productos: newCart
  }
  await containerCart.deleteById(req.params.cartId)
  await containerCart.save(cart);
  console.log(newCart)
  res.status(200).json(`Producto con id: ${req.params.id_prod} eliminado del carrito con id: ${req.params.cartId}`)
})