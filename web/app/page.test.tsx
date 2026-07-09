import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Home from "./page";
import { getInstitutes, getRooms, getSchedulesToday } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  getInstitutes: vi.fn(),
  getRooms: vi.fn(),
  getSchedulesToday: vi.fn(),
}));

const institute = {
  id: "inst-1",
  name: "Instituto de Computação",
  slug: "ic",
  floors: 1,
  createdAt: "",
};

const rooms = [
  { _id: "room-1", name: "SmartClass II", institute_id: "inst-1", floor: "1", type: "sala_aula", capacity: 40, resources: [], status: "ativa", createdAt: "", updatedAt: "" },
  { _id: "room-2", name: "Laboratório 1", institute_id: "inst-1", floor: "1", type: "laboratorio", capacity: 30, resources: [], status: "ativa", createdAt: "", updatedAt: "" },
  { _id: "room-3", name: "Sala de Reuniões", institute_id: "inst-1", floor: "1", type: "sala_reuniao", capacity: 12, resources: [], status: "ativa", createdAt: "", updatedAt: "" },
  { _id: "room-4", name: "Auditório", institute_id: "inst-1", floor: "1", type: "auditorio", capacity: 120, resources: [], status: "ativa", createdAt: "", updatedAt: "" },
];

// "Agora" fixo em 08:30 — usado pelas fixtures de agendamentos abaixo para
// deixar determinístico o cálculo de ocupação (que depende da hora atual).
const NOW = new Date("2026-01-01T08:30:00");

const schedules = [
  { _id: "s1", title: "Aula: Grafos", category: "aula_regular", professor_id: "p1", professor_name: "Prof. X", room_id: "room-1", institute_id: "inst-1", date: "2026-01-01", start_time: "07:55", end_time: "09:35", expected_audience: 30, recurrence: "unico", equipment_requested: [], notes: "", status: "confirmado", created_by: "p1", createdAt: "", updatedAt: "" },
  { _id: "s2", title: "Aula: Lab 1 (Redes)", category: "aula_regular", professor_id: "p1", professor_name: "Prof. X", room_id: "room-2", institute_id: "inst-1", date: "2026-01-01", start_time: "11:35", end_time: "13:15", expected_audience: 20, recurrence: "unico", equipment_requested: [], notes: "", status: "confirmado", created_by: "p1", createdAt: "", updatedAt: "" },
  { _id: "s3", title: "Planejamento 2026", category: "reuniao", professor_id: "p1", professor_name: "Prof. X", room_id: "room-3", institute_id: "inst-1", date: "2026-01-01", start_time: "07:00", end_time: "11:00", expected_audience: 10, recurrence: "unico", equipment_requested: [], notes: "", status: "confirmado", created_by: "p1", createdAt: "", updatedAt: "" },
];

describe("Home", () => {
  beforeEach(() => {
    vi.setSystemTime(NOW);
    vi.mocked(getInstitutes).mockResolvedValue([institute]);
    vi.mocked(getRooms).mockResolvedValue(rooms as never);
    vi.mocked(getSchedulesToday).mockResolvedValue(schedules as never);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("renderiza o título da página", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /ocupação em tempo real/i, level: 1 })
    ).toBeInTheDocument();
  });

  it("renderiza os três botões de filtro", () => {
    render(<Home />);
    expect(screen.getByText("TODAS")).toBeInTheDocument();
    expect(screen.getByText("LIVRES")).toBeInTheDocument();
    expect(screen.getByText("OCUPADAS")).toBeInTheDocument();
  });

  it("exibe todas as salas por padrão", async () => {
    render(<Home />);
    expect(await screen.findByText("SmartClass II")).toBeInTheDocument();
    expect(screen.getByText("Laboratório 1")).toBeInTheDocument();
    expect(screen.getByText("Sala de Reuniões")).toBeInTheDocument();
  });

  it("filtra apenas salas livres ao clicar em LIVRES", async () => {
    render(<Home />);
    await screen.findByText("SmartClass II");

    await userEvent.click(screen.getByText("LIVRES"));
    expect(screen.getByText("Laboratório 1")).toBeInTheDocument();
    expect(screen.getByText("Auditório")).toBeInTheDocument();
    expect(screen.queryByText("SmartClass II")).not.toBeInTheDocument();
    expect(screen.queryByText("Sala de Reuniões")).not.toBeInTheDocument();
  });

  it("filtra salas ocupadas e em reunião ao clicar em OCUPADAS", async () => {
    render(<Home />);
    await screen.findByText("SmartClass II");

    await userEvent.click(screen.getByText("OCUPADAS"));
    expect(screen.getByText("SmartClass II")).toBeInTheDocument();
    expect(screen.getByText("Sala de Reuniões")).toBeInTheDocument();
    expect(screen.queryByText("Laboratório 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Auditório")).not.toBeInTheDocument();
  });

  it("volta a exibir todas as salas ao clicar em TODAS", async () => {
    render(<Home />);
    await screen.findByText("SmartClass II");

    await userEvent.click(screen.getByText("LIVRES"));
    await userEvent.click(screen.getByText("TODAS"));
    expect(screen.getByText("SmartClass II")).toBeInTheDocument();
    expect(screen.getByText("Laboratório 1")).toBeInTheDocument();
  });
});
