import { render, screen } from "@testing-library/react";
import AuthStatus from "../../src/components/AuthStatus";
import { mockAuthState } from "../utils";

describe("AuthStatus", () => {
  const renderComponent = () => {
    render(<AuthStatus />);
  };

  it("should render a loading message while fetching auth status", () => {
    mockAuthState({
      isAuthenticated: false,
      isLoading: true,
      user: undefined,
    });

    renderComponent();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render a login button if the user is not authenticated", () => {
    mockAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
    });

    renderComponent();

    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log out/i })
    ).not.toBeInTheDocument();
  });

  it("should render the user name if user is authenticated", () => {
    const authState = {
      isAuthenticated: true,
      isLoading: false,
      user: { name: "Harry" },
    };

    mockAuthState(authState);

    renderComponent();

    expect(screen.getByText(/harry/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /log out/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log in/i })
    ).not.toBeInTheDocument();
  });

  // end describe
});
