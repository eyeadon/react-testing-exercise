import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { Theme } from "@radix-ui/themes";
import { db } from "../mocks/db";
import { Category, Product } from "../../src/entities";

describe("BrowseProductsPage", () => {
  const categories: Category[] = [
    {
      id: 1,
      name: "All",
    },
    {
      id: 2,
      name: "Electronics",
    },
    {
      id: 1,
      name: "Appliances",
    },
    {
      id: 1,
      name: "Accessories",
    },
  ];

  const products: Product[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      products.push(product);
    });
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: {} } });
  });

  const renderComponent = () => {
    render(
      <Theme>
        <BrowseProducts />
      </Theme>
    );
  };

  it("should render a loading skeleton when fetching categories", () => {
    server.use(
      http.get("/categories", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    expect(
      screen.getByRole("progressbar", { name: /categories/i })
    ).toBeInTheDocument();
  });

  it("should remove the loading skeleton after categories are fetched", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );

    expect(
      screen.queryByRole("progressbar", { name: /categories/i })
    ).not.toBeInTheDocument();
  });

  it("should render a loading skeleton when fetching products", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    expect(
      screen.getByRole("progressbar", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should remove the skeleton after products are fetched", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /products/i })
    );

    expect(
      screen.queryByRole("progressbar", { name: /products/i })
    ).not.toBeInTheDocument();
  });

  it("should not show an error message if fetching categories fails", async () => {
    server.use(http.get("/categories", () => HttpResponse.error()));

    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: /category/i })
    ).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render the list of categories in combobox", async () => {
    const product = db.product.findMany({
      where: { name: { equals: products.name } },
    });

    renderComponent();

    const items = await screen.findAllByRole("combobox");
    expect(items.length).toBeGreaterThan(0);
    expect(
      screen.queryByRole("combobox", { name: /category/i })
    ).toBeInTheDocument();
  });
});
