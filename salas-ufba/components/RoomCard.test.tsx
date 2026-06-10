import { render, screen } from "@testing-library/react";
import RoomCard from "./RoomCard";

const baseProps = {
  name: "Sala 101",
  status: "OCUPADA" as const,
  capacity: 60,
};

describe("RoomCard", () => {
  it("renderiza o nome da sala", () => {
    render(<RoomCard {...baseProps} />);
    expect(screen.getByText("Sala 101")).toBeInTheDocument();
  });

  it("renderiza evento atual quando OCUPADA", () => {
    render(
      <RoomCard
        {...baseProps}
        currentEvent={{ title: "Aula: EDA 1", startTime: "08:50", endTime: "10:40" }}
      />
    );
    expect(screen.getByText("Aula: EDA 1")).toBeInTheDocument();
    expect(screen.getByText("ACONTECENDO AGORA")).toBeInTheDocument();
  });

  it("renderiza label EM ANDAMENTO quando EM_REUNIAO", () => {
    render(
      <RoomCard
        {...baseProps}
        status="EM_REUNIAO"
        currentEvent={{ title: "Planejamento 2024", startTime: "09:00", endTime: "11:00" }}
      />
    );
    expect(screen.getByText("EM ANDAMENTO")).toBeInTheDocument();
  });

  it("renderiza Sala Livre quando LIVRE", () => {
    render(<RoomCard {...baseProps} status="LIVRE" />);
    expect(screen.getByText("Sala Livre")).toBeInTheDocument();
  });

  it("renderiza próximo evento quando informado", () => {
    render(<RoomCard {...baseProps} nextEvent={{ title: "Cálculo A", time: "13:00" }} />);
    expect(screen.getByText("Cálculo A")).toBeInTheDocument();
    expect(screen.getByText("13:00")).toBeInTheDocument();
  });

  it("renderiza a capacidade", () => {
    render(<RoomCard {...baseProps} />);
    expect(screen.getByText("60 Pessoas")).toBeInTheDocument();
  });
});