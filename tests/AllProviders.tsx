import { Theme } from "@radix-ui/themes";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CartProvider } from "../src/providers/CartProvider";
import AuthProvider from "../src/providers/AuthProvider";
import { LanguageProvider } from "../src/providers/language/LanguageProvider";
import { BrowserRouter, createBrowserRouter } from "react-router-dom";
import routes from "../src/routes";

const AllProviders = ({ children }: PropsWithChildren) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const router = createBrowserRouter(routes);

  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={client}>
          <CartProvider>
            <LanguageProvider language="en">
              <Theme>{children}</Theme>
            </LanguageProvider>
          </CartProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AllProviders;
