import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
  const renderSearchBox = () => {
    const mockFunc = vi.fn().mockReturnValue("processed");
    render(<SearchBox onChange={mockFunc} />);
    return {
      input: screen.getByPlaceholderText(/search/i),
      onChange: mockFunc,
      user: userEvent.setup(),
    };
  };

  it("should render an input field for searching", () => {
    const { input } = renderSearchBox();

    expect(input).toBeInTheDocument();
  });

  it("should call onChange when Enter is pressed", async () => {
    const { input, onChange, user } = renderSearchBox();

    const searchText = "mysearchtext";
    await user.type(input, searchText + "{enter}");

    expect(onChange).toHaveBeenCalledWith(searchText);
  });

  it("should not call onChange when input field is empty", async () => {
    const { input, onChange, user } = renderSearchBox();

    await user.type(input, "{enter}");

    expect(onChange).not.toHaveBeenCalled();
  });
});
