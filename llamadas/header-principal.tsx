import React from "react"
import { Filter, Pencil, Sliders } from "lucide-react"
import VistaBotIVRGeneral from "./vista-general-bots/vista-botIVR-gnral"
import PruebaBotHeader from "./prueba-bot-header"
import LoadingGuardarBot from "./loading-guardarbot"

interface HeaderPrincipalProps {
  nombreBot: string;
  onPublishBot?: (botData: { nombre: string; descripcion: string }) => void;
  onNombreBotChange?: (nuevoNombre: string) => void;
  descripcionBot?: string;
  onDescripcionBotChange?: (nuevaDescripcion: string) => void;
}

const HeaderPrincipal: React.FC<HeaderPrincipalProps> = ({ nombreBot, onPublishBot, onNombreBotChange, descripcionBot, onDescripcionBotChange }) => {  
  const [isPublishing, setIsPublishing] = React.useState(false)
  const [showVistaBotIVR, setShowVistaBotIVR] = React.useState(false)
  const [showFiltroModal, setShowFiltroModal] = React.useState(false)
  const [showTelegramModal, setShowTelegramModal] = React.useState(false)
  const [editNombre, setEditNombre] = React.useState(false)
  const [nombreEditable, setNombreEditable] = React.useState(nombreBot)
  const [editDescripcion, setEditDescripcion] = React.useState(false)
  const [descripcionEditable, setDescripcionEditable] = React.useState(descripcionBot || "")

  React.useEffect(() => {
    setNombreEditable(nombreBot)
    setDescripcionEditable(descripcionBot || "")
  }, [nombreBot, descripcionBot])
  const handleNombreChange = (nuevoNombre: string) => {
    setNombreEditable(nuevoNombre);
    if (onNombreBotChange) {
      onNombreBotChange(nuevoNombre);
    }
  };

  const handleDescripcionChange = (nuevaDescripcion: string) => {
    setDescripcionEditable(nuevaDescripcion);
    if (onDescripcionBotChange) {
      onDescripcionBotChange(nuevaDescripcion);
    }
  };

  const handleConfirmarNombre = () => {
    setEditNombre(false);
    handleNombreChange(nombreEditable);
  };

  const handleConfirmarDescripcion = () => {
    setEditDescripcion(false);
    handleDescripcionChange(descripcionEditable);
  };

  const handleCancelarEdicion = () => {
    setNombreEditable(nombreBot);
    setDescripcionEditable(descripcionBot || "");
    setEditNombre(false);
    setEditDescripcion(false);
  };

  if (showVistaBotIVR) {
    return <VistaBotIVRGeneral />
  }

  return (
    <>
      <div className="w-full flex items-center bg-white px-0 py-0" style={{ minHeight: 56, borderBottom: '1px solid #eee' }}>
        {/* Barra lateral izquierda decorativa azul */}
        <div className="h-full" style={{ width: 8, background: 'linear-gradient(180deg, #2563eb 0%, #2563eb 100%)', borderRadius: '0 8px 8px 0' }}></div>
        {/* Título y subtítulo */}        <div className="flex flex-col justify-center ml-4" style={{ minWidth: 220 }}>
          <div className="flex items-center gap-2">
            {editNombre ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nombreEditable}
                  onChange={(e) => setNombreEditable(e.target.value)}
                  className="text-lg font-semibold text-black leading-none bg-transparent border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleConfirmarNombre();
                    } else if (e.key === 'Escape') {
                      handleCancelarEdicion();
                    }
                  }}
                />
                <button
                  onClick={handleConfirmarNombre}
                  className="text-green-600 hover:text-green-700 p-1"
                  title="Confirmar"
                >
                  ✓
                </button>
                <button
                  onClick={handleCancelarEdicion}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Cancelar"
                >
                  ✗
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-black leading-none">{nombreEditable || "Bot IVR"}</span>
                <button
                  onClick={() => setEditNombre(true)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title="Editar nombre"
                >
                  <Pencil size={16} />
                </button>
              </div>
            )}
          </div>          <div className="flex items-center gap-2 mt-1">
            {editDescripcion ? (
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={descripcionEditable}
                  onChange={(e) => setDescripcionEditable(e.target.value)}
                  className="text-sm text-[#6c6c9f] bg-transparent border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500 flex-1"
                  placeholder="Agregar descripción..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleConfirmarDescripcion();
                    } else if (e.key === 'Escape') {
                      handleCancelarEdicion();
                    }
                  }}
                />
                <button
                  onClick={handleConfirmarDescripcion}
                  className="text-green-600 hover:text-green-700 p-1"
                  title="Confirmar"
                >
                  ✓
                </button>
                <button
                  onClick={handleCancelarEdicion}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Cancelar"
                >
                  ✗
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span 
                  className="text-[#6c6c9f] text-sm hover:text-[#2563eb] cursor-pointer underline"
                  onClick={() => setEditDescripcion(true)}
                  title="Editar descripción"
                >
                  {descripcionEditable || "¿Qué es esto?"}
                </span>
                {!descripcionEditable && (
                  <button
                    onClick={() => setEditDescripcion(true)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Agregar descripción"
                  >
                    <Pencil size={12} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Centro: Dropdown + filtro */}
        <div className="flex-1 flex justify-center items-center">
          <div className="flex items-center gap-2">
            <select
              className="min-w-[180px] h-10 px-4 border border-gray-200 rounded-md text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 text-base"
              defaultValue=""
            >
              <option value="" disabled>Select...</option>
              <option value="bot1">Bot 1</option>
              <option value="bot2">Bot 2</option>
            </select>
            <button className="p-2 text-[#b6b6d6] hover:text-[#2563eb]" tabIndex={-1} aria-label="Filtrar" onClick={() => setShowFiltroModal(v => !v)}>
              <Filter size={20} />
            </button>
          </div>
        </div>        {/* Derecha: iconos y botón en rojo */}
        <div className="flex items-center gap-3 mr-6">          {/* Ícono de robot/bot */}
          <div className="relative">
            <button 
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors" 
              aria-label="Bot"
              onClick={() => setShowTelegramModal(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                <circle cx="12" cy="5" r="2"/>
                <path d="M12 7v4"/>
                <line x1="8" y1="16" x2="8" y2="16"/>
                <line x1="16" y1="16" x2="16" y2="16"/>
              </svg>
            </button>
            
            {/* Modal de Telegram posicionado debajo del ícono */}
            <PruebaBotHeader 
              isOpen={showTelegramModal} 
              onClose={() => setShowTelegramModal(false)} 
            />
          </div>
            {/* Ícono de documento/página */}
          <button 
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors" 
            aria-label="Documento"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </button>
          
          {/* Ícono de advertencia/triángulo */}
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors" aria-label="Advertencia">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </button>          <button className="ml-2 px-6 py-2 bg-red-500 text-white rounded-md font-semibold text-base hover:bg-red-600 transition-colors" style={{ minWidth: 140 }}
            onClick={async () => {
              try {
                setIsPublishing(true);
                
                // Simular tiempo de guardado
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                if (onPublishBot) {
                  onPublishBot({
                    nombre: nombreEditable || "Bot IVR",
                    descripcion: descripcionEditable || "Bot IVR creado"
                  });
                }
                setShowVistaBotIVR(true);
              } finally {
                setIsPublishing(false);
              }
            }}>
            Publicar bot
          </button>
        </div>
      </div>
      {/* Panel de filtros debajo del header, no modal */}
      {showFiltroModal && (
        <div className="w-full flex justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full relative flex flex-col gap-0 border border-gray-100 mt-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">Búsqueda por filtros <Sliders size={20} className="text-blue-400" /></h2>
              <button className="text-blue-400 text-2xl" onClick={() => setShowFiltroModal(false)}>&times;</button>
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col gap-6 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Tipo de acción</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-700 bg-white" defaultValue="">
                    <option value="" disabled>Seleccionar...</option>
                  </select>
                </div>
                <div className="mt-4">
                  <span className="block text-sm font-semibold text-gray-700 mb-2">Información adicional</span>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="info" className="accent-blue-400" /> Con descripción para IA
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="info" className="accent-blue-400" /> Sin descripción para IA
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="info" className="accent-blue-400" /> Restringido
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="info" className="accent-blue-400" /> Etiqueta CAPI
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="info" className="accent-blue-400" /> Información ofuscada
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center flex-1">
                <div className="bg-[#f5f6fa] rounded-xl p-8 flex flex-col items-center justify-center w-full h-full">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="120" height="120" rx="24" fill="#e5e6ef" />
                    <g>
                      <rect x="32" y="36" width="56" height="12" rx="6" fill="#b6b6d6" />
                      <rect x="32" y="54" width="56" height="12" rx="6" fill="#b6b6d6" />
                      <rect x="32" y="72" width="56" height="12" rx="6" fill="#b6b6d6" />
                      <circle cx="60" cy="60" r="18" fill="#2563eb" />
                      <rect x="54" y="54" width="12" height="12" rx="6" fill="#fff" />
                    </g>
                  </svg>
                  <span className="block text-blue-600 text-base text-center mt-4">Aplica filtros y encuentra rápidamente los nodos a gestionar.</span>
                </div>
              </div>            </div>
          </div>        </div>
      )}
      
      <LoadingGuardarBot isOpen={isPublishing} />
    </>
  )
}

export default HeaderPrincipal
