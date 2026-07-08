"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/home/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Info, ShieldCheck, Mail, Loader2, AlertTriangle, UserPlus, Building2, ChevronDown } from "lucide-react";
import { getInstitutes, createUser } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface Institute {
  id: string;
  name: string;
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
const PASSWORD_HELP_TEXT =
  "Deve conter pelo menos 8 caracteres, sendo 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial";

interface FieldErrors {
  name?: boolean;
  email?: boolean;
  siape?: boolean;
  password?: "required" | "weak";
  confirmPassword?: "required" | "mismatch";
}

export default function CadastrarUsuario() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [siape, setSiape] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"PROFESSOR" | "ADMIN">("PROFESSOR");
  const [selectedInstituteId, setSelectedInstituteId] = useState<string | null>(null);
  const [instituteOpen, setInstituteOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const instituteRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const inputErrorClass = (
    kind: "required" | "dashed" | undefined
  ) =>
    kind === "required"
      ? "border-red-500"
      : kind === "dashed"
      ? "border-red-500 border-dashed"
      : "border-gray-300";

  const router = useRouter();
  const { user } = useAuth();
  const currentUserRole = user?.role || "";

  useEffect(() => {
    if (!user) return;

    const loadInstitutes = async () => {
      try {
        if (user.role === "SUPERADMIN") {
          const data = await getInstitutes();
          setInstitutes(data);
          if (data.length > 0) {
            setSelectedInstituteId(data[0].id);
          }
        } else {
          // ADMIN can only register teachers inside the institutes they are associated with
          const adminInsts = user.institutes || [];
          setInstitutes(adminInsts);
          if (adminInsts.length > 0) {
            setSelectedInstituteId(adminInsts[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load institutes", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInstitutes();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (instituteRef.current && !instituteRef.current.contains(e.target as Node)) {
        setInstituteOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const rest = { ...prev };
      delete rest[field];
      return rest;
    });
  };

  const handlePasswordBlur = () => {
    if (password && !PASSWORD_REGEX.test(password)) {
      setFieldErrors((prev) => ({ ...prev, password: "weak" }));
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword && confirmPassword !== password) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: "mismatch" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = true;
    if (!email.trim()) errors.email = true;
    if (!siape.trim()) errors.siape = true;

    if (!password) {
      errors.password = "required";
    } else if (!PASSWORD_REGEX.test(password)) {
      errors.password = "weak";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "required";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "mismatch";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setError("");

    try {
      await createUser({
        name,
        email,
        password,
        role,
        siape: siape ? siape.trim() : undefined,
        instituteIds: selectedInstituteId ? [selectedInstituteId] : [],
      });

      router.push("/super-admin/usuarios");
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao cadastrar o usuário.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeHref="/super-admin/usuarios" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopBar />

        <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#000666]">Cadastrar Novo Usuário</h1>
              <p className="text-sm text-gray-500 mt-1">Adicione um novo docente ou administrador ao sistema Salas UFBA 2.0.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
              
              {/* Formulário de Cadastro (2/3 da largura) */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm space-y-6">
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm font-semibold flex items-start gap-2">
                      <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="font-bold text-sm text-gray-700">Nome Completo</label>
                    <input
                      className={`w-full border rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none ${inputErrorClass(
                        fieldErrors.name ? "required" : undefined
                      )}`}
                      placeholder="ex: João Silva"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearFieldError("name");
                      }}
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700">E-mail Institucional</label>
                      <input
                        type="email"
                        className={`w-full border rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none ${inputErrorClass(
                          fieldErrors.email ? "required" : undefined
                        )}`}
                        placeholder="usuario@ufba.br"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          clearFieldError("email");
                        }}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700">Matrícula SIAPE</label>
                      <input
                        className={`w-full border rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none ${inputErrorClass(
                          fieldErrors.siape ? "required" : undefined
                        )}`}
                        placeholder="ex: 1234567"
                        value={siape}
                        onChange={(e) => {
                          setSiape(e.target.value);
                          clearFieldError("siape");
                        }}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="font-bold text-sm text-gray-700">Senha de Acesso</label>
                        <input
                          type="password"
                          className={`w-full border rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none ${inputErrorClass(
                            fieldErrors.password === "required"
                              ? "required"
                              : fieldErrors.password === "weak"
                              ? "dashed"
                              : undefined
                          )}`}
                          placeholder="Mínimo 8 caracteres (Ex: Senha123!)"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            clearFieldError("password");
                          }}
                          onBlur={handlePasswordBlur}
                          disabled={isSubmitting}
                          required
                        />
                        {fieldErrors.password === "weak" ? (
                          <span className="text-red-500 text-xs mt-1 block">{PASSWORD_HELP_TEXT}</span>
                        ) : (
                          <span className="text-[10px] text-gray-400 block mt-1">
                            Deve conter pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="font-bold text-sm text-gray-700">Repetir Senha</label>
                        <input
                          type="password"
                          className={`w-full border rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none ${inputErrorClass(
                            fieldErrors.confirmPassword === "required"
                              ? "required"
                              : fieldErrors.confirmPassword === "mismatch"
                              ? "dashed"
                              : undefined
                          )}`}
                          placeholder="Confirme a senha"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            clearFieldError("confirmPassword");
                          }}
                          onBlur={handleConfirmPasswordBlur}
                          disabled={isSubmitting}
                          required
                        />
                        {fieldErrors.confirmPassword === "mismatch" && (
                          <span className="text-red-500 text-xs mt-1 block">As senhas não coincidem</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700">Associar a Instituto / Prédio (opcional)</label>
                      {isLoading ? (
                        <div className="flex items-center gap-2 h-11 text-xs text-gray-400">
                          <Loader2 size={16} className="animate-spin" />
                          <span>Carregando institutos...</span>
                        </div>
                      ) : (
                        <div className="relative" ref={instituteRef}>
                          <button
                            type="button"
                            onClick={() => setInstituteOpen((v) => !v)}
                            disabled={isSubmitting}
                            className="flex items-center justify-between gap-2 w-full border border-gray-300 rounded p-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors bg-white"
                          >
                            <span className="flex items-center gap-2">
                              <Building2 size={14} className="text-gray-400" />
                              {institutes.find((i) => i.id === selectedInstituteId)?.name ?? "Nenhum instituto"}
                            </span>
                            <ChevronDown size={14} className="text-gray-400" />
                          </button>
                          {instituteOpen && (
                            <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10 max-h-40 overflow-y-auto">
                              <li
                                onClick={() => {
                                  setSelectedInstituteId(null);
                                  setInstituteOpen(false);
                                }}
                                className="px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 cursor-pointer"
                              >
                                Nenhum instituto
                              </li>
                              {institutes.map((inst) => (
                                <li
                                  key={inst.id}
                                  onClick={() => {
                                    setSelectedInstituteId(inst.id);
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
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="font-bold text-sm text-gray-700 block mb-3">Tipo de Acesso</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="acesso"
                          value="PROFESSOR"
                          checked={role === "PROFESSOR"}
                          onChange={() => setRole("PROFESSOR")}
                          disabled={isSubmitting}
                          className="w-4 h-4 text-[#000666] accent-[#000666]"
                        />
                        <span className="text-sm text-gray-600">Professor</span>
                      </label>
                      
                      {currentUserRole === "SUPERADMIN" && (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="acesso"
                            value="ADMIN"
                            checked={role === "ADMIN"}
                            onChange={() => setRole("ADMIN")}
                            disabled={isSubmitting}
                            className="w-4 h-4 text-[#000666] accent-[#000666]"
                          />
                          <span className="text-sm text-gray-600">Administrador</span>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => router.push("/usuarios")}
                      disabled={isSubmitting}
                      className="px-8 py-2.5 border border-[#000666] text-[#000666] rounded font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      VOLTAR
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-2.5 bg-[#000666] text-white rounded font-bold text-sm hover:bg-blue-900 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          CADASTRANDO...
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} />
                          CADASTRAR USUÁRIO
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Sidebar de Avisos (1/3 da largura) */}
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex gap-4">
                  <Mail className="text-[#000666] shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-sm text-[#000666]">Matrícula SIAPE</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">A matrícula SIAPE é obrigatória para o login de professores e deve ser única no sistema.</p>
                  </div>
                </div>
                
                <div className="bg-gray-100 p-6 rounded-lg border border-gray-200 flex gap-4">
                  <ShieldCheck className="text-gray-600 shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-sm text-gray-700">Nível de Acesso</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {currentUserRole === "SUPERADMIN" 
                        ? "Como Superadministrador, você pode cadastrar Administradores (ADMIN) e Professores."
                        : "Como Administrador, você pode cadastrar apenas Professores."
                      }
                    </p>
                  </div>
                </div>

                <div className="bg-gray-100 p-6 rounded-lg border border-gray-200 flex gap-4">
                  <Info className="text-gray-600 shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-sm text-gray-700">Associação de Instituto</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">O usuário só poderá visualizar salas e criar reservas referentes aos institutos associados.</p>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <Footer />
        </div>
    </div>
  );
}