import { factory, primaryKey } from "@mswjs/data";
import { faker } from "@faker-js/faker";

// key -> models, values -> model definitions (needs getter function)
export const db = factory({
  product: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.productName,
    price: () => faker.number.int({ min: 1, max: 100 }),
  },
});
