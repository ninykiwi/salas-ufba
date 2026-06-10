import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./page";

describe("Home", () => {
  it("renderiza o título da página", () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /ocupação em tempo real/i, level: 1 }));
  });

  it("renderiza os três botões de filtro", () => {
    render(<Home />);
    expect(screen.getByText("TODAS")).toBeInTheDocument();
    expect(screen.getByText("LIVRES")).toBeInTheDocument();
    expect(screen.getByText("OCUPADAS")).toBeInTheDocument();
  });

  it("exibe todas as salas por padrão", () => {
    render(<Home />);
    expect(screen.getByText("SmartClass II")).toBeInTheDocument();
    expect(screen.getByText("Laboratório 1")).toBeInTheDocument();
    expect(screen.getByText("Sala de Reuniões")).toBeInTheDocument();
  });

  it("filtra apenas salas livres ao clicar em LIVRES", async () => {
    render(<Home />);
    await userEvent.click(screen.getByText("LIVRES"));
    expect(screen.getByText("Laboratório 1")).toBeInTheDocument();
    expect(screen.getByText("Auditório")).toBeInTheDocument();
    expect(screen.queryByText("SmartClass II")).not.toBeInTheDocument();
    expect(screen.queryByText("Sala de Reuniões")).not.toBeInTheDocument();
  });

  it("filtra salas ocupadas e em reunião ao clicar em OCUPADAS", async () => {
    render(<Home />);
    await userEvent.click(screen.getByText("OCUPADAS"));
    expect(screen.getByText("SmartClass II")).toBeInTheDocument();
    expect(screen.getByText("Sala de Reuniões")).toBeInTheDocument();
    expect(screen.queryByText("Laboratório 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Auditório")).not.toBeInTheDocument();
  });

  it("volta a exibir todas as salas ao clicar em TODAS", async () => {
    render(<Home />);
    await userEvent.click(screen.getByText("LIVRES"));
    await userEvent.click(screen.getByText("TODAS"));
    expect(screen.getByText("SmartClass II")).toBeInTheDocument();
    expect(screen.getByText("Laboratório 1")).toBeInTheDocument();
  });
});