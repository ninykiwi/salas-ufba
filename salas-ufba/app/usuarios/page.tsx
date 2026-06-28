"use client";

import { useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ChevronLeft, ChevronRight, UserPlus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

const mockCampuses = [{ id: 1, name: "Campus Ondina" }];

const mockInstitutes = [
  { id: 1, name: "Instituto de Computação" },
  { id: 2, name: "Faculdade de Direito" },
];

// 1. Interface para tipar os usuários
interface Usuario {
  id: number;
  nome: string;
  iniciais: string;
  email: string;
  siape: string;
  funcao: "ADMINISTRADOR" | "PROFESSOR";
  departamento: string;
  ultimoAcesso: string;
}

// 2. Dados de demonstração baseados na imagem
const mockUsers: Usuario[] = [
  { id: 1, nome: "Rodrigo Lima", iniciais: "RL", email: "rodrigo.lima@ufba.br", siape: "1029384", funcao: "ADMINISTRADOR", departamento: "Depto. de Ciência da Computação", ultimoAcesso: "HOJE" },
  { id: 2, nome: "Ana Silva", iniciais: "AS", email: "ana.silva@ufba.br", siape: "2283741", funcao: "PROFESSOR", departamento: "Depto. de Matemática", ultimoAcesso: "2 DIAS ATRÁS" },
  { id: 3, nome: "Marcos Costa", iniciais: "MC", email: "m.costa@ufba.br", siape: "1982736", funcao: "PROFESSOR", departamento: "Depto. de Ciência da Computação", ultimoAcesso: "ONTEM" },
  { id: 4, nome: "Carla Mendes", iniciais: "CM", email: "carla.mendes@ufba.br", siape: "3482711", funcao: "PROFESSOR", departamento: "Depto. de Física", ultimoAcesso: "HOJE" },
  { id: 5, nome: "João Pedro", iniciais: "JP", email: "joao.pedro@ufba.br", siape: "9384756", funcao: "ADMINISTRADOR", departamento: "Depto. de Ciência da Computação", ultimoAcesso: "5 DIAS ATRÁS" },
  { id: 6, nome: "Fernanda Lima", iniciais: "FL", email: "f.lima@ufba.br", siape: "2233445", funcao: "PROFESSOR", departamento: "Depto. de Estatística", ultimoAcesso: "HOJE" },
  { id: 7, nome: "Lucas Alves", iniciais: "LA", email: "lucas.alves@ufba.br", siape: "5566778", funcao: "PROFESSOR", departamento: "Depto. de Ciência da Computação", ultimoAcesso: "ONTEM" },
];

type FilterTab = "Todos" | "Professores" | "Administradores";

export default function GestaoUsuarios() {
  const [selectedCampus, setSelectedCampus] = useState<number | null>(1);
  const [selectedInstitute, setSelectedInstitute] = useState<number | null>(1);

  // Estados para os filtros e paginação
  const [activeTab, setActiveTab] = useState<FilterTab>("Todos");
  const [selectedDept, setSelectedDept] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtragem dos usuários baseada nas abas e no departamento selecionado
  const filteredUsers = mockUsers.filter((user) => {
    const matchTab = 
      activeTab === "Todos" ? true : 
      activeTab === "Professores" ? user.funcao === "PROFESSOR" : 
      user.funcao === "ADMINISTRADOR";
    
    const matchDept = selectedDept === "Todos" || user.departamento === selectedDept;

    return matchTab && matchDept;
  });

  // Cálculos da paginação reutilizados
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

  // Estados para os Modais
const [isEditOpen, setIsEditOpen] = useState(false);
const [isDeleteOpen, setIsDeleteOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

// Funções para abrir os modais
const openEdit = (user: Usuario) => { setSelectedUser(user); setIsEditOpen(true); };
const openDelete = (user: Usuario) => { setSelectedUser(user); setIsDeleteOpen(true); };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar activeHref="/configuracoes/usuarios" />

        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminTopBar />

          <main className="flex-1 overflow-y-auto px-8 py-6">
            
            {/* Header da Página conforme Imagem */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Gestão de Usuários</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Gerencie as permissões e perfis de professores e administradores do sistema.
                </p>
              </div>
              
              <Link href="/usuarios/cadastrar-usuario">
                <button className="flex items-center gap-2 px-6 py-3 bg-[#000666] text-white rounded-md font-bold text-sm tracking-wide hover:bg-blue-900 transition-colors shadow-sm">
                  <UserPlus size={18} />
                  NOVO USUÁRIO
                </button>
              </Link>
            </div>

            {/* Container da Tabela Redesenhada */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-6 shadow-sm">
              
              {/* Barra de Filtros Superior */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                
                {/* Tabs / Pills */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  {(["Todos", "Professores", "Administradores"] as FilterTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
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

                {/* Filtro Dropdown */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">Filtrar por Departamento:</span>
                  <select 
                    value={selectedDept}
                    onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(1); }}
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
                  <div key={user.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50 transition-colors">
                    
                    {/* NOME COMPLETO & AVATAR */}
                    <div className="col-span-3 flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-full flex flex-shrink-0 items-center justify-center font-bold text-sm ${
                        user.funcao === 'ADMINISTRADOR' 
                          ? 'bg-[#002060] text-white' // Cor baseada no "RL" da imagem
                          : 'bg-[#e0e4e8] text-gray-600' // Cor baseada no "AS" e "MC" da imagem
                      }`}>
                        {user.iniciais}
                      </div>
                      <div>
                        <p className="font-bold text-base text-[#000666] whitespace-nowrap">{user.nome}</p>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase mt-0.5 tracking-wider">
                          Último acesso: {user.ultimoAcesso}
                        </p>
                      </div>
                    </div>
                    
                    {/* EMAIL / SIAPE */}
                    <div className="col-span-3">
                      <p className="text-sm font-medium text-gray-800">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wider">SIAPE: {user.siape}</p>
                    </div>
                    
                    {/* FUNÇÃO */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                        user.funcao === 'ADMINISTRADOR'
                          ? 'bg-[#000666] text-white border-transparent'
                          : 'bg-white text-gray-500 border-gray-300'
                      }`}>
                        {user.funcao}
                      </span>
                    </div>

                    {/* DEPARTAMENTO */}
                    <div className="col-span-3">
                      <p className="text-sm text-gray-600 leading-snug">{user.departamento}</p>
                    </div>
                    
                    {/* AÇÕES */}
                    <div className="col-span-1 flex justify-end gap-3">
                      <button 
                        onClick={() => openEdit(user)} 
                        className="p-1.5 text-gray-400 hover:text-[#000666] hover:bg-gray-100 rounded transition-colors"
                      >
                        <Pencil size={18} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => openDelete(user)} 
                        className="p-1.5 text-[#d94848] hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={18} strokeWidth={2.5} />
                      </button>
                    </div>

                  </div>
                ))}

                {/* Estado Vazio caso a busca não retorne nada */}
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
                    Mostrando <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> a <span className="font-medium text-gray-900">{Math.min(indexOfLastItem, filteredUsers.length)}</span> de <span className="font-medium text-gray-900">{filteredUsers.length}</span> usuários
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handlePrevPage} 
                      disabled={currentPage === 1}
                      className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    {/* Renderiza números das páginas */}
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

          </main>
        </div>
      </div>

      {/* Modal de Exclusão */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir Usuário</h3>
            <p className="text-sm text-gray-500 mb-6">Tem certeza que deseja remover <strong>{selectedUser?.nome}</strong>? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-600">CANCELAR</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded font-bold text-sm hover:bg-red-700">CONFIRMAR EXCLUSÃO</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-bold text-[#000666] mb-4">Editar Usuário</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome</label>
                <input defaultValue={selectedUser?.nome} className="w-full border border-gray-300 rounded p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Função</label>
                <select defaultValue={selectedUser?.funcao} className="w-full border border-gray-300 rounded p-2 text-sm">
                  <option value="PROFESSOR">Professor</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-600">CANCELAR</button>
              <button className="px-4 py-2 bg-[#000666] text-white rounded font-bold text-sm">SALVAR ALTERAÇÕES</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}