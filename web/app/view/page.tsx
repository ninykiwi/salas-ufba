"use client";

import { useCallback, useEffect, useState } from "react";
import ViewHeader from "@/components/view/ViewHeader";
import ViewFooter from "@/components/view/ViewFooter";
import ViewRoomCard from "@/components/view/ViewRoomCard";
import { getInstitutes, getRooms, getSchedulesToday, Institute, Room, Schedule } from "@/lib/api";
import { computeRoomOccupancy, RoomOccupancyStatus } from "@/lib/roomOccupancy";

const ROOMS_PER_PAGE = 6;
const REFRESH_INTERVAL_MS = 60_000;

interface ViewRoom {
  id: string;
  name: string;
  status: RoomOccupancyStatus;
  currentEvent?: { title: string; professor?: string; startTime: string; endTime: string };
  freeLabel?: string;
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks.length > 0 ? chunks : [[]];
}

export default function ViewPage() {
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [todaySchedules, setTodaySchedules] = useState<Schedule[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    getInstitutes()
      .then((data) => setInstitute(data[0] ?? null))
      .catch(() => setInstitute(null));
  }, []);

  const loadOccupancy = useCallback(async (instituteId: string) => {
    const [roomsData, schedulesData] = await Promise.all([
      getRooms({ institute_id: instituteId, status: "ativa" }),
      getSchedulesToday(instituteId),
    ]);
    setRooms(roomsData);
    setTodaySchedules(schedulesData);
  }, []);

  useEffect(() => {
    if (!institute) return;

    loadOccupancy(institute.id);
    const interval = setInterval(() => loadOccupancy(institute.id), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [institute, loadOccupancy]);

  const viewRooms: ViewRoom[] = rooms.map((room) => {
    const occupancy = computeRoomOccupancy(room, todaySchedules);
    return {
      id: room._id,
      name: room.name,
      status: occupancy.status,
      currentEvent: occupancy.currentEvent,
      freeLabel: occupancy.status === "LIVRE" ? "Livre para Estudo" : undefined,
    };
  });

  const pages = chunk(viewRooms, ROOMS_PER_PAGE);

  const handleNext = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % pages.length);
  }, [pages.length]);

  // Se a lista de páginas encolher (menos salas), volta pra primeira em vez de
  // ficar presa numa página que deixou de existir.
  useEffect(() => {
    if (currentPage >= pages.length) setCurrentPage(0);
  }, [currentPage, pages.length]);

  const currentRooms = pages[currentPage] ?? [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-8 py-6 gap-6">
      <ViewHeader
        institute={institute?.name ?? "Carregando..."}
        location="Campus Federação — Pavilhão de Aulas (PAF 2)"
      />

      <div className="grid grid-cols-3 gap-4 flex-1">
        {currentRooms.map((room) => (
          <ViewRoomCard key={room.id} {...room} />
        ))}
      </div>

      <ViewFooter
        currentPage={currentPage}
        totalPages={pages.length}
        onNext={handleNext}
      />
    </div>
  );
}
