import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import { Product } from "../../src/entities";
import { db } from "../mocks/db";
import { navigateTo, simulateDelay } from "../utils";

describe("ProductDetailPage", () => {
  let product: Product;

  beforeAll(() => {
    product = db.product.create();
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  it("should render a loading message when page is loading", async () => {
    simulateDelay("/products");

    navigateTo("/products/" + product.id);

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  // non-numeric value is used as the route parameter
  it("should render an error message if fetching a product fails", async () => {
    navigateTo("/products/" + "hello");

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    // screen.debug();
    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it("should render a product not found message", async () => {
    navigateTo("/products/" + 999);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    // screen.debug();
    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it("should render a product name and price when product found", async () => {
    navigateTo("/products/" + product.id);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    expect(
      screen.getByRole("heading", { name: product.name })
    ).toBeInTheDocument();
    expect(screen.getByText("$" + product.price)).toBeInTheDocument();
  });

  // end describe
});
