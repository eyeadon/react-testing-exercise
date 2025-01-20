import { it, expect, describe } from "vitest";
import { db } from "./mocks/db";

describe("Main", () => {
  // const response = await fetch("/categories");
  // const data = await response.json();
  // console.log(data);
  // expect(data).toHaveLength(3);

  it("should create", () => {
    const product = db.product.create({ name: "Apple" });

    console.log(product);
    // console.log(db.product.getAll());
    // console.log(db.product.delete({ where: { id: { equals: product.id } } }));
  });
});
