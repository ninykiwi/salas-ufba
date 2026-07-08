"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Footer from "@/components/home/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Info, CheckCircle, ChevronDown, AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  getInstitutes,
  createRoom,
  ApiError,
  Institute,
  RoomType,
  RoomStatus,
  ROOM_TYPES,
  ROOM_RESOURCES,
} from "@/lib/api";

interface FloorOption {
  id: string;
  name: string;
}

function buildFloorOptions(floors: number): FloorOption[] {
  const options: FloorOption[] = [{ id: "terreo", name: "Térreo" }];
  for (let i = 1; i < floors; i++) {
    options.push({ id: String(i), name: `${i}º Andar` });
  }
  return options;
}

export default function CadastrarSala() {
  const router = useRouter();
  const { user } = useAuth();

  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [isLoadingInstitutes, setIsLoadingInstitutes] = useState(true);

  const [name, setName] = useState("");
  const [selectedInstituteId, setSelectedInstituteId] = useState<string>("");
  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [selectedType, setSelectedType] = useState<RoomType | "">("");
  const [capacity, setCapacity] = useState("");
  const [resources, setResources] = useState<string[]>([]);
  const [status, setStatus] = useState<RoomStatus>("ativa");

  const [instituteOpen, setInstituteOpen] = useState(false);
  const [floorOpen, setFloorOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

  const instituteRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getInstitutes()
      .then(setInstitutes)
      .catch(() => setError("Não foi possível carregar os institutos."))
      .finally(() => setIsLoadingInstitutes(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    const adminInstituteId = user.institutes?.[0]?.id;
    if (adminInstituteId) setSelectedInstituteId(adminInstituteId);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (instituteRef.current && !instituteRef.current.contains(e.target as Node)) {
        setInstituteOpen(false);
      }
      if (floorRef.current && !floorRef.current.contains(e.target as Node)) {
        setFloorOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedInstitute = institutes.find((i) => i.id === selectedInstituteId);
  const floorOptions = useMemo(
    () => buildFloorOptions(selectedInstitute?.floors ?? 1),
    [selectedInstitute]
  );

  const isDifferentInstitute =
    !!user?.institutes?.[0]?.id &&
    !!selectedInstituteId &&
    selectedInstituteId !== user.institutes[0].id;

  const handleInstituteChange = (id: string) => {
    setSelectedInstituteId(id);
    setSelectedFloor("");
    setInstituteOpen(false);
  };

  const toggleResource = (resource: string) => {
    setResources((prev) =>
      prev.includes(resource) ? prev.filter((r) => r !== resource) : [...prev, resource]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const capacityNumber = Number(capacity);
    const errors: Record<string, boolean> = {
      name: !name.trim(),
      institute: !selectedInstituteId,
      floor: !selectedFloor,
      type: !selectedType,
      capacity: !capacity || !Number.isInteger(capacityNumber) || capacityNumber < 1,
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    setIsSubmitting(true);
    try {
      await createRoom({
        name: name.trim(),
        institute_id: selectedInstituteId,
        floor: selectedFloor,
        type: selectedType as RoomType,
        capacity: capacityNumber,
        resources,
        status,
      });
      router.push("/admin/salas");
    } catch (err: any) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        router.push("/login");
        return;
      }
      setError(err.message || "Erro ao cadastrar a sala.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeHref="/admin/salas" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopBar />

        <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="mb-8">
              <nav className="flex text-sm font-medium text-gray-500 mb-2">
                <span>Salas</span>
                <span className="mx-2">/</span>
                <span className="text-[#000666] font-bold">Cadastrar Sala</span>
              </nav>
              <h1 className="text-xl font-bold text-gray-900">Novo Registro de Sala</h1>
              <p className="text-sm text-gray-400 mt-1">
                Preencha as informações técnicas para disponibilizar o espaço no sistema de reservas.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">

              {/* Main Form Card */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm space-y-6">

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-xs font-semibold flex items-start gap-2">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700" htmlFor="room_name">Nome da Sala</label>
                      <input
                        className={`w-full bg-white border rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors ${
                          fieldErrors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        id="room_name"
                        placeholder="Ex: Sala 101"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700">Instituto</label>
                      <div className="relative" ref={instituteRef}>
                        <button
                          type="button"
                          onClick={() => setInstituteOpen((v) => !v)}
                          disabled={isLoadingInstitutes}
                          className={`flex items-center justify-between gap-2 w-full bg-white border rounded p-3 text-sm text-gray-700 hover:bg-gray-50 focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors disabled:opacity-50 ${
                            isDifferentInstitute
                              ? "border-yellow-400"
                              : fieldErrors.institute
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isLoadingInstitutes
                            ? "Carregando..."
                            : institutes.find((i) => i.id === selectedInstituteId)?.name ??
                              "Selecione o Instituto"}
                          <ChevronDown size={14} className="text-gray-400" />
                        </button>
                        {instituteOpen && (
                          <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10 max-h-56 overflow-y-auto">
                            {institutes.map((institute) => (
                              <li
                                key={institute.id}
                                onClick={() => handleInstituteChange(institute.id)}
                                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                              >
                                {institute.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {isDifferentInstitute && (
                        <p className="text-xs text-yellow-600 font-semibold">
                          Este instituto é diferente do seu instituto vinculado.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700">Andar</label>
                      <div className="relative" ref={floorRef}>
                        <button
                          type="button"
                          onClick={() => setFloorOpen((v) => !v)}
                          className={`flex items-center justify-between gap-2 w-full bg-white border rounded p-3 text-sm text-gray-700 hover:bg-gray-50 focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors ${
                            fieldErrors.floor ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          {floorOptions.find((f) => f.id === selectedFloor)?.name ?? "Selecione o Andar"}
                          <ChevronDown size={14} className="text-gray-400" />
                        </button>
                        {floorOpen && (
                          <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10">
                            {floorOptions.map((floor) => (
                              <li
                                key={floor.id}
                                onClick={() => { setSelectedFloor(floor.id); setFloorOpen(false); }}
                                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                              >
                                {floor.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700">Tipo de Sala</label>
                      <div className="relative" ref={typeRef}>
                        <button
                          type="button"
                          onClick={() => setTypeOpen((v) => !v)}
                          className={`flex items-center justify-between gap-2 w-full bg-white border rounded p-3 text-sm text-gray-700 hover:bg-gray-50 focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors ${
                            fieldErrors.type ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          {ROOM_TYPES.find((t) => t.value === selectedType)?.label ?? "Selecione o Tipo"}
                          <ChevronDown size={14} className="text-gray-400" />
                        </button>
                        {typeOpen && (
                          <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10">
                            {ROOM_TYPES.map((type) => (
                              <li
                                key={type.value}
                                onClick={() => { setSelectedType(type.value); setTypeOpen(false); }}
                                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                              >
                                {type.label}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700" htmlFor="capacity">Capacidade (Pessoas)</label>
                      <input
                        className={`w-full bg-white border rounded p-3 text-sm focus:ring-[#000666] focus:border-[#000666] outline-none transition-colors ${
                          fieldErrors.capacity ? "border-red-500" : "border-gray-300"
                        }`}
                        id="capacity"
                        placeholder="Ex: 40"
                        type="number"
                        min={1}
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="font-bold text-sm text-gray-700">Recursos Disponíveis</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {ROOM_RESOURCES.map((resource) => (
                        <label
                          key={resource}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <input
                            className="rounded text-[#000666] focus:ring-[#000666] h-4 w-4"
                            type="checkbox"
                            checked={resources.includes(resource)}
                            onChange={() => toggleResource(resource)}
                          />
                          <span className="text-sm font-medium text-gray-700">{resource}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-sm text-gray-700">Status da Sala</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={status === "ativa"}
                          onChange={(e) => setStatus(e.target.checked ? "ativa" : "inativa")}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#000666]"></div>
                        <span className="ms-3 text-sm font-medium text-gray-700">
                          {status === "ativa" ? "Ativa" : "Inativa"}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-4">
                    <button
                      className="px-6 py-2.5 border border-[#000666] text-[#000666] rounded font-bold text-sm hover:bg-gray-50 transition-colors"
                      type="button"
                      onClick={() => router.push("/admin/salas")}
                      disabled={isSubmitting}
                    >
                      CANCELAR
                    </button>
                    <button
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#000666] text-white rounded font-bold text-sm hover:bg-blue-900 transition-colors disabled:opacity-50"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                      CADASTRAR SALA
                    </button>
                  </div>
                </form>
              </div>

              {/* Sidebar Info/Tooltips */}
              <div className="space-y-6">

                <div className="bg-[#000666] text-white p-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={20} className="text-blue-300" />
                    <h3 className="font-bold text-base">Gestão de Recursos</h3>
                  </div>
                  <p className="text-sm opacity-90 leading-relaxed">
                    Ao cadastrar uma sala com recursos específicos (ex: Ar Condicionado), o sistema automaticamente prioriza essas salas para turmas com necessidades especiais ou eventos oficiais do instituto.
                  </p>
                </div>

                <div className="bg-[#f8f9fa] p-6 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-base text-[#000666] mb-4">Dicas de Cadastro</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <CheckCircle size={18} className="text-[#000666] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Use nomes padronizados como "Sala 101" ou "Auditório A".</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle size={18} className="text-[#000666] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Certifique-se que a capacidade informada segue as normas de segurança.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle size={18} className="text-[#000666] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">O status "Inativo" remove a sala das buscas de reserva temporariamente.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </main>

          <Footer />
        </div>
    </div>
  );
}
