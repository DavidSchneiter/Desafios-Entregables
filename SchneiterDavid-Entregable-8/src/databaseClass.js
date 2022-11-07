class Contenedor {
  constructor(options, tableName, p1, p2, p3) {
    this.knex = require("knex")(options);
    this.tableName = tableName;
    this.knex.schema
      .createTable(`${tableName}`, (table) => {
        table.increments("id");
        table.string(`${p1}`);
        table.string(`${p2}`);
        table.string(`${p3}`);
      })
      .then(() => console.log("table created"))
      .catch((err) => console.log(err));
  }

  save(data) {
    return this.knex(`${this.tableName}`)
      .insert(data)
      .then(() => console.log("data inserted"))
      .catch((err) => console.log(err));
  }

  getAll() {
    return this.knex
      .from(`${this.tableName}`)
      .select()
      .then((data) => {
        return data;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Contenedor;
