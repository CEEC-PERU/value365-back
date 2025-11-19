import React, { useState } from "react";

interface PruebaBotModalCardProps {
  isOpen: boolean;
  onClose: () => void;
}

const PruebaBotModalCard: React.FC<PruebaBotModalCardProps> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-sm bg-white/30">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full relative">
        <button
          className="absolute top-4 right-4 text-gray-400 text-3xl hover:text-red-500 transition-colors duration-150"
          onClick={onClose}
          aria-label="Cerrar"
          style={{ lineHeight: 1 }}
        >
          &times;
        </button>
        <div className="flex flex-col items-center mb-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 mb-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="6" width="18" height="12" rx="3" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5"/>
              <path d="M9.5 12H8m0 0l1.5-1.5M8 12l1.5 1.5M14.5 12H16m0 0l-1.5-1.5M16 12l-1.5 1.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-base text-gray-800 font-medium">
              Telegram te dará un token de autorización para previsualizar el flujo de tu bot.
            </p>
          </div>
        </div>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-red-200"
          placeholder="Inserta tu token acá"
          value={token}
          onChange={e => setToken(e.target.value)}
        />
        <div className="text-xs text-gray-500 mb-4 text-center">
          Para ejecutar la prueba, debes publicar al menos 1 vez el bot
        </div>
        <button
          className="px-8 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition-colors text-base shadow-md mx-auto block mt-2"
          style={{ minWidth: '120px', maxWidth: '220px' }}
          onClick={onClose}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default PruebaBotModalCard;
