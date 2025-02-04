import { render, screen } from "@testing-library/react";
import { Category, Product } from "../../src/entities";
import EditProductPage from "../../src/pages/admin/EditProductPage";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { mockAuthState, navigateTo } from "../utils";

describe("EditProductPage", () => {
  let category: Category;
  let product: Product;

  beforeAll(() => {
    category = db.category.create();
    product = db.product.create({ categoryId: category.id });
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  const renderComponent = () => {
    mockAuthState({
      isAuthenticated: true,
      isLoading: false,
      user: undefined,
    });

    navigateTo("/admin/products/" + product.id + "/edit");

    return {
      waitForFormToLoad: async () => await screen.findByRole("form"),
      getInputs: async () => {
        return {
          nameInput: await screen.findByPlaceholderText(/name/i),
          priceInput: await screen.findByPlaceholderText(/price/i),
          categoryInput: await screen.findByRole("combobox", {
            name: category.name,
          }),
        };
      },
      getSubmitButton: () => screen.getByRole("button", { name: /submit/i }),
    };
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad, getInputs } = renderComponent();

    // await screen.findByRole("form");
    // await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    await waitForFormToLoad();
    const { nameInput, priceInput, categoryInput } = await getInputs();

    expect(nameInput).toHaveTextContent(product.name);
    expect(priceInput).toHaveTextContent(product.price.toString());
    expect(categoryInput).toBeInTheDocument();
  });

  // it("should populate form fields when editing a product", async () => {
  //   const product: Product = {
  //     id: 1,
  //     name: "MyProduct",
  //     price: 10,
  //     categoryId: category.id,
  //   };

  //   const { waitForFormToLoad, getInputs } = renderComponent(product);

  //   await waitForFormToLoad();
  //   const inputs = await getInputs();

  //   expect(inputs.nameInput).toHaveValue(product.name);
  //   expect(inputs.priceInput).toHaveValue(product.price.toString());
  //   expect(inputs.categoryInput).toHaveTextContent(category.name);
  // });

  // it("should focus on the Name field when page loads", async () => {
  //   const { waitForFormToLoad, getInputs } = renderComponent();

  //   await waitForFormToLoad();
  //   const { nameInput } = await getInputs();

  //   expect(nameInput).toHaveFocus();
  // });

  // it("should display an error if name is missing", async () => {
  //   const { waitForFormToLoad, getInputs, getSubmitButton } = renderComponent();

  //   await waitForFormToLoad();
  //   const form = await getInputs();
  //   const submit = getSubmitButton();

  //   const user = userEvent.setup();
  //   await user.type(form.priceInput, "10");
  //   await user.click(form.categoryInput);
  //   const options = screen.getAllByRole("option");
  //   await user.click(options[0]);
  //   await user.click(submit);

  //   const error = screen.getByRole("alert");
  //   expect(error).toBeInTheDocument();
  //   expect(error).toHaveTextContent(/required/i);
  // });

  // end describe
});
