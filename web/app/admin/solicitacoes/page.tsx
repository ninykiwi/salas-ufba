"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Footer from "@/components/home/Footer";
import { Check, X, Clock, Calendar, ArrowLeftRight, PackageOpen } from "lucide-react";

type RequestType = "reserva" | "cancelamento" | "troca" | "emprestimo";
type RequestStatus = "pendente" | "aceita" | "recusada";

interface RoomRequest {
  id: number;
  type: RequestType;
  professor: string;
  room: string;
  date: string;
  startTime: string;
  endTime?: string;
  targetRoom?: string;
  status: RequestStatus;
  createdAt: string;
}

const mockRequests: RoomRequest[] = [
  { id: 1, type: "reserva",       professor: "Prof. Ricardo Silva",  room: "Laboratório 1", date: "Hoje",    startTime: "14:00", endTime: "16:00", status: "pendente", createdAt: "08:30" },
  { id: 2, type: "troca",         professor: "Profa. Ana Costa",     room: "Sala 101",      date: "Hoje",    startTime: "09:00", targetRoom: "Sala 102",               status: "pendente", createdAt: "09:10" },
  { id: 3, type: "cancelamento",  professor: "Prof. Bruno Ferreira", room: "Auditório",     date: "Amanhã",  startTime: "10:00", endTime: "12:00",                     status: "pendente", createdAt: "09:45" },
  { id: 4, type: "emprestimo",    professor: "Profa. Carla Matos",   room: "Lab 203",       date: "Sex",     startTime: "13:00", endTime: "15:00",                     status: "pendente", createdAt: "10:00" },
  { id: 5, type: "reserva",       professor: "Prof. André Lima",     room: "Sala 102",      date: "Hoje",    startTime: "16:00", endTime: "18:00",                     status: "aceita",   createdAt: "07:00" },
  { id: 6, type: "cancelamento",  professor: "Prof. Carlos Eduardo", room: "Sala 208",      date: "Amanhã",  startTime: "08:00", endTime: "10:00",                     status: "recusada", createdAt: "06:30" },
];

const typeConfig: Record<RequestType, { label: string; icon: React.ReactNode; color: string }> = {
  reserva:      { label: "Reserva",      icon: <Calendar size={13} />,       color: "bg-blue-50 text-blue-700 border-blue-200"    },
  cancelamento: { label: "Cancelamento", icon: <X size={13} />,              color: "bg-red-50 text-red-600 border-red-200"       },
  troca:        { label: "Troca",        icon: <ArrowLeftRight size={13} />, color: "bg-amber-50 text-amber-700 border-amber-200" },
  emprestimo:   { label: "Empréstimo",   icon: <PackageOpen size={13} />,    color: "bg-purple-50 text-purple-700 border-purple-200" },
};

const statusConfig: Record<RequestStatus, { label: string; className: string }> = {
  pendente:  { label: "Pendente",  className: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
  aceita:    { label: "Aceita",    className: "bg-green-50 text-green-700 border border-green-200"    },
  recusada:  { label: "Recusada",  className: "bg-red-50 text-red-600 border border-red-200"          },
};

function describeRequest(r: RoomRequest): string {
  switch (r.type) {
    case "reserva":      return `Reserva: ${r.room} (${r.date}, ${r.startTime}${r.endTime ? ` - ${r.endTime}` : ""})`;
    case "cancelamento": return `Cancelamento: ${r.room} (${r.date}, ${r.startTime}${r.endTime ? ` - ${r.endTime}` : ""})`;
    case "troca":        return `Troca: ${r.room} → ${r.targetRoom} (${r.date}, ${r.startTime})`;
    case "emprestimo":   return `Empréstimo: ${r.room} (${r.date}, ${r.startTime}${r.endTime ? ` - ${r.endTime}` : ""})`;
  }
}

type FilterTab = "todas" | RequestType;

export default function SolicitacoesPage() {
  const [requests, setRequests] = useState<RoomRequest[]>(mockRequests);
  const [activeTab, setActiveTab] = useState<FilterTab>("todas");

  const pending = requests.filter((r) => r.status === "pendente");

  const filtered = requests.filter((r) =>
    activeTab === "todas" ? true : r.type === activeTab
  );

  const handle = (id: number, action: "aceita" | "recusada") => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: action } : r));
  };

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "todas",        label: "Todas"        },
    { key: "reserva",      label: "Reservas"     },
    { key: "emprestimo",   label: "Empréstimos"  },
    { key: "troca",        label: "Trocas"       },
    { key: "cancelamento", label: "Cancelamentos"},
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeHref="/admin/solicitacoes" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Solicitações Pendentes</h1>
            <p className="text-sm text-gray-400 mt-0.5">Gerencie as solicitações dos professores.</p>
          </div>
          {pending.length > 0 && (
            <span className="text-sm text-gray-500">
              <span className="font-bold text-indigo-900">{pending.length}</span> nova{pending.length > 1 ? "s" : ""} solicitaç{pending.length > 1 ? "ões" : "ão"}
            </span>
          )}
        </div>

        <div className="px-8 pt-4 bg-white border-b border-gray-200 flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-indigo-900 text-indigo-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <main className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-sm">Nenhuma solicitação encontrada.</p>
            </div>
          ) : (
            filtered.map((req) => {
              const type   = typeConfig[req.type];
              const status = statusConfig[req.status];
              return (
                <div
                  key={req.id}
                  className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{req.professor}</span>
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${type.color}`}>
                        {type.icon}
                        {type.label}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{describeRequest(req)}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={11} />
                      <span>Solicitado às {req.createdAt}</span>
                    </div>
                  </div>

                  {req.status === "pendente" && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handle(req.id, "aceita")}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white text-sm font-bold rounded-lg transition-colors"
                      >
                        <Check size={14} />
                        Aceitar
                      </button>
                      <button
                        onClick={() => handle(req.id, "recusada")}
                        className="flex items-center gap-1.5 px-4 py-2 border border-red-400 text-red-500 hover:bg-red-50 text-sm font-bold rounded-lg transition-colors"
                      >
                        <X size={14} />
                        Recusar
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}