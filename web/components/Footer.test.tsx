import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("renderiza o texto de copyright", () => {
    render(<Footer />);
    expect(
      screen.getByText(/© 2026 Salas UFBA 2\.0/i)
    ).toBeInTheDocument();
  });

  it("renderiza o nome da universidade", () => {
    render(<Footer />);
    expect(screen.getByText("UNIVERSIDADE FEDERAL DA BAHIA")).toBeInTheDocument();
  });
});