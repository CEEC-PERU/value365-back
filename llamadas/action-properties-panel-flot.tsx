"use client"

import type React from "react"
import { X, ChevronDown } from "lucide-react"
import { useState } from "react"

interface ActionPropertiesPanelProps {
  action?: {
    id: string
    name: string
    category: string
    description?: string
  } | null
  onClose?: () => void
}

export const ActionPropertiesPanel: React.FC<ActionPropertiesPanelProps> = ({ action, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    advanced: false,
  })

  if (!action) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 h-screen overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Propiedades</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-center px-6">Selecciona un nodo para ver sus propiedades</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white flex-shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{action.name}</h2>
          <p className="text-xs text-gray-500 mt-1">{action.category}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* General Section */}
        <div className="border-b border-gray-100">
          <button
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 text-gray-800 font-medium transition-colors"
            onClick={() =>
              setExpandedSections((prev) => ({
                ...prev,
                general: !prev.general,
              }))
            }
          >
            <span>Configuración General</span>
            <ChevronDown size={18} className={`transition-transform ${expandedSections.general ? "rotate-180" : ""}`} />
          </button>

          {expandedSections.general && (
            <div className="bg-gray-50 px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  defaultValue={action.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  defaultValue={action.description || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        {/* Advanced Section */}
        <div className="border-b border-gray-100">
          <button
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 text-gray-800 font-medium transition-colors"
            onClick={() =>
              setExpandedSections((prev) => ({
                ...prev,
                advanced: !prev.advanced,
              }))
            }
          >
            <span>Configuración Avanzada</span>
            <ChevronDown
              size={18}
              className={`transition-transform ${expandedSections.advanced ? "rotate-180" : ""}`}
            />
          </button>

          {expandedSections.advanced && (
            <div className="bg-gray-50 px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo de espera (segundos)</label>
                <input
                  type="number"
                  defaultValue="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm font-medium text-gray-700">Reintentable</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0 flex gap-3">
        <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm">
          Cancelar
        </button>
        <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm">
          Guardar
        </button>
      </div>
    </div>
  )
}

export default ActionPropertiesPanel
