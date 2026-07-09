"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AdminRequestDetailsModal from "./AdminRequestDetailsModal";

export interface Solicitacao {
  id: string;
  professor: string;
  sala: string;
  horario: string;
  data: string;
  motivo: string;
  tipo: "TROCA" | "RESERVA";
  frequencia?: string;
  responsavelAtual?: string;
  descricao?: string;
}

interface AdminRequestsTableProps {
  requests: Solicitacao[];
  processingId: string | null;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export default function AdminRequestsTable({
  requests,
  processingId,
  onAccept,
  onReject,
}: AdminRequestsTableProps) {
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedRequest, setSelectedRequest] = useState<Solicitacao | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const solicitacoesFiltradas = requests.filter((req) => {
    if (tipoFiltro === "Todos") return true;
    return req.tipo === tipoFiltro;
  });

  const totalPages = Math.ceil(solicitacoesFiltradas.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = solicitacoesFiltradas.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleFilterChange = (tab: string) => {
    setTipoFiltro(tab);
    setCurrentPage(1);
  };

  const openDetails = (req: Solicitacao) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  const typeBadges: Record<string, { text: string; classes: string }> = {
    RESERVA: { text: "Reserva", classes: "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-600" },
    TROCA: { text: "Troca", classes: "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-700" },
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-12 shadow-sm">

        {/* Barra Superior Alterada */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          {/* Lado Esquerdo: Título da Seção */}
          <h3 className="text-lg font-bold text-[#000666]">Solicitações Pendentes</h3>

          {/* Lado Direito: Apenas os botões de Filtro */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(["Todos", "RESERVA", "TROCA"] as const).map((tab) => {
              const labelMap = { Todos: "Todos", RESERVA: "Reservas", TROCA: "Trocas" };
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleFilterChange(tab)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors uppercase tracking-wider ${
                    tipoFiltro === tab
                      ? "bg-[#000666] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {labelMap[tab]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cabeçalho das Colunas */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#f8f9fa] border-b border-gray-200 text-xs font-bold text-gray-500 tracking-wider">
          <div className="col-span-4">PROFESSOR / SALA</div>
          <div className="col-span-3">HORÁRIO / DATA</div>
          <div className="col-span-3">TIPO DA SOLICITAÇÃO</div>
          <div className="col-span-2 text-right">AÇÕES</div>
        </div>

        {/* Corpo da Tabela Dinâmico */}
        <div className="divide-y divide-gray-200">
          {currentRequests.length > 0 ? (
            currentRequests.map((req) => {
              const badge = typeBadges[req.tipo] ?? typeBadges.RESERVA;
              const isProcessing = processingId === req.id;

              return (
                <div
                  key={req.id}
                  onClick={() => openDetails(req)}
                  className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50/80 cursor-pointer transition-colors"
                >
                  {/* Professor / Sala */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="w-1.5 h-10 bg-[#000666] rounded-sm shrink-0"></div>
                    <div>
                      <p className="font-bold text-base text-[#000666]">{req.professor}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{req.sala}</p>
                    </div>
                  </div>

                  {/* Horário / Data */}
                  <div className="col-span-3">
                    <p className="text-sm text-gray-800">{req.data}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{req.horario}</p>
                  </div>

                  {/* Tipo */}
                  <div className="col-span-3">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${badge.classes}`}>
                      {badge.text}
                    </span>
                  </div>

                  {/* Botões de Ação com Stop Propagation */}
                  <div className="col-span-2 flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onAccept(req.id)}
                      disabled={isProcessing}
                      className="px-4 py-1.5 bg-[#000666] text-white rounded text-xs font-semibold hover:bg-blue-900 transition-colors disabled:opacity-50"
                    >
                      Aceitar
                    </button>
                    <button
                      onClick={() => onReject(req.id)}
                      disabled={isProcessing}
                      className="px-4 py-1.5 border border-[#d90000] text-[#d90000] rounded text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-10 text-center text-gray-500 text-sm">
              Nenhuma solicitação encontrada com os filtros aplicados.
            </div>
          )}
        </div>

        {/* Controles de Paginação Dinâmicos */}
        {solicitacoesFiltradas.length > itemsPerPage && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-[#f8f9fa]">
            <span className="text-sm text-gray-500">
              Mostrando <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> a{" "}
              <span className="font-medium text-gray-900">
                {Math.min(indexOfLastItem, solicitacoesFiltradas.length)}
              </span>{" "}
              de <span className="font-medium text-gray-900">{solicitacoesFiltradas.length}</span> resultados
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-sm font-medium text-gray-700 px-2">
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <AdminRequestDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
        onAccept={onAccept}
        onReject={onReject}
      />
    </>
  );
}
