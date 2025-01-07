import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  it("should render user name when name is provided", () => {
    const user: User = { id: 1, name: "Me" };
    render(<UserAccount user={user} />);

    const name = screen.getByText(user.name);

    expect(name).toBeInTheDocument();
    expect(name).toHaveTextContent(/me/i);
  });

  it("should render edit button when user is an admin", () => {
    const user: User = { id: 1, name: "Me", isAdmin: true };
    render(<UserAccount user={user} />);

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });

  it("should not render edit button when user is not an admin", () => {
    const user: User = { id: 1, name: "Me" };
    render(<UserAccount user={user} />);

    // must use queryByRole
    const button = screen.queryByRole("button");

    expect(button).not.toBeInTheDocument();
  });
});
