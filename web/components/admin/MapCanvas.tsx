"use client";

import { useRef, useEffect } from "react";
import { Stage, Layer, Rect, Circle, RegularPolygon, Text, Transformer, Line, Group } from "react-konva";
import Konva from "konva";
import { MapShape, categoryColors } from "@/types/map";

const GRID_SIZE = 40;
const STAIR_STEP = 12;

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

interface MapCanvasProps {
  shapes: MapShape[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (shapes: MapShape[]) => void;
  width: number;
  height: number;
}

export default function MapCanvas({ shapes, selectedId, onSelect, onChange, width, height }: MapCanvasProps) {
  const transformerRef = useRef<Konva.Transformer>(null);
  const stageRef = useRef<Konva.Stage>(null);

  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    if (selectedId) {
      const node = stageRef.current.findOne(`#${selectedId}`);
      transformerRef.current.nodes(node ? [node] : []);
    } else {
      transformerRef.current.nodes([]);
    }
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedId, shapes]);

  const handleDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
    onChange(shapes.map((s) => s.id === id ? { ...s, x: e.target.x(), y: e.target.y() } : s));
  };

  const handleTransformEnd = (id: string, e: Konva.KonvaEventObject<Event>) => {
    const node = e.target as Konva.Group;
    onChange(shapes.map((s) => s.id === id ? {
      ...s,
      x: node.x(),
      y: node.y(),
      width: Math.max(40, s.width * node.scaleX()),
      height: Math.max(40, s.height * node.scaleY()),
      rotation: node.rotation(),
    } : s));
    node.scaleX(1);
    node.scaleY(1);
  };

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
          const { fill, text } = categoryColors[shape.category];

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
                  stroke="rgba(255,255,255,0.5)"
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
              onClick={() => onSelect(shape.id)}
            />
          ) : shape.type === "circle" ? (
            <Circle
              radius={shape.width / 2}
              fill={fill}
              onClick={() => onSelect(shape.id)}
            />
          ) : (
            <RegularPolygon
              sides={3}
              radius={shape.width / 2}
              fill={fill}
              onClick={() => onSelect(shape.id)}
            />
          );

          const labelWidth = shape.label.length * 8;
          const labelHeight = 16;

          return (
            <Group
              key={shape.id}
              id={shape.id}
              x={shape.x}
              y={shape.y}
              rotation={shape.rotation}
              draggable
              onClick={() => onSelect(shape.id)}
              onDragEnd={(e) => handleDragEnd(shape.id, e)}
              onTransformEnd={(e) => handleTransformEnd(shape.id, e)}
            >
              {shapeNode}
              {stairLines}
              {shape.category === "escadas" && (
                <Rect
                  x={shape.width / 2 - labelWidth / 2}
                  y={shape.height / 2 - labelHeight / 2}
                  width={labelWidth}
                  height={labelHeight}
                  fill={fill}
                  listening={false}
                />
              )}
              <Text
                x={textX}
                y={textY}
                width={shape.width}
                height={shape.type === "circle" ? shape.width : shape.height}
                text={shape.label || " "}
                align="center"
                verticalAlign="middle"
                fill={text}
                fontSize={11}
                fontStyle="bold"
                listening={false}
                wrap="word"
                padding={6}
              />
            </Group>
          );
        })}
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => (newBox.width < 40 || newBox.height < 40 ? oldBox : newBox)}
        />
      </Layer>
    </Stage>
  );
}