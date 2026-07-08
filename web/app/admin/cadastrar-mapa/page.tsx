"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ChevronDown, Building2, Layers, Trash2, Save, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
  MapShape, MapData, ShapeType, RoomCategory,
  categoryLabels, categoryColors, categoryDefaults,
} from "@/types/map";
import { getInstitutes, Institute } from "@/lib/api";

const MapCanvas = dynamic(() => import("@/components/admin/MapCanvas"), { ssr: false });

const FLOORS = [1, 2, 3];
const CATEGORIES = Object.keys(categoryLabels) as RoomCategory[];
const SHAPE_TYPES: { type: ShapeType; label: string }[] = [
  { type: "rect",     label: "Quadrado"  },
  { type: "circle",   label: "Círculo"   },
  { type: "triangle", label: "Triângulo" },
];

const storageKey = (instituteId: string, floor: number) => `map_${instituteId}_floor_${floor}`;

interface ModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  confirmClass: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function Modal({ title, description, confirmLabel, confirmClass, onConfirm, onCancel }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-gray-500">{description}</p>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CadastrarMapaPage() {
  const [institutes, setInstitutes]               = useState<Institute[]>([]);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
  const [selectedFloor, setSelectedFloor]         = useState(1);
  const [shapes, setShapes]                       = useState<MapShape[]>([]);
  const [history, setHistory]                     = useState<MapShape[][]>([]);
  const [future, setFuture]                       = useState<MapShape[][]>([]);
  const [selectedId, setSelectedId]               = useState<string | null>(null);
  const [isDirty, setIsDirty]                     = useState(false);
  const [clipboard, setClipboard]                 = useState<MapShape | null>(null);
  const [instituteOpen, setInstituteOpen]         = useState(false);
  const [floorOpen, setFloorOpen]                 = useState(false);
  const [categoryOpen, setCategoryOpen]           = useState(false);
  const [showSaveModal, setShowSaveModal]         = useState(false);
  const [pendingNav, setPendingNav]               = useState<{ institute?: Institute; floor?: number } | null>(null);

  const instituteRef = useRef<HTMLDivElement>(null);
  const floorRef     = useRef<HTMLDivElement>(null);
  const categoryRef  = useRef<HTMLDivElement>(null);

  const shapesRef = useRef(shapes);
  useEffect(() => { shapesRef.current = shapes; }, [shapes]);

  const pushShapes = (newShapes: MapShape[]) => {
    setHistory((prev) => [...prev, shapesRef.current]);
    setFuture([]);
    setShapes(newShapes);
    setIsDirty(true);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (instituteRef.current && !instituteRef.current.contains(e.target as Node)) setInstituteOpen(false);
      if (floorRef.current     && !floorRef.current.contains(e.target as Node))     setFloorOpen(false);
      if (categoryRef.current  && !categoryRef.current.contains(e.target as Node))  setCategoryOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      const current = shapesRef.current;

      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        setHistory((prev) => {
          if (prev.length === 0) return prev;
          const last = prev[prev.length - 1];
          setFuture((f) => [current, ...f]);
          setShapes(last);
          setIsDirty(true);
          return prev.slice(0, -1);
        });
        return;
      }

      if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        setFuture((prev) => {
          if (prev.length === 0) return prev;
          const next = prev[0];
          setHistory((h) => [...h, current]);
          setShapes(next);
          setIsDirty(true);
          return prev.slice(1);
        });
        return;
      }

      if ((e.key === "Delete" || e.key === "Backspace") && !isInput && selectedId) {
        pushShapes(current.filter((s) => s.id !== selectedId));
        setSelectedId(null);
        return;
      }

      if (e.ctrlKey && e.key === "c" && selectedId) {
        const shape = current.find((s) => s.id === selectedId);
        if (shape) setClipboard(shape);
        return;
      }

      if (e.ctrlKey && e.key === "v" && clipboard) {
        const newShape: MapShape = {
          ...clipboard,
          id: `${clipboard.type}-${Date.now()}`,
          x: clipboard.x + 20,
          y: clipboard.y + 20,
        };
        pushShapes([...current, newShape]);
        setSelectedId(newShape.id);
        return;
      }

      if (!isInput && selectedId && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        pushShapes(current.map((s) => {
          if (s.id !== selectedId) return s;
          return {
            ...s,
            x: e.key === "ArrowLeft" ? s.x - step : e.key === "ArrowRight" ? s.x + step : s.x,
            y: e.key === "ArrowUp"   ? s.y - step : e.key === "ArrowDown"  ? s.y + step : s.y,
          };
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, clipboard]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    getInstitutes()
      .then((data) => {
        setInstitutes(data);
        if (data.length > 0) setSelectedInstitute(data[0]);
      })
      .catch(() => setInstitutes([]));
  }, []);

  const loadMap = (instituteId: string, floor: number) => {
    const stored = localStorage.getItem(storageKey(instituteId, floor));
    if (stored) {
      try { setShapes((JSON.parse(stored) as MapData).shapes); }
      catch { setShapes([]); }
    } else {
      setShapes([]);
    }
    setSelectedId(null);
    setHistory([]);
    setFuture([]);
    setIsDirty(false);
  };

  useEffect(() => {
    if (!selectedInstitute) return;
    loadMap(selectedInstitute.id, selectedFloor);
  }, [selectedInstitute, selectedFloor]);

  const tryChangeContext = (institute?: Institute, floor?: number) => {
    if (isDirty) {
      setPendingNav({ institute, floor });
    } else {
      applyContextChange(institute, floor);
    }
  };

  const applyContextChange = (institute?: Institute, floor?: number) => {
    if (institute) setSelectedInstitute(institute);
    if (floor)     setSelectedFloor(floor);
    setPendingNav(null);
  };

  const addCategory = (category: RoomCategory) => {
    const defaults = categoryDefaults[category];
    const newShape: MapShape = {
      id: `${category}-${Date.now()}`,
      type: defaults.type,
      category,
      x: 80,
      y: 80,
      width: defaults.width,
      height: defaults.height,
      rotation: 0,
      label: defaults.label,
    };
    pushShapes([...shapesRef.current, newShape]);
    setSelectedId(newShape.id);
  };

  const addFreeShape = (type: ShapeType) => {
    const newShape: MapShape = {
      id: `${type}-${Date.now()}`,
      type,
      category: "sala_aula",
      x: type !== "rect" ? 140 : 80,
      y: type !== "rect" ? 140 : 80,
      width: type !== "rect" ? 80 : 120,
      height: type !== "rect" ? 80 : 90,
      rotation: 0,
      label: "inserir_nome",
    };
    pushShapes([...shapesRef.current, newShape]);
    setSelectedId(newShape.id);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    pushShapes(shapesRef.current.filter((s) => s.id !== selectedId));
    setSelectedId(null);
  };

  const handleSaveConfirm = () => {
    if (!selectedInstitute) return;
    const data: MapData = {
      institute_id: selectedInstitute.id,
      institute_name: selectedInstitute.name,
      floor: selectedFloor,
      shapes,
    };
    localStorage.setItem(storageKey(selectedInstitute.id, selectedFloor), JSON.stringify(data));
    setIsDirty(false);
    setShowSaveModal(false);
  };

  const selectedShape = shapes.find((s) => s.id === selectedId) ?? null;

  const updateSelectedShape = (patch: Partial<MapShape>) => {
    if (!selectedId) return;
    pushShapes(shapesRef.current.map((s) => s.id === selectedId ? { ...s, ...patch } : s));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeHref="/admin/cadastrar-mapa" />

      {showSaveModal && (
        <Modal
          title="Salvar mapa"
          description={`Deseja salvar o mapa do ${selectedInstitute?.name ?? ""} — Piso ${selectedFloor}?`}
          confirmLabel="Salvar"
          confirmClass="bg-indigo-900 hover:bg-indigo-800"
          onConfirm={handleSaveConfirm}
          onCancel={() => setShowSaveModal(false)}
        />
      )}

      {pendingNav && (
        <Modal
          title="Alterações não salvas"
          description="Você tem alterações não salvas. Deseja descartá-las e continuar?"
          confirmLabel="Descartar e continuar"
          confirmClass="bg-red-600 hover:bg-red-700"
          onConfirm={() => applyContextChange(pendingNav.institute, pendingNav.floor)}
          onCancel={() => setPendingNav(null)}
        />
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mapear Salas</h1>
            <p className="text-sm text-gray-400 mt-0.5">Desenhe a planta baixa de cada andar.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={instituteRef}>
              <button
                onClick={() => setInstituteOpen((v) => !v)}
                className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors bg-white"
              >
                <Building2 size={14} className="text-gray-400" />
                {selectedInstitute?.name ?? "Selecione o instituto"}
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {instituteOpen && (
                <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10">
                  {institutes.map((inst) => (
                    <li
                      key={inst.id}
                      onClick={() => { tryChangeContext(inst, undefined); setInstituteOpen(false); }}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      {inst.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative" ref={floorRef}>
              <button
                onClick={() => setFloorOpen((v) => !v)}
                className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors bg-white"
              >
                <Layers size={14} className="text-gray-400" />
                Piso {selectedFloor}
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {floorOpen && (
                <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10">
                  {FLOORS.map((floor) => (
                    <li
                      key={floor}
                      onClick={() => { tryChangeContext(undefined, floor); setFloorOpen(false); }}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Piso {floor}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowSaveModal(true)}
            disabled={!isDirty}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-colors ${
              isDirty
                ? "bg-indigo-900 hover:bg-indigo-800 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Save size={15} />
            Salvar Mapa
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-col gap-6 px-4 py-6 border-r border-gray-200 bg-white w-52 shrink-0 overflow-y-auto">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Elementos</p>
              <div className="flex flex-col gap-1">
                {CATEGORIES.map((cat) => {
                  const { fill, text } = categoryColors[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => addCategory(cat)}
                      className="flex items-center gap-3 text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <span
                        className="shrink-0"
                        style={{ backgroundColor: fill, color: text, width: 32, height: 20, borderRadius: 2, minWidth: 28, display: "inline-block" }}
                      />
                      {categoryLabels[cat]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Formas Livres</p>
              <div className="flex flex-col gap-1">
                {SHAPE_TYPES.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => addFreeShape(type)}
                    className="flex items-center gap-3 text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    {type === "rect" && <span className="w-6 h-4 bg-gray-400 shrink-0" />}
                    {type === "circle" && <span className="w-5 h-5 bg-gray-400 rounded-full shrink-0" />}
                    {type === "triangle" && (
                      <span className="shrink-0" style={{ width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "18px solid #9ca3af" }} />
                    )}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {selectedId && (
              <button
                onClick={deleteSelected}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors mt-auto"
              >
                <Trash2 size={14} />
                Excluir selecionado
              </button>
            )}
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm inline-block">
              <MapCanvas
                shapes={shapes}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onChange={(updated) => pushShapes(updated)}
                width={900}
                height={600}
              />
            </div>
          </div>

          <div className="w-56 shrink-0 border-l border-gray-200 bg-white px-4 py-6">
            {selectedShape ? (
              <div className="flex flex-col gap-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Propriedades</p>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Nome</label>
                  <input
                    type="text"
                    value={selectedShape.label}
                    onChange={(e) => updateSelectedShape({ label: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Categoria</label>
                  <div className="relative" ref={categoryRef}>
                    <button
                      onClick={() => setCategoryOpen((v) => !v)}
                      className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors bg-white"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 shrink-0" style={{ backgroundColor: categoryColors[selectedShape.category].fill }} />
                        {categoryLabels[selectedShape.category]}
                      </div>
                      <ChevronDown size={14} className="text-gray-400" />
                    </button>
                    {categoryOpen && (
                      <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10">
                        {CATEGORIES.map((cat) => (
                          <li
                            key={cat}
                            onClick={() => { updateSelectedShape({ category: cat }); setCategoryOpen(false); }}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                          >
                            <span className="w-3 h-3 shrink-0" style={{ backgroundColor: categoryColors[cat].fill }} />
                            {categoryLabels[cat]}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {(["width", "height"] as const).map((prop) => (
                    <div key={prop}>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">
                        {prop === "width" ? "Largura" : "Altura"}
                      </label>
                      <input
                        type="number"
                        value={Math.round(selectedShape[prop])}
                        onChange={(e) => updateSelectedShape({ [prop]: Number(e.target.value) })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Rotação (°)</label>
                  <input
                    type="number"
                    value={Math.round(selectedShape.rotation)}
                    onChange={(e) => updateSelectedShape({ rotation: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center gap-2 text-gray-400">
                <p className="text-sm">Selecione uma forma para editar suas propriedades.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}