function random(cant) {
  let numeros = [];
  for (let i = 0; i < cant; i++) {
    numeros.push(Math.floor(Math.random() * 1000 + 1));
  }
  const specimens = numeros.filter((number, i) =>
    i == 0 ? true : numeros[i - 1] != number
  );
  const listado = specimens.map((spec) => {
    return { number: spec, count: 0 };
  });

  listado.map((count, i) => {
    const actualSpecLength = numeros.filter(
      (number) => number === count.number
    ).length;
    count.count = actualSpecLength;
  });
  return listado;
}

module.exports = random;
