"use client";

import { useState, useEffect } from "react";
import { Usuario } from "./AdminUserTable";
import { Loader2 } from "lucide-react";

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
  onUserUpdated: () => void;
}

export default function AdminUserModals({
  isEditOpen,
  isDeleteOpen,
  onCloseEdit,
  onCloseDelete,
  selectedUser,
  institutes,
  onUserUpdated,
}: AdminUserModalsProps) {
  // Estados para Edição do Usuário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [siape, setSiape] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PROFESSOR");
  const [selectedInstituteIds, setSelectedInstituteIds] = useState<string[]>([]);
  
  // Controle de Submissão e Erros
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Informações do Usuário Logado
  const [currentUserRole, setCurrentUserRole] = useState("PROFESSOR");
  const [currentUserInstitutes, setCurrentUserInstitutes] = useState<any[]>([]);

  // Carrega e preenche os dados do modal quando abrir
  useEffect(() => {
    // Pegar usuário logado
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUserRole(storedUser.role || "PROFESSOR");
    setCurrentUserInstitutes(storedUser.institutes || []);

    if (selectedUser) {
      setName(selectedUser.nome);
      setEmail(selectedUser.email);
      setSiape(selectedUser.siape === "N/A" ? "" : selectedUser.siape);
      setPassword("");
      setRole(selectedUser.role || "PROFESSOR");
      setSelectedInstituteIds(
        selectedUser.institutes?.map((inst) => String(inst.id)) || []
      );
      setError("");
    }
  }, [selectedUser, isEditOpen]);

  // Filtra institutos que o ADMIN logado pode gerenciar
  const allowedInstitutes = currentUserRole === "SUPERADMIN"
    ? institutes
    : institutes.filter((inst) =>
        currentUserInstitutes.some((admInst) => String(admInst.id) === String(inst.id))
      );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Nome completo é obrigatório");
    if (!email.trim()) return setError("E-mail institucional é obrigatório");
    if (selectedInstituteIds.length === 0) {
      return setError("Selecione pelo menos um instituto/unidade");
    }

    if (password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.\-_])[A-Za-z\d@$!%*?&#.\-_]{8,}$/;
      if (!passwordRegex.test(password)) {
        setError(
          "A nova senha deve ter no mínimo 8 caracteres, com pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial (!@#$%)."
        );
        return;
      }
    }

    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:3001/users/${selectedUser?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          siape: siape.trim() || null,
          password: password || undefined,
          role,
          instituteIds: selectedInstituteIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erro ao atualizar usuário");
      }

      onUserUpdated();
      onCloseEdit();
    } catch (err: any) {
      setError(err.message || "Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:3001/users/${selectedUser?.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao excluir usuário");
      }

      onUserUpdated();
      onCloseDelete();
    } catch (err: any) {
      setError(err.message || "Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedInstituteIds([...selectedInstituteIds, id]);
    } else {
      setSelectedInstituteIds(selectedInstituteIds.filter((item) => item !== id));
    }
  };

  return (
    <>
      {/* Modal de Exclusão */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir Usuário</h3>
            <p className="text-sm text-gray-500 mb-4">
              Tem certeza que deseja remover <strong>{selectedUser?.nome}</strong>? Esta ação não
              pode ser desfeita.
            </p>

            {error && (
              <div className="mb-4 p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={onCloseDelete}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
              >
                CANCELAR
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                CONFIRMAR EXCLUSÃO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 context-modal">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto border border-gray-100"
          >
            <h3 className="text-lg font-bold text-[#000666] mb-5 border-b pb-2">
              Editar Perfil do Usuário
            </h3>

            {error && (
              <div className="mb-5 p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded font-semibold">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  E-mail Institucional
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none"
                  required
                />
              </div>

              {/* Matrícula / SIAPE */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Matrícula (SIAPE)
                </label>
                <input
                  type="text"
                  value={siape}
                  onChange={(e) => setSiape(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none"
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Nova Senha (deixe em branco para não alterar)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none"
                />
              </div>

              {/* Permissão / Função */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Permissão de Acesso
                </label>
                {currentUserRole === "SUPERADMIN" ? (
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none"
                  >
                    <option value="PROFESSOR">Professor</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                ) : (
                  <div className="w-full bg-gray-50 border border-gray-200 text-gray-600 rounded-md p-2 text-sm font-semibold select-none">
                    {role === "ADMIN" ? "Administrador" : "Professor"}
                  </div>
                )}
              </div>

              {/* Instituto / Faculdade (Checkbox List) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Instituto / Unidade (Selecione pelo menos um)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                  {allowedInstitutes.map((inst) => {
                    const isChecked = selectedInstituteIds.includes(String(inst.id));
                    return (
                      <label
                        key={inst.id}
                        className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded p-2 hover:bg-gray-100 cursor-pointer select-none transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleCheckboxChange(String(inst.id), e.target.checked)}
                          className="rounded text-[#000666] focus:ring-[#000666]"
                        />
                        <span className="truncate">{inst.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 border-t pt-4">
              <button
                type="button"
                onClick={onCloseEdit}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-[#000666] text-white rounded font-bold text-sm hover:bg-blue-900 transition-colors disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                SALVAR ALTERAÇÕES
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}