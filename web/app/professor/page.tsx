"use client";

import { useState } from "react";
import Footer from "@/components/home/Footer";
import ProfRoomCard from "@/components/professor/ProfRoomCard";
import { CirclePlus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import ProfSidebar from "@/components/professor/ProfSidebar";
import ProfTopBar from "@/components/professor/ProfTopBar";

type StatusFilter = "TODAS" | "LIVRES" | "OCUPADAS";
type RoomStatus = "OCUPADA" | "LIVRE" | "EM_REUNIAO";

interface Room {
  id: number;
  name: string;
  status: RoomStatus;
  currentEvent?: { title: string; startTime: string; endTime: string };
  nextEvent?: { title: string; time: string };
  capacity: number;
  freeUntil?: string;
}

interface Evento {
  id: number;
  nome: string;
  tipo: string;
  sala: string;
  predio: string;
  data: string;
  horario: string;
}

const rooms: Room[] = [
  {
    id: 1,
    name: "SmartClass II",
    status: "OCUPADA",
    currentEvent: { title: "Aula: Grafos", startTime: "07:55", endTime: "09:35" },
    nextEvent: { title: "Reunião Geral IC", time: "10:00" },
    capacity: 40,
  },
  {
    id: 2,
    name: "Laboratório 1",
    status: "LIVRE",
    nextEvent: { title: "Aula: Lab 1 (Redes)", time: "11:35" },
    capacity: 30,
  },
  {
    id: 3,
    name: "Sala 101",
    status: "OCUPADA",
    currentEvent: { title: "Aula: EDA 1", startTime: "08:50", endTime: "10:40" },
    nextEvent: { title: "Cálculo A", time: "13:00" },
    capacity: 60,
  },
  {
    id: 4,
    name: "Sala de Reuniões",
    status: "EM_REUNIAO",
    currentEvent: { title: "Planejamento 2026", startTime: "09:00", endTime: "11:00" },
    nextEvent: { title: "Reunião Formas", time: "14:50" },
    capacity: 12,
  },
  {
    id: 5,
    name: "Auditório",
    status: "LIVRE",
    nextEvent: { title: "Colação de Grau", time: "18:30" },
    capacity: 120,
    freeUntil: "18:30",
  },
  {
    id: 6,
    name: "Sala 102",
    status: "OCUPADA",
    currentEvent: { title: "Aula: POO", startTime: "07:55", endTime: "09:35" },
    nextEvent: { title: "Eletromag", time: "09:45" },
    capacity: 45,
  },
];

const filterMap: Record<StatusFilter, RoomStatus[]> = {
  TODAS: ["OCUPADA", "LIVRE", "EM_REUNIAO"],
  LIVRES: ["LIVRE"],
  OCUPADAS: ["OCUPADA", "EM_REUNIAO"],
};

const mockEventos: Evento[] = [
  { id: 1, nome: "Aula: Grafos", tipo: "Aula", sala: "SmartClass II", predio: "Instituto de Computação", data: "24 Out", horario: "07:55" },
  { id: 2, nome: "Reunião Geral IC", tipo: "Reunião", sala: "SmartClass II", predio: "Instituto de Computação", data: "24 Out", horario: "10:00" },
  { id: 3, nome: "Aula: Lab 1", tipo: "Aula", sala: "Laboratório 1", predio: "Instituto de Computação", data: "24 Out", horario: "11:35" },
  { id: 4, nome: "Planejamento 2026", tipo: "Reunião", sala: "Sala de Reuniões", predio: "Faculdade de Direito", data: "24 Out", horario: "09:00" },
];

const mockCampuses = [{ id: 1, name: "Campus Ondina" }];

const mockInstitutes = [{ id: 1, name: "Instituto de Computação" }, {id: 2, name: "Faculdade de Direito"}];

export default function Home() {

  const [selectedCampus, setSelectedCampus] = useState<number | null>(1);

  const [selectedInstitute, setSelectedInstitute] = useState<number | null>(1);

  const [filter, setFilter] = useState<StatusFilter>("TODAS");

  const filtered = rooms.filter((r) => filterMap[filter].includes(r.status));

  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [salaFiltro, setSalaFiltro] = useState("Todas");
  const [predioFiltro, setPredioFiltro] = useState("Todos");

  const eventosFiltrados = mockEventos.filter(e => 
    (tipoFiltro === "Todos" || e.tipo === tipoFiltro) &&
    (salaFiltro === "Todas" || e.sala === salaFiltro) &&
    (predioFiltro === "Todos" || e.predio === predioFiltro)
  );

return (
    <div className="flex h-screen bg-gray-50">
      <ProfSidebar activeHref="/professor" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <ProfTopBar />

        <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ocupação em Tempo Real</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Acompanhe a disponibilidade das salas do instituto.
                </p>
              </div>
              
              <div className="grid grid-cols-3 border border-gray-200 rounded-lg overflow-hidden bg-white">
                {(["TODAS", "LIVRES", "OCUPADAS"] as StatusFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 px-2 py-2 text-xs font-semibold transition-colors ${
                      filter === f
                        ? "bg-[#000666] text-white"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {filtered.map((room) => (
                <ProfRoomCard key={room.id} {...room} />
              ))}
              
              {/* Add Card */}
              <Link href="/professor/cadastrar-evento">
                              <div className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center p-6 text-gray-400 hover:border-[#000666] hover:text-[#000666] transition-all cursor-pointer min-h-[300px]">
                                <div className="text-center justify-center flex flex-col items-center gap-2">
                                    <CirclePlus size={36}/>
                                  <p className="font-bold uppercase tracking-wider text-sm">Cadastrar Evento</p>
                                </div>
                              </div>
              </Link>
            </div>
          </main>

          <Footer />
        </div>
    </div>
  );
}