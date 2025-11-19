"use client"

import React, { useState, useRef } from "react"
import ActionPanelHeader from "../secciones/header-accions"
import SwitchStich from "../../../ui/switch-stich-acciones"

interface PropMenuOpcionesProps {
  nombre: string
  opciones?: string[]
  activarLista: boolean
  onGuardar: (data: { nombre: string; activarLista: boolean; opciones: string[] }) => void
}

const menuOpcionesIcon = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
    <g>
      <rect x="13" y="16" width="14" height="2" rx="1" fill="#B1B5C9" />
      <rect x="13" y="22" width="14" height="2" rx="1" fill="#B1B5C9" />
    </g>
  </svg>
)

const PropMenuOpciones: React.FC<PropMenuOpcionesProps> = ({
  nombre,
  opciones = [],
  activarLista,
  onGuardar,
}) => {
  const [nombreAccion, setNombreAccion] = useState(nombre)
  const [listaActiva, setListaActiva] = useState(activarLista)
  const [opcionesLocal, setOpcionesLocal] = useState<string[]>(opciones)
  const [mostrarConfig, setMostrarConfig] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [mensajeError, setMensajeError] = useState(false)
  const [formato, setFormato] = useState("Números")
  const [formatoMenuAbierto, setFormatoMenuAbierto] = useState(false)
  const [enviarOpciones, setEnviarOpciones] = useState(true)
  const formatoRef = useRef<HTMLDivElement>(null)
  const opcionesFormato = [
    { value: "Números", label: "Números" },
    { value: "Letras", label: "Letras" },
    { value: "Sin enumerar", label: "Sin enumerar" },
  ]

  // Handler para agregar nueva opción
  const agregarOpcion = () => {
    // Si no hay opciones, agrega la primera con el texto por defecto
    let nuevasOpciones;
    if (opcionesLocal.length === 0) {
      nuevasOpciones = ["Escriba una opción acá."];
    } else {
      nuevasOpciones = [...opcionesLocal, "Escriba una opción acá."];
    }
    setOpcionesLocal(nuevasOpciones);
    // Notificar al canvas principal que se agregó una opción (solo la última agregada)
    if (window && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("opcion-agregada", {
        detail: {
          nodo: nombreAccion,
          nombreOpcion: nuevasOpciones[nuevasOpciones.length - 1],
          cantidad: nuevasOpciones.length
        }
      }))
    }
  }

  // Handler para cambiar una opción
  const cambiarOpcion = (idx: number, valor: string) => {
    const nuevas = [...opcionesLocal]
    nuevas[idx] = valor
    setOpcionesLocal(nuevas)
  }

  // Handler para eliminar una opción
  const eliminarOpcion = (idx: number) => {
    setOpcionesLocal(opcionesLocal.filter((_, i) => i !== idx))
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto rounded-xl">
      <ActionPanelHeader title="Propiedades de la acción" />
      <div className="p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la acción: *</label>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 border border-blue-200">
            {menuOpcionesIcon}
          </span>
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
        <div className="mb-6 flex items-center gap-3">
          <label className="block text-sm font-medium text-gray-700 mb-0">Activar lista de opciones interactiva</label>
          <SwitchStich
            checked={listaActiva}
            onChange={setListaActiva}
          />
        </div>
        {/* Botón para mostrar configuración de opciones SOLO si no está abierto el panel */}
        {!mostrarConfig && (
          <div className="mb-6">
            <button
              className="w-full px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg bg-white text-blue-600 flex items-center gap-2 justify-center font-medium"
              style={{ cursor: "pointer" }}
              onClick={() => setMostrarConfig(true)}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <rect x="4" y="6" width="16" height="2" rx="1" fill="#3b82f6" />
                <rect x="4" y="12" width="16" height="2" rx="1" fill="#3b82f6" />
              </svg>
              Configurar opciones
            </button>
          </div>
        )}
        {/* Panel de configuración de opciones */}
        {mostrarConfig && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje *</label>
            <textarea
              className={`border rounded-lg px-3 py-2 w-full ${mensajeError ? "border-red-500" : "border-gray-300"}`}
              placeholder="Escriba acá un texto..."
              value={mensaje}
              onChange={e => {
                setMensaje(e.target.value)
                setMensajeError(e.target.value.trim() === "")
              }}
              maxLength={1500}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className={mensajeError ? "text-red-500" : "text-gray-400"}>{mensajeError ? "Este campo es obligatorio" : null}</span>
              <span className="text-gray-400">{mensaje.length} / 1500</span>
            </div>
            <div className="flex items-center mt-4 mb-2">
              <span className="text-sm text-gray-700">Enviar opciones en la conversación</span>
              <SwitchStich checked={enviarOpciones} onChange={setEnviarOpciones} className="ml-2" />
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Formato de la numeración</label>
            <div className="relative mb-4" ref={formatoRef}>
              <button
                type="button"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full text-left bg-white flex items-center justify-between"
                onClick={() => setFormatoMenuAbierto((v) => !v)}
              >
                {formato}
                <span className="ml-2 text-gray-400">▾</span>
              </button>
              {formatoMenuAbierto && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg z-10">
                  {opcionesFormato.map((op) => (
                    <button
                      key={op.value}
                      type="button"
                      className={`flex items-center w-full px-4 py-3 text-sm gap-3 ${formato === op.value ? "bg-white text-orange-600 font-semibold" : "bg-gray-50 text-gray-700"}`}
                      onClick={() => { setFormato(op.value); setFormatoMenuAbierto(false) }}
                    >
                      <span className={`inline-block w-5 h-5 rounded-full border-2 flex items-center justify-center ${formato === op.value ? "border-blue-400" : "border-gray-300"}`}>
                        {formato === op.value && <span className="w-3 h-3 rounded-full bg-blue-400" />}
                      </span>
                      {op.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opciones *</label>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-3 mb-2">
              {opcionesLocal.map((op, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500 font-medium mr-2">{idx + 1}.</span>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                    value={op}
                    onChange={e => cambiarOpcion(idx, e.target.value)}
                  />
                  {/* Icono de menú de opciones (3 puntos verticales) */}
                  <span className="flex items-center justify-center h-8 px-2 cursor-pointer text-gray-400">
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <circle cx="8" cy="3" r="1.2" fill="#B1B5C9" />
                      <circle cx="8" cy="8" r="1.2" fill="#B1B5C9" />
                      <circle cx="8" cy="13" r="1.2" fill="#B1B5C9" />
                    </svg>
                  </span>
                </div>
              ))}
              <button
                className="w-full px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg bg-white text-blue-600 flex items-center gap-2 justify-center font-medium"
                onClick={agregarOpcion}
              >
                + Agregar nueva opción
              </button>
            </div>
          </div>
        )}
        <button
          className={`px-6 py-2 rounded-lg w-full transition-colors duration-200 font-semibold border border-transparent shadow-sm ${nombreAccion.trim().length > 0 && mensaje.trim().length > 0 ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
          onClick={() => onGuardar({ nombre: nombreAccion, activarLista: listaActiva, opciones: opcionesLocal })}
          disabled={nombreAccion.trim().length === 0 || mensaje.trim().length === 0}
        >
          Guardar
        </button>
      </div>
    </div>
  )
}

export default PropMenuOpciones
