import React, { useState, useRef, useEffect } from "react";

interface TooltipImportBotProps {
  onClose: () => void;
  onImportar: (archivo: File) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

const TooltipImportBot: React.FC<TooltipImportBotProps> = ({ onClose, onImportar, buttonRef }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [tipoImport, setTipoImport] = useState<string>("sin-configuracion");
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buttonRef.current && tooltipRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      setPosition({
        top: buttonRect.bottom + 8,
        left: Math.max(16, buttonRect.left - tooltipRect.width / 2 + buttonRect.width / 2)
      });
    }
  }, [buttonRef]);

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportar(file);
      onClose();
    }
  };

  const handleCargarClick = () => {
    document.getElementById('fileInput')?.click();
  };
return (
    <>
      {/* Overlay con blur para cerrar al hacer clic fuera */}
      <div 
        className="fixed inset-0 backdrop-blur-sm z-40" 
        onClick={onClose}
      />
      
      {/* Tooltip flotante */}
      <div 
        ref={tooltipRef}
        className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80 animate-in fade-in-0 zoom-in-95 duration-200"
        style={{ 
          top: position.top, 
          left: position.left,
          transform: 'translateX(-50%)'
        }}
      >
        {/* Flecha apuntando hacia arriba */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <span className="text-sm font-medium text-gray-900">¿De qué forma quieres importar tu Bot?</span>
          </div>
            {/* Opciones de importación */}
          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
              <div className="relative">
                <input 
                  type="radio" 
                  name="tipoImport" 
                  value="sin-configuracion"
                  checked={tipoImport === "sin-configuracion"}
                  onChange={(e) => setTipoImport(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                  tipoImport === "sin-configuracion" ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}>
                  {tipoImport === "sin-configuracion" && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-700 select-none">Sin configuración de campaña</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
              <div className="relative">
                <input 
                  type="radio" 
                  name="tipoImport" 
                  value="con-configuracion"
                  checked={tipoImport === "con-configuracion"}
                  onChange={(e) => setTipoImport(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                  tipoImport === "con-configuracion" ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}>
                  {tipoImport === "con-configuracion" && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-700 select-none">Con configuración de campaña</span>
            </label>
          </div>

          {/* Información adicional */}
          {tipoImport === "sin-configuracion" && (
            <div className="mb-4 p-2.5 bg-blue-50 rounded-md border-l-4 border-blue-400">
              <div className="flex items-start gap-1.5">
                <svg className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <strong>Al seleccionar sin configuración de campaña</strong>, evitarás errores por duplicidad en el flujo de Bot cargado.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Input de archivo oculto */}
          <input
            type="file"
            id="fileInput"
            accept=".json,.zip,.bot"
            onChange={handleFileSelected}
            className="hidden"
          />

          <button 
            className="w-full px-3 py-2 rounded-md bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm" 
            onClick={handleCargarClick}
          >
            Cargar
          </button>
        </div>
      </div>
    </>
  );
};

export default TooltipImportBot;
