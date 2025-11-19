"use client"

import type React from "react"
import { useState } from "react"
import { Star, ChevronDown, ChevronUp } from "lucide-react"

interface Action {
  id: string
  name: string
  icon: React.ReactNode
  category: string
  description?: string
}

interface AccionesPanelProps {
  handleDragStart: (e: React.DragEvent, action: Action) => void
  selectedAction?: Action | null
  onSelectAction?: (action: Action) => void
}

export const sectionIcons: Record<string, React.ReactNode> = {
  Generales: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="7" width="18" height="10" rx="2" stroke="#4B5563" strokeWidth="2" />
      <rect x="7" y="3" width="10" height="18" rx="2" stroke="#4B5563" strokeWidth="2" />
    </svg>
  ),
  Interactivas: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="2" stroke="#4B5563" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" stroke="#4B5563" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" stroke="#4B5563" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" stroke="#4B5563" strokeWidth="2" />
    </svg>
  ),
  Derivaciones: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M8 12h8" stroke="#4B5563" strokeWidth="2" />
      <path d="M16 12l-4 4m4-4l-4-4" stroke="#4B5563" strokeWidth="2" />
    </svg>
  ),
  Servicios: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v20" stroke="#4B5563" strokeWidth="2" />
      <path d="M2 12h20" stroke="#4B5563" strokeWidth="2" />
    </svg>
  ),
}

export const actions: Record<string, Action[]> = {
  Generales: [
    {
      id: "gen-1",
      name: "Texto",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
          <rect x="13" y="17" width="14" height="6" rx="3" stroke="#B1B5C9" strokeWidth="2" />
          <rect x="17" y="13" width="6" height="14" rx="3" stroke="#B1B5C9" strokeWidth="2" />
        </svg>
      ),
      category: "Generales",
      description: "Texto",
    },
    {
      id: "gen-2",
      name: "Despedida",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
          <path d="M20 12v16" stroke="#B1B5C9" strokeWidth="2" />
          <path d="M12 20h16" stroke="#B1B5C9" strokeWidth="2" />
          <path d="M25 15l5 5-5 5" stroke="#B1B5C9" strokeWidth="2" />
        </svg>
      ),
      category: "Generales",
      description: "Despedida",
    },
  ],
  Interactivas: [
    {
      id: "int-1",
      name: "Menú De Opciones",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
          <g>
            <rect x="13" y="16" width="14" height="2" rx="1" fill="#B1B5C9" />
            <rect x="13" y="22" width="14" height="2" rx="1" fill="#B1B5C9" />
          </g>
        </svg>
      ),
      category: "Interactivas",
      description: "Menú De Opciones",
    },
    {
      id: "int-2",
      name: "Pregunta",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
          <text x="20" y="26" textAnchor="middle" fontSize="20" fill="#B1B5C9">?</text>
        </svg>
      ),
      category: "Interactivas",
      description: "Pregunta",
    },
    {
      id: "int-3",
      name: "Enviar Adjunto",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
          <path d="M25 15l-7 7a3 3 0 0 0 4 4l7-7a3 3 0 0 0-4-4z" stroke="#B1B5C9" strokeWidth="2" fill="none" />
          <rect x="15" y="25" width="10" height="2" rx="1" fill="#B1B5C9" />
        </svg>
      ),
      category: "Interactivas",
      description: "Enviar Adjunto",
    },
  ],
  Derivaciones: [
    {
      id: "der-1",
      name: "Derivar A Agente",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
          <g>
            <rect x="14" y="16" width="6" height="12" rx="2" stroke="#B1B5C9" strokeWidth="2" />
            <rect x="22" y="12" width="6" height="12" rx="2" stroke="#B1B5C9" strokeWidth="2" />
            <path d="M20 20h6" stroke="#B1B5C9" strokeWidth="2" />
          </g>
        </svg>
      ),
      category: "Derivaciones",
      description: "Derivar A Agente",
    },
    {
      id: "der-2",
      name: "Derivar A Whatsapp",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
          <g>
            <path d="M14 20c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" stroke="#B1B5C9" strokeWidth="2" />
            <path d="M20 26l-2-2" stroke="#B1B5C9" strokeWidth="2" />
            <circle cx="24" cy="20" r="2" stroke="#B1B5C9" strokeWidth="2" />
          </g>
        </svg>
      ),
      category: "derivar-wsp",
      description: "Derivar A Whatsapp",
    },
  ],
  Servicios: [
    {
      id: "ser-1",
      name: "Servicio Configurable",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
          <path d="M20 10a10 10 0 1 1-7.07 2.93" stroke="#B1B5C9" strokeWidth="2" />
          <circle cx="20" cy="20" r="4" stroke="#B1B5C9" strokeWidth="2" />
          <path d="M24 16l4-4" stroke="#B1B5C9" strokeWidth="2" />
        </svg>
      ),
      category: "servicio-config",
      description: "Servicio Configurable",
    },
    {
      id: "ser-2",
      name: "Evaluar Condición",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
          <circle cx="20" cy="14" r="3" stroke="#B1B5C9" strokeWidth="2" />
          <circle cx="14" cy="26" r="3" stroke="#B1B5C9" strokeWidth="2" />
          <circle cx="26" cy="26" r="3" stroke="#B1B5C9" strokeWidth="2" />
          <path d="M20 17v6M20 23l-6 3M20 23l6 3" stroke="#B1B5C9" strokeWidth="2" />
        </svg>
      ),
      category: "Servicios",
      description: "Evaluar Condición",
    },
  ],
}

const AccionesPanel: React.FC<Omit<AccionesPanelProps, 'expandedSections' | 'toggleSection'>> = ({
  handleDragStart,
  selectedAction,
  onSelectAction,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Generales: false,
    Interactivas: false,
    Derivaciones: false,
    Servicios: false,
  });

  const handleSectionToggle = (section: string) => {
    setExpandedSections((prev: Record<string, boolean>) => {
      const updated: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        updated[key] = key === section ? !prev[section] : false;
      });
      return updated;
    });
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 h-screen overflow-hidden flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-blue-50 flex-shrink-0 rounded-t-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <Star size={20} className="text-blue-500" />
          Acciones
        </h2>
      </div>
      <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
        <p className="text-sm text-gray-500">Arrastra las acciones al canvas para construir tu flujo</p>
      </div>

      {/* Sections - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(actions).map(([section, items]) => (
          <div key={section} className="border-b border-gray-100">
            <button
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 text-gray-800 font-medium transition-colors"
              onClick={() => handleSectionToggle(section)}
            >
              <span className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center">{sectionIcons[section]}</span>
                <span className="text-base">{section}</span>
              </span>
              <span className="text-gray-400">
                {expandedSections[section] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>

            {expandedSections[section] && (
              <div className="bg-gray-50 px-6 py-3">
                <div className="flex flex-col gap-3">
                  {items.map((action) => (
                    <div
                      key={action.id}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl bg-white border transition-all cursor-grab active:cursor-grabbing hover:shadow-md ${
                        selectedAction?.id === action.id
                          ? "border-blue-400 shadow-sm ring-2 ring-blue-100"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      draggable
                      onDragStart={(e) => {
                        handleDragStart(e, action)
                        onSelectAction?.(action)
                      }}
                      onClick={() => {
                        onSelectAction?.(action)
                        // Si es Evaluar Condición, fuerza la categoría para mostrar el panel correcto
                        if (action.name === "Evaluar Condición" && action.category !== "eval-condicion") {
                          action.category = "eval-condicion";
                        }
                      }}
                      style={{ alignItems: "center", minHeight: 64 }}
                    >
                      <span className="flex items-center justify-center rounded-full border border-gray-300 bg-gray-50" style={{ width: 48, height: 48 }}>
                        {action.icon}
                      </span>
                      <span className="text-gray-900 font-semibold text-base">{action.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box - Fixed at bottom */}
      <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex gap-3 items-start">
          <div className="flex-shrink-0 w-5 h-5 mt-0.5">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="2" />
              <path d="M12 16v-4" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="8" r="1" fill="#3b82f6" />
            </svg>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed">
            Configura tu Bot IVR a través de las acciones. Puedes usar{" "}
            <strong className="text-gray-800">audios pregrabados</strong> o escribir textos que se reproduzcan con{" "}
            <strong className="text-gray-800">lectura a voz</strong>.
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccionesPanel
