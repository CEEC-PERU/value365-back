import React from "react"
import ActionPanelHeader from "./header-accions"
import { MessageSquare } from "lucide-react"

const NoNodeSelectedPanel: React.FC = () => (
  <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto rounded-xl">
    <div className="bg-blue-50 px-6 py-4 rounded-t-xl border-b border-gray-200 flex items-center gap-2">
      <MessageSquare size={22} className="text-blue-400" />
      <h2 className="text-lg font-semibold text-gray-800">Propiedades de la acción</h2>
    </div>
    <div className="flex flex-col items-center py-10">
      <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
        <ellipse cx="45" cy="45" rx="44" ry="32" fill="#F6F8FF" />
        <rect x="30" y="30" width="30" height="30" rx="8" fill="#fff" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="40" y="40" width="10" height="10" rx="3" fill="#fff" stroke="#CBD5E1" strokeWidth="2" />
        <path d="M45 50h8M49 46v8" stroke="#CBD5E1" strokeWidth="2" />
        <circle cx="60" cy="65" r="6" fill="#fff" stroke="#CBD5E1" strokeWidth="2" />
        <path d="M57 65l2 2 4-4" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="text-center mt-4">
        <div className="font-bold text-gray-700 text-lg">No tienes nodos seleccionados</div>
        <div className="text-gray-500 text-sm mt-2">
          Para ver las propiedades de un mensaje, debes hacer click en una caja de flujo.
        </div>
      </div>
    </div>
  </div>
)

export default NoNodeSelectedPanel
