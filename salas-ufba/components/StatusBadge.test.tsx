import { render, screen } from "@testing-library/react";
import StatusBadge from "./StatusBradge";

describe("StatusBadge", () => {
  it("renderiza label OCUPADA", () => {
    render(<StatusBadge status="OCUPADA" />);
    expect(screen.getByText("OCUPADA")).toBeInTheDocument();
  });

  it("renderiza label LIVRE", () => {
    render(<StatusBadge status="LIVRE" />);
    expect(screen.getByText("LIVRE")).toBeInTheDocument();
  });

  it("renderiza label EM REUNIÃO", () => {
    render(<StatusBadge status="EM_REUNIAO" />);
    expect(screen.getByText("EM REUNIÃO")).toBeInTheDocument();
  });
});