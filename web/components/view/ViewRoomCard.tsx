import StatusBadge from "../home/StatusBradge";

type RoomStatus = "OCUPADA" | "LIVRE" | "EM_REUNIAO";

interface CurrentEvent {
  title: string;
  professor?: string;
  startTime: string;
  endTime: string;
}

interface ViewRoomCardProps {
  name: string;
  status: RoomStatus;
  currentEvent?: CurrentEvent;
  freeLabel?: string;
}

const cardAccent: Record<RoomStatus, string> = {
  OCUPADA: "bg-red-700",
  EM_REUNIAO: "bg-red-700",
  LIVRE: "bg-gray-400",
};

const contentAccent: Record<RoomStatus, string> = {
  OCUPADA: "border-l-4 border-[#000666]",
  EM_REUNIAO: "border-l-4 border-l-red-400",
  LIVRE: "border-l-4 border-l-gray-300",
};

export default function ViewRoomCard({ name, status, currentEvent, freeLabel }: ViewRoomCardProps) {
  const isOccupied = status === "OCUPADA" || status === "EM_REUNIAO";

  return (
    <div className={`bg-white relative overflow-hidden rounded-xl border border-gray-400 p-5 flex flex-col justify-evenly gap-4`}>
      <div className={`absolute top-0 left-0 right-0 h-[7px] ${cardAccent[status]}`}/>      
      <div className="flex items-center justify-between">
        <h2 className={`font-bold text-2xl ${isOccupied ? "text-indigo-900" : "text-gray-500"}`}>
          {name}
        </h2>
        <StatusBadge status={status} variant="tv" />
      </div>

      <div className={`pl-3 ${contentAccent[status]} flex flex-col gap-3`}>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Agora</p>

        {isOccupied && currentEvent ? (
          <>
            <p className="text-lg font-bold text-indigo-900 leading-snug">{currentEvent.title}</p>
            {currentEvent.professor && (
              <p className="text-base text-gray-500">{currentEvent.professor}</p>
            )}
            <p className="text-sm text-gray-500">{currentEvent.startTime} — {currentEvent.endTime}</p>
          </>
        ) : (
          <>
            <p className="text-base font-semibold text-gray-400">{freeLabel ?? "Livre para Estudo"}</p>
            <p className="text-sm text-gray-300">—</p>
            <p className="text-sm text-gray-300">—</p>
          </>
        )}
      </div>
    </div>
  );
}