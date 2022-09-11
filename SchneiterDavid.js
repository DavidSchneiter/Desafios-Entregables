class Usuario {
  constructor(nombre = "", apellido = "", libros = [], mascotas = []) {
    (this.nombre = nombre),
      (this.apellido = apellido),
      (this.libros = libros),
      (this.mascotas = mascotas);
  }

  getFullName() {
    return `${this.apellido} ${this.nombre}`;
  }

  addMascotas(pet) {
    this.mascotas.push(pet);
  }

  countMascotas() {
    return this.mascotas.length;
  }

  addBook(book) {
    if (typeof book == "object") {
      this.libros.push(book);
    }
  }

  getBookNames() {
    return this.libros.map(({ Nombre }) => {
      return Nombre;
    });
  }
}

const usuario = new Usuario(
  "David",
  "Schneiter",
  [
    {
      Nombre: "Martin Fierro",
      Autor: "José Hernández",
    },
    {
      Nombre: "El señor de los anillos",
      Autor: "J. R. R. Tolkien",
    },
  ],
  ["Noha", "Vaquita"]
);

console.log(usuario.getFullName());
console.log(usuario.countMascotas());
usuario.addMascotas("Loro");
console.log(usuario.countMascotas());
console.log(usuario.getBookNames());
usuario.addBook({ Nombre: "Cantar del Mio Cid", Autor: "Per Abbat" });
console.log(usuario.getBookNames());
