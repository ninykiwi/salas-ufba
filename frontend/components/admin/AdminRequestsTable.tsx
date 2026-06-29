"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Solicitacao {
  id: number;
  professor: string;
  sala: string;
  horario: string;
  data: string;
  motivo: string;
}

interface AdminRequestsTableProps {
  initialRequests: Solicitacao[];
}

export default function AdminRequestsTable({ initialRequests }: AdminRequestsTableProps) {
  const [requests] = useState<Solicitacao[]>(initialRequests);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = requests.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-12">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-bold text-[#000666]">Solicitações Pendentes</h3>
        <span className="text-xs font-bold bg-[#f0f4ff] text-[#000666] px-3 py-1 rounded-full">
          {requests.length} totais
        </span>
      </div>

      {/* Table Column Headers */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#f8f9fa] border-b border-gray-200 text-xs font-bold text-gray-500 tracking-wider">
        <div className="col-span-4">PROFESSOR / SALA</div>
        <div className="col-span-3">HORÁRIO / DATA</div>
        <div className="col-span-3">MOTIVO</div>
        <div className="col-span-2 text-right">AÇÕES</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {currentRequests.map((req) => (
          <div
            key={req.id}
            className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50 transition-colors"
          >
            <div className="col-span-4 flex items-center gap-4">
              <div className="w-1.5 h-10 bg-[#000666] rounded-sm"></div>
              <div>
                <p className="font-bold text-base text-[#000666]">{req.professor}</p>
                <p className="text-sm text-gray-500 mt-0.5">{req.sala}</p>
              </div>
            </div>

            <div className="col-span-3">
              <p className="text-base text-gray-800">{req.horario}</p>
              <p className="text-sm text-gray-500 mt-0.5">{req.data}</p>
            </div>

            <div className="col-span-3">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#e9ecef] text-gray-700">
                {req.motivo}
              </span>
            </div>

            <div className="col-span-2 flex justify-end gap-2">
              <button className="px-4 py-1.5 bg-[#000666] text-white rounded text-xs font-semibold hover:bg-blue-900 transition-colors">
                Aceitar
              </button>
              <button className="px-4 py-1.5 border border-[#d90000] text-[#d90000] rounded text-xs font-semibold hover:bg-red-50 transition-colors">
                Recusar
              </button>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhuma solicitação pendente no momento.
          </div>
        )}
      </div>

      {/* Controles de Paginação */}
      {requests.length > itemsPerPage && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-[#f8f9fa]">
          <span className="text-sm text-gray-500">
            Mostrando <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> a{" "}
            <span className="font-medium text-gray-900">
              {Math.min(indexOfLastItem, requests.length)}
            </span>{" "}
            de <span className="font-medium text-gray-900">{requests.length}</span> resultados
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
  );
}