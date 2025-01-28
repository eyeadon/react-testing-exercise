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

    return {
      waitForFormToLoad: async () => await screen.findByRole("form"),
      getInputs: async () => {
        return {
          nameInput: await screen.findByPlaceholderText(/name/i),
          priceInput: await screen.findByPlaceholderText(/price/i),
          categoryInput: screen.getByRole("combobox", { name: /category/i }),
        };
      },
      getSubmitButton: () => screen.getByRole("button"),
    };
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad, getInputs } = renderComponent();

    // await screen.findByRole("form");
    // await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    await waitForFormToLoad();
    const { nameInput, priceInput, categoryInput } = await getInputs();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
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
    const inputs = await getInputs();

    expect(inputs.nameInput).toHaveValue(product.name);
    expect(inputs.priceInput).toHaveValue(product.price.toString());
    expect(inputs.categoryInput).toHaveTextContent(category.name);
  });

  it("should focus on the Name field when page loads", async () => {
    const { waitForFormToLoad, getInputs } = renderComponent();

    await waitForFormToLoad();
    const { nameInput } = await getInputs();

    expect(nameInput).toHaveFocus();
  });

  it("should display an error if name is missing", async () => {
    const { waitForFormToLoad, getInputs, getSubmitButton } = renderComponent();

    await waitForFormToLoad();
    const form = await getInputs();
    const submit = getSubmitButton();

    const user = userEvent.setup();
    await user.type(form.priceInput, "10");
    await user.click(form.categoryInput);
    const options = screen.getAllByRole("option");
    await user.click(options[0]);
    await user.click(submit);

    const error = screen.getByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(/required/i);
  });
});
