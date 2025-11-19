"use client"

import React, { useState } from "react"
import ActionPanelHeader from "../secciones/header-accions"

const adjuntoIcon = (
  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 border border-blue-200">
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
      <path d="M25 15l-7 7a3 3 0 0 0 4 4l7-7a3 3 0 0 0-4-4z" stroke="#B1B5C9" strokeWidth="2" fill="none" />
      <rect x="15" y="25" width="10" height="2" rx="1" fill="#B1B5C9" />
    </svg>
  </span>
)

const uploadIcon = (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <path d="M32 44V20" stroke="#F59E42" strokeWidth="3" strokeLinecap="round" />
    <path d="M24 28l8-8 8 8" stroke="#F59E42" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="8" y="44" width="48" height="12" rx="6" stroke="#F59E42" strokeWidth="2" />
  </svg>
)

const PropEnviarArchivo: React.FC = () => {
  const [nombreAccion, setNombreAccion] = useState("Enviar adjunto")
  const [mensaje, setMensaje] = useState("")
  const [nombreArchivo, setNombreArchivo] = useState("")
  const [archivo, setArchivo] = useState<File | null>(null)
  const [url, setUrl] = useState("")
  const [modoUrl, setModoUrl] = useState(false)
  const [tipoAdjunto, setTipoAdjunto] = useState("MP3")
  const [guardado, setGuardado] = useState(true)

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto rounded-xl">
      <ActionPanelHeader title="Propiedades de la acción" />
      <div className="p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la acción:</label>
        <div className="flex items-center gap-2 mb-4">
          {adjuntoIcon}
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje:</label>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del archivo: <span className="text-xs text-gray-400">(opcional)</span></label>
        <input
          type="text"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-2"
          placeholder="Escriba el nombre del archivo"
          value={nombreArchivo}
          onChange={e => setNombreArchivo(e.target.value)}
        />
        <p className="text-xs text-gray-500 mb-4">Personaliza el nombre del archivo previo a la carga del mismo, de lo contrario se mantendrá el nombre original.</p>
        <label className="block text-sm font-medium text-gray-700 mb-2">Enviar adjunto</label>
        {!modoUrl ? (
          <div className="border-2 border-dashed border-red-400 rounded-xl p-6 mb-2 flex flex-col items-center justify-center bg-white relative">
            {/* Ícono de upload en rojo */}
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path d="M32 44V20" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
              <path d="M24 28l8-8 8 8" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="8" y="44" width="48" height="12" rx="6" stroke="#EF4444" strokeWidth="2" />
            </svg>
            <div className="mt-2 text-center">
              <span className="font-semibold text-gray-700">Selecciona o arrastra un <span className="text-red-500">archivo.</span></span>
            </div>
            <label className="mt-4 w-full cursor-pointer flex flex-col items-center">
              <span className="text-xs text-gray-400">*Sube un archivo de hasta 16MB</span>
              <input
                type="file"
                className="hidden"
                onChange={e => setArchivo(e.target.files?.[0] || null)}
              />
            </label>
            {archivo && (
              <div className="mt-2 text-xs text-green-600">Archivo seleccionado: {archivo.name}</div>
            )}
          </div>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL Adjunto</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full mb-2 bg-white">
              <input
                type="text"
                className="flex-1 border-none outline-none bg-transparent text-gray-700"
                placeholder="https://"
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
              <button
                type="button"
                className="ml-2 text-gray-400 hover:text-red-500"
                onClick={() => setUrl("")}
                title="Borrar URL"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="7" y="9" width="6" height="7" rx="1" fill="#B1B5C9" />
                  <rect x="6" y="6" width="8" height="2" rx="1" fill="#B1B5C9" />
                  <rect x="9" y="3" width="2" height="2" rx="1" fill="#B1B5C9" />
                  <rect x="4" y="8" width="12" height="1" fill="#B1B5C9" />
                </svg>
              </button>
            </div>
            <hr className="my-4 border-gray-200" />
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Adjunto</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
              value={tipoAdjunto}
              onChange={e => setTipoAdjunto(e.target.value)}
            >
              <option value="MP3">MP3</option>
              <option value="PDF">PDF</option>
              <option value="JPG">JPG</option>
              <option value="PNG">PNG</option>
              <option value="DOCX">DOCX</option>
            </select>
          </>
        )}
        <div className="text-center mb-2">
          <button
            type="button"
            className="text-red-500 text-sm font-semibold underline hover:text-red-600"
            onClick={() => setModoUrl(!modoUrl)}
          >
            {modoUrl ? "← Volver a adjuntar archivo" : "o escribe una URL"}
          </button>
        </div>
        <hr className="my-4 border-gray-200" />
        <button
          className={`px-6 py-2 rounded-lg w-full transition-colors duration-200 font-semibold border border-transparent shadow-sm ${guardado ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'}`}
          disabled={guardado}
          onClick={() => {
            // Aquí iría la lógica de guardado real
            setGuardado(true);
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  )
}

export default PropEnviarArchivo
