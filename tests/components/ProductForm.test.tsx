import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";
import { Category, Product } from "../../src/entities";
import { db } from "../mocks/db";
import userEvent from "@testing-library/user-event";

describe("ProductForm", () => {
  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  const renderComponent = (product?: Product) => {
    render(<ProductForm product={product} onSubmit={vi.fn()} />, {
      wrapper: AllProviders,
    });

    const nameInput = () => screen.findByPlaceholderText(/name/i);
    const priceInput = () => screen.findByPlaceholderText(/price/i);
    const categoryInput = () =>
      screen.getByRole("combobox", { name: /category/i });
    const submitButton = () => screen.getByRole("button");

    type FormData = {
      // iterate over keys of Product type
      [K in keyof Product]: any;
    };

    const validData: FormData = {
      id: 1,
      name: "a",
      price: 1,
      categoryId: 1,
    };

    const fill = async (product: FormData) => {
      const user = userEvent.setup();

      if (product.name !== undefined)
        await user.type(await nameInput(), product.name);

      if (product.price !== undefined)
        await user.type(await priceInput(), product.price.toString());

      await user.click(categoryInput());
      const options = screen.getAllByRole("option");
      await user.click(options[0]);
      await user.click(submitButton());
    };

    return {
      expectErrorToBeInTheDocument: (errorMessage: RegExp) => {
        const error = screen.getByRole("alert");
        expect(error).toBeInTheDocument();
        expect(error).toHaveTextContent(errorMessage);
      },
      waitForFormToLoad: () => screen.findByRole("form"),
      getInputs: () => {
        return {
          nameInput,
          priceInput,
          categoryInput,
          submitButton,
          fill,
          validData,
        };
      },
    };
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad, getInputs } = renderComponent();

    // await screen.findByRole("form");
    // await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    await waitForFormToLoad();
    const { nameInput, priceInput, categoryInput } = getInputs();

    expect(await nameInput()).toBeInTheDocument();
    expect(await priceInput()).toBeInTheDocument();
    expect(categoryInput()).toBeInTheDocument();
  });

  it("should populate form fields when editing a product", async () => {
    const product: Product = {
      id: 1,
      name: "Bread",
      price: 10,
      categoryId: category.id,
    };

    const { waitForFormToLoad, getInputs } = renderComponent(product);

    await waitForFormToLoad();
    const inputs = getInputs();

    expect(await inputs.nameInput()).toHaveValue(product.name);
    expect(await inputs.priceInput()).toHaveValue(product.price.toString());
    expect(inputs.categoryInput()).toHaveTextContent(category.name);
  });

  it("should focus on the Name field when page loads", async () => {
    const { waitForFormToLoad, getInputs } = renderComponent();

    await waitForFormToLoad();
    const { nameInput } = getInputs();

    expect(await nameInput()).toHaveFocus();
  });

  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "longer than 255 characters",
      name: "a".repeat(256),
      errorMessage: /255/i,
    },
  ])(
    "should display an error if Name is $scenario",
    async ({ name, errorMessage }) => {
      const { waitForFormToLoad, getInputs, expectErrorToBeInTheDocument } =
        renderComponent();

      await waitForFormToLoad();
      const form = getInputs();
      await form.fill({ ...form.validData, name });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "0",
      price: "0",
      errorMessage: /1/i,
    },
    {
      scenario: "negative",
      price: "-1",
      errorMessage: /1/i,
    },
    {
      scenario: "greater than 1000",
      price: "1001",
      errorMessage: /1000/i,
    },
    {
      scenario: "not a number",
      price: "a",
      errorMessage: /required/i,
    },
  ])(
    "should display an error if Price is $scenario",
    async ({ price, errorMessage }) => {
      const { waitForFormToLoad, getInputs, expectErrorToBeInTheDocument } =
        renderComponent();

      await waitForFormToLoad();
      const form = getInputs();

      await form.fill({ ...form.validData, price });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  // end describe
});
