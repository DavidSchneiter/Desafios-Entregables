import { Contenedor } from "../clase";  
import { Request, Response, Router} from 'express';
import { ObjectContainer } from "../interfaces";
import { getTime } from "../utils";
import { body } from "express-validator";
import { fieldValidator, roleValidator } from "../middlewares";

const container = new Contenedor("productos");

export const routerProducts:Router = Router();

routerProducts.get("/", async (req: Request, res:Response) => {
  res.status(200).json(await container.getAll());
});

routerProducts.get("/:id", async (req: Request, res: Response) => {
  const product = await container.getById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.status(200).json(await container.getById(req.params.id));
});

routerProducts.post("/", [
  body("name", "El nombre es obligatorio").notEmpty().isString(),
  body("description", "La descripcion es obligatoria").notEmpty().isString(),
  body("code", "El codigo es obligatorio").notEmpty().isString(),
  body("url", "La url es obligatoria").isLength({
      min: 10,
    }).isString(),
  body("price", "El precio es obligatorio").isNumeric().notEmpty(),
  body("stock", "El stock es obligatorio").isNumeric().notEmpty(),
  fieldValidator
  ], roleValidator,
  async (req: Request, res: Response) => {
  const {name,
    description,
    code,
    url,
    price,
    stock } = req.body;
  const product:ObjectContainer = {
    timestamp: getTime(),
    name,
    description,
    code,
    url,
    price,
    stock
  };
  res.status(200).json(await container.save(product));
});

routerProducts.put("/:id",[
  body("name", "El nombre es obligatorio").notEmpty().isString(),
  body("description", "La descripcion es obligatoria").notEmpty().isString(),
  body("code", "El codigo es obligatorio").notEmpty().isString(),
  body("url", "La url es obligatoria").isLength({
      min: 10,
    }).isString(),
  body("price", "El precio es obligatorio").isNumeric().notEmpty(),
  body("stock", "El stock es obligatorio").isNumeric().notEmpty(),
  fieldValidator
  ], roleValidator, async (req: Request, res:Response) => {
  let product = await container.getById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "producto no encontrado" });
  }
  const {
    name,
    description,
    code,
    url,
    price,
    stock } = req.body;
  const id = req.params.id
  res.status(200).json(await container.changeById(id,name,
    description,
    code,
    url,
    price,
    stock));
});

routerProducts.delete("/:id", roleValidator, async (req: Request, res:Response) => {
  const product = await container.getById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  const resp = await container.deleteById(req.params.id);
  res.status(200).json(resp);
});

