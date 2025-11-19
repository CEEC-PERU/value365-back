"use client"

import React, { useState } from "react"
import ActionPanelHeader from "../secciones/header-accions"

const servicioIcon = (
  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-50 border border-indigo-200">
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
      <path d="M20 10a10 10 0 1 1-7.07 2.93" stroke="#B1B5C9" strokeWidth="2" />
      <circle cx="20" cy="20" r="4" stroke="#B1B5C9" strokeWidth="2" />
      <path d="M24 16l4-4" stroke="#B1B5C9" strokeWidth="2" />
    </svg>
  </span>
)

interface PropServicioConfigProps {
  nombre: string
  conector: string
  mostrarComo: string
  variables: any[]
  onGuardar?: (data: any) => void
}

const PropServicioConfig: React.FC<PropServicioConfigProps> = ({ nombre, conector, mostrarComo, variables, onGuardar }) => {
  const [showParametersConfig, setShowParametersConfig] = useState(false);
  const [parameters, setParameters] = useState([
    { nombre: '', valor: '', descripcion: '' },
    { nombre: '', valor: '', descripcion: '' }
  ]);
    const [showHeadersConfig, setShowHeadersConfig] = useState(false);
    const [headers, setHeaders] = useState([
      { nombre: '', valor: '', descripcion: '' }
    ]);
  const [tipoLlamada, setTipoLlamada] = useState('GET');
  const [showTipoDropdown, setShowTipoDropdown] = useState(false);
  const [modalNombre, setModalNombre] = useState("");
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');
  const [showConfigModal, setShowConfigModal] = useState(false);
  // Estado inicial para comparar cambios
  const initialState = {
    nombreAccion: nombre || "Servicio configurable",
    conector: conector || "",
    mostrarComo: mostrarComo || "no-aplica",
    nombreRespuesta: "",
  };

  const [nombreRespuesta, setNombreRespuesta] = useState("");
  const [nombreAccion, setNombreAccion] = useState(nombre || "Servicio configurable")
  const [conectorState, setConectorState] = useState(conector || "")
  const [mostrarComoState, setMostrarComoState] = useState(mostrarComo || "no-aplica")
  const [variablesState, setVariablesState] = useState<any[]>(variables || [])
  const [showDropdown, setShowDropdown] = useState(false)

  // Detectar si hay cambios
  const hasChanges =
    nombreAccion !== initialState.nombreAccion ||
    conectorState !== initialState.conector ||
    mostrarComoState !== initialState.mostrarComo ||
    nombreRespuesta !== initialState.nombreRespuesta;

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto rounded-xl">
      <ActionPanelHeader title="Propiedades de la acción" />
      <div className="p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la acción:</label>
        <div className="flex items-center gap-2 mb-4">
          {servicioIcon}
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Seleccione un conector:</label>
        <div className="relative mb-4">
          <button
            type="button"
            className="border border-gray-200 rounded-lg px-3 py-2 w-full bg-white text-gray-700 flex justify-between items-center"
            onClick={() => setShowDropdown(prev => !prev)}
          >
            {conectorState ? conectorState : "Seleccionar"}
            <span className="ml-2 text-gray-400">▼</span>
          </button>
          {showDropdown && (
            <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-20">
              <div className="px-4 py-3 border-2 border-dashed border-red-400 rounded-lg text-red-500 text-sm flex items-center gap-2 mb-2 cursor-pointer hover:bg-red-50" onClick={() => setShowConfigModal(true)}> 
                <span className="font-bold text-lg">+</span> Agregar configuración
              </div>
          {/* Modal de configuración */}
          {showConfigModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-2xl shadow-xl w-[750px] max-w-full p-8 relative animate-fade-in border border-gray-200">
                <div className="w-full flex justify-start mb-2">
                  <button className="text-blue-700 hover:text-blue-900 text-base font-semibold bg-transparent" onClick={() => setShowConfigModal(false)}>
                    Volver
                  </button>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="text-2xl font-semibold text-gray-800 tracking-tight bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-700 transition-all w-[320px] pr-8"
                      value={modalNombre}
                      onChange={e => setModalNombre(e.target.value)}
                      placeholder="Escriba un nombre"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          if (modalNombre.trim() && onGuardar) {
                            onGuardar({ nombre: modalNombre });
                          }
                        }
                      }}
                    />
                    <span className="text-blue-700"><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M4 20h4l10.5-10.5a1.414 1.414 0 0 0-2-2L6 18v2z" stroke="currentColor" strokeWidth="2"/></svg></span>
                  </div>
                  <button className="px-5 py-2 rounded-lg bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition-all">FINALIZAR CONFIGURACIÓN</button>
                </div>
                <hr className="mb-6 border-gray-200" />
                <div className="flex gap-8 mb-6">
                  <div className="flex gap-6">
                    <button
                      className={`mr-6 pb-1 font-semibold text-base transition-colors ${activeTab === 'input' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-black border-b-2 border-transparent'}`}
                      onClick={() => setActiveTab('input')}
                    >
                      Input
                    </button>
                    <button
                      className={`pb-1 font-semibold text-base transition-colors ${activeTab === 'output' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-black border-b-2 border-transparent'}`}
                      onClick={() => setActiveTab('output')}
                    >
                      Validar Output
                    </button>
                  </div>
                </div>
                {activeTab === 'input' ? (
                  <div className="bg-gray-50 rounded-xl shadow p-6">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de llamada</label>
                        <div className="relative">
                          <button
                            type="button"
                            className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white text-gray-800 flex justify-between items-center"
                            onClick={() => setShowTipoDropdown(prev => !prev)}
                          >
                            {tipoLlamada}
                            <span className="ml-2 text-gray-400">&#9650;</span>
                          </button>
                          {showTipoDropdown && (
                            <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-40 overflow-y-auto">
                              {['GET', 'POST', 'PUT', 'DELETE · Beta', 'PATCH', 'OPTIONS'].map(option => {
                                const isBeta = option.includes('Beta');
                                const mainText = isBeta ? option.replace(' · Beta', '') : option;
                                return (
                                  <div
                                    key={option}
                                    className={`px-4 py-2 cursor-pointer flex items-center gap-2 ${tipoLlamada === mainText ? 'text-red-600 font-bold' : 'text-gray-700'} ${isBeta ? 'text-gray-700' : ''}`}
                                    onClick={() => {
                                      setTipoLlamada(mainText);
                                      setShowTipoDropdown(false);
                                    }}
                                  >
                                    <span>{mainText}</span>
                                    {isBeta && (
                                      <span className="ml-2 px-2 py-0.5 rounded-full border border-red-400 bg-red-50 text-xs text-red-500 font-semibold">Beta</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL del servicio</label>
                        <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white text-gray-800" placeholder="ejemplo: https://google.com" />
                      </div>
                    </div>
                    <div className="mb-6 border rounded-xl overflow-hidden bg-white">
                      <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div>
                          <span className="font-bold text-base text-gray-800">Headers</span>
                          <p className="text-gray-400 text-sm">Ingrese el nombre del header y el valor asignado.</p>
                        </div>
                         <button className="text-red-600 font-semibold" onClick={() => {
                           setShowHeadersConfig(prev => !prev);
                           if (!showHeadersConfig) setShowParametersConfig(false);
                         }}>Configurar</button>
                      </div>
                      {showHeadersConfig && (
                        <div className="p-4">
                          <div className="flex justify-end mb-2">
                            <button className="text-red-600 font-semibold">Guardar</button>
                          </div>
                          <table className="w-full border border-blue-200 rounded-lg mb-4" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                            <thead>
                              <tr className="bg-blue-50">
                                <th className="text-left px-4 py-2 font-bold text-gray-700">Nombre</th>
                                <th className="text-left px-4 py-2 font-bold text-gray-700">Valor</th>
                                <th className="text-left px-4 py-2 font-bold text-gray-700">Descripción</th>
                              </tr>
                            </thead>
                            <tbody>
                              {headers.map((header, idx) => (
                                <tr key={idx} className="border-b">
                                  <td className="px-4 py-2">
                                    <div className="flex items-center gap-2">
                                      <button className="text-red-400 hover:text-red-600" onClick={() => setHeaders(headers.filter((_, i) => i !== idx))}>
                                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#F59E42" strokeWidth="2"/><path d="M8 8l8 8M16 8l-8 8" stroke="#F59E42" strokeWidth="2"/></svg>
                                      </button>
                                      <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 w-full" placeholder="Escriba nuevo nombre" value={header.nombre} onChange={e => {
                                        const newHeaders = [...headers];
                                        newHeaders[idx].nombre = e.target.value;
                                        setHeaders(newHeaders);
                                      }} />
                                    </div>
                                  </td>
                                  <td className="px-4 py-2">
                                    <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 w-full" placeholder="Escriba nuevo valor" value={header.valor} onChange={e => {
                                      const newHeaders = [...headers];
                                      newHeaders[idx].valor = e.target.value;
                                      setHeaders(newHeaders);
                                    }} />
                                  </td>
                                  <td className="px-4 py-2">
                                    <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 w-full" placeholder="Escriba descripción" value={header.descripcion} onChange={e => {
                                      const newHeaders = [...headers];
                                      newHeaders[idx].descripcion = e.target.value;
                                      setHeaders(newHeaders);
                                    }} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <button
                            className="border-2 border-dashed border-red-400 rounded-lg px-6 py-3 text-red-500 text-sm flex items-center gap-2 mb-2 cursor-pointer hover:bg-red-50"
                            onClick={() => setHeaders([...headers, { nombre: '', valor: '', descripcion: '' }])}
                          >
                            <span className="font-bold text-lg">+</span> Agregar Header
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="border rounded-xl overflow-hidden bg-white mt-6">
                    </div>
                    <div className="border rounded-xl overflow-hidden bg-white">
                      <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div>
                          <span className="font-bold text-base text-gray-800">Parameters</span>
                          <p className="text-gray-400 text-sm">Ingrese el nombre del parámetro y el valor asignado. Puede ser un valor fijo o variable ejemplo: {'{{name}}'}</p>
                        </div>
                         <button className="text-blue-700 font-semibold" onClick={() => {
                           setShowParametersConfig(prev => !prev);
                           if (!showParametersConfig) setShowHeadersConfig(false);
                         }}>Configurar</button>
                      </div>
                      {showParametersConfig && (
                        <div className="p-4">
                          <div className="flex justify-end mb-2">
                            <button className="text-blue-700 font-semibold">Guardar</button>
                          </div>
                          <table className="w-full border border-blue-200 rounded-lg mb-4" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                            <thead>
                              <tr className="bg-blue-50">
                                <th className="text-left px-4 py-2 font-bold text-gray-700">Nombre</th>
                                <th className="text-left px-4 py-2 font-bold text-gray-700">Valor</th>
                                <th className="text-left px-4 py-2 font-bold text-gray-700">Descripción</th>
                              </tr>
                            </thead>
                            <tbody>
                              {parameters.map((param, idx) => (
                                <tr key={idx} className="border-b">
                                  <td className="px-4 py-2">
                                    <div className="flex items-center gap-2">
                                      <button className="text-blue-400 hover:text-blue-600" onClick={() => setParameters(parameters.filter((_, i) => i !== idx))}>
                                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2"/><path d="M8 8l8 8M16 8l-8 8" stroke="#2563eb" strokeWidth="2"/></svg>
                                      </button>
                                      <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 w-full" placeholder="Escriba nuevo nombre" value={param.nombre} onChange={e => {
                                        const newParams = [...parameters];
                                        newParams[idx].nombre = e.target.value;
                                        setParameters(newParams);
                                      }} />
                                    </div>
                                  </td>
                                  <td className="px-4 py-2">
                                    <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 w-full" placeholder="Escriba nuevo valor" value={param.valor} onChange={e => {
                                      const newParams = [...parameters];
                                      newParams[idx].valor = e.target.value;
                                      setParameters(newParams);
                                    }} />
                                  </td>
                                  <td className="px-4 py-2">
                                    <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 w-full" placeholder="Escriba descripción" value={param.descripcion} onChange={e => {
                                      const newParams = [...parameters];
                                      newParams[idx].descripcion = e.target.value;
                                      setParameters(newParams);
                                    }} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <button
                            className="border-2 border-dashed border-blue-400 rounded-lg px-6 py-3 text-blue-500 text-sm flex items-center gap-2 mb-2 cursor-pointer hover:bg-blue-50"
                            onClick={() => setParameters([...parameters, { nombre: '', valor: '', descripcion: '' }])}
                          >
                            <span className="font-bold text-lg">+</span> Agregar Parameter
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow p-8">
                    <p className="text-gray-700 mb-6">Prueba si el servicio funciona bien, completando la información que falta.</p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-yellow-800 text-sm flex items-center gap-2 mb-6">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 9v4" stroke="#F59E42" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1" fill="#F59E42"/><circle cx="12" cy="12" r="10" stroke="#F59E42" strokeWidth="2"/></svg>
                      <span><b>No hay variables asociadas</b>, de todas formas puedes validar el Output a continuación.</span>
                    </div>
                    <button className="px-6 py-2 rounded-lg border border-blue-700 text-blue-700 font-semibold bg-white hover:bg-blue-50 transition-all">Validar</button>
                  </div>
                )}
              </div>
            </div>
          )}
              <div className="px-4 pb-2 text-gray-500 text-xs">Selecciona un servicio para hacer conexión (5)</div>
              <div className="px-4 pb-2">
                <input type="text" placeholder="Buscar" className="w-full border border-gray-200 rounded-lg px-2 py-1 mb-2 text-sm" />
              </div>
              <div>
                {['ActivarNotificacionTimerIV', 'DesactivarNotificacionTimerIV', 'Envio de Lead', 'Envío Lead Chubb', 'Validacion_DNI'].map(option => (
                  <label key={option} className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="conector"
                      value={option}
                      checked={conectorState === option}
                      onChange={() => { setConectorState(option); setShowDropdown(false); }}
                      className="mr-2"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Variables</label>
            <span className="text-xs text-gray-400 flex items-center gap-2">Config:
              <a href="#" className="text-orange-500 underline">Copiar</a> |
              <a href="#" className="text-orange-500 underline">Pegar</a>
            </span>
          </div>
          {conectorState === 'ActivarNotificacionTimerIV' ? (
            <div className="grid grid-cols-2 gap-2">
              {["timer", "contenido", "clientid", "campaignid", "did", "idchat"].map((variable) => (
                <React.Fragment key={variable}>
                  <div className="bg-gray-100 rounded-lg px-3 py-2 text-gray-700 text-sm flex items-center justify-between">
                    {variable}
                  </div>
                  <input
                    type="text"
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="{{variable}}"
                  />
                </React.Fragment>
              ))}
            </div>
          ) : conectorState === 'DesactivarNotificacionTimerIV' ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-100 rounded-lg px-3 py-2 text-gray-700 text-sm flex items-center justify-between">
                jobName
              </div>
              <input
                type="text"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="{{variable}}"
              />
            </div>
          ) : conectorState === 'Envio de Lead' ? (
            <div className="grid grid-cols-2 gap-2">
              {["correo", "telefono", "dni", "nombres", "campania"].map((variable) => (
                <React.Fragment key={variable}>
                  <div className="bg-gray-100 rounded-lg px-3 py-2 text-gray-700 text-sm flex items-center justify-between">
                    {variable}
                  </div>
                  <input
                    type="text"
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="{{variable}}"
                  />
                </React.Fragment>
              ))}
            </div>
          ) : conectorState === 'Envío Lead Chubb' ? (
            <div className="grid grid-cols-2 gap-2">
              {["correo", "telefono", "dni", "nombres", "campania"].map((variable) => (
                <React.Fragment key={variable}>
                  <div className="bg-gray-100 rounded-lg px-3 py-2 text-gray-700 text-sm flex items-center justify-between">
                    {variable}
                  </div>
                  <input
                    type="text"
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="{{variable}}"
                  />
                </React.Fragment>
              ))}
            </div>
          ) : conectorState === 'Validacion_DNI' ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-100 rounded-lg px-3 py-2 text-gray-700 text-sm flex items-center justify-between">
                dni
              </div>
              <input
                type="text"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="{{variable}}"
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-blue-200 rounded-lg px-3 py-4 text-center text-blue-400 text-sm mb-2">
              No tienes variables asociadas
            </div>
          )}
        </div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mostrar como: <span className="ml-1 text-gray-400 cursor-help">&#9432;</span></label>
        <div className="flex flex-col gap-2 mb-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="mostrarComo" value="lista-interactiva" checked={mostrarComoState === "lista-interactiva"} onChange={e => setMostrarComoState(e.target.value)} />
            Lista interactiva
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="mostrarComo" value="botonera-interactiva" checked={mostrarComoState === "botonera-interactiva"} onChange={e => setMostrarComoState(e.target.value)} />
            Botonera interactiva
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="mostrarComo" value="lista" checked={mostrarComoState === "lista"} onChange={e => setMostrarComoState(e.target.value)} />
            Lista
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="mostrarComo" value="no-aplica" checked={mostrarComoState === "no-aplica"} onChange={e => setMostrarComoState(e.target.value)} />
            No aplica
          </label>
        </div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Variable de respuesta a mostrar:</label>
        <input
          type="text"
          className={`border border-gray-200 rounded-lg px-3 py-2 w-full mb-2 ${mostrarComoState === 'no-aplica' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700'}`}
          value={nombreRespuesta || ""}
          onChange={e => setNombreRespuesta(e.target.value)}
          disabled={mostrarComoState === 'no-aplica'}
          placeholder="Name (según la respuesta del servicio)"
        />
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-yellow-700 text-sm flex items-center gap-2 mb-4">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 9v4" stroke="#F59E42" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1" fill="#F59E42"/><circle cx="12" cy="12" r="10" stroke="#F59E42" strokeWidth="2"/></svg>
          En caso de lista interactiva, botonera interactiva y lista, si la opción tiene más de 24 caracteres, solo se le mostrarán los primeros 24.
        </div>
        <button
          className={`px-6 py-2 rounded-lg w-full font-semibold border ${hasChanges ? 'border-red-500 bg-red-500 text-white cursor-pointer' : 'border-gray-300 bg-white text-gray-400 cursor-not-allowed'}`}
          disabled={!hasChanges}
          onClick={() => {
            if (hasChanges && onGuardar) {
              onGuardar({
                nombre: nombreAccion,
                conector: conectorState,
                mostrarComo: mostrarComoState,
                nombreRespuesta,
              });
            }
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  )
}

export default PropServicioConfig
