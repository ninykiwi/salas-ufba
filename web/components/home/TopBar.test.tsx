import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TopBar from "./TopBar";

const defaultProps = {
  campuses: [
    { id: 1, name: "Campus Ondina" },
    { id: 2, name: "Campus Canela" },
  ],
  selectedCampus: 1,
  onCampusChange: vi.fn(),
  institutes: [
    { id: "1", name: "Instituto de Computação" },
    { id: "2", name: "Instituto de Física" },
  ],
  selectedInstitute: "1",
  onInstituteChange: vi.fn(),
};

describe("TopBar", () => {
  it("renderiza o campus selecionado", () => {
    render(<TopBar {...defaultProps} />);
    expect(screen.getByText("Campus Ondina")).toBeInTheDocument();
  });

  it("renderiza o instituto selecionado", () => {
    render(<TopBar {...defaultProps} />);
    expect(screen.getByText("Instituto de Computação")).toBeInTheDocument();
  });

  it("abre a lista de campuses ao clicar no botão", async () => {
    render(<TopBar {...defaultProps} />);
    await userEvent.click(screen.getByText("Campus Ondina"));
    expect(screen.getByText("Campus Canela")).toBeInTheDocument();
  });

  it("fecha a lista de campuses ao selecionar uma opção", async () => {
    render(<TopBar {...defaultProps} />);
    await userEvent.click(screen.getByText("Campus Ondina"));
    await userEvent.click(screen.getByText("Campus Canela"));
    expect(screen.queryByText("Campus Canela")).not.toBeInTheDocument();
  });

  it("chama onCampusChange com o id correto ao selecionar", async () => {
    render(<TopBar {...defaultProps} />);
    await userEvent.click(screen.getByText("Campus Ondina"));
    await userEvent.click(screen.getByText("Campus Canela"));
    expect(defaultProps.onCampusChange).toHaveBeenCalledWith(2);
  });

  it("abre a lista de institutos ao clicar no botão", async () => {
    render(<TopBar {...defaultProps} />);
    await userEvent.click(screen.getByText("Instituto de Computação"));
    expect(screen.getByText("Instituto de Física")).toBeInTheDocument();
  });

  it("fecha a lista de institutos ao selecionar uma opção", async () => {
    render(<TopBar {...defaultProps} />);
    await userEvent.click(screen.getByText("Instituto de Computação"));
    await userEvent.click(screen.getByText("Instituto de Física"));
    expect(screen.queryByText("Instituto de Física")).not.toBeInTheDocument();
  });

  it("chama onInstituteChange com o id correto ao selecionar", async () => {
    render(<TopBar {...defaultProps} />);
    await userEvent.click(screen.getByText("Instituto de Computação"));
    await userEvent.click(screen.getByText("Instituto de Física"));
    expect(defaultProps.onInstituteChange).toHaveBeenCalledWith("2");
  });

  it("fecha o dropdown de campus ao clicar fora", async () => {
    render(
      <div>
        <TopBar {...defaultProps} />
        <div data-testid="outside">fora</div>
      </div>
    );
    await userEvent.click(screen.getByText("Campus Ondina"));
    expect(screen.getByText("Campus Canela")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("outside"));
    expect(screen.queryByText("Campus Canela")).not.toBeInTheDocument();
  });

  it("fecha o dropdown de instituto ao clicar fora", async () => {
    render(
      <div>
        <TopBar {...defaultProps} />
        <div data-testid="outside">fora</div>
      </div>
    );
    await userEvent.click(screen.getByText("Instituto de Computação"));
    expect(screen.getByText("Instituto de Física")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("outside"));
    expect(screen.queryByText("Instituto de Física")).not.toBeInTheDocument();
  });
});