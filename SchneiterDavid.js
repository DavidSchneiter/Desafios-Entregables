class Usuario {
  constructor(name, lastname, books = [], pets = []) {
    (this.name = name),
      (this.lastname = lastname),
      (this.books = books),
      (this.pets = pets);
  }

  getFullName() {
    return `${this.lastname} ${this.name}`;
  }

  addMascotas(pet) {
    this.pets.push(pet);
  }

  countMascotas() {
    return this.pets.length;
  }

  addBook(Title, Author) {
    this.books.push({ Title, Author });
  }

  getBookNames() {
    return this.books.map(({ Title }) => {
      return Title;
    });
  }
}

const usuario = new Usuario(
  "David",
  "Schneiter",
  [
    {
      Title: "Martin Fierro",
      Author: "José Hernández",
    },
    {
      Title: "El señor de los anillos",
      Author: "J. R. R. Tolkien",
    },
  ],
  ["Noha", "Vaquita"]
);

console.log(usuario.getFullName());
console.log(usuario.countMascotas());
usuario.addMascotas("Loro");
console.log(usuario.countMascotas());
console.log(usuario.getBookNames());
usuario.addBook("Cantar del Mio Cid", "Per Abbat");
console.log(usuario.getBookNames());
console.log(usuario.books);
