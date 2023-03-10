import { Router } from "../../deps.ts";
import { Controller } from "../controller/api.controller.ts";

const controller = new Controller();

export const router = new Router()
  //User routes
  .get("/api", controller.obtenerColor)
  .post("/api", controller.guardarColor);
// .delete("/api/users/:userId", deleteUser)
// .patch("/api/users", updateUser)
// .post("/api/users", createUser);
