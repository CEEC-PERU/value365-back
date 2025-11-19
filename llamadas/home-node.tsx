"use client"

import type React from "react"
import { Home } from "lucide-react"

interface HomeNodeProps {
  x: number
  y: number
  onClick?: () => void
}

export const HomeNode: React.FC<HomeNodeProps> = ({ x, y, onClick }) => {
  return (
    <div
      className="absolute flex flex-col items-center cursor-pointer transition-all duration-200 group"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={onClick}
    >
      {/* Nodo Home */}
      <button
        className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center z-10 border-2 border-white shadow-lg hover:bg-blue-600 transition-colors"
        aria-label="Nodo Home"
      >
        <Home className="text-white" size={24} />
      </button>

      {/* Línea conectora */}
      <div className="w-0.5 h-12 bg-blue-400" />

      {/* Punto de conexión */}
      <div className="w-3 h-3 rounded-full bg-blue-400 border-2 border-white shadow-md" />
    </div>
  )
}

export default HomeNode
