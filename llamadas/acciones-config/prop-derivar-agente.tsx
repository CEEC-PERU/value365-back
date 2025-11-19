"use client"

import React, { useState, useEffect } from "react"
import { ivrService } from "@/lib/services/endpoints/ivr/api"
import { getEmpresasCampaigns, getCampaignsByEmpresa } from "@/lib/services/endpoints/campaign/api"
import { getStoredAuth } from "@/lib/auth"
import ActionPanelHeader from "../secciones/header-accions"

const agenteIcon = (
  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-50 border border-indigo-200">
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
      <g>
        <rect x="14" y="16" width="6" height="12" rx="2" stroke="#B1B5C9" strokeWidth="2" />
        <rect x="22" y="12" width="6" height="12" rx="2" stroke="#B1B5C9" strokeWidth="2" />
        <path d="M20 20h6" stroke="#B1B5C9" strokeWidth="2" />
      </g>
    </svg>
  </span>
)

const PropDerivarAgente: React.FC = () => {
  const [nombreAccion, setNombreAccion] = useState("Derivar a agente")
  const [mensaje, setMensaje] = useState("")
  const [empresa, setEmpresa] = useState("")
  const [empresas, setEmpresas] = useState<any[]>([])
  const [campania, setCampania] = useState("")
  const [campanias, setCampanias] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [showEmpresaMenu, setShowEmpresaMenu] = useState(false)
  const [showCampaniaMenu, setShowCampaniaMenu] = useState(false)
  const auth = getStoredAuth();
  const token = auth?.accessToken;
    // Cargar empresas al montar
    useEffect(() => {
      if (token) {
        console.log("Solicitando empresas con token:", token);
        getEmpresasCampaigns(token)
          .then(res => {
            console.log("Empresas recibidas:", res);
            // Si la respuesta tiene .data, usar ese campo
            setEmpresas(res.data || []);
          })
          .catch(err => {
            console.error("Error al cargar empresas:", err);
          });
      }
    }, [token]);

    // Cargar campañas al seleccionar empresa
    useEffect(() => {
      if (token && empresa) {
        console.log("Solicitando campañas para empresa:", empresa);
        getCampaignsByEmpresa(token, empresa)
          .then(res => {
            console.log("Campañas recibidas:", res);
            // Si la respuesta tiene .data, usar ese campo
            setCampanias(res.data || []);
          })
          .catch(err => {
            console.error("Error al cargar campañas:", err);
          });
      } else {
        setCampanias([]);
      }
    }, [token, empresa]);
  const [guardado, setGuardado] = useState(true)

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto rounded-xl">
      <ActionPanelHeader title="Propiedades de la acción" />
      <div className="p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la acción:</label>
        <div className="flex items-center gap-2 mb-4">
          {agenteIcon}
          <input
            type="text"
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            value={nombreAccion}
            onChange={e => {
              setNombreAccion(e.target.value);
              setGuardado(false);
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Personaliza la etiqueta de tu mensaje para una mejor visualización de las acciones en tu flujo y en tus reportes.
        </p>
        <hr className="my-4" />
        <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje (obligatorio)</label>
        <textarea
          className="border rounded-lg px-3 py-2 w-full border-gray-300"
          placeholder="Escriba su mensaje aquí"
          value={mensaje}
          onChange={e => {
            setMensaje(e.target.value);
            setGuardado(false);
          }}
          maxLength={1500}
        />
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-400">{mensaje.length} / 1500</span>
        </div>
        <hr className="my-4" />
        <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar empresa:</label>
        <div className="relative mb-4">
          <div
            className="border border-gray-300 rounded-lg px-3 py-2 w-full flex items-center justify-between cursor-pointer bg-white"
            onClick={() => setShowEmpresaMenu(v => !v)}
          >
            <span className="text-gray-400">{empresa ? empresas.find(e => e.empresa_id === empresa)?.empresa_nombre : "Elige una empresa"}</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4" stroke="#B1B5C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          {showEmpresaMenu && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <input
                type="text"
                className="w-full px-3 py-2 border-b border-gray-200 outline-none text-gray-700"
                placeholder="Buscar empresa"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
              <div className="flex flex-col">
                {empresas
                  .filter(e => e.empresa_nombre.toLowerCase().includes(busqueda.toLowerCase()))
                  .map(e => (
                    <button
                      key={e.empresa_id}
                      className={`flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 ${empresa === e.empresa_id ? "bg-gray-50" : ""}`}
                      onClick={() => {
                        setEmpresa(e.empresa_id);
                        setCampania(""); // Limpiar campaña al cambiar empresa
                        setGuardado(false);
                        setShowEmpresaMenu(false);
                        setBusqueda("");
                      }}
                    >
                      <span className="flex items-center justify-center w-6 h-6">
                        <span className={`inline-block w-4 h-4 rounded-full border-2 ${empresa === e.empresa_id ? "border-blue-500" : "border-gray-300"} bg-white flex items-center justify-center`}>
                          {empresa === e.empresa_id && <span className="block w-2 h-2 rounded-full bg-blue-500" />}
                        </span>
                      </span>
                      <span className="text-gray-700">{e.empresa_nombre}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar campaña:</label>
        <div className="relative mb-4">
          <div
            className="border border-gray-300 rounded-lg px-3 py-2 w-full flex items-center justify-between cursor-pointer bg-white"
            onClick={() => setShowCampaniaMenu(v => !v)}
          >
            <span className="text-gray-400">{campania ? (campanias.find(c => c.id === campania)?.nombre || "Elige una campaña") : "Elige una campaña"}</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4" stroke="#B1B5C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          {showCampaniaMenu && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <input
                type="text"
                className="w-full px-3 py-2 border-b border-gray-200 outline-none text-gray-700"
                placeholder="Buscar campaña"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
              <div className="flex flex-col">
                {Array.isArray(campanias) && campanias.length > 0 ? (
                  campanias
                    .filter(c => typeof c.nombre === "string" && c.nombre.toLowerCase().includes(busqueda.toLowerCase()))
                    .map(c => (
                      <button
                        key={c.id}
                        className={`flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 ${campania === c.id ? "bg-gray-50" : ""}`}
                        onClick={() => {
                          setCampania(c.id);
                          setGuardado(false);
                          setShowCampaniaMenu(false);
                          setBusqueda("");
                        }}
                      >
                        <span className="flex items-center justify-center w-6 h-6">
                          <span className={`inline-block w-4 h-4 rounded-full border-2 ${campania === c.id ? "border-blue-500" : "border-gray-300"} bg-white flex items-center justify-center`}>
                            {campania === c.id && <span className="block w-2 h-2 rounded-full bg-blue-500" />}
                          </span>
                        </span>
                        <span className="text-gray-700">{c.nombre}</span>
                      </button>
                    ))
                ) : (
                  <span className="text-gray-400 px-3 py-2">No hay campañas disponibles</span>
                )}
              </div>
            </div>
          )}
        </div>
        <button
          className={`px-6 py-2 rounded-lg w-full transition-colors duration-200 font-semibold border border-transparent shadow-sm ${guardado ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'}`}
          disabled={guardado}
          onClick={async () => {
            // Aquí deberías tener el flowId del flujo actual
            const flowId = "ID_DEL_FLUJO"; // Reemplaza por el id real
            const nodo = {
              flowId,
              tipo: "derivar-agente",
              datos: {
                nombreAccion,
                mensaje,
                empresa: parseInt(empresa, 10), // Convertir empresa a número
                campania: parseInt(campania, 10) // Convertir campania a número
              }
            };
            try {
              await ivrService.createNode(nodo, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setGuardado(true);
              alert("Acción guardada correctamente en el backend IVR");
            } catch (err) {
              alert("Error al guardar la acción en el backend");
              console.error(err);
            }
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  )
}

export default PropDerivarAgente
