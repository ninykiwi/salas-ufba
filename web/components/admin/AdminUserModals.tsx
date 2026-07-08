"use client";

import { useState, useEffect, useRef } from "react";
import { Usuario } from "./AdminUserTable";
import { Loader2, Building2, ChevronDown } from "lucide-react";
import { updateUser, deleteUser, Role } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("PROFESSOR");
  const [selectedInstituteId, setSelectedInstituteId] = useState<string | null>(null);
  const [instituteOpen, setInstituteOpen] = useState(false);
  const instituteRef = useRef<HTMLDivElement>(null);

  // Controle de Submissão e Erros
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Informações do Usuário Logado
  const { user: currentUser } = useAuth();
  const currentUserRole = currentUser?.role || "PROFESSOR";
  const currentUserInstitutes = currentUser?.institutes || [];

  // Carrega e preenche os dados do modal quando abrir
  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.nome);
      setEmail(selectedUser.email);
      setSiape(selectedUser.siape === "N/A" ? "" : selectedUser.siape);
      setPassword("");
      setConfirmPassword("");
      setRole((selectedUser.role as Role) || "PROFESSOR");
      setSelectedInstituteId(
        selectedUser.institutes?.[0] ? String(selectedUser.institutes[0].id) : null
      );
      setError("");
      setPasswordError("");
      setConfirmPasswordError("");
    }
  }, [selectedUser, isEditOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (instituteRef.current && !instituteRef.current.contains(e.target as Node)) {
        setInstituteOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtra institutos que o ADMIN logado pode gerenciar
  const allowedInstitutes = currentUserRole === "SUPERADMIN"
    ? institutes
    : institutes.filter((inst) =>
        currentUserInstitutes.some((admInst) => String(admInst.id) === String(inst.id))
      );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmPasswordError("");

    if (!name.trim()) return setError("Nome completo é obrigatório");
    if (!email.trim()) return setError("E-mail institucional é obrigatório");

    if (password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
      let hasFieldError = false;

      if (!passwordRegex.test(password)) {
        setPasswordError(
          "Deve conter pelo menos 8 caracteres, sendo 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial"
        );
        hasFieldError = true;
      }

      if (password !== confirmPassword) {
        setConfirmPasswordError("As senhas não coincidem");
        hasFieldError = true;
      }

      if (hasFieldError) return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await updateUser(String(selectedUser?.id), {
        name,
        email,
        siape: siape.trim() || null,
        password: password || undefined,
        role,
        instituteIds: selectedInstituteId ? [selectedInstituteId] : [],
      });

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
      await deleteUser(String(selectedUser?.id));

      onUserUpdated();
      onCloseDelete();
    } catch (err: any) {
      setError(err.message || "Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
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
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Nova Senha (deixe em branco para não alterar)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none ${
                    passwordError ? "border-red-500 border-dashed" : "border-gray-300"
                  }`}
                />
                {passwordError && (
                  <p className="mt-1 text-xs text-red-600 font-semibold">{passwordError}</p>
                )}
              </div>

              {/* Repetir Senha */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Repetir Senha
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none ${
                    confirmPasswordError ? "border-red-500 border-dashed" : "border-gray-300"
                  }`}
                />
                {confirmPasswordError && (
                  <p className="mt-1 text-xs text-red-600 font-semibold">{confirmPasswordError}</p>
                )}
              </div>

              {/* Permissão / Função */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Permissão de Acesso
                </label>
                {currentUserRole === "SUPERADMIN" ? (
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
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

              {/* Instituto / Faculdade */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Instituto / Unidade (opcional)
                </label>
                <div className="relative" ref={instituteRef}>
                  <button
                    type="button"
                    onClick={() => setInstituteOpen((v) => !v)}
                    className="flex items-center justify-between gap-2 w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors bg-white"
                  >
                    <span className="flex items-center gap-2">
                      <Building2 size={14} className="text-gray-400" />
                      {allowedInstitutes.find((i) => String(i.id) === selectedInstituteId)?.name ?? "Nenhum instituto"}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  {instituteOpen && (
                    <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10 max-h-48 overflow-y-auto">
                      <li
                        onClick={() => {
                          setSelectedInstituteId(null);
                          setInstituteOpen(false);
                        }}
                        className="px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 cursor-pointer"
                      >
                        Nenhum instituto
                      </li>
                      {allowedInstitutes.map((inst) => (
                        <li
                          key={inst.id}
                          onClick={() => {
                            setSelectedInstituteId(String(inst.id));
                            setInstituteOpen(false);
                          }}
                          className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          {inst.name}
                        </li>
                      ))}
                    </ul>
                  )}
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