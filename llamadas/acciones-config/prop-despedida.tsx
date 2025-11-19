import React, { useState } from "react"
import ActionPanelHeader from "../secciones/header-accions"
import { FaFlag } from "react-icons/fa"

interface PropDespedidaProps {
  nombre: string
  mensaje: string
  botonEnlace: boolean
  etiquetaCierre: string
  onGuardar: (data: { nombre: string; mensaje: string; botonEnlace: boolean; etiquetaCierre: string; textoLink?: string; enlace?: string }) => void
}

const PropDespedida: React.FC<PropDespedidaProps> = ({ nombre, mensaje, botonEnlace, etiquetaCierre, onGuardar }) => {
  const [nombreAccion, setNombreAccion] = useState(nombre)
  const [mensajeAccion, setMensajeAccion] = useState(mensaje)
  const [boton, setBoton] = useState(botonEnlace)
  const [etiqueta, setEtiqueta] = useState(etiquetaCierre)
  const [textoLink, setTextoLink] = useState("")
  const [enlace, setEnlace] = useState("")
  const [showModal, setShowModal] = useState(false);

  const puedeGuardar = nombreAccion.trim().length > 0 && mensajeAccion.trim().length > 0

  // Detectar si hay cambios para habilitar el botón Guardar y ponerlo rojo
  const editado = (
    nombreAccion.trim() !== nombre.trim() ||
    mensajeAccion.trim() !== mensaje.trim() ||
    boton !== botonEnlace ||
    etiqueta !== etiquetaCierre ||
    (boton && (textoLink.trim().length > 0 || enlace.trim().length > 0))
  );

  const handleSwitchClick = () => {
    if (!boton) {
      setShowModal(true);
    } else {
      setBoton(false);
      setTextoLink("");
      setEnlace("");
    }
  };

  const handleGuardar = () => {
    if (editado && puedeGuardar) {
      onGuardar({
        nombre: nombreAccion.trim(),
        mensaje: mensajeAccion.trim(),
        botonEnlace: boton,
        etiquetaCierre: etiqueta,
        textoLink: boton ? textoLink.trim() : "",
        enlace: boton ? enlace.trim() : ""
      });
      // Guardar en localStorage
      localStorage.setItem('despedida_nombre', nombreAccion.trim());
      localStorage.setItem('despedida_mensaje', mensajeAccion.trim());
      localStorage.setItem('despedida_botonEnlace', boton ? '1' : '0');
      localStorage.setItem('despedida_etiquetaCierre', etiqueta.trim());
      if (boton) {
        localStorage.setItem('despedida_textoLink', textoLink.trim());
        localStorage.setItem('despedida_enlace', enlace.trim());
      } else {
        localStorage.removeItem('despedida_textoLink');
        localStorage.removeItem('despedida_enlace');
      }
    }
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto rounded-xl">
      <ActionPanelHeader icon={<FaFlag className="text-blue-500" />} title="Propiedades de la acción" />
      <div className="p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la acción:</label>
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center" style={{ width: 48, height: 48 }}>
            {/* Icono SVG exacto igual al de Acciones.tsx, tamaño 48x48 */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" fill="#E0EDFF" stroke="#B1B5C9" strokeWidth="2" />
              <path d="M20 13v14" stroke="#B1B5C9" strokeWidth="2" />
              <path d="M13 20h14" stroke="#B1B5C9" strokeWidth="2" />
              <path d="M25 15l5 5-5 5" stroke="#B1B5C9" strokeWidth="2" />
            </svg>
          </span>
          <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 w-full" value={nombreAccion} onChange={e => setNombreAccion(e.target.value)} />
        </div>
        <p className="text-xs text-gray-500 mb-4">Personaliza la etiqueta de tu mensaje para una mejor visualización de las acciones en tu flujo y en tus reportes.</p>
        <hr className="my-4" />
        <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje: *</label>
        <textarea
          className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-2"
          rows={4}
          value={mensajeAccion}
          onChange={e => setMensajeAccion(e.target.value)}
          maxLength={1500}
          placeholder="Escriba su mensaje aquí"
        />
        <div className="text-xs text-gray-400 mb-4">{mensajeAccion.length} / 1500</div>
        <label className="flex items-center gap-2 text-sm mb-4">
          Enviar botón con enlace:
          <button
            type="button"
            className={`relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none shadow-sm border border-gray-200 flex items-center ${boton ? 'bg-red-500' : 'bg-gray-200'}`}
            onClick={handleSwitchClick}
            aria-checked={boton}
            role="switch"
            style={{ boxShadow: boton ? '0 2px 8px 0 rgba(239,68,68,0.15)' : '0 1px 4px 0 rgba(0,0,0,0.05)' }}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 flex items-center justify-center`}
              style={{ transform: boton ? 'translateX(20px)' : 'none', border: '1.5px solid #e5e7eb' }}
            >
              <span className={`block w-3 h-3 rounded-full ${boton ? 'bg-red-400' : 'bg-gray-300'}`}></span>
            </span>
          </button>
        </label>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl" onClick={() => setShowModal(false)}>&times;</button>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Botón con enlace</h2>
              <p className="mb-4 text-base text-gray-700">
                <span className="font-bold">¡Agrega un botón con enlace!</span> Aprovecha esta funcionalidad para ampliar información por medio de un sitio web.
              </p>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg text-base"
                onClick={() => { setShowModal(false); setBoton(true); }}
              >
                Continuar
              </button>
            </div>
          </div>
        )}
        {boton && !showModal && (
          <div className="mb-4 animate-fade-in">
            <label className="block text-sm font-medium text-gray-700 mb-2">Texto del link:</label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-2"
              value={textoLink}
              onChange={e => setTextoLink(e.target.value)}
              placeholder="Escribe el texto aquí"
            />
            <label className="block text-sm font-medium text-gray-700 mb-2">Enlace:</label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-1"
              value={enlace}
              onChange={e => setEnlace(e.target.value)}
              placeholder="https://www.chattigo.com"
            />
            <div className="text-xs text-gray-400 mb-2">Incluye "https://" al escribir el enlace</div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asignar etiqueta de cierre:</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                className="border-dashed border-2 border-blue-400 rounded px-3 py-2 w-full"
                value={etiqueta}
                onChange={e => setEtiqueta(e.target.value)}
                placeholder="+ Seleccionar"
              />
              <span className="ml-1 text-gray-400" title="¿Qué es esto?">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#6366F1" strokeWidth="2" /><path d="M12 16v-4" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="8" r="1" fill="#6366F1" /></svg>
              </span>
            </div>
          </div>
        )}
        <button
          className={`px-6 py-2 rounded-lg w-full ${editado && puedeGuardar ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'}`}
          onClick={handleGuardar}
          disabled={!editado || !puedeGuardar}
        >Guardar</button>
      </div>
    </div>
  )
}

export default PropDespedida
