const fs = require("fs");

class Contenedor {
  constructor(file) {
    this.contain = [];
    this.id = 0;
    this.file = file;
  }

  async save(obj) {
    if (!obj.id) {
      this.id++;
      obj.id = this.id;
    }

    this.contain.push(obj);
    this.contain.sort((a, b) => {
      return a.id - b.id;
    });
    try {
      await fs.promises.writeFile(
        `./${this.file}.txt`,
        JSON.stringify(this.contain, null, 2)
      );
      return `Id asignado al producto ${obj.title}: ${obj.id}`;
    } catch (error) {
      throw new Error("Imposible guardar", error);
    }
  }
  async getById(id) {
    try {
      const data = await fs.promises.readFile(`./${this.file}.txt`, "utf-8");
      return JSON.parse(data).filter((e) => {
        return e.id == parseInt(id);
      });
    } catch (error) {
      throw new Error("Imposible leer archivo", error);
    }
  }
  // async changeById(id, d1, d2, d3) {
  //   try {
  //     const data = await this.getById(id);
  //     return data = {

  //     }
  //   } catch (error) {

  //   }
  // }
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
        return e.id !== parseInt(id);
      });
      this.contain = newData;
      fs.writeFileSync(`./${this.file}.txt`, JSON.stringify(newData, null, 2));
      return newData;
    } catch (error) {
      throw new Error("Imposible leer archivo", error);
    }
  }
}

module.exports = Contenedor;
