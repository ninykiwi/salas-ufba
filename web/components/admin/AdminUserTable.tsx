"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";

export interface Usuario {
  id: string | number;
  nome: string;
  iniciais: string;
  email: string;
  siape: string;
  funcao: "ADMINISTRADOR" | "PROFESSOR";
  departamento: string;
  ultimoAcesso: string;
}

type FilterTab = "Todos" | "Professores" | "Administradores";

interface AdminUserTableProps {
  users: Usuario[];
  onEdit: (user: Usuario) => void;
  onDelete: (user: Usuario) => void;
}

export default function AdminUserTable({ users, onEdit, onDelete }: AdminUserTableProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("Todos");
  const [selectedDept, setSelectedDept] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredUsers = users.filter((user) => {
    const matchTab =
      activeTab === "Todos"
        ? true
        : activeTab === "Professores"
        ? user.funcao === "PROFESSOR"
        : user.funcao === "ADMINISTRADOR";

    const matchDept = selectedDept === "Todos" || user.departamento === selectedDept;

    return matchTab && matchDept;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-6 shadow-sm">
      {/* Barra de Filtros Superior */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {(["Todos", "Professores", "Administradores"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-[#000666] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">Filtrar por Departamento:</span>
          <select
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#000666] focus:border-[#000666]"
          >
            <option value="Todos">Todos</option>
            <option value="Depto. de Ciência da Computação">Depto. de Ciência da Computação</option>
            <option value="Depto. de Matemática">Depto. de Matemática</option>
            <option value="Depto. de Física">Depto. de Física</option>
            <option value="Depto. de Estatística">Depto. de Estatística</option>
          </select>
        </div>
      </div>

      {/* Cabeçalho da Tabela */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
        <div className="col-span-3">NOME COMPLETO</div>
        <div className="col-span-3">EMAIL / SIAPE</div>
        <div className="col-span-2">FUNÇÃO</div>
        <div className="col-span-3">DEPARTAMENTO</div>
        <div className="col-span-1 text-right">AÇÕES</div>
      </div>

      {/* Corpo da Tabela */}
      <div className="divide-y divide-gray-100">
        {currentUsers.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50 transition-colors"
          >
            <div className="col-span-3 flex items-center gap-4">
              <div
                className={`w-11 h-11 rounded-full flex flex-shrink-0 items-center justify-center font-bold text-sm ${
                  user.funcao === "ADMINISTRADOR"
                    ? "bg-[#002060] text-white"
                    : "bg-[#e0e4e8] text-gray-600"
                }`}
              >
                {user.iniciais}
              </div>
              <div>
                <p className="font-bold text-base text-[#000666] whitespace-nowrap">{user.nome}</p>
                <p className="text-[11px] font-semibold text-gray-400 uppercase mt-0.5 tracking-wider">
                  Último acesso: {user.ultimoAcesso}
                </p>
              </div>
            </div>

            <div className="col-span-3">
              <p className="text-sm font-medium text-gray-800">{user.email}</p>
              <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wider">
                SIAPE: {user.siape}
              </p>
            </div>

            <div className="col-span-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                  user.funcao === "ADMINISTRADOR"
                    ? "bg-[#000666] text-white border-transparent"
                    : "bg-white text-gray-500 border-gray-300"
                }`}
              >
                {user.funcao}
              </span>
            </div>

            <div className="col-span-3">
              <p className="text-sm text-gray-600 leading-snug">{user.departamento}</p>
            </div>

            <div className="col-span-1 flex justify-end gap-3">
              <button
                onClick={() => onEdit(user)}
                className="p-1.5 text-gray-400 hover:text-[#000666] hover:bg-gray-100 rounded transition-colors"
              >
                <Pencil size={18} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => onDelete(user)}
                className="p-1.5 text-[#d94848] hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            Nenhum usuário encontrado para os filtros selecionados.
          </div>
        )}
      </div>

      {/* Controles de Paginação */}
      {filteredUsers.length > itemsPerPage && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
          <span className="text-sm text-gray-500">
            Mostrando <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> a{" "}
            <span className="font-medium text-gray-900">
              {Math.min(indexOfLastItem, filteredUsers.length)}
            </span>{" "}
            de <span className="font-medium text-gray-900">{filteredUsers.length}</span> usuários
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-semibold transition-colors ${
                    currentPage === page
                      ? "bg-[#000666] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}