import fs from 'fs';
import { CartContainer, ObjectContainer } from './interfaces';
import { getTime } from './utils';


export class Contenedor {
  contain: Array<ObjectContainer>;
  id: number;
  file: string;

  constructor(file:string) {
    this.contain = [];
    this.id = 0;
    this.file = file;
  }

  async save(obj: ObjectContainer): Promise<string> {
    if (!obj.id) {
      this.id++;
      obj.id = this.id;
    }

    this.contain.push(obj);
    //muchos problemas con esos 2 objetos y el id asi que les puse any
    this.contain.sort((a:any, b:any) => {
      return a.id - b.id;
    });
    try {
      await fs.promises.writeFile(
        `./src/db/${this.file}.txt`,
        JSON.stringify(this.contain, null, 2)
      );
      return `Id asignado ${obj.name}: ${obj.id}`;
    } catch (error) {
      throw new Error(`Imposible guardar ${error}`);
    }
  }
  async getById(id:string):Promise<ObjectContainer>{
    try {
      const data = await fs.promises.readFile(`./src/db/${this.file}.txt`, "utf-8");
      return JSON.parse(data).filter((e:ObjectContainer) => {
        return e.id == parseInt(id);
      })[0];
    } catch (error) {
      throw new Error(`Imposible leer archivo ${error}`);
    }
  }
  async changeById(id:string,name: string,
    description: string,
  code: string,
  url: string,
  price: number,
  stock: number ):Promise<string>{
    try {
      let product = await this.getById(id);
      await this.deleteById(id);
      product = {
        id: parseInt(id),
        timestamp: getTime(),
        name: name ? name : product.name,
        description: description ? description : product.description,
        code: code ? code : product.code,
        url: url ? url : product.url,
        price: price ? price : product.price,
        stock: stock ? stock : product.stock,
      };
      await this.save(product)
      return "Producto Actualizado"
    } catch (error) {
       throw new Error(`Imposible guardar ${error}`)
    }
  }
  async getAll():Promise<any> {
    try {
      const data = await fs.promises.readFile(`./src/db/${this.file}.txt`, "utf-8");
      if (!data) return "Archivo vacio";
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Imposible leer archivo ${error}`);
    }
  }
  async deleteById(id: string): Promise<string>{
    try {
      const data = await fs.promises.readFile(`./src/db/${this.file}.txt`, "utf-8");
      const newData = JSON.parse(data).filter((e:ObjectContainer )=> {
        return e.id !== parseInt(id);
      });
      this.contain = newData;
      await fs.promises.writeFile(
        `./src/db/${this.file}.txt`,
        JSON.stringify(newData, null, 2)
      );
      return `Producto id: ${id} eliminado, lista actualizada: ${newData}`;
    } catch (error) {
      throw new Error(`Imposible leer archivo ${error}`);
    }
  }
  async deleteAll():Promise<void>{
    try {
      await fs.promises.writeFile(`./${this.file}.txt`, "");
    } catch (error) {
      throw new Error(`Imposible leer archivo ${error}`);
    }
  }
}

export class CartContenedor {
  contain: Array<CartContainer>;
  id: number;
  file: string;

  constructor(file:string) {
    this.contain = [];
    this.id = 0;
    this.file = file;
  }

  async save(obj: CartContainer): Promise<string> {
    if (!obj.id) {
      this.id++;
      obj.id = this.id;
    }

    this.contain.push(obj);
    //muchos problemas con esos 2 objetos y el id asi que les puse any
    this.contain.sort((a:any, b:any) => {
      return a.id - b.id;
    });
    try {
      await fs.promises.writeFile(
        `./src/db/${this.file}.txt`,
        JSON.stringify(this.contain, null, 2)
      );
      return `Id asignado: ${obj.id}`;
    } catch (error) {
      throw new Error(`Imposible guardar ${error}`);
    }
  }
  async getById(id:string):Promise<CartContainer>{
    try {
      const data = await fs.promises.readFile(`./src/db/${this.file}.txt`, "utf-8");
      return JSON.parse(data).filter((e:CartContainer) => {
        return e.id == parseInt(id);
      })[0];
    } catch (error) {
      throw new Error(`Imposible leer archivo ${error}`);
    }
  }
  async getAll():Promise<any> {
    try {
      const data = await fs.promises.readFile(`./src/db/${this.file}.txt`, "utf-8");
      if (!data) return "Archivo vacio";
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Imposible leer archivo ${error}`);
    }
  }
  async deleteProdById(id:string, cart:any):Promise<Array<ObjectContainer>>{
    try {
     const newData = cart.filter((e: ObjectContainer) => {
        return e.id !== parseInt(id);
     })
      return newData
    } catch (error) {
      throw new Error(`Imposible leer archivo ${error}`);
    }
  }
  async deleteById(id: string): Promise<string>{
    try {
      const data = await fs.promises.readFile(`./src/db/${this.file}.txt`, "utf-8");
      const newData = JSON.parse(data).filter((e:CartContainer )=> {
        return e.id !== parseInt(id);
      });
      this.contain = newData;
      await fs.promises.writeFile(
        `./src/db/${this.file}.txt`,
        JSON.stringify(newData, null, 2)
      );
      return `Producto id: ${id} eliminado, lista actualizada: ${newData}`;
    } catch (error) {
      throw new Error(`Imposible leer archivo ${error}`);
    }
  }
  async deleteAll():Promise<void>{
    try {
      await fs.promises.writeFile(`./${this.file}.txt`, "");
    } catch (error) {
      throw new Error(`Imposible leer archivo ${error}`);
    }
  }
}