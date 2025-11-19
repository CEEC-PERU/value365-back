import React, { useRef, useEffect, useState } from "react";
import HistorialAlertas from "./historial-alertas";

interface MonitoreoServiciosProps {
  isOpen: boolean;
  onClose: () => void;
}

const MonitoreoServicios: React.FC<MonitoreoServiciosProps> = ({ isOpen, onClose }) => {
  const notificationRef = useRef<HTMLDivElement>(null);
  const [showHistorial, setShowHistorial] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };  }, [isOpen, onClose]);
  const handleVerHistorial = () => {
    setShowHistorial(true);
  };

  const handleBackToNotifications = () => {
    setShowHistorial(false);
  };

  const handleCloseAll = () => {
    setShowHistorial(false);
    onClose();
  };

  if (!isOpen) return null;

  if (showHistorial) {
    return (
      <HistorialAlertas 
        isOpen={showHistorial}
        onClose={handleCloseAll}
        onBack={handleBackToNotifications}
      />
    );
  }
  return (
    <>
      {/* Backdrop con blur */}
      <div className="fixed inset-0 backdrop-blur-sm z-40"></div>
      
      <div 
        ref={notificationRef}
        className="absolute top-12 right-0 z-50 bg-white rounded-xl shadow-xl border border-gray-200 w-80 animate-fade-in"
        style={{ maxHeight: '400px' }}
      >
      {/* Header del modal */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800">Monitoreo de servicios</h3>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">(0)</span>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-blue-400">
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      
      {/* Contenido del modal */}
      <div className="p-6 text-center">        <div className="flex justify-center mb-4">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-blue-300">
            <circle cx="40" cy="40" r="35" fill="#e0e7ff" opacity="0.5"/>
            <path d="M30 35h20M35 30v20M45 30v20" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="52" cy="28" r="8" fill="#2563eb"/>
            <rect x="25" y="45" width="15" height="8" rx="2" fill="#60a5fa"/>
            <rect x="50" y="50" width="15" height="8" rx="2" fill="#60a5fa"/>
          </svg>
        </div>
        <h4 className="text-lg font-medium text-gray-700 mb-2">No tienes notificaciones nuevas</h4>
      </div>
        {/* Footer del modal */}
      <div className="px-4 py-3 border-t border-gray-100 flex justify-between text-sm">
        <button 
          onClick={handleVerHistorial}
          className="text-orange-500 hover:text-orange-600 font-medium"
        >
          Ver historial
        </button>        <button className="text-gray-400 hover:text-gray-600">
          Marcar como leído        </button>      </div>
    </div>
    </>
  );
};

export default MonitoreoServicios;
