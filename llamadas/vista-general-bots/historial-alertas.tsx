import React, { useRef, useEffect } from "react";

interface HistorialAlertasProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

const HistorialAlertas: React.FC<HistorialAlertasProps> = ({ isOpen, onClose, onBack }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Cierra el modal al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[60] animate-fade-in">
      <div 
        ref={modalRef}        className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-4xl mx-4 transform transition-all duration-300 ease-out overflow-hidden flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* Botón de regreso */}
            <button 
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-500">Mis bot |</span>
                <span className="text-sm font-medium text-gray-700">Alertas de servicios</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Monitoreo de servicios conectados</h2>
              <div className="flex items-center gap-2 mt-1">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-orange-500">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-orange-500">
                  <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Botón cerrar */}
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
          {/* Contenido del modal */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Descripción */}
          <div className="mb-6">
            <p className="text-gray-600 text-sm leading-relaxed">
              Monitorea el historial de notificaciones de error en los servicios de tus Bots. Cuando el error persista en un mismo servicio, podrás desplegar el detalle.{' '}
              <button className="text-blue-500 hover:text-blue-600 underline">
                ¿Quieres saber más?
              </button>
            </p>
          </div>
          
          {/* Estado vacío */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            {/* Icono de estado vacío */}
            <div className="mb-6">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="text-gray-300">
                <circle cx="60" cy="60" r="50" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2"/>
                <circle cx="45" cy="45" r="3" fill="#cbd5e1"/>
                <circle cx="75" cy="45" r="3" fill="#cbd5e1"/>
                <path d="M45 75c0-8.284 6.716-15 15-15s15 6.716 15 15" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Todavía no hay alertas para mostrar
            </h3>
          </div>
        </div>
          {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex-shrink-0">
          <p className="text-sm text-gray-500 text-center">
            Próximamente, podrás suscribirte con tu email y recibir alertas en tiempo real.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistorialAlertas;
