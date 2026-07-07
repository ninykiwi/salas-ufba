"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ChevronDown, Building2, Layers, BookOpen } from "lucide-react";
import Sidebar from "@/components/home/Sidebar";
import Footer from "@/components/home/Footer";
import StatusBadge from "@/components/home/StatusBradge";
import { MapShape, MapData } from "@/types/map";

const MapViewCanvas = dynamic(() => import("@/components/mapa/MapViewCanvas"), { ssr: false });

const mockInstitutes = [
  { id: 1, name: "Instituto de Computação" },
  { id: 2, name: "Faculdade de Direito" },
];

const FLOORS = [1, 2, 3];
const ROOM_CATEGORIES = new Set(["sala_aula", "auditorio"]);

const storageKey = (instituteId: number, floor: number) => `map_${instituteId}_floor_${floor}`;

interface RoomEvent {
  title: string;
  professor: string;
  startTime: string;
  endTime: string;
}

const mockEvents: Record<string, RoomEvent> = {
  "Sala 101":      { title: "Cálculo Diferencial I", professor: "Prof. Ricardo Almeida", startTime: "08:00", endTime: "11:30" },
  "Laboratório 1": { title: "Algoritmos I",           professor: "Prof. André Lima",      startTime: "07:55", endTime: "09:35" },
  "Auditório":     { title: "Seminário de IA",        professor: "Profª. Carla Matos",   startTime: "10:00", endTime: "12:00" },
  "Sala de Aula":  { title: "Engenharia de Software", professor: "Prof. Bruno Ferreira", startTime: "08:50", endTime: "10:40" },
};

const cardAccent: Record<string, string> = {
  occupied: "bg-indigo-900",
  free:     "bg-gray-300",
};

const contentAccent: Record<string, string> = {
  occupied: "border-l-4 border-indigo-900",
  free:     "border-l-4 border-gray-300",
};

export default function MapaPage() {
  const [selectedInstitute, setSelectedInstitute] = useState(mockInstitutes[0]);
  const [selectedFloor, setSelectedFloor]         = useState(1);
  const [shapes, setShapes]                       = useState<MapShape[]>([]);
  const [selectedId, setSelectedId]               = useState<string | null>(null);
  const [instituteOpen, setInstituteOpen]         = useState(false);
  const [floorOpen, setFloorOpen]                 = useState(false);
  const [canvasWidth, setCanvasWidth]             = useState(900);

  const instituteRef = useRef<HTMLDivElement>(null);
  const floorRef     = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (canvasRef.current) setCanvasWidth(canvasRef.current.offsetWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (instituteRef.current && !instituteRef.current.contains(e.target as Node)) setInstituteOpen(false);
      if (floorRef.current     && !floorRef.current.contains(e.target as Node))     setFloorOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey(selectedInstitute.id, selectedFloor));
    if (stored) {
      try { setShapes((JSON.parse(stored) as MapData).shapes); }
      catch { setShapes([]); }
    } else {
      setShapes([]);
    }
    setSelectedId(null);
  }, [selectedInstitute, selectedFloor]);

  const occupiedIds = new Set(
    shapes.filter((s) => ROOM_CATEGORIES.has(s.category) && mockEvents[s.label]).map((s) => s.id)
  );

  const selectedShape    = shapes.find((s) => s.id === selectedId) ?? null;
  const isSelectableRoom = selectedShape ? ROOM_CATEGORIES.has(selectedShape.category) : false;
  const selectedEvent    = isSelectableRoom && selectedShape ? mockEvents[selectedShape.label] ?? null : null;
  const isOccupied       = selectedShape ? occupiedIds.has(selectedShape.id) : false;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeHref="/mapa" />

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mapa do Campus</h1>
              <p className="text-sm text-gray-400 mt-0.5">Acompanhe a disponibilidade das salas do IC.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative" ref={instituteRef}>
                <button
                  onClick={() => setInstituteOpen((v) => !v)}
                  className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors bg-white"
                >
                  <Building2 size={14} className="text-gray-400" />
                  {selectedInstitute.name}
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                {instituteOpen && (
                  <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10">
                    {mockInstitutes.map((inst) => (
                      <li
                        key={inst.id}
                        onClick={() => { setSelectedInstitute(inst); setInstituteOpen(false); }}
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
                        onClick={() => { setSelectedFloor(floor); setFloorOpen(false); }}
                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        Piso {floor}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div
                className="flex-1 overflow-auto scrollbar-hide relative"
                ref={canvasRef}
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
            >
                {shapes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                    <p className="text-sm">Nenhum mapa cadastrado para este andar.</p>
                    </div>
                ) : (
                    <MapViewCanvas
                    shapes={shapes}
                    occupiedIds={occupiedIds}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    width={canvasWidth}
                    height={600}
                    events={mockEvents}
                    />
                )}

                <div className="fixed bottom-22 left-63 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 flex flex-col gap-2 z-20">
                    <p className="text-xs font-bold text-indigo-900 uppercase tracking-widest">Legenda</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: "#1A237E" }} />
                        Ocupada
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-4 h-4 rounded-sm shrink-0 border border-gray-200" style={{ backgroundColor: "#9CA3AF" }} />
                        Livre
                    </div>
                </div>
            </div>

            <div className="w-64 shrink-0 border-l border-gray-200 bg-white px-5 py-6">
              {isSelectableRoom && selectedShape ? (
                <div className="relative overflow-hidden rounded-xl border border-gray-300 p-4 flex flex-col gap-3">
                  <div className={`absolute top-0 left-0 right-0 h-[6px] ${isOccupied ? cardAccent.occupied : cardAccent.free}`} />

                  <div className="flex items-center justify-between mt-1">
                    <h2 className={`font-bold text-lg ${isOccupied ? "text-indigo-900" : "text-gray-500"}`}>
                      {selectedShape.label}
                    </h2>
                    <StatusBadge status={isOccupied ? "OCUPADA" : "LIVRE"} />
                  </div>

                  <div className={`pl-3 ${isOccupied ? contentAccent.occupied : contentAccent.free} flex flex-col gap-2`}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Agora</p>

                    {isOccupied && selectedEvent ? (
                      <>
                        <p className="text-sm font-bold text-indigo-900 leading-snug">{selectedEvent.title}</p>
                        <p className="text-xs text-gray-500">{selectedEvent.professor}</p>
                        <p className="text-xs text-gray-500">{selectedEvent.startTime} — {selectedEvent.endTime}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-gray-400">Livre para Estudo</p>
                        <p className="text-xs text-gray-300">—</p>
                        <p className="text-xs text-gray-300">—</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-gray-400">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <BookOpen size={20} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Selecione uma sala</p>
                    <p className="text-xs mt-1">Clique em qualquer sala ou auditório para visualizar detalhes de ocupação.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}