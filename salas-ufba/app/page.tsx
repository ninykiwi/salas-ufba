"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoomCard from "@/components/RoomCard";

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

const mockCampuses = [{ id: 1, name: "Campus Ondina" }];

const mockInstitutes = [{ id: 1, name: "Instituto de Computação" }, {id: 2, name: "Faculdade de Direito"}];

export default function Home() {

  const [selectedCampus, setSelectedCampus] = useState<number | null>(1);

  const [selectedInstitute, setSelectedInstitute] = useState<number | null>(1);

  const [filter, setFilter] = useState<StatusFilter>("TODAS");

  const filtered = rooms.filter((r) => filterMap[filter].includes(r.status));

return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeHref="/" />

        <div className="flex flex-col flex-1 overflow-hidden">

          <TopBar
            campuses={mockCampuses}
            selectedCampus={selectedCampus}
            onCampusChange={setSelectedCampus}
            institutes={mockInstitutes}
            selectedInstitute={selectedInstitute}
            onInstituteChange={setSelectedInstitute}
          />

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
              {filtered.map((room) => (
                <RoomCard key={room.id} {...room} />
              ))}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}