import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ReduxProvider from "../../src/providers/ReduxProvider";
import CategoryList from "../../src/components/CategoryList";
import { db } from "../mocks/db";
import { Category } from "../../src/entities";
import { delay, http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { simulateDelay, simulateError } from "../utils";

describe("CategoryList", () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const category = db.category.create();
      categories.push(category);
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });
  });

  const renderComponent = () => {
    render(
      <ReduxProvider>
        <CategoryList />
      </ReduxProvider>
    );
  };

  it("should render a list of categories", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    categories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it("should render a loading message when fetching categories", async () => {
    simulateDelay("/categories");

    renderComponent();

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
    // expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render an error message if fetching categories fails", async () => {
    simulateError("/categories");

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  // end describe
});
