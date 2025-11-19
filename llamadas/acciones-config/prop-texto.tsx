import React, { useState } from "react"
import ActionPanelHeader from "../secciones/header-accions"
import { MessageSquare } from "lucide-react"

interface PropTextoProps {
  nombre: string;
  mensaje?: string;
  icon?: React.ReactNode;
  onGuardar: (nuevoNombre: string, nuevoMensaje: string, botonEnlace: boolean) => void;
}

const PropTexto: React.FC<PropTextoProps> = ({ nombre, mensaje = "", icon, onGuardar }) => {
  const [valor, setValor] = useState(nombre);
  const [mensajeTexto, setMensajeTexto] = useState(mensaje);
  const [botonEnlace, setBotonEnlace] = useState(false);
  const [editado, setEditado] = useState(false);

  // Modal para botón con enlace
  const [showModal, setShowModal] = useState(false);
  const [showLinkFields, setShowLinkFields] = useState(false);
  const [textoLink, setTextoLink] = useState("");
  const [enlace, setEnlace] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  React.useEffect(() => {
    setValor(nombre);
    setMensajeTexto(mensaje ?? "");
    setEditado(false);
  }, [nombre, mensaje]);

  React.useEffect(() => {
    setEditado(
      valor.trim() !== nombre.trim() ||
      mensajeTexto.trim() !== (mensaje || "").trim()
    );
  }, [valor, mensajeTexto, nombre, mensaje]);

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValor(e.target.value);
    setEditado(
      e.target.value.trim() !== nombre.trim() || mensajeTexto.trim() !== (mensaje ?? "").trim()
    );
  };

  const handleMensajeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMensajeTexto(e.target.value);
    setEditado(
      valor.trim() !== nombre.trim() || e.target.value.trim() !== (mensaje ?? "").trim()
    );
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBotonEnlace(e.target.checked);
    if (e.target.checked) {
      setShowModal(true);
      setShowLinkFields(false);
    } else {
      setShowLinkFields(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setBotonEnlace(false);
  };

  const handleModalContinue = () => {
    setShowModal(false);
    setShowLinkFields(true);
  };

  const handleGuardar = () => {
    if (editado && valor.trim().length > 0) {
      onGuardar(valor.trim(), mensajeTexto.trim(), botonEnlace);
      // Guardar en localStorage
      localStorage.setItem('ivr_texto_nombre', valor.trim());
      localStorage.setItem('ivr_texto_mensaje', mensajeTexto.trim());
      localStorage.setItem('ivr_texto_botonEnlace', botonEnlace ? '1' : '0');
      setEditado(false);
    }
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto rounded-xl">
      <div className="bg-blue-50 px-6 py-4 rounded-t-xl border-b border-gray-200 flex items-center gap-2 justify-between relative">
        <div className="flex items-center gap-2">
          <MessageSquare size={22} className="text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-800">Propiedades de la acción</h2>
        </div>
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
      <div className="p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la acción:</label>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 border border-blue-200">{icon}</span>
          <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 w-full" value={valor} onChange={handleNombreChange} />
        </div>
        <p className="text-xs text-gray-500 mb-4">Personaliza la etiqueta de tu mensaje para una mejor visualización de las acciones en tu flujo y en tus reportes.</p>
        <hr className="my-4" />
        <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje: *</label>
        <textarea
          className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-2"
          rows={4}
          value={mensajeTexto}
          onChange={handleMensajeChange}
          placeholder="Escriba su mensaje aquí"
        />
        <div className="text-xs text-gray-400 mb-4">{mensajeTexto.length} / 1500</div>
        <label className="flex items-center gap-2 text-sm mb-4">
          Enviar botón con enlace:
          <button
            type="button"
            className={`relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none shadow-sm border border-gray-200 flex items-center ${botonEnlace ? 'bg-red-500' : 'bg-gray-200'}`}
            onClick={() => handleSwitchChange({ target: { checked: !botonEnlace } } as any)}
            aria-checked={botonEnlace}
            role="switch"
            style={{ boxShadow: botonEnlace ? '0 2px 8px 0 rgba(239,68,68,0.15)' : '0 1px 4px 0 rgba(0,0,0,0.05)' }}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 flex items-center justify-center`}
              style={{ transform: botonEnlace ? 'translateX(20px)' : 'none', border: '1.5px solid #e5e7eb' }}
            >
              <span className={`block w-3 h-3 rounded-full ${botonEnlace ? 'bg-red-400' : 'bg-gray-300'}`}></span>
            </span>
          </button>
        </label>
        {showLinkFields && (
          <div className="mb-4">
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
              placeholder="https://www.value365.com"
            />
            <div className="text-xs text-gray-400 mb-2">Incluye "https://" al escribir el enlace</div>
          </div>
        )}
        <button
          className={`px-6 py-2 rounded-lg w-full ${editado && valor.trim() ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'}`}
          disabled={!editado || !valor.trim()}
          onClick={handleGuardar}
        >
          Guardar
        </button>
      </div>      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl" onClick={handleModalClose}>&times;</button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Botón con enlace</h2>
            <p className="mb-4 text-base text-gray-700">
              <span className="font-bold">¡Agrega un botón con enlace!</span> Aprovecha esta funcionalidad para ampliar información por medio de un sitio web.
            </p>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg text-base"
              onClick={handleModalContinue}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropTexto;
