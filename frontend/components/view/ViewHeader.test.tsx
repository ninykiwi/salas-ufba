import { render, screen } from "@testing-library/react";
import ViewHeader from "./ViewHeader";

describe("ViewHeader", () => {
  it("renderiza o nome do instituto", () => {
    render(<ViewHeader institute="Instituto de Computação" location="Campus Federação" />);
    expect(screen.getByText("Instituto de Computação")).toBeInTheDocument();
  });

  it("renderiza a localização", () => {
    render(<ViewHeader institute="Instituto de Computação" location="Campus Federação" />);
    expect(screen.getByText("Campus Federação")).toBeInTheDocument();
  });
});