"use client";

import { useState } from "react";
import StatusBadge from "../home/StatusBradge";
import AdminSwapRequestModal from "./AdminSwapRequestModal"; // Ajuste o caminho se necessário
import { CalendarDays, Clock, Users, ArrowLeftRight } from "lucide-react";
import Link from "next/link";

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

interface AdminRoomCardProps {
  name: string;
  status: Status;
  currentEvent?: CurrentEvent;
  nextEvent?: NextEvent;
  capacity: number;
  freeUntil?: string; 
}

const currentEventStyles: Record< "OCUPADA" | "EM_REUNIAO", { wrapper: string; label: string; labelText: string; titleColor: string; borderColor: string } > = {
  OCUPADA: {
    wrapper: "bg-blue-50",
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

export default function AdminRoomCard({
  name,
  status,
  currentEvent,
  nextEvent,
  capacity,
  freeUntil,
}: AdminRoomCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isOccupied = status === "OCUPADA" || status === "EM_REUNIAO";
  const eventStyle = isOccupied ? currentEventStyles[status] : null;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 h-full overflow-hidden">
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

        {/* Rodapé unificado */}
        <div className="mt-auto bg-gray-50 -mx-5 -mb-5 p-4 flex items-center justify-between border-t border-gray-100 text-xs">
          {status === "LIVRE" ? (
            <Link href="/salas/cadastrar-evento">
              <button className="bg-[#000666] text-white px-3 py-2 rounded-lg font-bold text-[10px] uppercase hover:opacity-90 transition-opacity">
                Solicitar Reserva
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-3 text-gray-500 font-medium">
              {/* MODIFICAÇÃO: onClick adicionado aqui para abrir o modal */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 hover:text-[#000666] transition-colors cursor-pointer"
              >
                <ArrowLeftRight size={14} />
                <span>Solicitar Troca</span>
              </button>
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{capacity} Pessoas</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Renderização condicional do modal fora do fluxo do card */}
      <AdminSwapRequestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roomName={name}
        currentEventTitle={currentEvent?.title}
      />
    </>
  );
}