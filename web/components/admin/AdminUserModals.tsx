"use client";

import { Usuario } from "./AdminUserTable";

interface InstituteOption {
  id: string | number;
  name: string;
}

interface AdminUserModalsProps {
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
  selectedUser: Usuario | null;
  institutes: InstituteOption[];
}

export default function AdminUserModals({
  isEditOpen,
  isDeleteOpen,
  onCloseEdit,
  onCloseDelete,
  selectedUser,
  institutes,
}: AdminUserModalsProps) {
  return (
    <>
      {/* Modal de Exclusão */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir Usuário</h3>
            <p className="text-sm text-gray-500 mb-6">
              Tem certeza que deseja remover <strong>{selectedUser?.nome}</strong>? Esta ação não
              pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={onCloseDelete}
                className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded transition-colors"
              >
                CANCELAR
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded font-bold text-sm hover:bg-red-700 transition-colors">
                CONFIRMAR EXCLUSÃO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição Expandido */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 context-modal">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#000666] mb-5 border-b pb-2">
              Editar Perfil do Usuário
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  defaultValue={selectedUser?.nome}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  E-mail Institucional
                </label>
                <input
                  type="email"
                  defaultValue={selectedUser?.email}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none"
                />
              </div>

              {/* Matrícula / SIAPE */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Matrícula (SIAPE)
                </label>
                <input
                  type="text"
                  defaultValue={selectedUser?.siape}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none"
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Nova Senha
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none"
                />
              </div>

              {/* Permissão / Função */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Permissão de Acesso
                </label>
                <select
                  defaultValue={selectedUser?.funcao}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none"
                >
                  <option value="PROFESSOR">Professor</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </select>
              </div>

              {/* Instituto / Faculdade */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Instituto / Unidade
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none"
                  defaultValue={
                    selectedUser?.departamento.includes("Computação") ? 1 : 2
                  }
                >
                  {institutes.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 border-t pt-4">
              <button
                onClick={onCloseEdit}
                className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded transition-colors"
              >
                CANCELAR
              </button>
              <button className="px-4 py-2 bg-[#000666] text-white rounded font-bold text-sm hover:bg-blue-900 transition-colors">
                SALVAR ALTERAÇÕES
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}