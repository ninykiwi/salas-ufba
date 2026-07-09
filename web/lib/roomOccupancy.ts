import { Room, Schedule } from "@/lib/api";

export type RoomOccupancyStatus = "OCUPADA" | "LIVRE" | "EM_REUNIAO";

export interface RoomOccupancy {
  status: RoomOccupancyStatus;
  currentEvent?: {
    title: string;
    professor: string;
    startTime: string;
    endTime: string;
  };
  nextEvent?: { title: string; time: string };
  freeUntil?: string;
}

function currentTimeString(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

export function computeRoomOccupancy(
  room: Room,
  todaySchedules: Schedule[]
): RoomOccupancy {
  const currentTime = currentTimeString();
  const roomSchedules = todaySchedules
    .filter((s) => s.room_id === room._id && s.status === "confirmado")
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const activeSchedule = roomSchedules.find(
    (s) => s.start_time <= currentTime && s.end_time > currentTime
  );
  const upcoming = roomSchedules.find((s) => s.start_time > currentTime);
  const nextEvent = upcoming
    ? { title: upcoming.title, time: upcoming.start_time }
    : undefined;

  if (activeSchedule) {
    return {
      status: activeSchedule.category === "reuniao" ? "EM_REUNIAO" : "OCUPADA",
      currentEvent: {
        title: activeSchedule.title,
        professor: activeSchedule.professor_name,
        startTime: activeSchedule.start_time,
        endTime: activeSchedule.end_time,
      },
      nextEvent,
    };
  }

  return {
    status: "LIVRE",
    nextEvent,
    freeUntil: nextEvent?.time,
  };
}
