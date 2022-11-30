const { faker } = require("@faker-js/faker");

const createFakeProduct = () => {
  return {
    id: faker.datatype.uuid(),
    title: faker.name.jobTitle(),
    price: faker.datatype.number(),
    thumbnail: faker.image.image(),
  };
};

module.exports = createFakeProduct;
