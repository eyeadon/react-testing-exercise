import { render, screen } from "@testing-library/react";
import Label from "../../src/components/Label";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";
import AllProviders from "../AllProviders";
import { Language } from "../../src/providers/language/type";

describe("Label", () => {
  const renderComponent = (labelId: string, language: Language) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>,
      {
        wrapper: AllProviders,
      }
    );
  };

  describe("Current language is EN", () => {
    it.each([
      { labelId: "welcome", text: "Welcome" },
      { labelId: "new_product", text: "New Product" },
      { labelId: "edit_product", text: "Edit Product" },
    ])("should render $text for $labelId", ({ labelId, text }) => {
      renderComponent(labelId, "en");

      expect(screen.getByText(text)).toBeInTheDocument();
    });
    // end describe
  });

  describe("Current language is ES", () => {
    it.each([
      { labelId: "welcome", text: "Bienvenidos" },
      { labelId: "new_product", text: "Nuevo Producto" },
      { labelId: "edit_product", text: "Editar Producto" },
    ])("should render $text for $labelId", ({ labelId, text }) => {
      renderComponent(labelId, "es");

      expect(screen.getByText(text)).toBeInTheDocument();
    });
    // end describe
  });

  it("should throw an error if given an invalid labelId", () => {
    // renderComponent call needs to be inside expect call or it will
    // always throw an error
    // catch error inside expect
    expect(() => renderComponent("!", "en")).toThrowError();
  });

  // end describe
});
