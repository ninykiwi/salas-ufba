"use client";

import { useEffect, useRef } from "react";
import { X, Calendar, Clock, FileText, User, HelpCircle, RefreshCw } from "lucide-react";
import { Solicitacao } from "./AdminRequestsTable"; // ajuste se o caminho for outro

interface AdminRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: Solicitacao | null;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}

export default function AdminRequestDetailsModal({
  isOpen,
  onClose,
  request,
  onAccept,
  onReject,
}: AdminRequestDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !request) return null;

  // Helpers para badges e estilos contextuais
  const typeLabels: Record<string, { text: string; styles: string }> = {
    TROCA: { text: "Solicitação de Troca", styles: "bg-amber-50 text-amber-700 border border-amber-200" },
    EMPRESTIMO: { text: "Empréstimo Temporário", styles: "bg-blue-50 text-blue-700 border border-blue-200" },
    NOVA: { text: "Nova Solicitação", styles: "bg-green-50 text-green-700 border border-green-200" },
  };

  const reqType = request.tipo || "NOVA";
  const typeInfo = typeLabels[reqType] || typeLabels.NOVA;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-lg mx-4 overflow-hidden transform transition-all"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex flex-col gap-1">
            <span className={`inline-self-start text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${typeInfo.styles}`}>
              {typeInfo.text}
            </span>
            <h3 className="font-bold text-gray-800 text-sm mt-1">
              Detalhes do Agendamento #{request.id}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">
          
          {/* Seção de Atores: Quem usa vs Quem quer usar */}
          {reqType === "EMPRESTIMO" || reqType === "TROCA" ? (
            <div className="grid grid-cols-2 gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs">
              <div className="flex flex-col gap-1 border-r border-gray-200 pr-3">
                <p className="text-gray-500 font-bold uppercase tracking-wide">Responsável Atual</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <User size={14} className="text-gray-400" />
                  <span className="font-bold text-gray-800">{request.responsavelAtual || "Não informado"}</span>
                </div>
                <p className="text-gray-400 mt-0.5">Cederá o espaço reservado</p>
              </div>
              <div className="flex flex-col gap-1 pl-3">
                <p className="text-[#000666] font-bold uppercase tracking-wide">Solicitante</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <User size={14} className="text-[#000666]" />
                  <span className="font-bold text-[#000666]">{request.professor}</span>
                </div>
                <p className="text-gray-400 mt-0.5">Deseja assumir o horário</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs">
              <User size={18} className="text-gray-400" />
              <div>
                <p className="text-gray-500 font-bold uppercase tracking-wide">Docente Solicitante</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{request.professor}</p>
              </div>
            </div>
          )}

          {/* Dados Cronológicos e Espaço */}
          <div className="grid grid-cols-2 gap-4 text-xs border-b border-gray-100 pb-4">
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 font-semibold uppercase">Ambiente Alvo</span>
              <span className="text-sm font-bold text-[#000666]">{request.sala}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 font-semibold uppercase">Periodicidade / Frequência</span>
              <div className="flex items-center gap-1 text-sm font-bold text-gray-800 mt-0.5">
                <RefreshCw size={12} className="text-gray-500" />
                <span>{request.frequencia || "Única (Pontual)"}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 font-semibold uppercase">Data / Dia</span>
              <div className="flex items-center gap-1 text-sm font-medium text-gray-800 mt-0.5">
                <Calendar size={13} className="text-gray-400" />
                <span>{request.data}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 font-semibold uppercase">Faixa de Horário</span>
              <div className="flex items-center gap-1 text-sm font-medium text-gray-800 mt-0.5">
                <Clock size={13} className="text-gray-400" />
                <span>{request.horario}</span>
              </div>
            </div>
          </div>

          {/* Motivo e Descrição Completa */}
          <div className="flex flex-col gap-2 text-xs">
            <span className="text-gray-400 font-semibold uppercase flex items-center gap-1">
              <FileText size={13} /> Justificativa Detalhada
            </span>
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-3.5 text-gray-700 leading-relaxed text-sm">
              <p className="font-bold text-xs text-gray-500 mb-1 uppercase">Contexto curto: {request.motivo}</p>
              <p className="italic text-gray-600">
                {request.descricao || "Nenhuma descrição textual complementar foi anexada a este pedido."}
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé com as Ações Administrativas */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={() => { onReject(request.id); onClose(); }}
            className="px-4 py-2 border border-[#d90000] text-[#d90000] rounded-lg text-xs font-bold uppercase hover:bg-red-50 transition-colors"
          >
            Recusar Solicitação
          </button>
          <button
            onClick={() => { onAccept(request.id); onClose(); }}
            className="px-4 py-2 bg-[#000666] text-white rounded-lg text-xs font-bold uppercase hover:bg-blue-900 transition-colors"
          >
            Aprovar e Agendar
          </button>
        </div>
      </div>
    </div>
  );
}