"use client";

import { useRef } from "react";
import { Stage, Layer, Rect, Circle, RegularPolygon, Text, Line, Group } from "react-konva";
import Konva from "konva";
import { MapShape, categoryColors } from "@/types/map";

const GRID_SIZE = 40;
const STAIR_STEP = 12;
const OCCUPIED_COLOR = "#1A237E";
const FREE_COLOR = "#9CA3AF";
const ROOM_CATEGORIES = new Set(["sala_aula", "auditorio"]);

function buildGrid(width: number, height: number) {
  const lines = [];
  for (let x = 0; x <= width; x += GRID_SIZE) {
    lines.push(<Line key={`v-${x}`} points={[x, 0, x, height]} stroke="#e5e7eb" strokeWidth={1} />);
  }
  for (let y = 0; y <= height; y += GRID_SIZE) {
    lines.push(<Line key={`h-${y}`} points={[0, y, width, y]} stroke="#e5e7eb" strokeWidth={1} />);
  }
  return lines;
}

interface RoomEvent {
  title: string;
  professor: string;
  startTime: string;
  endTime: string;
}

interface MapViewCanvasProps {
  shapes: MapShape[];
  occupiedIds: Set<string>;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  width: number;
  height: number;
  events: Record<string, RoomEvent>;
}

export default function MapViewCanvas({ shapes, occupiedIds, selectedId, onSelect, width, height, events }: MapViewCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onMouseDown={(e) => { if (e.target === e.target.getStage()) onSelect(null); }}
    >
      <Layer>{buildGrid(width, height)}</Layer>
      <Layer>
        {shapes.map((shape) => {
          const isRoom     = ROOM_CATEGORIES.has(shape.category);
          const isOccupied = occupiedIds.has(shape.id);
          const isSelected = selectedId === shape.id;
          const event      = isOccupied ? events[shape.label] ?? null : null;

          const fill      = isRoom ? (isOccupied ? OCCUPIED_COLOR : FREE_COLOR) : categoryColors[shape.category].fill;
          const textColor = isRoom ? "#ffffff" : categoryColors[shape.category].text;

          const textX = shape.type !== "rect" ? shape.width / 2 * -1 : 0;
          const textY = shape.type !== "rect" ? shape.height / 2 * -1 : 0;

          const stairLines = [];
          if (shape.category === "escadas" && shape.type === "rect") {
            const padding = 6;
            const count = Math.floor((shape.width - padding * 2) / STAIR_STEP);
            for (let i = 1; i <= count; i++) {
              const x = padding + i * STAIR_STEP;
              stairLines.push(
                <Line
                  key={`stair-${i}`}
                  points={[x, padding, x, shape.height - padding]}
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth={1.5}
                  listening={false}
                />
              );
            }
          }

          const shapeNode = shape.type === "rect" ? (
            <Rect
              width={shape.width}
              height={shape.height}
              fill={fill}
              cornerRadius={0}
              stroke={isSelected ? "#60A5FA" : "transparent"}
              strokeWidth={isSelected ? 2 : 0}
              onClick={() => onSelect(shape.id)}
            />
          ) : shape.type === "circle" ? (
            <Circle
              radius={shape.width / 2}
              fill={fill}
              stroke={isSelected ? "#60A5FA" : "transparent"}
              strokeWidth={isSelected ? 2 : 0}
              onClick={() => onSelect(shape.id)}
            />
          ) : (
            <RegularPolygon
              sides={3}
              radius={shape.width / 2}
              fill={fill}
              stroke={isSelected ? "#60A5FA" : "transparent"}
              strokeWidth={isSelected ? 2 : 0}
              onClick={() => onSelect(shape.id)}
            />
          );

          return (
            <Group
              key={shape.id}
              x={shape.x}
              y={shape.y}
              rotation={shape.rotation}
              onClick={() => onSelect(shape.id)}
            >
              {shapeNode}
              {stairLines}
              {shape.category === "escadas" && (
                <Rect
                  x={shape.width / 2 - (shape.label.length * 4)}
                  y={shape.height / 2 - 8}
                  width={shape.label.length * 8}
                  height={16}
                  fill={fill}
                  listening={false}
                />
              )}

              {isRoom && isOccupied && event ? (
                <>
                  <Text
                    x={textX}
                    y={textY + 6}
                    width={shape.width}
                    text={shape.label}
                    align="center"
                    fill={textColor}
                    fontSize={11}
                    fontStyle="bold"
                    listening={false}
                    padding={6}
                  />
                  <Text
                    x={textX}
                    y={textY + 22}
                    width={shape.width}
                    height={shape.height - 36}
                    text={event.title}
                    align="center"
                    verticalAlign="middle"
                    fill="rgba(255,255,255,0.85)"
                    fontSize={10}
                    listening={false}
                    wrap="word"
                    padding={4}
                  />
                  <Text
                    x={textX}
                    y={textY + shape.height - 18}
                    width={shape.width}
                    text={`Até ${event.endTime}`}
                    align="center"
                    fill="rgba(255,255,255,0.7)"
                    fontSize={9}
                    listening={false}
                    padding={4}
                  />
                </>
              ) : (
                <Text
                  x={textX}
                  y={textY}
                  width={shape.width}
                  height={shape.type === "circle" ? shape.width : shape.height}
                  text={shape.label || " "}
                  align="center"
                  verticalAlign="middle"
                  fill={textColor}
                  fontSize={11}
                  fontStyle="bold"
                  listening={false}
                  wrap="word"
                  padding={6}
                />
              )}
            </Group>
          );
        })}
      </Layer>
    </Stage>
  );
}