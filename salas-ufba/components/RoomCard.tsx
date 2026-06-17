import StatusBadge from "./StatusBradge";
import { CalendarDays, Clock, Users } from "lucide-react";

type Status = "OCUPADA" | "LIVRE" | "EM_REUNIAO";

interface CurrentEvent {
  title: string;
  startTime: string;
  endTime: string;
}

interface NextEvent {
  title: string;
  time: string;
}

interface RoomCardProps {
  name: string;
  status: Status;
  currentEvent?: CurrentEvent;
  nextEvent?: NextEvent;
  capacity: number;
  freeUntil?: string; 
}

const currentEventStyles: Record< "OCUPADA" | "EM_REUNIAO", { wrapper: string; label: string; labelText: string; titleColor: string; borderColor: string } > = {
  OCUPADA: {
    wrapper: "bg-[blue-50]",
    label: "text-[#000666]",
    labelText: "ACONTECENDO AGORA",
    titleColor: "text-[#000666]",
    borderColor: "border-l-4 border-[#000666]",
  },
  EM_REUNIAO: {
    wrapper: "bg-red-50",
    label: "text-red-700",
    labelText: "EM ANDAMENTO",
    titleColor: "text-red-500",
    borderColor: "border-l-4 border-red-400",
  },
};

export default function RoomCard({
  name,
  status,
  currentEvent,
  nextEvent,
  capacity,
  freeUntil,
}: RoomCardProps) {
  const isOccupied = status === "OCUPADA" || status === "EM_REUNIAO";
  const eventStyle = isOccupied ? currentEventStyles[status] : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[#000666] font-semibold text-lg">{name}</h2>
        <StatusBadge status={status} />
      </div>

      {isOccupied && currentEvent && eventStyle ? (
        <div className={`p-3 ${eventStyle.wrapper} ${eventStyle.borderColor}`}>
          <p className={`text-xs font-semibold uppercase tracking-wide ${eventStyle.label}`}>
            {eventStyle.labelText}
          </p>
          <p className={`font-bold text-xl mt-1 ${eventStyle.titleColor}`}>
            {currentEvent.title}
          </p>
          <div className="flex items-center gap-1 text-[#000666] text-xs mt-1">
            <Clock size={12} />
            <span>
              {currentEvent.startTime} — {currentEvent.endTime}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-gray-50 flex flex-col gap-1 border-l-4 border-gray-300">
          <div className="flex items-center gap-2 text-gray-400">
            <CalendarDays size={16} />
            <span className="text-xs font-semibold uppercase tracking-wide">Disponível</span>
          </div>
          <p className="font-bold text-xl text-gray-600">Sala Livre</p>
          <p className="text-xs text-gray-400">
            {freeUntil ? `Livre até as ${freeUntil}` : "Sem atividades no momento"}
          </p>
        </div>
      )}

      {nextEvent && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
            Próximo Evento
          </p>
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>{nextEvent.title}</span>
            <span className="font-semibold">{nextEvent.time}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-400 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{capacity} Pessoas</span>
        </div>
        <button className="text-[#000666] font-semibold text-sm cursor-pointer">
          Ver Horários
        </button>
      </div>
    </div>
  );
}