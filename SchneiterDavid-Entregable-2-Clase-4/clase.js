const fs = require("fs");

class Contenedor {
  constructor(file) {
    this.contain = [];
    this.id = 0;
    this.file = file;
  }

  async save(obj) {
    this.id++;
    obj.id = this.id;
    this.contain.push(obj);
    try {
      await fs.promises.writeFile(
        `./${this.file}.txt`,
        JSON.stringify(this.contain, null, 2)
      );
      return `Id asignado al prdoucto ${obj.title}: ${this.id}`;
    } catch (error) {
      throw new Error("Imposible guardar", error);
    }
  }

  async getById(id) {
    try {
      const data = await fs.promises.readFile(`./${this.file}.txt`, "utf-8");
      return JSON.parse(data).filter((e) => {
        return e.id == id;
      });
    } catch (error) {
      throw new Error("Imposible leer archivo", error);
    }
  }
  async getAll() {
    try {
      const data = await fs.promises.readFile(`./${this.file}.txt`, "utf-8");
      if (!data) return "Archivo vacio";
      return JSON.parse(data);
    } catch (error) {
      throw new Error("Imposible leer archivo", error);
    }
  }
  async deleteById(id) {
    try {
      const data = await fs.promises.readFile(`./${this.file}.txt`, "utf-8");
      const newData = JSON.parse(data).filter((e) => {
        return e.id !== id;
      });
      fs.writeFileSync(`./${this.file}.txt`, JSON.stringify(newData, null, 2));
    } catch (error) {
      throw new Error("Imposible leer archivo", error);
    }
  }
  async deleteAll() {
    try {
      await fs.promises.writeFile(`./${this.file}.txt`, "");
    } catch (error) {
      throw new Error("Imposible guardar", error);
    }
  }
}

const objeto = {
  title: "Coca Cola",
  price: 300,
  thumbnail:
    "https://http2.mlstatic.com/D_NQ_NP_854112-MLA47134564539_082021-O.webp",
};
const objeto2 = {
  title: "Papas Lays",
  price: 200,
  thumbnail:
    "https://http2.mlstatic.com/D_NQ_NP_854112-MLA47134564539_082021-O.webp",
};
const objeto3 = {
  title: "Don Satur Dulces",
  price: 160,
  thumbnail:
    "https://http2.mlstatic.com/D_NQ_NP_854112-MLA47134564539_082021-O.webp",
};

const container = new Contenedor("productos");
const logs = async () => {
  console.log(await container.save(objeto));
  console.log(await container.save(objeto2));
  console.log(await container.save(objeto3));
  console.log(await container.getById(1));
  console.log(await container.getAll());
  await container.deleteById(2);
  console.log(await container.getAll());
  await container.deleteAll();
  console.log(await container.getAll());
};
logs();
