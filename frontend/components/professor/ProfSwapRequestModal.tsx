"use client";

import { useEffect, useRef, useState } from "react";
import { X, ArrowLeftRight, UserCheck, Calendar, ShieldAlert } from "lucide-react";

interface ProfSwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  currentEventTitle?: string;
}

type UserRole = "RESPONSAVEL" | "OUTRO_DOCENTE";
type ProposalType = "PONTUAL" | "RECORRENTE";

export default function ProfSwapRequestModal({
  isOpen,
  onClose,
  roomName,
  currentEventTitle,
}: ProfSwapRequestModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Estado para saber quem está operando o modal
  const [userRole, setUserRole] = useState<UserRole>("RESPONSAVEL");
  
  // Estado para o tipo de proposta (caso seja "Outro Docente")
  const [proposalType, setProposalType] = useState<ProposalType>("PONTUAL");

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-lg mx-4 overflow-hidden"
      >
        {/* Cabeçalho */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2 text-[#000666]">
            {userRole === "RESPONSAVEL" ? <ArrowLeftRight size={18} /> : <UserCheck size={18} />}
            <h3 className="font-bold text-sm uppercase tracking-wide">
              Solicitação de Espaço — {roomName}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* ABA PRINCIPAL: Quem é você em relação a esta sala? */}
        <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-100/50 p-1.5 gap-1 text-center text-xs">
          <button
            type="button"
            onClick={() => setUserRole("RESPONSAVEL")}
            className={`py-2 font-bold rounded-lg transition-colors ${
              userRole === "RESPONSAVEL" ? "bg-white text-[#000666] shadow-sm" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Sou o responsável atual por esta sala
          </button>
          <button
            type="button"
            onClick={() => setUserRole("OUTRO_DOCENTE")}
            className={`py-2 font-bold rounded-lg transition-colors ${
              userRole === "OUTRO_DOCENTE" ? "bg-white text-[#000666] shadow-sm" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Quero pedir esta sala emprestada
          </button>
        </div>

        {/* Formulário Dinâmico */}
        <div className="p-6 flex flex-col gap-4">
          
          {/* FLUXO 1: SOU O RESPONSÁVEL DA SALA (Direto para o Admin) */}
          {userRole === "RESPONSAVEL" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Solicitação de troca permanente enviada direto para a aprovação do Administrador.");
                onClose();
              }}
              className="flex flex-col gap-4 animate-fade-in"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
                Esta ação enviará um pedido de permuta diretamente para a <strong>Administração do Sistema</strong> para realocar permanentemente sua atividade.
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Sua Sala Desejada (Alvo da Troca)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pavilhão II - Sala 204"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:border-[#000666] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Justificativa para a Coordenação / Admin
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explique o motivo técnico/didático da necessidade de troca definitiva..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:border-[#000666] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#000666] text-white rounded-lg text-xs font-semibold uppercase hover:opacity-90">Enviar ao Admin</button>
              </div>
            </form>
          )}

          {/* FLUXO 2: SOU OUTRO DOCENTE (Proposta Direta para o Responsável Atual) */}
          {userRole === "OUTRO_DOCENTE" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Proposta de uso [${proposalType}] enviada diretamente ao docente responsável atual.`);
                onClose();
              }}
              className="flex flex-col gap-4 animate-fade-in"
            >
              {/* Sub-Abas para escolher Tipo de Proposta */}
              <div className="flex bg-gray-100 p-1 rounded-lg gap-1 text-center text-xs">
                <button
                  type="button"
                  onClick={() => setProposalType("PONTUAL")}
                  className={`flex-1 py-1.5 font-semibold rounded-md transition-colors ${proposalType === "PONTUAL" ? "bg-[#000666] text-white" : "text-gray-600 hover:bg-gray-200"}`}
                >
                  Uso Exclusivo (1 Dia)
                </button>
                <button
                  type="button"
                  onClick={() => setProposalType("RECORRENTE")}
                  className={`flex-1 py-1.5 font-semibold rounded-md transition-colors ${proposalType === "RECORRENTE" ? "bg-[#000666] text-white" : "text-gray-600 hover:bg-200"}`}
                >
                  Uso Semanal (Toda semana)
                </button>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 leading-relaxed">
                <strong>📍 Destinatário:</strong> Esta proposta irá para o painel do professor responsável por <span className="italic">"{currentEventTitle || "este horário"}"</span>. Se ele aceitar no sistema, o espaço será temporariamente liberado para você.
              </div>

              {proposalType === "PONTUAL" ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Data Desejada</label>
                    <input type="date" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:border-[#000666] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Horário do Turno</label>
                    <input type="text" required placeholder="Ex: 07:55 — 09:35" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:border-[#000666] focus:outline-none" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dia Fixo Semanal</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:border-[#000666] focus:outline-none">
                      <option value="2">Segunda-feira</option>
                      <option value="3">Terça-feira</option>
                      <option value="4">Quarta-feira</option>
                      <option value="5">Quinta-feira</option>
                      <option value="6">Sexta-feira</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Horário Semanal</label>
                    <input type="text" required placeholder="Ex: 13:00 às 14:50" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:border-[#000666] focus:outline-none" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mensagem Cordial ao Professor</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Escreva uma mensagem explicando seu caso (ex: 'Prezado colega, preciso aplicar uma avaliação que exige os computadores deste laboratório...')"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:border-[#000666] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#000666] text-white rounded-lg text-xs font-semibold uppercase hover:opacity-90">Enviar Proposta</button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}