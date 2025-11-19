import React from "react"

interface AutomatizacionPanelProps {
  panelAutomatizacion: "main" | "alerta" | "error" | "autorespuestas"
  setPanelAutomatizacion: (value: "main" | "alerta" | "error" | "autorespuestas") => void
  flujoError: string
  setFlujoError: (value: string) => void
  minutos: number
  setMinutos: (value: number) => void
  segundos: number
  setSegundos: (value: number) => void
  campania: string
  setCampania: (value: string) => void
  campaniaError: boolean
  setCampaniaError: (value: boolean) => void
  etiquetaCierre: string
  setEtiquetaCierre: (value: string) => void
  autorespuestaActiva: boolean
  setAutorespuestaActiva: (value: boolean) => void
  autorespuestaTexto: string
  setAutorespuestaTexto: (value: string) => void
  insistenciaActiva: boolean
  setInsistenciaActiva: (value: boolean) => void
  tiempoCompleto: boolean
}

const AutomatizacionPanel: React.FC<AutomatizacionPanelProps> = ({
  panelAutomatizacion,
  setPanelAutomatizacion,
  flujoError,
  setFlujoError,
  minutos,
  setMinutos,
  segundos,
  setSegundos,
  campania,
  setCampania,
  campaniaError,
  setCampaniaError,
  etiquetaCierre,
  setEtiquetaCierre,
  autorespuestaActiva,
  setAutorespuestaActiva,
  autorespuestaTexto,
  setAutorespuestaTexto,
  insistenciaActiva,
  setInsistenciaActiva,
  tiempoCompleto,
}) => {  const [repetirPregunta, setRepetirPregunta] = React.useState(false);
  const [numeroIntentos, setNumeroIntentos] = React.useState("");
  const [mensajeReintento, setMensajeReintento] = React.useState("");
  const [flujoErrorPanel, setFlujoErrorPanel] = React.useState("");
  const [mensajeMaximoIntentos, setMensajeMaximoIntentos] = React.useState("");
  const isAlertaFormComplete = React.useMemo(() => {
    // Se activa cuando hay cambios en los campos
    const hasTime = minutos > 0 || segundos > 0;
    const hasFlowError = flujoError !== "";
    const hasAutorespuesta = autorespuestaActiva;
    const hasInsistencia = insistenciaActiva;
    const hasAutorespuestaText = autorespuestaTexto.trim() !== "";
    
    // Para flujos específicos
    if (flujoError === "Pase a agente") {
      return hasTime && campania !== "";
    }
    if (flujoError === "Cierre de chat") {
      return hasTime && etiquetaCierre !== "";
    }
    
    return hasTime || hasFlowError || hasAutorespuesta || hasInsistencia || hasAutorespuestaText;
  }, [flujoError, minutos, segundos, campania, etiquetaCierre, autorespuestaActiva, insistenciaActiva, autorespuestaTexto]);

  const isErrorFormComplete = React.useMemo(() => {
    const hasIntentos = numeroIntentos !== "";
    const hasFlujoError = flujoErrorPanel !== "";
    const hasMensajeReintento = mensajeReintento.trim() !== "";
    const hasMensajeMaximo = mensajeMaximoIntentos.trim() !== "";
    
    return hasIntentos || hasFlujoError || hasMensajeReintento || hasMensajeMaximo || repetirPregunta;
  }, [numeroIntentos, flujoErrorPanel, repetirPregunta, mensajeReintento, mensajeMaximoIntentos]);

  const isAutorespuestasFormComplete = React.useMemo(() => {
    return autorespuestaActiva;
  }, [autorespuestaActiva]);

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto rounded-xl shadow-xl" style={{ minWidth: 340 }}>
      {panelAutomatizacion === "main" ? (
        <>
          <div className="bg-blue-50 rounded-t-xl px-8 py-5 flex items-center gap-2 w-full">
            <svg width="24" height="24" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="4" height="4" rx="1" />
              <rect x="10" y="3" width="4" height="4" rx="1" />
              <rect x="17" y="3" width="4" height="4" rx="1" />
              <rect x="3" y="10" width="4" height="4" rx="1" />
              <rect x="10" y="10" width="4" height="4" rx="1" />
              <rect x="17" y="10" width="4" height="4" rx="1" />
              <rect x="3" y="17" width="4" height="4" rx="1" />
              <rect x="10" y="17" width="4" height="4" rx="1" />
              <rect x="17" y="17" width="4" height="4" rx="1" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-800 m-0">Automatización</h2>
          </div>
          <div className="flex flex-col gap-3 p-6">
            <button
              className="w-full flex items-center justify-between px-4 py-4 bg-white hover:bg-gray-100 rounded-lg transition-colors shadow-sm border border-gray-100"
              onClick={() => setPanelAutomatizacion("alerta")}
            >
              <span className="font-medium text-gray-700">Alerta de inactividad</span>
              <svg width="22" height="22" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button
              className="w-full flex items-center justify-between px-4 py-4 bg-white hover:bg-gray-100 rounded-lg transition-colors shadow-sm border border-gray-100"
              onClick={() => setPanelAutomatizacion("error")}
            >
              <span className="font-medium text-gray-700">Error en el flujo</span>
              <svg width="22" height="22" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button
              className="w-full flex items-center justify-between px-4 py-4 bg-white hover:bg-gray-100 rounded-lg transition-colors shadow-sm border border-gray-100"
              onClick={() => setPanelAutomatizacion("autorespuestas")}
            >
              <span className="font-medium text-gray-700">Autorespuestas</span>
              <svg width="22" height="22" fill="none" stroke="#222" strokeWidth="2" viewBox="0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </>
      ) : panelAutomatizacion === "alerta" ? (
        <>
          <div className="bg-[#f6f8ff] px-6 py-4 border-b flex items-center gap-2">
            <button
              className="mr-2 text-gray-500 hover:text-blue-500"
              onClick={() => setPanelAutomatizacion("main")}
              aria-label="Volver"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="font-semibold text-gray-800">
              Automatización / <span className="text-blue-700 font-bold">Alerta de inactividad</span>
            </span>
          </div>
          <div className="flex-1 px-6 py-4 overflow-y-auto">
            <p className="text-gray-500 mb-4 text-sm">
              Puedes configurar una acción, un mensaje y un tiempo máximo en caso que el cliente no responda al último mensaje del bot.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Flujo de error:</label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700"
                value={flujoError}
                onChange={e => setFlujoError(e.target.value)}
              >
                <option value="">Selecciona un flujo de error...</option>
                <option value="Pase a agente">Pase a agente</option>
                <option value="Cierre de chat">Cierre de chat</option>
              </select>
            </div>
            <div className="mb-4 flex gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo de inactividad:</label>
                <div className="flex gap-2 items-center">
                  <div className="flex flex-col items-center">
                    <input type="number" min={0} max={99} value={minutos} onChange={e => setMinutos(Number(e.target.value))} className="w-12 text-center border border-gray-300 rounded-lg" />
                    <span className="text-xs text-gray-500">Minutos</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <input type="number" min={0} max={59} value={segundos} onChange={e => setSegundos(Number(e.target.value))} className="w-12 text-center border border-gray-300 rounded-lg" />
                    <span className="text-xs text-gray-500">Segundos</span>
                  </div>
                </div>
              </div>
            </div>
            {/*  "Pase a agente" */}
            {flujoError === "Pase a agente" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar campaña:</label>
                <select
                  className={`w-full px-4 py-2 rounded-lg border ${campaniaError ? "border-red-500" : "border-gray-300"} bg-white text-gray-700`}
                  value={campania}
                  onChange={e => {
                    setCampania(e.target.value);
                    setCampaniaError(e.target.value === "");
                  }}
                >
                  <option value="">Seleccionar</option>
                  <option value="Campaña 1">Campaña 1</option>
                  <option value="Campaña 2">Campaña 2</option>
                  <option value="Campaña 3">Campaña 3</option>
                </select>
                {campaniaError && (
                  <span className="text-xs text-red-500 mt-1 block">La campaña es requerida</span>
                )}
              </div>
            )}
            {flujoError === "Cierre de chat" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  Asignar etiqueta de cierre:
                  <span className="text-gray-400 cursor-pointer" title="¿Qué es esto?">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12" y2="8" />
                    </svg>
                  </span>
                </label>                <button
                  className="w-full px-4 py-2 border-2 border-dashed border-indigo-500 rounded-lg flex items-center gap-2 text-indigo-600 font-medium bg-white hover:bg-indigo-50 transition"
                  onClick={() => setEtiquetaCierre("Etiqueta seleccionada")}
                >
                  <span className="text-xl font-bold">+</span>
                  <span>{etiquetaCierre ? etiquetaCierre : "Seleccionar"}</span>
                </button>
              </div>
            )}
            <hr className="my-4" />
            <div className="mb-4 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Autorespuesta:</label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={autorespuestaActiva}
                  onChange={() => setAutorespuestaActiva(!autorespuestaActiva)}
                />
                <span className="ml-2 text-gray-400">{autorespuestaActiva ? "Activado" : "Desactivado"}</span>
                <span className={`ml-2 w-10 h-5 rounded-full relative transition ${autorespuestaActiva ? "bg-blue-400" : "bg-gray-200"}`}>
                  <span className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${autorespuestaActiva ? "translate-x-5" : ""}`}></span>
                </span>
              </label>
            </div>
            <textarea
              className={`w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 transition resize-none mb-2 ${!autorespuestaActiva ? "opacity-50 cursor-not-allowed" : ""}`}
              rows={3}
              maxLength={1500}
              placeholder="Escriba una autorespuesta del bot aquí..."
              disabled={!autorespuestaActiva}
              value={autorespuestaTexto}
              onChange={e => setAutorespuestaTexto(e.target.value)}
            />
            <div className={`text-xs text-gray-400 mb-4 text-right ${!autorespuestaActiva ? "opacity-50" : ""}`}>
              {autorespuestaTexto.length} / 1500
            </div>
            <div className="mb-4 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Mensaje de insistencia:</label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={insistenciaActiva}
                  onChange={() => setInsistenciaActiva(!insistenciaActiva)}
                />
                <span className="ml-2 text-gray-400">{insistenciaActiva ? "Activado" : "Desactivado"}</span>
                <span className={`ml-2 w-10 h-5 rounded-full relative transition ${insistenciaActiva ? "bg-blue-400" : "bg-gray-200"}`}>
                  <span className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${insistenciaActiva ? "translate-x-5" : ""}`}></span>
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Para habilitar el mensaje de insistencia, el tiempo de inactividad debe ser mayor a 5 minutos
            </p>
            <button
              className={`text-blue-600 font-semibold mb-4 ${!insistenciaActiva ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
              disabled={!insistenciaActiva}
            >
              Configurar
            </button>            <button
              className={`w-full py-3 rounded-xl font-semibold shadow transition ${
                isAlertaFormComplete 
                  ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
              }`}
              disabled={!isAlertaFormComplete}
            >
              Guardar
            </button>
          </div>
        </>
      ) : panelAutomatizacion === "autorespuestas" ? (
        <>
          <div className="bg-[#f6f8ff] px-6 py-4 border-b flex items-center gap-2">
            <button
              className="mr-2 text-gray-500 hover:text-blue-500"
              onClick={() => setPanelAutomatizacion("main")}
              aria-label="Volver"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="font-semibold text-gray-800">
              Automatización / <span className="text-blue-700 font-bold">Autorespuestas</span>
            </span>
          </div>
          <div className="flex-1 px-6 py-4 overflow-y-auto">
            <p className="text-gray-500 mb-4 text-sm">
              Agrega autorespuestas cuando quieras cerrar un chat en espera o ingrese un chat fuera de horario. No podrás visualizar las autorespuestas que no tengas configuradas.
            </p>
            <div className="mb-6 flex items-center justify-between">
              <label className="block text-base font-medium text-gray-700">Mensaje fuera de horario</label>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={autorespuestaActiva} onChange={() => setAutorespuestaActiva(!autorespuestaActiva)} />
                <span className="ml-2 text-gray-400">{autorespuestaActiva ? "Activado" : "Desactivado"}</span>
                <span className={`ml-2 w-10 h-5 rounded-full relative transition ${autorespuestaActiva ? "bg-blue-400" : "bg-gray-200"}`}>
                  <span className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${autorespuestaActiva ? "translate-x-5" : ""}`}></span>
                </span>
              </label>            </div>
            <div className="mt-8">              <button
                className={`w-full py-3 rounded-xl font-semibold shadow transition ${
                  isAutorespuestasFormComplete 
                    ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                }`}
                disabled={!isAutorespuestasFormComplete}
              >
                Guardar
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-[#f6f8ff] px-6 py-4 border-b flex items-center gap-2">
            <button
              className="mr-2 text-gray-500 hover:text-blue-500"
              onClick={() => setPanelAutomatizacion("main")}
              aria-label="Volver"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="font-semibold text-gray-800">
              Automatización / <span className="text-blue-700 font-bold">Error en el flujo</span>
            </span>
          </div>
          <div className="flex-1 px-6 py-4 overflow-y-auto">
            <p className="text-gray-500 mb-4 text-sm">
              Puedes configurar una acción, un mensaje y una cantidad de intentos en caso que el cliente responda de forma incorrecta a la pregunta del bot. El mensaje de máximos intentos se entregará al agotar los intentos.
            </p>            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nº de intentos:</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700"
                value={numeroIntentos}
                onChange={e => setNumeroIntentos(e.target.value)}
              >
                <option value="">Selecciona un número de intentos...</option>
                <option value="1">1 intento</option>
                <option value="2">2 intentos</option>
                <option value="3">3 intentos</option>
                <option value="4">4 intentos</option>
                <option value="5">5 intentos</option>
              </select>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Repetir pregunta:</label>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={repetirPregunta} onChange={() => setRepetirPregunta(!repetirPregunta)} />
                <span className="ml-2 text-gray-400">{repetirPregunta ? "Activado" : "Desactivado"}</span>
                <span className={`ml-2 w-10 h-5 rounded-full relative transition ${repetirPregunta ? "bg-blue-400" : "bg-gray-200"}`}>
                  <span className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${repetirPregunta ? "translate-x-5" : ""}`}></span>
                </span>
              </label>
            </div>            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje de Reintento:</label>
              <textarea
                className={`w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 transition resize-none mb-2 ${repetirPregunta ? "opacity-50 cursor-not-allowed" : ""}`}
                rows={3}
                maxLength={1500}
                placeholder="Mensaje de Reintento"
                disabled={repetirPregunta}
                value={mensajeReintento}
                onChange={e => setMensajeReintento(e.target.value)}
              />
              <div className="text-xs text-gray-400 mb-4 text-right">{mensajeReintento.length} / 1500</div>
            </div>            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Flujo de error:</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700"
                value={flujoErrorPanel}
                onChange={e => setFlujoErrorPanel(e.target.value)}
              >
                <option value="">Selecciona un flujo de error...</option>
                <option value="Pase a agente">Pase a agente</option>
                <option value="Cierre de chat">Cierre de chat</option>
              </select>
            </div>            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje de máximo de intentos:</label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 transition resize-none mb-2"
                rows={3}
                maxLength={1500}
                placeholder="Mensaje de máximo de intentos"
                value={mensajeMaximoIntentos}
                onChange={e => setMensajeMaximoIntentos(e.target.value)}
              />
              <div className="text-xs text-gray-400 mb-4 text-right">{mensajeMaximoIntentos.length} / 1500</div>
            </div>            <button
              className={`w-full py-3 rounded-xl font-semibold shadow transition ${
                isErrorFormComplete 
                  ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
              }`}
              disabled={!isErrorFormComplete}
            >
              Guardar
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default AutomatizacionPanel
