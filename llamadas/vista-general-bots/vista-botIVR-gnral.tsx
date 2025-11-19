import React, { useState, useRef } from "react";
import CallsManagement from "../llamadas-principal";
import HeaderPrincipal from "../header-principal";
import MonitoreoServicios from "./mon-servicios";
import TooltipImportBot from "./import-bot";
import GestCampModalCard from "./gestcamp-modal-card";
import PruebaBotModalCard from "./pruebabot-modal-card";
import ExportProyecModalCard from "./exportproyec-modal-card";

const bots = [
  {
    nombre: "Evalúa si tienes un crédito",
    creado: "15 de enero de 2024",
    publicado: "16 de febrero de 2024",
    tipo: "AUXILIAR",
    demo: "DEMO BN GPT V2",
    activado: true,
    descripcion: "Bot auxiliar para evaluación de créditos",
  },
  {
    nombre: "Nivel de Satisfacción",
    creado: "26 de agosto de 2024",
    publicado: "Sin publicar",
    tipo: "ENCUESTA",
    demo: "ALO.COM Recuperate",
    activado: true,
    descripcion: "Encuesta para medir satisfacción del cliente",
  },
  {
    nombre: "Aliados Prevención",
    creado: "13 de octubre de 2022",
    publicado: "22 de diciembre de 2022",
    tipo: "GENERAL",
    demo: null,
    activado: false,
    descripcion: "Bot general para prevención",
  },
  {
    nombre: "Bot asistencia - test",
    creado: "13 de julio de 2023",
    publicado: "12 de diciembre de 2023",
    tipo: "GENERAL",
    demo: null,
    activado: false,
    descripcion: "Bot de prueba para asistencia",
  },
];

const ModalCrearBot = ({ onClose, onCrear }: { onClose: () => void; onCrear: (bot: any) => void }) => {
  const [nombre, setNombre] = useState("");
  const tipo = "IVR"; 
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!nombre.trim() || !descripcion.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }
    onCrear({ nombre, tipo, descripcion });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[rgba(30,32,40,0.35)] flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-10 max-w-xl w-full relative">
        <button className="absolute top-4 right-4 text-gray-400 text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-3xl font-bold text-blue-600 mb-2">Crear Bot</h2>
        <p className="text-gray-600 mb-6">Para empezar debes darle un nombre y descripción a tu bot. El tipo de bot es IVR y no se puede modificar.</p>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Nombre del Bot:</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300" placeholder="Escriba el nombre del bot aquí..." />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Tipo de Bot:</label>
            <input value={tipo} disabled className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500" />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">Descripción del Bot</label>
          <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300" rows={4} placeholder="Escriba una descripción del bot aquí..." />
        </div>
        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
        <div className="flex justify-end">
          <button className="px-8 py-2 rounded-lg bg-[#e5e6ef] text-[#1a237e] font-semibold" onClick={handleSubmit} disabled={!nombre.trim() || !descripcion.trim()}>Siguiente</button>
        </div>
      </div>
    </div>  );
};

interface VistaBotIVRGeneralProps {
  nombreBot?: string;
  descripcionBot?: string;
  botPublicado?: { nombre: string; descripcion: string } | null;
}

const VistaBotIVRGeneral: React.FC<VistaBotIVRGeneralProps> = ({ nombreBot, descripcionBot, botPublicado }) => {const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [botToDelete, setBotToDelete] = useState<number | null>(null);
  const importButtonRef = useRef<HTMLButtonElement>(null);
  const [botsList, setBotsList] = useState(bots);  const [botCreado, setBotCreado] = useState<any | null>(null);
  const [nombreBotCreado, setNombreBotCreado] = useState<string>("");
  const [descripcionBotCreado, setDescripcionBotCreado] = useState<string>("");
  const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);  const [selectedBots, setSelectedBots] = useState<number[]>([]);  const [showFilter, setShowFilter] = useState(false);
  const [showDeleteTooltip, setShowDeleteTooltip] = useState(false);
  const [showGestCampModal, setShowGestCampModal] = useState(false);
  const [selectedBotForCampaign, setSelectedBotForCampaign] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showPruebaModal, setShowPruebaModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [botToExport, setBotToExport] = useState<{ nombre: string } | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
   const botPublicadoProcessed = useRef<{ nombre: string; descripcion: string } | null>(null);

  React.useEffect(() => {
    if (botPublicado && 
        (!botPublicadoProcessed.current || 
         botPublicadoProcessed.current.nombre !== botPublicado.nombre || 
         botPublicadoProcessed.current.descripcion !== botPublicado.descripcion)) {
      
      const botYaExiste = botsList.some(bot => 
        bot.nombre === botPublicado.nombre && 
        bot.descripcion === botPublicado.descripcion
      );
      
      if (!botYaExiste) {
        const nuevoBotPublicado = {
          nombre: botPublicado.nombre,
          tipo: "IVR",
          descripcion: botPublicado.descripcion,
          creado: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
          publicado: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
          demo: null,
          activado: true,
          avatar: "🤖"
        };
        setBotsList(prev => [...prev, nuevoBotPublicado]);
        botPublicadoProcessed.current = botPublicado;
      }
    }
  }, [botPublicado]);

  const handleCrearBot = (bot: any) => {
    const nuevoBotConId = {
      id: `bot-${Date.now()}`,
      ...bot, 
      descripcion: bot.descripcion || "",
      creado: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }), 
      publicado: 'Sin publicar', 
      demo: null, 
      activado: false
    };
    setBotsList([...botsList, nuevoBotConId]);
    setBotCreado(bot);
    setNombreBotCreado(bot.nombre);
    setDescripcionBotCreado(bot.descripcion || "");
  };
  const handleImportarBot = (archivo: File) => {
    const nuevoBot = {
      nombre: `Bot Importado - ${archivo.name.replace(/\.[^/.]+$/, "")}`,
      tipo: "IVR",
      descripcion: "Bot importado desde archivo",
      creado: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
      publicado: 'Sin publicar',
      demo: null,
      activado: false
    };
    
    setBotsList([...botsList, nuevoBot]);
    console.log("Bot importado:", archivo.name);
  };
  const handleToggleActivado = (idx: number) => {
    setBotsList(prev => prev.map((bot, i) => i === idx ? { ...bot, activado: !bot.activado } : bot));
  };

  const handleSelectBot = (idx: number) => {
    setSelectedBots(prev => 
      prev.includes(idx) 
        ? prev.filter(i => i !== idx)
        : [...prev, idx]
    );
  };
  const handleSelectAll = () => {
    if (selectedBots.length === botsList.length) {
      setSelectedBots([]);
    } else {
      setSelectedBots(botsList.map((_, idx) => idx));
    }
  };
  const handleDeleteSelected = () => {
    if (selectedBots.length > 0) {
      const newBotsList = botsList.filter((_, idx) => !selectedBots.includes(idx));
      setBotsList(newBotsList);
      setSelectedBots([]);
    }
  };  const handleDuplicateBot = (idx: number) => {
    const botToDuplicate = botsList[idx];
    const duplicatedBot = {
      ...botToDuplicate,
      nombre: `${botToDuplicate.nombre} - DUPLICADO`,
      creado: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
      publicado: 'Sin publicar',
      activado: false
    };
    
    const newBotsList = [...botsList];
    newBotsList.splice(idx + 1, 0, duplicatedBot);
    setBotsList(newBotsList);
    setMenuOpenIdx(null); 
  };
  const handleDeleteBot = (idx: number) => {
    const bot = botsList[idx];
    if (!bot.activado) {
      setBotToDelete(idx);
      setShowDeleteModal(true);
      setMenuOpenIdx(null);
    }
  };

  const confirmDeleteBot = () => {
    if (botToDelete !== null) {
      const newBotsList = botsList.filter((_, i) => i !== botToDelete);
      setBotsList(newBotsList);
      setBotToDelete(null);
      setShowDeleteModal(false);
    }
  };
  const cancelDeleteBot = () => {
    setBotToDelete(null);
    setShowDeleteModal(false);
  };

  const handleGestionarCampañas = (idx: number) => {
    setSelectedBotForCampaign(idx);
    setShowGestCampModal(true);
    setMenuOpenIdx(null);
  };
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenIdx(null);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    }
    if (menuOpenIdx !== null || showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpenIdx, showFilter]);  if (botCreado) {
    return <CallsManagement nombreBot={nombreBotCreado} descripcionBot={descripcionBotCreado} />;
  }

  if (nombreBot) {
    return <CallsManagement nombreBot={nombreBot} descripcionBot={descripcionBot} />;
  }

  return (    <div className="w-full min-h-screen bg-white p-8">      <h1 className="text-2xl font-bold mb-6 ml-8">Mis Bots</h1>
      <div className="max-w-none ml-8 mr-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar Bot..."
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 w-64 pl-10"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#b6b6d6]">
              <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><path d="M8.5 15.5a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm6.5-1.5l4 4" stroke="#b6b6d6" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
          </div><button 
            className="p-2 text-[#b6b6d6] hover:text-blue-500"
            onClick={handleSelectAll}
            title={selectedBots.length === botsList.length ? "Deseleccionar todo" : "Seleccionar todo"}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <rect x="3" y="3" width="14" height="14" rx="2" stroke="#b6b6d6" strokeWidth="2"/>
              {selectedBots.length > 0 && selectedBots.length === botsList.length && (
                <path d="M7 10l2 2 4-4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              )}
            </svg>
          </button>
          {selectedBots.length > 0 && (
            <span className="text-sm text-gray-600">
              {selectedBots.length} seleccionado{selectedBots.length > 1 ? 's' : ''}
            </span>
          )}          <div className="relative">
            <button 
              className="p-2 text-[#b6b6d6] hover:text-blue-500"
              onClick={() => setShowFilter(!showFilter)}
              title="Filtrar"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V4z" stroke="#b6b6d6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>          
            
              {/* Modal de filtro */}
            {showFilter && (
              <>
                {/* Backdrop con blur */}
                <div className="fixed inset-0 backdrop-blur-sm z-40"></div>
                
                <div 
                  ref={filterRef}
                  className="absolute top-12 left-0 z-50 bg-white rounded-lg shadow-xl border border-gray-200 w-96 animate-fade-in"
                >
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Filtros y Ordenamiento</h3>
                  <button 
                    onClick={() => setShowFilter(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Filtrar Bots</h4>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">Campaña y canal</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500">
                          <option>Seleccionar...</option>
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">Tipo de Bot</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500">
                          <option>Seleccionar...</option>
                        </select>
                      </div>
                      
                      {/* Estado */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">Estado</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500">
                          <option>Seleccionar...</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Orden Bots</h4>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">Mostrar primero</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="orden" className="w-4 h-4 text-blue-500 border-gray-300" />
                            <span className="text-sm text-gray-700">Creado más reciente</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="orden" className="w-4 h-4 text-blue-500 border-gray-300" />
                            <span className="text-sm text-gray-700">Creado menos reciente</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="orden" className="w-4 h-4 text-blue-500 border-gray-300" />
                            <span className="text-sm text-gray-700">Publicado más reciente</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="orden" className="w-4 h-4 text-blue-500 border-gray-300" />
                            <span className="text-sm text-gray-700">Publicado menos reciente</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="orden" className="w-4 h-4 text-blue-500 border-gray-300" />
                            <span className="text-sm text-gray-700">Sin publicar</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="orden" defaultChecked className="w-4 h-4 text-blue-500 border-gray-300" />
                            <span className="text-sm text-gray-700">Ninguno</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                    <button className="px-4 py-2 text-orange-500 border border-orange-300 rounded-md hover:bg-orange-50 transition-colors">
                      Limpiar filtros
                    </button>                    <button className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                      Aplicar filtros
                    </button>
                  </div>
                </div>
              </div>
              </>
            )}</div>       
          <div className="relative">
            <button 
              className={`p-2 rounded-lg transition-all duration-200 ${
                selectedBots.length > 0 
                  ? 'text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedBots.length > 0 ? handleDeleteSelected() : {}}
              onMouseEnter={() => setSelectedBots.length === 0 && setShowDeleteTooltip(true)}
              onMouseLeave={() => setShowDeleteTooltip(false)}
              disabled={selectedBots.length === 0}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path 
                  d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            
            {showDeleteTooltip && selectedBots.length === 0 && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                <div className="bg-purple-600 text-white text-sm py-2 px-3 rounded-lg shadow-lg whitespace-nowrap">
                  Selecciona los proyectos que deseas eliminar
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-600"></div>
                </div>
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-4 relative pr-8">
          
            <button 
              className="p-2 text-orange-400 hover:text-orange-500 transition-colors relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <MonitoreoServicios 
              isOpen={showNotifications} 
              onClose={() => setShowNotifications(false)} 
            />             
            <button 
              ref={importButtonRef}
              className="p-2 text-orange-400 hover:text-orange-500 transition-colors"
              onClick={() => setShowImportModal(true)}
              title="Importar Bot"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14v-4M10 12l2-2 2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors" onClick={() => setShowModal(true)}>
              Crear Bot
            </button>
          </div>        </div>        <div className="space-y-4 mt-20">
          {botsList.map((bot, idx) => (
            <div key={idx} className="flex items-center gap-6">
              <div className="flex items-center justify-center">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedBots.includes(idx)}
                    onChange={() => handleSelectBot(idx)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedBots.includes(idx) 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-300 hover:border-blue-400'
                  }`}>
                    {selectedBots.includes(idx) && (
                      <svg width="12" height="12" fill="none" viewBox="0 0 12 12">
                        <path d="M2 6l2 2 6-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </label>
              </div>              
              <div className="bg-white rounded-xl shadow border border-gray-100 flex items-center p-4 relative flex-1 w-full">
                <div className="flex flex-col items-center justify-center w-24">
                  <span className="text-xs font-bold text-blue-500">{bot.tipo}</span>
                </div>              <div className="flex-1 px-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-lg font-semibold text-gray-800">{bot.nombre}</div>
                  {bot.nombre.includes('DUPLICADO') && (
                    <span className="inline-block px-2 py-1 text-xs font-bold bg-orange-100 text-orange-600 rounded-full border border-orange-300">
                      DUPLICADO
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  <span className="font-bold">Creado:</span> {bot.creado} &nbsp; <span className="font-bold">Publicado:</span> {bot.publicado}
                </div>
                {bot.demo && (
                  <span className="inline-block px-3 py-1 text-xs border border-blue-400 text-blue-500 rounded-lg mr-2">{bot.demo}</span>
                )}
              </div><div className="flex flex-col items-end gap-2 min-w-[120px]">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-normal text-black">{bot.activado ? 'Activado' : 'Desactivado'}</span>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={bot.activado} onChange={() => handleToggleActivado(idx)} className="sr-only" />
                    <span className={`w-10 h-6 flex items-center rounded-full p-1 ${bot.activado ? 'bg-red-400' : 'bg-blue-300'}`}>
                      <span className={`bg-white w-4 h-4 rounded-full shadow-md transform ${bot.activado ? 'translate-x-4' : ''}`}></span>
                    </span>
                  </label>
                  <button
                    className="ml-2 text-gray-400 hover:text-orange-500 text-2xl focus:outline-none"
                    style={{ marginTop: '-8px' }}
                    onClick={() => setMenuOpenIdx(idx)}
                  >
                    <span style={{fontWeight:'bold',fontSize:'22px'}}>⋮</span>
                  </button>
                </div>                {menuOpenIdx === idx && (
                  <div ref={menuRef} className="absolute right-6 top-12 z-50 bg-white rounded-lg shadow-lg border border-gray-100 py-2 w-56 animate-fade-in">
                    <ul className="text-gray-700">
                      {bot.activado ? (
                        <>
                          <li 
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleDuplicateBot(idx)}
                          >
                            <i className="fas fa-copy text-gray-500" />
                            Duplicar proyecto
                          </li>
                          <li className="flex items-center gap-2 px-4 py-2 text-gray-400 cursor-not-allowed">
                            <i className="fas fa-trash text-gray-300" />
                            Eliminar proyecto
                          </li>
                          <li 
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => { setBotToExport(bot); setShowExportModal(true); setMenuOpenIdx(null); }}
                          >
                            <i className="fas fa-download text-gray-500" />
                            Exportar proyecto
                          </li>
                          <li 
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => { setShowPruebaModal(true); setMenuOpenIdx(null); }}
                          >
                            <i className="fas fa-robot text-gray-500" />
                            Prueba tu bot
                          </li>
                        </>
                      ) : (
                        <>
                          <li 
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleDuplicateBot(idx)}
                          >
                            <i className="fas fa-copy text-gray-500" />
                            Duplicar proyecto
                          </li>                      
                          <li 
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                            onClick={() => handleDeleteBot(idx)}
                          >
                            <i className="fas fa-trash text-red-400" />
                            Eliminar proyecto
                          </li>                      
                          <li 
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleGestionarCampañas(idx)}
                          >
                            <i className="fas fa-bullhorn text-gray-500" />
                            Gestionar campañas
                          </li>
                          <li 
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => { setBotToExport(bot); setShowExportModal(true); setMenuOpenIdx(null); }}
                          >
                            <i className="fas fa-download text-gray-500" />
                            Exportar proyecto
                          </li>
                          <li 
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => { setShowPruebaModal(true); setMenuOpenIdx(null); }}
                          >
                            <i className="fas fa-robot text-gray-500" />
                            Prueba tu bot
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                )}</div>
              </div>
            </div>
          ))}
        </div>      
        <div className="mt-16 flex items-center gap-6">
          <div className="w-5 h-5"></div>
          <div
            className="border-2 border-dashed border-blue-200 bg-white rounded-xl flex items-center gap-4 px-6 py-6 cursor-pointer hover:bg-blue-50 transition shadow-sm flex-1"
            style={{ minHeight: 80 }}
            onClick={() => setShowModal(true)}
          >            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-blue-200 bg-blue-50">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#60a5fa" strokeWidth="2"/>
                  <path d="M12 8v8M8 12h8" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-lg font-semibold text-blue-500">Crea un nuevo Bot</span>
            </div>
          </div>
        </div>      </div>      {showModal && <ModalCrearBot onClose={() => setShowModal(false)} onCrear={handleCrearBot} />}
      {showImportModal && <TooltipImportBot onClose={() => setShowImportModal(false)} onImportar={handleImportarBot} buttonRef={importButtonRef} />}
      {showExportModal && botToExport && (
        <ExportProyecModalCard 
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          proyecto={botToExport}
        />
      )}
      {showPruebaModal && (
        <PruebaBotModalCard 
          isOpen={showPruebaModal}
          onClose={() => setShowPruebaModal(false)}
        />
      )}
      {showGestCampModal && (
        <GestCampModalCard 
          isOpen={showGestCampModal}
          onClose={() => setShowGestCampModal(false)}
          botNombre={selectedBotForCampaign !== null ? botsList[selectedBotForCampaign]?.nombre : undefined}
        />
      )}{showDeleteModal && botToDelete !== null && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Eliminar Bot</h3>
                <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                ¿Estás seguro de que deseas eliminar el bot <strong>"{botsList[botToDelete]?.nombre}"</strong>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Se eliminará permanentemente y no podrás recuperarlo.
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDeleteBot}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteBot}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VistaBotIVRGeneral;
