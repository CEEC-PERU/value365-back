"use client"

import type React from "react"
import { Trash2, Copy, Settings } from "lucide-react"

interface NodeActionProps {
  id: string
  name: string
  icon?: string
  x: number
  y: number
  isSelected?: boolean
  onDelete?: (id: string) => void
  onDuplicate?: (id: string) => void
  onSelect?: (id: string) => void
  onConfigure?: (id: string) => void
}

export const NodeAction: React.FC<NodeActionProps> = ({
  id,
  name,
  icon = "📝",
  x,
  y,
  isSelected = false,
  onDelete,
  onDuplicate,
  onSelect,
  onConfigure,
}) => {
  return (
    <div
      className={`absolute flex flex-col items-center cursor-move transition-all duration-200 group`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={() => onSelect?.(id)}
    >
      {/* Nodo principal */}
      <div
        className={`relative flex flex-col items-center gap-2 px-6 py-4 rounded-lg shadow-lg transition-all duration-200 ${
          isSelected
            ? "bg-blue-500 text-white shadow-xl ring-2 ring-blue-300"
            : "bg-gray-700 text-white hover:bg-gray-600 shadow-md"
        }`}
      >
        {/* Icono */}
        <span className="text-3xl">{icon}</span>

        {/* Nombre de la acción */}
        <span className="text-sm font-semibold text-center whitespace-nowrap">{name}</span>

        {/* Botones de acción - Aparecen al hover */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-lg shadow-lg p-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onConfigure?.(id)
            }}
            className="p-1.5 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
            title="Configurar"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate?.(id)
            }}
            className="p-1.5 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded transition-colors"
            title="Duplicar"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.(id)
            }}
            className="p-1.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Punto de conexión inferior */}
      <div className="w-3 h-3 rounded-full bg-blue-400 border-2 border-white shadow-md mt-2" />
    </div>
  )
}

export default NodeAction
