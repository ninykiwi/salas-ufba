import { render, screen } from "@testing-library/react";
import Sidebar from "./Sidebar";

describe("Sidebar", () => {
  it("renderiza os itens de navegação", () => {
    render(<Sidebar />);
    expect(screen.getByText("Ocupação em Tempo Real")).toBeInTheDocument();
    expect(screen.getByText("Agenda Completa")).toBeInTheDocument();
    expect(screen.getByText("Mapa do Campus")).toBeInTheDocument();
  });

  it("renderiza o botão de login", () => {
    render(<Sidebar />);
    expect(screen.getByText("LOGIN")).toBeInTheDocument();
  });

  it("aplica estilo ativo no item correspondente ao activeHref", () => {
    render(<Sidebar activeHref="/agenda" />);
    const agendaLink = screen.getByText("Agenda Completa").closest("a");
    expect(agendaLink).toHaveClass("bg-indigo-50");
  });
});