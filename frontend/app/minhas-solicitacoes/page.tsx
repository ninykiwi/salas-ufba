"use client";

import { useState } from "react";
import ProfTopBar from "@/components/professor/ProfTopBar";
import Footer from "@/components/Footer";
import ProfSidebar from "@/components/professor/ProfSidebar";
import { Clock, CheckCircle2, XCircle, Calendar, MapPin } from "lucide-react";

export interface MinhaSolicitacao {
  id: number;
  sala: string;
  predio: string;
  horario: string;
  data: string;
  tipo: "NOVA" | "EMPRESTIMO" | "TROCA";
  status: "PENDENTE" | "ACEITA" | "RECUSADA";
  motivoRecusa?: string;
}

const mockMinhasSolicitacoes: MinhaSolicitacao[] = [
  { id: 1, sala: "Sala 102 - Bloco A", predio: "Instituto de Computação", horario: "14:00 - 16:00", data: "Hoje, 24 Out", tipo: "NOVA", status: "PENDENTE" },
  { id: 2, sala: "Auditório Laranja", predio: "Instituto de Computação", horario: "08:30 - 11:30", data: "Amanhã, 25 Out", tipo: "EMPRESTIMO", status: "ACEITA" },
  { id: 3, sala: "Sala 101 - Bloco B", predio: "Instituto de Computação", horario: "19:00 - 22:00", data: "26 Out", tipo: "TROCA", status: "RECUSADA", motivoRecusa: "Sala já reservada para manutenção predial externa." },
  { id: 4, sala: "Laboratório 1", predio: "Instituto de Computação", horario: "10:00 - 12:00", data: "Amanhã, 25 Out", tipo: "NOVA", status: "PENDENTE" },
  { id: 5, sala: "Sala 205 - Bloco C", predio: "Faculdade de Direito", horario: "14:00 - 18:00", data: "28 Out", tipo: "EMPRESTIMO", status: "ACEITA" },
];

export default function Home() {
  // Dois estados separados para os dropdowns
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [statusFiltro, setStatusFiltro] = useState("Todos");

  // Filtragem cruzada inteligente: respeita as duas seleções ao mesmo tempo
  const solicitacoesFiltradas = mockMinhasSolicitacoes.filter((req) => {
    const bateTipo = tipoFiltro === "Todos" || req.tipo === tipoFiltro;
    const bateStatus = statusFiltro === "Todos" || req.status === statusFiltro;
    return bateTipo && bateStatus;
  });

  const statusBadges = {
    PENDENTE: {
      text: "Pendente",
      classes: "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-700 border border-amber-200",
      icon: <Clock size={12} className="text-amber-500 mr-1" />
    },
    ACEITA: {
      text: "Aceita",
      classes: "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-green-50 text-green-700 border border-green-200",
      icon: <CheckCircle2 size={12} className="text-green-500 mr-1" />
    },
    RECUSADA: {
      text: "Recusada",
      classes: "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-red-50 text-red-700 border border-red-200",
      icon: <XCircle size={12} className="text-red-500 mr-1" />
    }
  };

  const typeBadges = {
    NOVA: { text: "Nova", classes: "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-600" },
    EMPRESTIMO: { text: "Empréstimo", classes: "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-600" },
    TROCA: { text: "Troca", classes: "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-600" },
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <ProfSidebar activeHref="/minhas-solicitacoes" />

        <div className="flex flex-col flex-1 overflow-hidden">
          <ProfTopBar />

          <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="mb-8">
              <h1 className="text-xl font-bold text-gray-900">Minhas Solicitações de Reserva</h1>
              <p className="text-sm text-gray-500 mt-1">
                Aqui você pode visualizar e gerenciar suas solicitações de reserva.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              
              {/* Barra Superior com os Dropdowns estilizados conforme image_05589a.png */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h3 className="text-base font-bold text-gray-700">Histórico de Pedidos</h3>
                
                {/* Grupo de Filtros */}
                <div className="flex items-center gap-3">
                  {/* Select Filtro por Tipo */}
                  <select
                    value={tipoFiltro}
                    onChange={(e) => setTipoFiltro(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg text-sm text-gray-600 px-3 py-2 pr-8 cursor-pointer focus:outline-none focus:border-blue-800 transition-colors shadow-sm font-medium appearance-none bg-[url('data:image/svg+xml;bs5,json')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.2em_1.2em]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234a5568' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="Todos">Filtrar por Tipo</option>
                    <option value="NOVA">Nova</option>
                    <option value="EMPRESTIMO">Empréstimo</option>
                    <option value="TROCA">Troca</option>
                  </select>

                  {/* Select Filtro por Status */}
                  <select
                    value={statusFiltro}
                    onChange={(e) => setStatusFiltro(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg text-sm text-gray-600 px-3 py-2 pr-8 cursor-pointer focus:outline-none focus:border-blue-800 transition-colors shadow-sm font-medium appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234a5568' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                      backgroundSize: '16px',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.5rem center'
                    }}
                  >
                    <option value="Todos">Filtrar por Status</option>
                    <option value="PENDENTE">Pendente</option>
                    <option value="ACEITA">Aceita</option>
                    <option value="RECUSADA">Recusada</option>
                  </select>
                </div>
              </div>

              {/* Cabeçalho */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#f8f9fa] border-b border-gray-200 text-xs font-bold text-gray-500 tracking-wider">
                <div className="col-span-4">LOCALIZAÇÃO / AMBIENTE</div>
                <div className="col-span-3">HORÁRIO / DATA</div>
                <div className="col-span-2">TIPO</div>
                <div className="col-span-3 text-right">STATUS DA HOMOLOGAÇÃO</div>
              </div>

              {/* Corpo */}
              <div className="divide-y divide-gray-100">
                {solicitacoesFiltradas.length > 0 ? (
                  solicitacoesFiltradas.map((req) => {
                    const status = statusBadges[req.status];
                    const type = typeBadges[req.tipo];

                    return (
                      <div key={req.id} className="flex flex-col">
                        <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50/50 transition-colors">
                          <div className="col-span-4 flex items-center gap-4">
                            <div className="w-1.5 h-10 bg-[#000666] rounded-sm shrink-0"></div>
                            <div>
                              <p className="font-bold text-base text-gray-800">{req.sala}</p>
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <MapPin size={12} /> {req.predio}
                              </p>
                            </div>
                          </div>

                          <div className="col-span-3">
                            <p className="text-sm font-semibold text-gray-700">{req.horario}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <Calendar size={12} /> {req.data}
                            </p>
                          </div>

                          <div className="col-span-2">
                            <span className={type.classes}>{type.text}</span>
                          </div>

                          <div className="col-span-3 flex justify-end">
                            <span className={status.classes}>
                              {status.icon}
                              {status.text}
                            </span>
                          </div>
                        </div>

                        {req.status === "RECUSADA" && req.motivoRecusa && (
                          <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 text-xs text-gray-500">
                            <span className="font-semibold text-gray-600">Motivo da Recusa:</span> {req.motivoRecusa}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-10 text-center text-gray-500 text-sm">
                    Nenhuma solicitação encontrada com os filtros selecionados.
                  </div>
                )}
              </div>

            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}