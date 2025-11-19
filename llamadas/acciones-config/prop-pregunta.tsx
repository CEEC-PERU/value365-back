"use client"

import React, { useState } from "react"
import ActionPanelHeader from "../secciones/header-accions"

// Ícono de pregunta (puedes reemplazar por el que uses en tu flujo)
const preguntaIcon = (
  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 border border-blue-200">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
      <text x="20" y="26" textAnchor="middle" fontSize="20" fill="#B1B5C9">?</text>
    </svg>
  </span>
)

interface PropPreguntaProps {
  nombre: string
  mensaje?: string
  tipoPregunta?: string
  infoOculta?: boolean
  onGuardar: (data: { nombre: string; mensaje: string; tipoPregunta: string; infoOculta: boolean }) => void
}

const tiposPregunta = [
  { value: "seleccion", label: "Seleccionar" },
  { value: "otro", label: "Otro" },
]

const PropPregunta: React.FC<PropPreguntaProps> = ({
  nombre,
  mensaje = "",
  tipoPregunta = "",
  infoOculta = false,
  onGuardar,
}) => {
  const [nombreAccion, setNombreAccion] = useState(nombre)
  const [mensajeAccion, setMensajeAccion] = useState(mensaje)
  const [tipo, setTipo] = useState(tipoPregunta)
  const [oculta, setOculta] = useState(infoOculta)
  const [otroValor, setOtroValor] = useState("")

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto rounded-xl">
      <ActionPanelHeader title="Propiedades de la acción" />
      <div className="p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la acción:</label>
        <div className="flex items-center gap-2 mb-4">
          {preguntaIcon}
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje*</label>
        <textarea
          className="border rounded-lg px-3 py-2 w-full border-gray-300"
          placeholder="Escriba su mensaje aquí"
          value={mensajeAccion}
          onChange={e => setMensajeAccion(e.target.value)}
          maxLength={1500}
        />
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-400">{mensajeAccion.length} / 1500</span>
        </div>
        <hr className="my-4" />
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de pregunta:</label>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
          value={tipo}
          onChange={e => setTipo(e.target.value)}
        >
          {tiposPregunta.map(tp => (
            <option key={tp.value} value={tp.value}>{tp.label}</option>
          ))}
        </select>
        {tipo === "otro" && (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2 mt-6">Tipo de formato:</label>
            <div className="flex items-center mb-4">
              <input
                type="radio"
                name="tipoFormato"
                checked={true}
                readOnly
                className="form-radio h-5 w-5 text-orange-500 border-orange-400 focus:ring-2 focus:ring-orange-500"
                style={{ accentColor: '#F97316' }}
              />
              <span className="ml-2 text-gray-500">Números</span>
            </div>
            <hr className="my-4 border-gray-200" />
          </>
        )}
        <label className="block text-sm font-medium text-gray-700 mb-2">Información oculta <span title="Por seguridad, la información proporcionada en este nodo no será visible en la conversación" className="ml-1 text-gray-400 cursor-help">?</span></label>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={oculta}
            onChange={e => setOculta(e.target.checked)}
            className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
          />
          <span className="ml-2 text-sm text-gray-500">Por seguridad, la información proporcionada en este nodo no será visible en la conversación</span>
        </div>
        <button
          className={`px-6 py-2 rounded-lg w-full transition-colors duration-200 font-semibold border border-transparent shadow-sm ${nombreAccion.trim().length > 0 && mensajeAccion.trim().length > 0 ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
          onClick={() => onGuardar({ nombre: nombreAccion, mensaje: mensajeAccion, tipoPregunta: tipo, infoOculta: oculta })}
          disabled={nombreAccion.trim().length === 0 || mensajeAccion.trim().length === 0}
        >
          Guardar
        </button>
      </div>
    </div>
  )
}

export default PropPregunta
