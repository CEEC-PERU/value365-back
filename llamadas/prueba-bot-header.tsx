import React from "react";

interface PruebaBotHeaderProps {
  isOpen: boolean;
  onClose: () => void;
}

const PruebaBotHeader: React.FC<PruebaBotHeaderProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-12 right-0 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 relative animate-in fade-in-0 zoom-in-95 duration-200 border border-gray-200">
        {/* Botón de cerrar */}
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Telegram te dará un token de autorización para previsualizar el flujo de tu bot.
          </h3>
          
          {/* Token input */}
          <div className="mb-4">
            <input
              type="text"
              value="6449416278:AAGvlxlILHRmVtDut5Sj2UWmYZaB5"
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm font-mono"
            />
          </div>
          
          <p className="text-sm text-gray-600 mb-6">
            Para ejecutar la prueba, debes publicar al menos 1 vez el bot
          </p>
          
          <button
            className="px-8 py-3 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 active:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={onClose}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PruebaBotHeader;
