import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { products } from "../mocks/data";
import { db } from "../mocks/db";

describe("ProductDetail", () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it("should render the product details", async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    render(<ProductDetail productId={productId} />);

    const item = await screen.findByText(new RegExp(product!.name));
    expect(item).toBeInTheDocument();
    const price = await screen.findByText(
      new RegExp(product!.price.toString())
    );
    expect(price).toBeInTheDocument();
  });

  it("should render message if no product found", async () => {
    server.use(http.get("/products/1", () => HttpResponse.json(null)));

    render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/not found/i);
    expect(message).toBeInTheDocument();
  });

  it("should render an error for invalid productId", async () => {
    render(<ProductDetail productId={0} />);

    const message = await screen.findByText(/invalid/i);
    expect(message).toBeInTheDocument();
  });
});
