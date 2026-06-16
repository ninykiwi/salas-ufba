import { render, screen } from "@testing-library/react";
import ViewFooter from "./ViewFooter";

const defaultProps = {
  currentPage: 0,
  totalPages: 3,
  startRoom: 101,
  endRoom: 208,
  totalRooms: 420,
  onNext: vi.fn(),
};

describe("ViewFooter", () => {
  it("renderiza o texto de exibição de salas", () => {
    render(<ViewFooter {...defaultProps} />);
    expect(screen.getByText("Exibindo Salas 101 - 208 de 420")).toBeInTheDocument();
  });

  it("renderiza o countdown inicial em 15s", () => {
    render(<ViewFooter {...defaultProps} />);
    expect(screen.getByText(/Próxima Atualização em 15s/i)).toBeInTheDocument();
  });

  it("renderiza os dots de paginação", () => {
    render(<ViewFooter {...defaultProps} />);
    const dots = document.querySelectorAll(".rounded-full.w-2\\.5");
    expect(dots).toHaveLength(3);
  });

  it("marca o dot da página atual como azul", () => {
    render(<ViewFooter {...defaultProps} />);
    const dots = document.querySelectorAll(".rounded-full.w-2\\.5");
    expect(dots[0]).toHaveClass("bg-blue-600");
    expect(dots[1]).toHaveClass("bg-gray-300");
  });
});