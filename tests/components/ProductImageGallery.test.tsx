import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("ProductImageGallery", () => {
  test("should render nothing when imageUrls array is empty", () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  test("should render a list of images", () => {
    const urls = [
      "https://testing-library.com/",
      "https://testing-library.com/docs/",
    ];
    render(<ProductImageGallery imageUrls={urls} />);

    const images = screen.getAllByRole("img");

    expect(images).toHaveLength(2);

    urls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute("src", url);
    });
  });
});
