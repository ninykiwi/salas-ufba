"use client";

import { useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/Footer";
import AdminRoomCard from "@/components/admin/AdminRoomCard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminEventTable, { Evento } from "@/components/admin/AdminEventTable";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

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

export default function Home() {
  const [filter, setFilter] = useState<StatusFilter>("TODAS");
  const filteredRooms = rooms.filter((r) => filterMap[filter].includes(r.status));

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar activeHref="/admin" />

        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminTopBar />

          <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ocupação em Tempo Real</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Acompanhe a disponibilidade das salas do IC.
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
              {filteredRooms.map((room) => (
                <AdminRoomCard key={room.id} {...room} />
              ))}

              {/* Add Card */}
              <Link href="/salas/cadastrar-evento">
                <div className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center p-6 text-gray-400 hover:border-[#000666] hover:text-[#000666] transition-all cursor-pointer min-h-[300px]">
                  <div className="text-center justify-center flex flex-col items-center gap-2">
                    <CirclePlus size={36} />
                    <p className="font-bold uppercase tracking-wider text-sm">Cadastrar Evento</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Tabela de Eventos Refatorada */}
            <AdminEventTable eventos={mockEventos} rooms={rooms} />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}