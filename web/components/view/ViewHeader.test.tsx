import { render, screen } from "@testing-library/react";
import ViewHeader from "./ViewHeader";

const institutes = [{ id: "1", name: "Instituto de Computação" }];

describe("ViewHeader", () => {
  it("renderiza o nome do instituto selecionado", () => {
    render(
      <ViewHeader
        institutes={institutes}
        selectedInstitute="1"
        onInstituteChange={() => {}}
        location="Campus Federação"
      />
    );
    expect(screen.getByText("Instituto de Computação")).toBeInTheDocument();
  });

  it("renderiza a localização", () => {
    render(
      <ViewHeader
        institutes={institutes}
        selectedInstitute="1"
        onInstituteChange={() => {}}
        location="Campus Federação"
      />
    );
    expect(screen.getByText("Campus Federação")).toBeInTheDocument();
  });

  it("mostra texto de fallback quando nenhum instituto está selecionado", () => {
    render(
      <ViewHeader
        institutes={institutes}
        selectedInstitute={null}
        onInstituteChange={() => {}}
        location="Campus Federação"
      />
    );
    expect(screen.getByText("Selecione um instituto")).toBeInTheDocument();
  });
});
