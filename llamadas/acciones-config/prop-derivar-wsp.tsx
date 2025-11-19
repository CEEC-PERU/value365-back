"use client"

import React, { useState, useEffect } from "react"
import ActionPanelHeader from "../secciones/header-accions"
import { getEmpresasCampaigns, getCampaignsByEmpresa } from "@/lib/services/endpoints/campaign/api"
import { getStoredAuth } from "@/lib/auth"

const auth = getStoredAuth()
const token = auth?.accessToken
const whatsappIcon = (
  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-50 border border-indigo-200">
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
      <g>
        <path d="M14 20c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" stroke="#B1B5C9" strokeWidth="2" />
        <path d="M20 26l-2-2" stroke="#B1B5C9" strokeWidth="2" />
        <circle cx="24" cy="20" r="2" stroke="#B1B5C9" strokeWidth="2" />
      </g>
    </svg>
  </span>
)

const PropDerivarWsp: React.FC = () => {
  const [nombreAccion, setNombreAccion] = useState("Derivar a Whatsapp")
  const [campania, setCampania] = useState("")
  const [canal, setCanal] = useState("")
  const [plantilla, setPlantilla] = useState("")
  const [guardado, setGuardado] = useState(true)
  const [empresa, setEmpresa] = useState("")
  const [empresas, setEmpresas] = useState<any[]>([])
  const [campanias, setCampanias] = useState<any[]>([])

  // Cargar empresas al montar
  useEffect(() => {
    if (token) {
      getEmpresasCampaigns(token)
        .then((res) => setEmpresas(res.data || []))
        .catch((err) => console.error("Error al cargar empresas:", err))
    }
  }, [token])

  // Cargar campañas al seleccionar empresa
  useEffect(() => {
    if (token && empresa) {
      getCampaignsByEmpresa(token, parseInt(empresa, 10))
        .then((res) => setCampanias(res.data || []))
        .catch((err) => console.error("Error al cargar campañas:", err))
    } else {
      setCampanias([])
    }
  }, [token, empresa])

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto rounded-xl">
      <ActionPanelHeader title="Propiedades de la acción" />
      <div className="p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la acción:</label>
        <div className="flex items-center gap-2 mb-4">
          {whatsappIcon}
          <input
            type="text"
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            value={nombreAccion}
            onChange={e => setNombreAccion(e.target.value)}
          />
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Personaliza la etiqueta de tu mensaje para una mejor visualización de las acciones en tu flujo y en tus reportes.
        </p>
        <hr className="my-4" />
        <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
        <div className="relative mb-4">
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 w-full bg-white text-gray-700 cursor-pointer"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
          >
            <option value="">Seleccionar</option>
            {empresas.map((e) => (
              <option key={e.empresa_id} value={e.empresa_id}>
                {e.empresa_nombre}
              </option>
            ))}
          </select>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">Campaña</label>
        <div className="relative mb-4">
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 w-full bg-white text-gray-700 cursor-pointer"
            value={campania}
            onChange={(e) => setCampania(e.target.value)}
          >
            <option value="">Seleccionar</option>
            {campanias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Canal</label>
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 w-full mb-4 bg-gray-100 text-gray-400 cursor-not-allowed"
          value={canal}
          disabled
        >
          <option value="">Seleccionar</option>
        </select>
        <label className="block text-sm font-medium text-gray-700 mb-2">Plantilla</label>
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 w-full mb-4 bg-gray-100 text-gray-400 cursor-not-allowed"
          value={plantilla}
          disabled
        >
          <option value="">Seleccionar</option>
        </select>
        <button
          className={`px-6 py-2 rounded-lg w-full font-semibold border border-gray-300 bg-white text-gray-400 mt-2 ${guardado ? "cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600 cursor-pointer"}`}
          disabled={guardado}
          onClick={() => setGuardado(true)}
        >
          Guardar
        </button>
      </div>
    </div>
  )
}

export default PropDerivarWsp
