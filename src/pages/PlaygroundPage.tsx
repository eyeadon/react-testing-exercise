import { Theme } from "@radix-ui/themes";
import BrowseProducts from "./BrowseProductsPage";
import { CartProvider } from "../providers/CartProvider";

const PlaygroundPage = () => {
  return (
    <CartProvider>
      <Theme>
        <BrowseProducts />
      </Theme>
    </CartProvider>
  );
};

export default PlaygroundPage;
