import React, { useEffect } from "react";

interface ExportProyecModalCardProps {
  isOpen: boolean;
  onClose: () => void;
  proyecto: { nombre: string } | null;
}

const ExportProyecModalCard: React.FC<ExportProyecModalCardProps> = ({ isOpen, onClose, proyecto }) => {
  useEffect(() => {
    if (isOpen && proyecto) {
      const data = { nombre: proyecto.nombre };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${proyecto.nombre || "bot"}.json`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        onClose();
      }, 100);
    }
  }, [isOpen, proyecto, onClose]);
  return null;
};

export default ExportProyecModalCard;
