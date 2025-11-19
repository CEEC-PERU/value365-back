import React, { useRef, useEffect, useState } from "react";

interface GestCampModalCardProps {
  isOpen: boolean;
  onClose: () => void;
  botNombre?: string;
}

const GestCampModalCard: React.FC<GestCampModalCardProps> = ({ isOpen, onClose, botNombre }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const availableChannels = {
    campana1: ["facebook", "messenger", "email"],
    campana2: ["facebook", "email"],
    campana3: ["messenger", "email"],
    "ALO.COM Recuperate": ["facebook", "messenger", "email"]
  };

  const handleChannelToggle = (channel: string) => {
    setSelectedChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      // Reset state when modal closes
      setShowCampaignForm(false);
      setSelectedCampaign("");
      setSelectedChannels([]);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleAsociarCampaña = () => {
    setShowCampaignForm(true);
  };

  const handleCancelar = () => {
    setShowCampaignForm(false);
    setSelectedCampaign("");
    setSelectedChannels([]);
  };

  const handleGuardar = () => {
    console.log("Guardando campaña:", selectedCampaign, "Canales:", selectedChannels);
    onClose();
  };

  // Estado para selección de canales en el filtro
  const [filterChannels, setFilterChannels] = useState<string[]>([]);

  const handleToggleFilterChannel = (channel: string) => {
    setFilterChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm z-40"></div>
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          ref={modalRef}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 relative animate-fade-in"
        >
          {/* Header con botón de cerrar */}
          <div className="flex justify-end p-4 pb-2">
            <button 
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path 
                  d="M18 6L6 18M6 6l12 12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>          
          <div className="px-6 pb-6 pt-0">
            <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
              Conecta tu Bot
            </h2>
            
            <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
              Asocia una campaña y al menos un canal para tu bot. Cuando lo conectes, podrás hacer derivaciones.
            </p>

            {!showCampaignForm ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1 pr-4">
                    <p className="text-blue-500 font-medium text-sm mb-4">
                      Todavía no tienes asociada<br />
                      ninguna campaña
                    </p>
                    
                    <button 
                      onClick={handleAsociarCampaña}
                      className="border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg py-2 px-3 flex items-center justify-center gap-2 text-blue-600 font-medium text-xs"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Asociar nueva campaña
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center border-2 border-blue-300 shadow-sm">
                        <div className="w-10 h-10 bg-gradient-to-b from-red-400 to-red-500 rounded-full flex items-center justify-center relative">
                          <div className="w-2 h-2 bg-white rounded-full absolute top-1.5"></div>
                          <div className="w-1 h-1 bg-white rounded-full absolute top-3 left-3"></div>
                          <div className="w-1 h-1 bg-white rounded-full absolute top-3 right-3"></div>
                          <div className="w-2 h-0.5 bg-white rounded-full absolute bottom-1.5"></div>
                        </div>
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✋</span>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <div className="text-white">
                          <div className="flex gap-1 mb-1">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                          <div className="w-3 h-0.5 bg-white rounded-full mx-auto"></div>
                        </div>
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✋</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                        <path 
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                          stroke="white" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="text-xs text-blue-800 leading-relaxed">
                      <p>
                        Si seleccionas una <strong>campaña padre</strong>, no podrás asociar otra campaña. De lo contrario, si 
                        seleccionas una <strong>campaña normal</strong> podrás asociar más campañas del mismo tipo.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botón Salir centrado */}
                <div className="flex justify-center">
                  <button 
                    onClick={onClose}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm min-w-[100px]"
                  >
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaña
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCampaign}
                        onChange={(e) => {
                          setSelectedCampaign(e.target.value);
                          setSelectedChannels([]); 
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-white appearance-none pr-10"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="ALO.COM Recuperate">ALO.COM Recuperate</option>
                        <option value="campana1">Campaña de Marketing 2024</option>
                        <option value="campana2">Campaña de Ventas Q4</option>
                        <option value="campana3">Campaña de Fidelización</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center mb-2 gap-3 justify-between w-full">
                      <label className="block text-sm font-medium text-gray-700">
                        Canales disponibles
                      </label>
                      <div className="relative flex flex-row gap-2">
                        <button
                          type="button"
                          className="p-2 text-gray-400 hover:text-blue-500"
                          onClick={() => setShowFilterPopover((v) => !v)}
                          title="Filtrar"
                        >
                          <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-400 hover:text-blue-500"
                          onClick={() => setShowSearchInput((v) => !v)}
                          title="Buscar"
                        >
                          <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
                            <path d="M8.5 15.5a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm6.5-1.5l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>                        {showSearchInput && (
                          <div className="relative">
                            <input
                              type="text"
                              className="pl-3 pr-8 py-1 border border-gray-300 rounded-md text-sm text-gray-700 w-40"
                              placeholder="Buscar canal..."
                              value={searchValue}
                              onChange={e => setSearchValue(e.target.value)}
                              autoFocus
                            />
                            <button
                              type="button"
                              className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                              onClick={() => { setShowSearchInput(false); setSearchValue(""); }}
                              tabIndex={-1}
                            >
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </div>
                        )}

                        {showFilterPopover && (
                          <div className="absolute right-0 top-10 z-50 bg-white rounded-xl shadow-xl border border-gray-200 w-80 animate-fade-in p-6">
                            <form>
                              <div className="flex flex-col gap-3 mb-4">
                                <label className="flex items-center gap-2 text-gray-800 text-base font-normal cursor-pointer select-none">
                                  <span className="relative w-5 h-5 flex items-center justify-center">
                                    <input type="radio" name="estadoCanal" defaultChecked className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-500 checked:border-blue-600 checked:bg-white focus:outline-none" style={{ boxShadow: 'none' }} />
                                    <span className="pointer-events-none absolute w-3 h-3 rounded-full bg-blue-600 scale-0 peer-checked:scale-100 transition-transform"></span>
                                  </span>
                                  Canales disponibles
                                </label>
                                <label className="flex items-center gap-2 text-gray-800 text-base font-normal cursor-pointer select-none">
                                  <span className="relative w-5 h-5 flex items-center justify-center">
                                    <input type="radio" name="estadoCanal" className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-500 checked:border-blue-600 checked:bg-white focus:outline-none" style={{ boxShadow: 'none' }} />
                                    <span className="pointer-events-none absolute w-3 h-3 rounded-full bg-blue-600 scale-0 peer-checked:scale-100 transition-transform"></span>
                                  </span>
                                  Canales no disponibles
                                </label>
                              </div>
                              <hr className="my-4 border-gray-200" />
                              <div className="flex items-center justify-center gap-6 mb-6">


                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white cursor-pointer relative transition-all duration-150 ${filterChannels.includes('facebook') ? 'border-green-500' : 'border-gray-200'}`}
                                  onClick={() => handleToggleFilterChannel('facebook')}
                                >
                                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="12" fill="#fff" />
                                    <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" fill="#3b5998"/>
                                  </svg>
                                  {filterChannels.includes('facebook') && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-green-500">
                                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                                        <circle cx="10" cy="10" r="7" fill="#22c55e" />
                                        <path d="M7.5 10.5l2 2 3-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </span>
                                  )}
                                </div>

                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white cursor-pointer relative transition-all duration-150 ${filterChannels.includes('messenger') ? 'border-green-500' : 'border-gray-200'}`}
                                  onClick={() => handleToggleFilterChannel('messenger')}
                                >
                                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="12" fill="#00B2FF" />
                                    <path d="M8 15l3.5-4 2.5 3 4-4-3.5 4-2.5-3-4 4z" fill="#fff"/>
                                  </svg>
                                  {filterChannels.includes('messenger') && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-green-500">
                                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                                        <circle cx="10" cy="10" r="7" fill="#22c55e" />
                                        <path d="M7.5 10.5l2 2 3-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </span>
                                  )}
                                </div>

                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white cursor-pointer relative transition-all duration-150 ${filterChannels.includes('email') ? 'border-green-500' : 'border-gray-200'}`}
                                  onClick={() => handleToggleFilterChannel('email')}
                                >
                                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                                    <rect x="4" y="7" width="16" height="10" rx="2" fill="#fff"/>
                                    <path d="M4 7l8 5 8-5" stroke="#3ec6d3" strokeWidth="1.5" strokeLinejoin="round"/>
                                  </svg>
                                  {filterChannels.includes('email') && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-green-500">
                                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                                        <circle cx="10" cy="10" r="7" fill="#22c55e" />
                                        <path d="M7.5 10.5l2 2 3-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-4 mt-2">
                                <button
                                  type="button"
                                  className="flex-1 border-2 border-orange-500 text-orange-500 rounded-md py-2 font-semibold text-base hover:bg-orange-50 transition-colors"
                                  onClick={() => setFilterChannels([])}
                                >
                                  Limpiar filtros
                                </button>
                                <button
                                  type="button"
                                  className="flex-1 bg-orange-500 text-white rounded-md py-2 font-semibold text-base hover:bg-orange-600 transition-colors"
                                  onClick={() => setShowFilterPopover(false)}
                                >
                                  Aplicar filtros
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedCampaign && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedCampaign === "ALO.COM Recuperate" ? (
                          <>
                            {/* Facebook */}
                            <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm">
                              <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                                <svg width="16" height="16" fill="#3b5998" viewBox="0 0 24 24">
                                  <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
                                </svg>
                              </div>
                              <span className="text-xs text-gray-700 font-semibold">ID 1011359118066...</span>
                            </div>
                            {/* Messenger */}
                            <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm">
                              <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                                <svg width="16" height="16" fill="#00B2FF" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="12" fill="#00B2FF" />
                                  <path d="M8 15l3.5-4 2.5 3 4-4-3.5 4-2.5-3-4 4z" fill="#fff"/>
                                </svg>
                              </div>
                              <span className="text-xs text-gray-700 font-semibold">ID 1011359118066...</span>
                            </div>
                            {/* Email */}
                            <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm">
                              <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                                <svg width="16" height="16" fill="#3ec6d3" viewBox="0 0 24 24">
                                  <rect x="4" y="7" width="16" height="10" rx="2" fill="#fff"/>
                                  <path d="M4 7l8 5 8-5" stroke="#3ec6d3" strokeWidth="1.5" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <span className="text-xs text-gray-700 font-semibold">ID contacto@alo.co...</span>
                            </div>
                          </>
                        ) : (
                          // Para otras campañas, mostrar solo los canales seleccionados en el filtro
                          <>
                            {filterChannels.includes('facebook') && (
                              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm">
                                <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                                  <svg width="16" height="16" fill="#3b5998" viewBox="0 0 24 24">
                                    <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
                                  </svg>
                                </div>
                                <span className="text-xs text-gray-700 font-semibold">ID 1011359118066...</span>
                              </div>
                            )}
                            {filterChannels.includes('messenger') && (
                              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm">
                                <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                                  <svg width="16" height="16" fill="#00B2FF" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="12" fill="#00B2FF" />
                                    <path d="M8 15l3.5-4 2.5 3 4-4-3.5 4-2.5-3-4 4z" fill="#fff"/>
                                  </svg>
                                </div>
                                <span className="text-xs text-gray-700 font-semibold">ID 1011359118066...</span>
                              </div>
                            )}
                            {filterChannels.includes('email') && (
                              <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm">
                                <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                                  <svg width="16" height="16" fill="#3ec6d3" viewBox="0 0 24 24">
                                    <rect x="4" y="7" width="16" height="10" rx="2" fill="#fff"/>
                                    <path d="M4 7l8 5 8-5" stroke="#3ec6d3" strokeWidth="1.5" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                                <span className="text-xs text-gray-700 font-semibold">ID contacto@alo.co...</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                        <path 
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                          stroke="white" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="text-xs text-blue-800 leading-relaxed">
                      <p>
                        Si seleccionas una <strong>campaña padre</strong>, no podrás asociar otra campaña. De lo contrario, si 
                        seleccionas una <strong>campaña normal</strong> podrás asociar más campañas del mismo tipo.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={handleCancelar}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleGuardar}
                    disabled={!selectedCampaign || selectedChannels.length === 0}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                      (selectedCampaign && selectedChannels.length > 0)
                        ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Guardar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default GestCampModalCard;
