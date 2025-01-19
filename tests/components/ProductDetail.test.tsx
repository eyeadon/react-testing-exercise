import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { products } from "../mocks/data";

describe("ProductDetail", () => {
  it("should render the product", async () => {
    render(<ProductDetail productId={1} />);

    const item = await screen.findByText(new RegExp(products[0].name));
    expect(item).toBeInTheDocument();
    const price = await screen.findByText(
      new RegExp(products[0].price.toString())
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
