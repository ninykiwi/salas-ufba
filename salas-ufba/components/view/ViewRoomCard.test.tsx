import { render, screen } from "@testing-library/react";
import ViewRoomCard from "./ViewRoomCard";

const baseProps = {
  name: "Sala 101",
  status: "OCUPADA" as const,
};

describe("ViewRoomCard", () => {
  it("renderiza o nome da sala", () => {
    render(<ViewRoomCard {...baseProps} />);
    expect(screen.getByText("Sala 101")).toBeInTheDocument();
  });

  it("renderiza o evento atual quando OCUPADA", () => {
    render(
      <ViewRoomCard
        {...baseProps}
        currentEvent={{
          title: "Cálculo Diferencial",
          professor: "Prof. Ricardo",
          startTime: "13:00",
          endTime: "15:50",
        }}
      />
    );
    expect(screen.getByText("Cálculo Diferencial")).toBeInTheDocument();
    expect(screen.getByText("Prof. Ricardo")).toBeInTheDocument();
    expect(screen.getByText("13:00 — 15:50")).toBeInTheDocument();
  });

  it("renderiza freeLabel quando LIVRE", () => {
    render(<ViewRoomCard {...baseProps} status="LIVRE" freeLabel="Lab Disponível" />);
    expect(screen.getByText("Lab Disponível")).toBeInTheDocument();
  });

  it("renderiza label padrão quando LIVRE sem freeLabel", () => {
    render(<ViewRoomCard {...baseProps} status="LIVRE" />);
    expect(screen.getByText("Livre para Estudo")).toBeInTheDocument();
  });
});