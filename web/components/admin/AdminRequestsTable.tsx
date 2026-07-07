"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AdminRequestDetailsModal from "./AdminRequestDetailsModal";

export interface Solicitacao {
  id: number;
  professor: string;
  sala: string;
  horario: string;
  data: string;
  motivo: string;
  tipo?: "TROCA" | "EMPRESTIMO" | "NOVA";
  frequencia?: string;          
  responsavelAtual?: string;    
  descricao?: string;           
}

interface AdminRequestsTableProps {
  initialRequests: Solicitacao[];
}

export default function AdminRequestsTable({ initialRequests }: AdminRequestsTableProps) {
  // Estado do filtro baseado exatamente no seu modelo funcional de abas
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Estados para controle do Modal Detalhado
  const [selectedRequest, setSelectedRequest] = useState<Solicitacao | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtragem em tempo de execução direto da propriedade recebida
  const solicitacoesFiltradas = initialRequests.filter((req) => {
    if (tipoFiltro === "Todos") return true;
    return req.tipo === tipoFiltro;
  });

  // Paginação recalculada dinamicamente com base no filtro ativo
  const totalPages = Math.ceil(solicitacoesFiltradas.length / itemsPerPage);
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
    setCurrentPage(1); // Evita bugs de página órfã ao filtrar
  };

  const handleAccept = (id: number) => {
    alert(`Solicitação #${id} aceita com sucesso!`);
  };

  const handleReject = (id: number) => {
    alert(`Solicitação #${id} recusada.`);
  };

  const openDetails = (req: Solicitacao) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  // Mapeamento visual estético dos Badges de Tipo
  const typeBadges: Record<string, { text: string; classes: string }> = {
    NOVA: { text: "Nova", classes: "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-600" },
    EMPRESTIMO: { text: "Empréstimo", classes: "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-600" },
    TROCA: { text: "Troca", classes: "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-600" },
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
            {(["Todos", "NOVA", "EMPRESTIMO", "TROCA"] as const).map((tab) => {
              const labelMap = { Todos: "Todos", NOVA: "Novas", EMPRESTIMO: "Empréstimos", TROCA: "Trocas" };
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

        {/* Cabeçalho das Colunas — Trocado de vez "MOTIVO" por "TIPO DA SOLICITAÇÃO" */}
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
              // Fallback para caso o objeto não tenha tipo definido no banco/mock
              const badge = typeBadges[req.tipo || "NOVA"] || typeBadges.NOVA;

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

                  {/* Coluna de Tipo Substituindo Completo o Antigo Motivo */}
                  <div className="col-span-3">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${badge.classes}`}>
                      {badge.text}
                    </span>
                  </div>

                  {/* Botões de Ação com Stop Propagation */}
                  <div className="col-span-2 flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => handleAccept(req.id)}
                      className="px-4 py-1.5 bg-[#000666] text-white rounded text-xs font-semibold hover:bg-blue-900 transition-colors"
                    >
                      Aceitar
                    </button>
                    <button 
                      onClick={() => handleReject(req.id)}
                      className="px-4 py-1.5 border border-[#d90000] text-[#d90000] rounded text-xs font-semibold hover:bg-red-50 transition-colors"
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
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </>
  );
}