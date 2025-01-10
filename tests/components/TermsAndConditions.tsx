import { render, screen } from "@testing-library/react";
import TermsAndConditions from "../../src/components/TermsAndConditions";
import userEvent from "@testing-library/user-event";

describe("TermsAndConditions", () => {
  const renderComponent = () => {
    render(<TermsAndConditions />);

    return {
      heading: screen.getByRole("heading"),
      checkbox: screen.getByRole("checkbox"),
      button: screen.getByRole("button"),
    };
  };

  it("should render with correct text and state", () => {
    const { heading, checkbox, button } = renderComponent();

    // expect(heading).toBeInTheDocument(); not needed with getByRole
    expect(heading).toHaveTextContent("Terms & Conditions");
    expect(checkbox).not.toBeChecked();
    expect(button).toBeDisabled();
  });

  it("should enable the button when checkbox is checked", async () => {
    // arrange
    const { checkbox, button } = renderComponent();

    // act
    // returns object
    const user = userEvent.setup();
    await user.click(checkbox);

    // assert
    expect(button).toBeEnabled();
  });
});
