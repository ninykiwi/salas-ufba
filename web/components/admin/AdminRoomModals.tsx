"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  updateRoom,
  ApiError,
  Institute,
  Room,
  RoomType,
  RoomStatus,
  ROOM_TYPES,
  ROOM_RESOURCES,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

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

interface AdminRoomModalsProps {
  isEditOpen: boolean;
  onCloseEdit: () => void;
  selectedRoom: Room | null;
  institutes: Institute[];
  onRoomUpdated: () => void;
}

export default function AdminRoomModals({
  isEditOpen,
  onCloseEdit,
  selectedRoom,
  institutes,
  onRoomUpdated,
}: AdminRoomModalsProps) {
  const { user: currentUser } = useAuth();

  const [name, setName] = useState("");
  const [selectedInstituteId, setSelectedInstituteId] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
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
    if (selectedRoom) {
      setName(selectedRoom.name);
      setSelectedInstituteId(selectedRoom.institute_id);
      setSelectedFloor(selectedRoom.floor);
      setSelectedType(selectedRoom.type);
      setCapacity(String(selectedRoom.capacity));
      setResources(selectedRoom.resources);
      setStatus(selectedRoom.status);
      setError("");
      setFieldErrors({});
    }
  }, [selectedRoom, isEditOpen]);

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
    !!currentUser?.institutes?.[0]?.id &&
    !!selectedInstituteId &&
    selectedInstituteId !== currentUser.institutes[0].id;

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;
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
      await updateRoom(selectedRoom._id, {
        name: name.trim(),
        institute_id: selectedInstituteId,
        floor: selectedFloor,
        type: selectedType as RoomType,
        capacity: capacityNumber,
        resources,
        status,
      });
      onRoomUpdated();
      onCloseEdit();
    } catch (err: any) {
      setError(
        err instanceof ApiError ? err.message : "Erro de conexão com o servidor."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSave}
        className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto border border-gray-100"
      >
        <h3 className="text-lg font-bold text-[#000666] mb-5 border-b pb-2 border-b-gray-200">
          Editar Sala
        </h3>

        {error && (
          <div className="mb-5 p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Nome da Sala
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none ${
                fieldErrors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Instituto
            </label>
            <div className="relative" ref={instituteRef}>
              <button
                type="button"
                onClick={() => setInstituteOpen((v) => !v)}
                className={`flex items-center justify-between gap-2 w-full border rounded-md p-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors bg-white ${
                  isDifferentInstitute
                    ? "border-yellow-400"
                    : fieldErrors.institute
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                {institutes.find((i) => i.id === selectedInstituteId)?.name ?? "Selecione o Instituto"}
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {instituteOpen && (
                <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10 max-h-48 overflow-y-auto">
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
              <p className="mt-1 text-xs text-yellow-600 font-semibold">
                Este instituto é diferente do seu instituto vinculado.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Andar
            </label>
            <div className="relative" ref={floorRef}>
              <button
                type="button"
                onClick={() => setFloorOpen((v) => !v)}
                className={`flex items-center justify-between gap-2 w-full border rounded-md p-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors bg-white ${
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

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Tipo de Sala
            </label>
            <div className="relative" ref={typeRef}>
              <button
                type="button"
                onClick={() => setTypeOpen((v) => !v)}
                className={`flex items-center justify-between gap-2 w-full border rounded-md p-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors bg-white ${
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

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Capacidade (Pessoas)
            </label>
            <input
              type="number"
              min={1}
              placeholder="Ex: 40"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className={`w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-[#000666] focus:border-[#000666] focus:outline-none ${
                fieldErrors.capacity ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Recursos Disponíveis
            </label>
            <div className="grid grid-cols-2 gap-3">
              {ROOM_RESOURCES.map((resource) => (
                <label
                  key={resource}
                  className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <input
                    className="rounded text-[#000666] focus:ring-[#000666] h-4 w-4"
                    type="checkbox"
                    checked={resources.includes(resource)}
                    onChange={() => toggleResource(resource)}
                  />
                  <span className="text-sm text-gray-700">{resource}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex items-center gap-4 pt-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Status</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={status === "ativa"}
                onChange={(e) => setStatus(e.target.checked ? "ativa" : "inativa")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#000666]"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">
                {status === "ativa" ? "Ativa" : "Inativa"}
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6 border-t pt-4 border-t-gray-200">
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
  );
}
