export type ShapeType = "rect" | "circle" | "triangle";

export type RoomCategory =
  | "sala_aula"
  | "corredor"
  | "banheiro"
  | "escadas"
  | "elevador"
  | "auditorio";

export const categoryLabels: Record<RoomCategory, string> = {
  sala_aula: "Sala de Aula",
  corredor:  "Corredor",
  banheiro:  "Banheiro",
  escadas:   "Escadas",
  elevador:  "Elevador",
  auditorio: "Auditório",
};

export const categoryColors: Record<RoomCategory, { fill: string; text: string }> = {
  sala_aula: { fill: "#4B5563", text: "#ffffff" },
  auditorio: { fill: "#4B5563", text: "#ffffff" },
  corredor:  { fill: "#D1D5DB", text: "#374151" },
  banheiro:  { fill: "#374151", text: "#ffffff" },
  escadas:   { fill: "#94A3B8", text: "#ffffff" },
  elevador:  { fill: "#6B7280", text: "#ffffff" },
};

export const categoryDefaults: Record<RoomCategory, { type: ShapeType; width: number; height: number; label: string }> = {
  sala_aula: { type: "rect",   width: 120, height: 90,  label: "Sala de Aula" },
  auditorio: { type: "rect",   width: 200, height: 160, label: "Auditório"    },
  corredor:  { type: "rect",   width: 60,  height: 200, label: "Corredor"     },
  banheiro:  { type: "rect",   width: 80,  height: 60,  label: "Banheiro"     },
  escadas:   { type: "rect",   width: 101,  height: 43, label: "Escadas"      },
  elevador:  { type: "rect",   width: 60,  height: 60,  label: "Elevador"     },
};

export interface MapShape {
  id: string;
  type: ShapeType;
  category: RoomCategory;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  label: string;
}

export interface MapData {
  institute_id: string;
  institute_name: string;
  floor: number;
  shapes: MapShape[];
}