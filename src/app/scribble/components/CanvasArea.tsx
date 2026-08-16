"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type Konva from "konva";
import { Stage, Layer, Line, Circle, Rect, Text, Group, Transformer } from 'react-konva/lib/ReactKonva';
import { useCanvasStore } from "../store/canvasStore";
import { useToolStore } from "../store/toolStore";

interface CanvasAreaProps {
  selectedSticker: string | null;
}

export default function CanvasArea({ selectedSticker }: CanvasAreaProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const activeTool = useToolStore((state) => state.activeTool);
  const color = useToolStore((state) => state.color);
  const penSize = useToolStore((state) => state.penSize);
  const penOpacity = useToolStore((state) => state.penOpacity);
  const eraserSize = useToolStore((state) => state.eraserSize);
  const eraserOpacity = useToolStore((state) => state.eraserOpacity);
  const gridEnabled = useToolStore((state) => state.gridEnabled);
  const gridSize = useToolStore((state) => state.gridSize);
  const fillColor = useToolStore((state) => state.fillColor);
  const strokeWidth = useToolStore((state) => state.strokeWidth);
  const textFontFamily = useToolStore((state) => state.textFontFamily);
  const textFontStyle = useToolStore((state) => state.textFontStyle);
  const textFontWeight = useToolStore((state) => state.textFontWeight);
  const zoom = useToolStore((state) => state.zoom);


  const elements = useCanvasStore((state) => state.elements);
  const addElement = useCanvasStore((state) => state.addElement);
  const updateLastElement = useCanvasStore((state) => state.updateLastElement);
  const updateElement = useCanvasStore((state) => state.updateElement);
  const setSelectedElement = useCanvasStore(
    (state) => state.setSelectedElement,
  );
  const selectedElement = useCanvasStore((state) => state.selectedElement);
  const deleteElement = useCanvasStore((state) => state.deleteElement);
  const duplicateElement = useCanvasStore((state) => state.duplicateElement);
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const [drawing, setDrawing] = useState(false);
  /** 0×0 until container is measured — Stage mounts only when ready. */
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [textInput, setTextInput] = useState("");
  const [isTextEditing, setIsTextEditing] = useState(false);

  const [_textProperties, _setTextProperties] = useState({
    fontSize: 16,
    fontFamily: "Arial",
    fontStyle: "normal",
    fontWeight: "normal",
  });

  /** Pointer in drawing-space coords (accounts for Konva stage zoom). */
  const getDrawPos = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return null;
    const pointer = stage.getPointerPosition();
    if (!pointer) return null;
    const scale = stage.scaleX() || 1;
    return { x: pointer.x / scale, y: pointer.y / scale };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);
      // Ignore collapsed frames (flex % height not resolved yet).
      if (width < 2 || height < 2) return;
      setStageSize((prev) =>
        prev.width === width && prev.height === height ? prev : { width, height },
      );
    };

    updateSize();
    // rAF: first mobile layout often settles after paint.
    const raf = window.requestAnimationFrame(updateSize);
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeTool === "Select" && selectedElement && transformerRef.current && stageRef.current) {
      const node = stageRef.current.findOne(`#${selectedElement}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer()?.batchDraw();
      } else {
        transformerRef.current.nodes([]);
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedElement, activeTool, elements.length]);

  const setIsDrawing = (value: boolean) => {
    drawingRef.current = value;
    setDrawing(value);
  };

  const handlePointerDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent | PointerEvent>) => {
    // Stop page scroll / browser gestures while drawing on the stage.
    e.evt.preventDefault();

    const pos = getDrawPos();
    if (!pos) return;

    const clickedOnEmpty = e.target === e.target.getStage();

    if (activeTool === "Select" && clickedOnEmpty) {
      setSelectedElement(null);
      return;
    }

    if (activeTool === "Select" && !clickedOnEmpty) {
      const elementId = e.target.attrs.id;
      if (elementId) {
        setSelectedElement(elementId);
      }
      return;
    }

    if (activeTool === "Draw") {
      setIsDrawing(true);
      addElement({
        type: "line",
        points: [pos.x, pos.y],
        color,
        strokeWidth: penSize,
        opacity: penOpacity,
        id: `line-${Date.now()}`,
      });
    } else if (activeTool === "Erase") {
      setIsDrawing(true);
      addElement({
        type: "eraser",
        points: [pos.x, pos.y],
        color: "#ffffff",
        strokeWidth: eraserSize,
        opacity: eraserOpacity,
        id: `eraser-${Date.now()}`,
      });
    } else if (activeTool === "Rectangle") {
      setIsDrawing(true);
      startPosRef.current = pos;
      addElement({
        type: "rect",
        points: [],
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        color,
        strokeWidth,
        fill: fillColor,
        id: `rect-${Date.now()}`,
      });
    } else if (activeTool === "Circle") {
      setIsDrawing(true);
      startPosRef.current = pos;
      addElement({
        type: "circle",
        points: [],
        x: pos.x,
        y: pos.y,
        radius: 0,
        color,
        strokeWidth,
        fill: fillColor,
        id: `circle-${Date.now()}`,
      });
    } else if (activeTool === "Text") {
      setIsTextEditing(true);
      setTextInput("");
      const textId = `text-${Date.now()}`;
      addElement({
        type: "text",
        points: [],
        x: pos.x,
        y: pos.y,
        text: "",
        color,
        strokeWidth: 1,
        fontSize: penSize,
        fontFamily: textFontFamily,
        fontStyle: textFontStyle,
        fontWeight: textFontWeight,
        id: textId,
      });
      setSelectedElement(textId);
    } else if (activeTool === "Sticker" && selectedSticker) {
      addElement({
        type: "sticker",
        points: [],
        x: pos.x,
        y: pos.y,
        stickerName: selectedSticker || "smile",
        color,
        strokeWidth: 1,
        id: `sticker-${Date.now()}`,
      });
    }
  };

  const handlePointerMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent | PointerEvent>) => {
    e.evt.preventDefault();
    if (!drawingRef.current) return;

    const pos = getDrawPos();
    if (!pos) return;

    // Read store synchronously — React `elements` / `drawing` lag behind touchmove.
    const storeElements = useCanvasStore.getState().elements;
    const lastIndex = storeElements.length - 1;
    const lastElement = storeElements[lastIndex];
    if (!lastElement) return;

    if (activeTool === "Draw" || activeTool === "Erase") {
      updateLastElement([...lastElement.points, pos.x, pos.y]);
    } else if (activeTool === "Rectangle") {
      const start = startPosRef.current;
      updateElement(lastIndex, {
        width: pos.x - start.x,
        height: pos.y - start.y,
      });
    } else if (activeTool === "Circle") {
      const start = startPosRef.current;
      const dx = pos.x - start.x;
      const dy = pos.y - start.y;
      updateElement(lastIndex, { radius: Math.sqrt(dx * dx + dy * dy) });
    }
  };

  const handlePointerUp = () => {
    if (drawingRef.current) {
      useCanvasStore.getState().saveToHistory();
    }
    setIsDrawing(false);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedElement) {
        if (e.key === "Delete") {
          deleteElement(selectedElement);
        } else if (e.ctrlKey && e.key === "d") {
          e.preventDefault();
          duplicateElement(selectedElement);
        }
      }
    },
    [selectedElement, deleteElement, duplicateElement],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSelect = (id: string) => {
    setSelectedElement(id);
  };

  const handleTextChange = (id: string, newText: string) => {
    const index = elements.findIndex((el) => el.id === id);
    updateElement(index, { text: newText });
  };

  const renderGrid = () => {
    if (!gridEnabled) return null;
    const lines: JSX.Element[] = [];
    for (let i = 0; i < stageSize.width / gridSize; i++) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i * gridSize, 0, i * gridSize, stageSize.height]}
          stroke="#ddd"
          strokeWidth={1}
        />,
      );
    }
    for (let i = 0; i < stageSize.height / gridSize; i++) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, i * gridSize, stageSize.width, i * gridSize]}
          stroke="#ddd"
          strokeWidth={1}
        />,
      );
    }
    return lines;
  };

  const getCursor = () => {
    switch (activeTool) {
      case "Draw":
        return "crosshair";
      case "Erase":
        return "crosshair";
      case "Select":
        return "move";
      case "Text":
        return "text";
      default:
        return "default";
    }
  };

  const getCommonProps = (element: any) => ({
    draggable: activeTool === "Select",
    x: element.x || 0,
    y: element.y || 0,
    scaleX: element.scaleX || 1,
    scaleY: element.scaleY || 1,
    rotation: element.rotation || 0,
    onClick: () => activeTool === "Select" && handleSelect(element.id),
    onTap: () => activeTool === "Select" && handleSelect(element.id),
    onDragStart: () => {
      if (activeTool === "Select") {
        handleSelect(element.id);
      }
    },
    onDragEnd: (e: any) => {
      const node = e.target;
      const index = elements.findIndex(el => el.id === element.id);
      if (index !== -1) {
        updateElement(index, { x: node.x(), y: node.y() });
        useCanvasStore.getState().saveToHistory();
      }
    },
    onTransformEnd: (e: any) => {
      const node = e.target;
      const index = elements.findIndex(el => el.id === element.id);
      if (index !== -1) {
        updateElement(index, { 
          x: node.x(), 
          y: node.y(), 
          scaleX: Math.max(0.01, node.scaleX()), 
          scaleY: Math.max(0.01, node.scaleY()), 
          rotation: node.rotation() 
        });
        useCanvasStore.getState().saveToHistory();
      }
    }
  });

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full min-h-0 touch-none overflow-hidden rounded-zen-2xl border border-zen-border-soft/60 bg-[hsl(40,40%,99%)] shadow-[0_8px_28px_-18px_rgba(30,41,90,0.12)]"
      style={{ touchAction: "none" }}
      aria-label="Scribble drawing canvas"
      role="application"
    >
      {elements.length === 0 && !drawing ? (
        <p
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center font-ui text-sm text-zen-fg-subtle"
          aria-hidden="true"
        >
          Start anywhere.
        </p>
      ) : null}
      <div className="absolute inset-0 overflow-hidden" style={{ touchAction: "none" }}>
        {stageSize.width > 0 && stageSize.height > 0 ? (
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            scaleX={zoom}
            scaleY={zoom}
            ref={stageRef}
            // Pointer events cover mouse, touch, and stylus — avoid dual touch+pointer handlers.
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              cursor: getCursor(),
              touchAction: "none",
              display: "block",
            }}
          >
            <Layer>
              {renderGrid()}
              {elements.map((element, _idx) => {
                const _isSelected = selectedElement === element.id;
                if (element.type === "line") {
                  return (
                    <Line
                      key={element.id}
                      id={element.id}
                      points={element.points}
                      stroke={element.color}
                      strokeWidth={element.strokeWidth}
                      opacity={element.opacity}
                      tension={0.5}
                      lineCap="round"
                      lineJoin="round"
                      {...getCommonProps(element)}
                    />
                  );
                } else if (element.type === "eraser") {
                  return (
                    <Line
                      key={element.id}
                      id={element.id}
                      points={element.points}
                      stroke={element.color}
                      strokeWidth={element.strokeWidth}
                      opacity={element.opacity}
                      tension={0.5}
                      lineCap="round"
                      lineJoin="round"
                      globalCompositeOperation="destination-out"
                      {...getCommonProps(element)}
                    />
                  );
                } else if (element.type === "rect") {
                  return (
                    <Rect
                      key={element.id}
                      id={element.id}
                      width={element.width}
                      height={element.height}
                      stroke={element.color}
                      strokeWidth={element.strokeWidth}
                      fill={element.fill}
                      {...getCommonProps(element)}
                    />
                  );
                } else if (element.type === "circle") {
                  return (
                    <Circle
                      key={element.id}
                      id={element.id}
                      radius={element.radius}
                      stroke={element.color}
                      strokeWidth={element.strokeWidth}
                      fill={element.fill}
                      {...getCommonProps(element)}
                    />
                  );
                } else if (element.type === "text") {
                  return (
                    <Text
                      key={element.id}
                      id={element.id}
                      text={element.text || "Click to edit"}
                      fontSize={element.fontSize}
                      fontFamily={element.fontFamily}
                      fill={element.color}
                      {...getCommonProps(element)}
                      onDblClick={() => {
                        setIsTextEditing(true);
                        setTextInput(element.text || "");
                        setSelectedElement(element.id);
                      }}
                    />
                  );
                } else if (element.type === "sticker") {
                  const getEmoji = (name: string) => {
                    const emojiMap: { [key: string]: string } = {
                      smile: "😊",
                      heart: "❤️",
                      star: "⭐",
                      zap: "⚡",
                      sun: "☀️",
                      moon: "🌙",
                      cloud: "☁️",
                      cute_face: "🥰",
                      love: "💖",
                      sparkle: "✨",
                    };
                    return emojiMap[name] || "😊";
                  };
                  return (
                    <Text
                      key={element.id}
                      id={element.id}
                      text={getEmoji(element.stickerName || "smile")}
                      fontSize={32}
                      fill={element.color}
                      {...getCommonProps(element)}
                    />
                  );
                }

                return null;
              })}
              {selectedElement && (
                <Transformer
                  ref={transformerRef}
                  boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 5 || newBox.height < 5) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              )}
            </Layer>
          </Stage>
        ) : null}
        {isTextEditing && selectedElement && (
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onBlur={() => {
              handleTextChange(selectedElement, textInput);
              setIsTextEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTextChange(selectedElement, textInput);
                setIsTextEditing(false);
              }
            }}
            className="absolute top-4 left-4 z-10 rounded-zen-md border border-zen-border bg-zen-surface px-2 py-1 font-ui text-sm"
          />
        )}
      </div>
    </div>
  );
}
