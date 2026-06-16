"use client";

import { useState, useCallback } from "react";
import ViewHeader from "@/components/view/ViewHeader";
import ViewFooter from "@/components/view/ViewFooter";
import ViewRoomCard from "@/components/view/ViewRoomCard";

type RoomStatus = "OCUPADA" | "LIVRE" | "EM_REUNIAO";

interface Room {
  id: number;
  name: string;
  status: RoomStatus;
  currentEvent?: { title: string; professor?: string; startTime: string; endTime: string };
  freeLabel?: string;
}

const allRooms: Room[][] = [
  [
    { id: 1, name: "Sala 101", status: "OCUPADA", currentEvent: { title: "Cálculo Diferencial e Integral I", professor: "Prof. Ricardo Almeida", startTime: "13:00", endTime: "15:50" } },
    { id: 2, name: "Sala 102", status: "LIVRE", freeLabel: "Livre para Estudo" },
    { id: 3, name: "Sala 105", status: "OCUPADA", currentEvent: { title: "Arquitetura de Computadores", professor: "Profª. Mariana Souza", startTime: "15:00", endTime: "16:50" } },
    { id: 4, name: "Auditório A", status: "OCUPADA", currentEvent: { title: "Workshop: IA Generativa", professor: "Lab de Inovação Digital", startTime: "14:00", endTime: "18:00" } },
    { id: 5, name: "Lab 203", status: "LIVRE", freeLabel: "Lab Disponível" },
    { id: 6, name: "Sala 208", status: "OCUPADA", currentEvent: { title: "Redes de Computadores I", professor: "Prof. Carlos Eduardo", startTime: "15:30", endTime: "17:20" } },
  ],
  [
    { id: 7, name: "Sala 301", status: "LIVRE", freeLabel: "Livre para Estudo" },
    { id: 8, name: "Sala 302", status: "OCUPADA", currentEvent: { title: "Banco de Dados I", professor: "Prof. André Lima", startTime: "14:00", endTime: "15:50" } },
    { id: 9, name: "Sala 303", status: "OCUPADA", currentEvent: { title: "Engenharia de Software", professor: "Profª. Carla Matos", startTime: "13:00", endTime: "14:50" } },
    { id: 10, name: "Lab 304", status: "LIVRE", freeLabel: "Lab Disponível" },
    { id: 11, name: "Sala 305", status: "OCUPADA", currentEvent: { title: "Sistemas Operacionais", professor: "Prof. Bruno Ferreira", startTime: "15:00", endTime: "16:50" } },
    { id: 12, name: "Sala 306", status: "LIVRE", freeLabel: "Livre para Estudo" },
  ],
];

const ROOMS_PER_PAGE = 6;
const TOTAL_ROOMS = 420;

export default function ViewPage() {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % allRooms.length);
  }, []);

  const rooms = allRooms[currentPage];
  const startRoom = currentPage * ROOMS_PER_PAGE + 101;
  const endRoom = startRoom + ROOMS_PER_PAGE - 1;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-8 py-6 gap-6">
      <ViewHeader
        institute="Instituto de Computação"
        location="Campus Federação — Pavilhão de Aulas (PAF 2)"
      />

      <div className="grid grid-cols-3 gap-4 flex-1">
        {rooms.map((room) => (
          <ViewRoomCard key={room.id} {...room} />
        ))}
      </div>

      <ViewFooter
        currentPage={currentPage}
        totalPages={allRooms.length}
        startRoom={startRoom}
        endRoom={endRoom}
        totalRooms={TOTAL_ROOMS}
        onNext={handleNext}
      />
    </div>
  );
}