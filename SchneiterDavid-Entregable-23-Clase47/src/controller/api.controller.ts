import { Context } from "../../deps.ts";
import { Colores } from "../db/containerClass.ts";

export class Controller {
  constructor(private db: Colores = new Colores()) {}

  obtenerColor = (ctx: Context) => {
    try {
      const colores = this.db.obtenerColor();
      ctx.response.body = { colores };
    } catch (err) {
      ctx.response.status = 404;
      ctx.response.body = { msg: err.message };
    }
  };

  guardarColor = async (ctx: Context) => {
    try {
      const { color } = await ctx.request.body().value;

      this.db.guardarColor(color);
      ctx.response.body = color;
    } catch (err) {
      ctx.response.status = 404;
      ctx.response.body = { msg: err.message };
    }
  };
}
