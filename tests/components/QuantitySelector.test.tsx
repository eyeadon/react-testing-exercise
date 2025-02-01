import { render, screen, within } from "@testing-library/react";
import QuantitySelector from "../../src/components/QuantitySelector";
import { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { CartProvider } from "../../src/providers/CartProvider";
import userEvent from "@testing-library/user-event";
import { db } from "../mocks/db";

describe("QuantitySelector", () => {
  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: "testProduct",
      price: 10,
      categoryId: category.id,
    };

    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>,
      {
        wrapper: AllProviders,
      }
    );

    const user = userEvent.setup();

    const getAddToCartButton = () =>
      screen.queryByRole("button", { name: /add to cart/i });

    const getQuantityControls = () => ({
      quantity: screen.queryByRole("status"),
      decrementButton: screen.queryByRole("button", { name: "-" }),
      incrementButton: screen.queryByRole("button", { name: "+" }),
    });

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

  it("myTest should show quantity selector when Add to Cart is clicked", async () => {
    renderComponent();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(await screen.findByRole("spinbutton")).toBeInTheDocument();
    expect(await screen.findByRole("status")).toBeInTheDocument();
  });

  it("myTest should show adjust quantity by button presses", async () => {
    renderComponent();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    const spinbutton = await screen.findByRole("spinbutton");
    const plusSign = within(spinbutton).getByRole("button", { name: "+" });
    const minusSign = within(spinbutton).getByRole("button", { name: "-" });
    await user.click(spinbutton);
    await user.click(plusSign);

    expect(spinbutton).toBeInTheDocument();
    expect(plusSign).toBeInTheDocument();
    expect(minusSign).toBeInTheDocument();
    expect(await screen.findByRole("status")).toHaveTextContent(/2/i);
  });

  it("should render the Add to Cart button", () => {
    const { getAddToCartButton } = renderComponent();
    expect(getAddToCartButton()).toBeInTheDocument();
  });

  it("should add the product to the cart", async () => {
    const { getQuantityControls, addToCart } = renderComponent();

    const firstRenderedAddToCartButton = await addToCart();

    const { quantity, decrementButton, incrementButton } =
      getQuantityControls();
    expect(quantity).toHaveTextContent("1");
    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();

    expect(firstRenderedAddToCartButton).not.toBeInTheDocument();
  });

  it("should increment the quantity", async () => {
    const { getQuantityControls, addToCart, incrementQuantity } =
      renderComponent();
    await addToCart();

    await incrementQuantity();

    const { quantity } = getQuantityControls();
    expect(quantity).toHaveTextContent("2");
  });

  it("should decrement the quantity", async () => {
    const {
      getQuantityControls,
      addToCart,
      incrementQuantity,
      decrementQuantity,
    } = renderComponent();
    await addToCart();
    await incrementQuantity();

    await decrementQuantity();

    const { quantity } = getQuantityControls();
    expect(quantity).toHaveTextContent("1");
  });

  it("should remove the product from the cart", async () => {
    const {
      getAddToCartButton,
      getQuantityControls,
      addToCart,
      decrementQuantity,
    } = renderComponent();

    // firstRenderedAddToCartButton
    await addToCart();

    await decrementQuantity();

    const { quantity, decrementButton, incrementButton } =
      getQuantityControls();
    expect(quantity).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();

    // screen.debug();
    const secondRenderedAddToCartButton = getAddToCartButton();
    expect(secondRenderedAddToCartButton).toBeInTheDocument();
  });

  // end describe
});
