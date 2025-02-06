import { render, screen } from "@testing-library/react";
import { Category, Product } from "../../src/entities";
import { db } from "../mocks/db";
import { mockAuthState, navigateTo } from "../utils";
import userEvent from "@testing-library/user-event";

describe("EditProductPage", () => {
  let category: Category;
  let product: Product;

  beforeAll(() => {
    category = db.category.create();
    product = db.product.create({ price: 10, categoryId: category.id });
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  const renderComponent = () => {
    // type FormData = {
    //   // iterate over keys of Product type
    //   [K in keyof Product]: any;
    // };

    // const validData: FormData = {
    //   id: 1,
    //   name: "myProduct",
    //   price: 10,
    //   categoryId: category.id,
    // };

    mockAuthState({
      isAuthenticated: true,
      isLoading: false,
      user: { name: "Harry" },
    });

    navigateTo("/admin/products/" + product.id + "/edit");

    // render(<EditProductPage />, { wrapper: AllProviders });

    const nameInput = () => screen.findByPlaceholderText(/name/i);
    const priceInput = () => screen.findByPlaceholderText(/price/i);
    const categoryInput = () =>
      screen.getByRole("combobox", { name: /category/i });
    const submitButton = () => screen.getByRole("button", { name: /submit/i });

    const fill = async (product: Product) => {
      const user = userEvent.setup();

      if (product.name !== undefined)
        await user.type(await nameInput(), product.name);

      if (product.price !== undefined)
        await user.type(await priceInput(), product.price.toString());

      // for console error of act(), Radix UI select component issue
      await user.tab();

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
          // validData,
        };
      },
    };
    // end renderComponent
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad, getInputs } = renderComponent();

    await waitForFormToLoad();
    const { nameInput, priceInput, categoryInput } = getInputs();

    expect(await nameInput()).toBeInTheDocument();
    expect(await priceInput()).toBeInTheDocument();
    expect(categoryInput()).toBeInTheDocument();
  });

  it("should populate form fields when editing a product", async () => {
    const { waitForFormToLoad, getInputs } = renderComponent();

    await waitForFormToLoad();
    const form = getInputs();

    expect(await form.nameInput()).toHaveValue(product.name);
    expect(await form.priceInput()).toHaveValue(product.price.toString());
    expect(form.categoryInput()).toHaveTextContent(category.name);
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
    {
      scenario: "an empty space",
      name: " ",
      errorMessage: /required/i,
    },
  ])(
    "should display an error if Name is $scenario",
    async ({ name, errorMessage }) => {
      const { waitForFormToLoad, getInputs, expectErrorToBeInTheDocument } =
        renderComponent();

      await waitForFormToLoad();
      const form = getInputs();
      await form.fill({ ...product, name: name! });

      // console.log(product);
      // screen.debug();
      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  // it.each([
  //   {
  //     scenario: "missing",
  //     errorMessage: /required/i,
  //   },
  //   {
  //     scenario: "0",
  //     price: "0",
  //     errorMessage: /1/i,
  //   },
  //   {
  //     scenario: "negative",
  //     price: "-1",
  //     errorMessage: /1/i,
  //   },
  //   {
  //     scenario: "greater than 1000",
  //     price: "1001",
  //     errorMessage: /1000/i,
  //   },
  //   {
  //     scenario: "not a number",
  //     price: "a",
  //     errorMessage: /required/i,
  //   },
  // ])(
  //   "should display an error if Price is $scenario",
  //   async ({ price, errorMessage }) => {
  //     const { waitForFormToLoad, getInputs, expectErrorToBeInTheDocument } =
  //       renderComponent();

  //     await waitForFormToLoad();
  //     const form = getInputs();

  //     await form.fill({ ...form.validData, price });

  //     expectErrorToBeInTheDocument(errorMessage);
  //   }
  // );

  // it.each([
  //   {
  //     scenario: "no category selected",
  //     errorMessage: /required/i,
  //   },
  //   {
  //     scenario: "wrong categoryId",
  //     categoryId: 1,
  //     errorMessage: /required/i,
  //   },
  // ])(
  //   "should display an error if Category is $scenario",
  //   async ({ categoryId, errorMessage }) => {
  //     const { waitForFormToLoad, getInputs, expectErrorToBeInTheDocument } =
  //       renderComponent();

  //     await waitForFormToLoad();
  //     const form = getInputs();

  //     const user = userEvent.setup();

  //     await user.type(await form.nameInput(), "a");
  //     await user.type(await form.priceInput(), "1");

  //     // for console error of act(), Radix UI select component issue
  //     await user.tab();

  //     // await user.click(form.categoryInput());
  //     // const options = screen.getAllByRole("option");
  //     // await user.click();
  //     await user.click(form.submitButton());

  //     expectErrorToBeInTheDocument(errorMessage);

  //     if (categoryId) {
  //       // get combobox
  //       await user.click(form.categoryInput());

  //       expect(screen.queryByText(categoryId)).not.toBeInTheDocument();
  //     }
  //   }
  // );

  // it("should submit form when filled with correct data", async () => {
  //   const { waitForFormToLoad, getInputs, onSubmit } = renderComponent();

  //   await waitForFormToLoad();
  //   const form = getInputs();

  //   await form.fill(form.validData);

  //   const { id, ...formDataNoId } = form.validData;
  //   expect(onSubmit).toHaveBeenCalledWith(formDataNoId);
  // });

  // it("should show a toast with error message when form submission fails", async () => {
  //   const { waitForFormToLoad, getInputs, onSubmit } = renderComponent();
  //   onSubmit.mockRejectedValue({});

  //   await waitForFormToLoad();
  //   const form = getInputs();
  //   await form.fill(form.validData);

  //   const toast = await screen.findByRole("status");
  //   expect(toast).toBeInTheDocument();
  //   expect(toast).toHaveTextContent(/error/i);
  // });

  // it("should disable the submit button upon submission", async () => {
  //   const { waitForFormToLoad, getInputs, onSubmit } = renderComponent();
  //   // unresolved Promise
  //   onSubmit.mockReturnValue(new Promise(() => {}));

  //   await waitForFormToLoad();
  //   const form = getInputs();
  //   await form.fill(form.validData);

  //   expect(form.submitButton()).toBeDisabled();
  // });

  // it("should enable the submit button after submission", async () => {
  //   const { waitForFormToLoad, getInputs, onSubmit } = renderComponent();

  //   onSubmit.mockResolvedValue({});

  //   await waitForFormToLoad();
  //   const form = getInputs();
  //   await form.fill(form.validData);

  //   expect(form.submitButton()).not.toBeDisabled();
  // });

  // it("should enable the submit button if submission fails", async () => {
  //   const { waitForFormToLoad, getInputs, onSubmit } = renderComponent();

  //   onSubmit.mockRejectedValue("error");

  //   await waitForFormToLoad();
  //   const form = getInputs();
  //   await form.fill(form.validData);

  //   expect(form.submitButton()).not.toBeDisabled();
  // });

  // it("should reset the form after submission", async () => {
  //   const { waitForFormToLoad, getInputs } = renderComponent();

  //   await waitForFormToLoad();
  //   const form = getInputs();
  //   await form.fill(form.validData);

  //   // const comboBox = form.categoryInput();

  //   expect(await form.nameInput()).toBeInTheDocument();
  //   expect(await form.priceInput()).toBeInTheDocument();
  //   expect(screen.getByDisplayValue(category.name)).toBeInTheDocument();
  // });

  // end describe
});
