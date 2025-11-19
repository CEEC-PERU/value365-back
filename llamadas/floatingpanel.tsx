import React, { useState } from "react";

interface FloatingPanelProps {
  show: boolean;
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  children?: React.ReactNode;
  title?: string;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({
  show,
  onClose,
  initialPosition = { x: 120, y: window.innerHeight / 2 - 200 },
  children,
  title = "Propiedades de la acción",
}) => {
  const [panelPosition, setPanelPosition] = useState(initialPosition);
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const [panelDragOffset, setPanelDragOffset] = useState({ x: 0, y: 0 });

  const handlePanelMouseDown = (e: React.MouseEvent) => {
    setIsDraggingPanel(true);
    setPanelDragOffset({
      x: e.clientX - panelPosition.x,
      y: e.clientY - panelPosition.y,
    });
  };

  const handlePanelMouseUp = () => {
    setIsDraggingPanel(false);
  };

  const handlePanelMouseMove = (e: React.MouseEvent) => {
    if (isDraggingPanel) {
      setPanelPosition({
        x: e.clientX - panelDragOffset.x,
        y: e.clientY - panelDragOffset.y,
      });
    }
  };

  if (!show) return null;

  return (
    <div
      className="absolute bg-white shadow-lg flex flex-col z-50"
      style={{
        left: panelPosition.x,
        top: panelPosition.y,
        width: "320px",
        height: "420px",
        borderRadius: "18px",
        overflow: "hidden",
        border: "1px solid #f0f1f5",
        boxShadow: "0 8px 32px 0 rgba(60,80,180,0.10)",
        cursor: isDraggingPanel ? "move" : "default",
        userSelect: isDraggingPanel ? "none" : "auto",
      }}
      onMouseMove={handlePanelMouseMove}
      onMouseUp={handlePanelMouseUp}
      onMouseLeave={handlePanelMouseUp}
    >
      <div
        className="relative px-6 py-4 text-lg font-semibold text-gray-800 select-none flex items-center"
        style={{
          background: "#f6f8ff",
          borderTopLeftRadius: "18px",
          borderTopRightRadius: "18px",
          cursor: "move",
        }}
        onMouseDown={handlePanelMouseDown}
      >
        <span>{title}</span>
        <button
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 text-blue-500 hover:text-blue-700 transition"
          onClick={onClose}
          aria-label="Cerrar"
          style={{ fontSize: "1.2rem", fontWeight: 700, cursor: "pointer" }}
        >
          ×
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-6">
        {children}
      </div>
    </div>
  );
};

export default FloatingPanel;