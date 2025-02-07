import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import AllProviders from "../AllProviders";
import { db, getProductsByCategory } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";
import NavBar from "../../src/components/NavBar";

const renderComponent = () => {
  render(<BrowseProducts />, { wrapper: AllProviders });

  const getCategoriesSkeleton = () =>
    screen.queryByRole("progressbar", { name: /categories/i });

  const getProductsSkeleton = () =>
    screen.queryByRole("progressbar", { name: /products/i });

  const getCategoriesComboBox = () => screen.queryByRole("combobox");

  const selectCategory = async (name: RegExp | string) => {
    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = getCategoriesComboBox();
    const user = userEvent.setup();
    await user.click(combobox!);

    const option = screen.getByRole("option", {
      name: name,
    });
    await user.click(option!);
  };

  const expectProductsToBeInTheDocument = (products: Product[]) => {
    const rows = screen.getAllByRole("row");
    // remove header row from rows
    const dataRows = rows.slice(1);
    expect(dataRows).toHaveLength(products.length);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  };

  return {
    getCategoriesSkeleton,
    getProductsSkeleton,
    getCategoriesComboBox,
    selectCategory,
    expectProductsToBeInTheDocument,
  };
};

const getCartControls = () => {
  const user = userEvent.setup();

  const getQuantityControls = () => ({
    quantity: within(screen.getByRole("spinbutton")).queryByRole("status"),
    decrementButton: screen.queryByRole("button", { name: "-" }),
    incrementButton: screen.queryByRole("button", { name: "+" }),
  });

  const getAddToCartButton = () => {
    const rows = screen.getAllByRole("row");
    // remove header row from rows
    const dataRows = rows.slice(1);
    const firstCartButton = within(dataRows[0]).queryByRole("button", {
      name: /add to cart/i,
    });
    // console.log(firstCartButton);
    return firstCartButton;
  };

  const addToCart = async () => {
    const button = getAddToCartButton();
    await user.click(button!);
    return button;
  };

  const incrementQuantity = async () => {
    const { incrementButton } = getQuantityControls();
    await user.click(incrementButton!);
  };

  const decrementQuantity = async () => {
    const { decrementButton } = getQuantityControls();
    await user.click(decrementButton!);
  };

  return {
    getAddToCartButton,
    getQuantityControls,
    addToCart,
    incrementQuantity,
    decrementQuantity,
  };
};

describe("BrowseProductsPage", () => {
  const categories: Category[] = [];

  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category = db.category.create({ name: "Category" + item });
      categories.push(category);
      [1, 2].forEach(() => {
        const product = db.product.create({ categoryId: category.id });
        products.push(product);
      });
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });

    const productIds = products.map((p) => p.id);
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  it("should render a loading skeleton when fetching categories", () => {
    simulateDelay("/categories");
    const { getCategoriesSkeleton } = renderComponent();

    expect(getCategoriesSkeleton()).toBeInTheDocument();
  });

  it("should remove the loading skeleton after categories are fetched", async () => {
    const { getCategoriesSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    expect(getCategoriesSkeleton()).not.toBeInTheDocument();
  });

  it("should render a loading skeleton when fetching products", async () => {
    simulateDelay("/products");
    const { getProductsSkeleton } = renderComponent();

    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  it("should remove the loading skeleton after products are fetched", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    expect(getProductsSkeleton()).not.toBeInTheDocument();
  });

  it("should not show an error message if categories cannot be fetched", async () => {
    simulateError("/categories");
    const { getCategoriesSkeleton, getCategoriesComboBox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    // expect(
    //   screen.queryByRole("combobox", { name: /category/i })
    // ).not.toBeInTheDocument();
    expect(getCategoriesComboBox()).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    simulateError("/products");
    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render the list of categories in combobox", async () => {
    const { getCategoriesSkeleton, getCategoriesComboBox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = getCategoriesComboBox();
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox!);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();

    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it("should filter products by category", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    const selectedCategory = categories[0];
    await selectCategory(selectedCategory.name);

    const products = getProductsByCategory(selectedCategory.id);
    expectProductsToBeInTheDocument(products);
  });

  it("should render all products if All category is selected", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    await selectCategory(/all/i);

    const products = db.product.getAll();
    expectProductsToBeInTheDocument(products);
  });

  it("should update the cart count when product is added to cart", async () => {
    render(
      <>
        <NavBar />
        <BrowseProducts />
      </>,
      { wrapper: AllProviders }
    );

    const getProductsSkeleton = () =>
      screen.queryByRole("progressbar", { name: /products/i });
    await waitForElementToBeRemoved(getProductsSkeleton);

    const { addToCart, incrementQuantity, decrementQuantity } =
      getCartControls();

    await addToCart();

    const navBar = await screen.findByRole("navigation");
    const count = await within(navBar).findByRole("status");

    expect(count).toBeInTheDocument();
    expect(count).toHaveTextContent("1");
  });

  it("should update the cart count when plus button is clicked", async () => {
    render(
      <>
        <NavBar />
        <BrowseProducts />
      </>,
      { wrapper: AllProviders }
    );

    const getProductsSkeleton = () =>
      screen.queryByRole("progressbar", { name: /products/i });
    await waitForElementToBeRemoved(getProductsSkeleton);

    const { addToCart, incrementQuantity } = getCartControls();

    await addToCart();
    await incrementQuantity();

    const navBar = await screen.findByRole("navigation");
    const count = await within(navBar).findByRole("status");

    expect(count).toBeInTheDocument();
    expect(count).toHaveTextContent("2");
  });

  // end describe
});
