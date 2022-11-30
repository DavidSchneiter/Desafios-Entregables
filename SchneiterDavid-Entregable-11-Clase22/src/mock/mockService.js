const createFakeProduct = require("../utils/productFaker");

// const Contenedor = require("../clase");

class MockService {
  // container = [];
  // container = new Contenedor("productos-test");
  constructor() {}

  getAll() {
    const newProducts = createFakeProduct();
    return newProducts;
  }
}

module.exports = MockService;
