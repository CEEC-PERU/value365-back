import React, { useState } from "react"
import { MessageSquare } from "lucide-react"

interface ActionPanelHeaderProps {
  icon?: React.ReactNode
  title?: string
  className?: string
}

const ActionPanelHeader: React.FC<ActionPanelHeaderProps> = ({ icon, title = "Propiedades de la acción", className }) => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className={`bg-blue-50 px-6 py-4 rounded-t-xl border-b border-gray-200 flex items-center gap-2 justify-between relative ${className || ""}`}>
      <span className="text-blue-500 text-xl">
        {/* Usa el icono de texto como en el panel de texto */}
        <MessageSquare size={22} className="text-blue-400" />
      </span>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {/* Tres puntos con menú desplegable */}
      <div className="relative">
        <button
          className="text-gray-400 hover:text-gray-600 p-2 rounded-full"
          onClick={() => setShowMenu((prev) => !prev)}
          aria-label="Más opciones"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
            <button className="flex items-center gap-2 px-4 py-3 w-full text-gray-700 hover:bg-gray-50 text-sm">
              <svg width="20" height="20" fill="none" stroke="#6366F1" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 4v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4" stroke="#6366F1" strokeWidth="2"/><path d="M9 8h6" stroke="#6366F1" strokeWidth="2"/><path d="M9 12h6" stroke="#6366F1" strokeWidth="2"/></svg>
              Etiqueta
            </button>
            <button className="flex items-center gap-2 px-4 py-3 w-full text-gray-700 hover:bg-gray-50 text-sm">
              <svg width="20" height="20" fill="none" stroke="#6366F1" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" stroke="#6366F1" strokeWidth="2"/><circle cx="12" cy="12" r="10" stroke="#6366F1" strokeWidth="2"/></svg>
              Historial de bloqueos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActionPanelHeader
