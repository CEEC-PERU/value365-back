import React from "react";

interface LoadingGuardarBotProps {
  isOpen: boolean;
}

const LoadingGuardarBot: React.FC<LoadingGuardarBotProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(30,32,40,0.35)] flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-10 max-w-md w-full relative">
        <div className="flex flex-col items-center justify-center">
          {/* Icono animado del bot */}
          <div className="mb-6 relative">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                <circle cx="12" cy="5" r="2"/>
                <path d="M12 7v4"/>
                <line x1="8" y1="16" x2="8" y2="16"/>
                <line x1="16" y1="16" x2="16" y2="16"/>
              </svg>
            </div>
            {/* Círculos animados alrededor */}
            <div className="absolute -inset-2">
              <div className="w-20 h-20 border-2 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
            </div>
          </div>

          {/* Texto principal */}
          <h3 className="text-xl font-bold text-gray-800 mb-2">Guardando Bot...</h3>
          <p className="text-gray-600 text-center mb-6">
            Estamos procesando y guardando tu bot. Este proceso puede tomar unos segundos.
          </p>

          {/* Barra de progreso animada */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ 
              width: '100%',
              animation: 'progress 2s ease-in-out infinite'
            }}></div>
          </div>

          {/* Puntos de carga */}
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingGuardarBot;
