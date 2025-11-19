"use client"

import React, { useState } from "react";
import { ivrService } from "@/lib/services/endpoints/ivr/api";
import ActionPanelHeader from "../secciones/header-accions";

const condicionIcon = (
  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-50 border border-indigo-200">
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
      <circle cx="20" cy="14" r="3" stroke="#B1B5C9" strokeWidth="2" />
      <circle cx="14" cy="26" r="3" stroke="#B1B5C9" strokeWidth="2" />
      <circle cx="26" cy="26" r="3" stroke="#B1B5C9" strokeWidth="2" />
      <path d="M20 17v6M20 23l-6 3M20 23l6 3" stroke="#B1B5C9" strokeWidth="2" />
    </svg>
  </span>
);

// Cambia el tipo de condiciones a un array de objetos
interface Condicion {
  pregunta: string;
  varIzq: string;
  cond: string;
  varDer: string;
}

const PropEvalCondicion: React.FC = () => {
  const [condiciones, setCondiciones] = useState<Condicion[]>([]);
  // ID del flujo actual, debe venir por props/context o estar definido aquí
  const flowId = "ID_DEL_FLUJO"; // Reemplaza por el id real
  const [nombreAccion, setNombreAccion] = useState("Evaluar condición");
  const [showEvalForm, setShowEvalForm] = useState(false);
  const [showCondDropdown, setShowCondDropdown] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  // Form state for new condition
  const [evalPregunta, setEvalPregunta] = useState("");
  const [evalVarIzq, setEvalVarIzq] = useState("");
  const [evalCond, setEvalCond] = useState("");
  const [evalVarDer, setEvalVarDer] = useState("");

  // Opciones de condición con "Contiene (includes)" agregada
  const opcionesCond = [
    { value: ">", label: "Mayor (>)" },
    { value: "<", label: "Menor (<)" },
    { value: "!=", label: "Distinto (!=)" },
    { value: "==", label: "Igual (==)" },
    { value: ">=", label: "Mayor igual (>=)" },
    { value: "<=", label: "Menor igual (<=)" },
    { value: "includes", label: "Contiene (includes)" },
  ];

  // Vista principal
  if (!showEvalForm) {
    return (
      <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto rounded-xl">
        <ActionPanelHeader title="Propiedades de la acción" />
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la acción:</label>
          <div className="flex items-center gap-2 mb-4">
            {condicionIcon}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Crea al menos una condición <span className="text-xs text-gray-400">(obligatorio)</span></label>
          {/* Renderiza las condiciones guardadas */}
          {condiciones.length > 0 ? (
            condiciones.map((cond, idx) => (
              <div key={idx} className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-2 relative">
                <span className="text-gray-700 text-base flex-1">{cond.pregunta}</span>
                <button
                  className="ml-2 text-orange-600 text-sm font-medium hover:underline"
                  onClick={() => {
                    setShowEvalForm(true);
                    setEditIndex(idx);
                    setEvalPregunta(cond.pregunta);
                    setEvalVarIzq(cond.varIzq);
                    setEvalCond(cond.cond);
                    setEvalVarDer(cond.varDer);
                  }}
                >
                  Editar
                </button>
                <button
                  className="ml-2 text-gray-400 hover:text-red-500"
                  onClick={() => {
                    setCondiciones(condiciones.filter((_, i) => i !== idx));
                  }}
                  aria-label="Eliminar"
                >
                  &times;
                </button>
              </div>
            ))
          ) : (
            <div className="mb-4">
              <input
                type="text"
                className="border border-gray-200 rounded-lg px-3 py-2 w-full bg-gray-100 text-gray-400"
                value="Condicion default"
                disabled
              />
            </div>
          )}
          <button
            className="border-2 border-dashed border-blue-300 rounded-lg px-6 py-4 text-blue-500 text-base flex items-center gap-2 mb-4 cursor-pointer hover:bg-blue-50 w-full justify-center"
            onClick={() => {
              setShowEvalForm(true);
              setEditIndex(null);
              setEvalPregunta("");
              setEvalVarIzq("");
              setEvalCond("");
              setEvalVarDer("");
            }}
          >
            <span className="font-bold text-2xl">+</span> Agregar
          </button>
          <p className="text-xs text-gray-400 mb-4">*En caso de que no se cumpla ninguna condición, se usará la condición default</p>
          <button
            className={`px-6 py-2 rounded-lg w-full font-semibold border ${condiciones.length > 0 ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"}`}
            disabled={condiciones.length === 0}
          >
            Guardar
          </button>
        </div>
      </div>
    );
  }

  // Vista de formulario para agregar/editar condición
  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto rounded-xl">
      <div className="rounded-t-xl bg-blue-50 flex items-center p-6 pb-2">
        <button
          className="mr-2 text-blue-500 hover:text-blue-700"
          onClick={() => {
            setShowEvalForm(false);
            setEditIndex(null);
          }}
          aria-label="Volver"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="font-semibold text-lg text-gray-700">Evaluar condición</span>
      </div>
      <div className="px-6 pb-6 pt-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">¿Qué quieres evaluar?</label>
        <input
          type="text"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
          placeholder="Escribe aquí"
          value={evalPregunta}
          onChange={e => setEvalPregunta(e.target.value)}
        />
        <hr className="my-2" />
        <label className="block text-sm font-medium text-gray-700 mb-2">Escribe la condición a evaluar, puedes utilizar variables referenciándolas entre llaves</label>
        <p className="text-xs text-gray-400 mb-2">Por ejemplo: &#123;&#123;componente&#125;&#125;</p>
        <input
          type="text"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-2"
          placeholder="Escribe una variable o constante"
          value={evalVarIzq}
          onChange={e => setEvalVarIzq(e.target.value)}
        />
        {/* Custom dropdown for condition selection */}
        <div className="relative mb-2">
          <button
            type="button"
            className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white flex justify-between items-center shadow-sm text-gray-700 font-medium"
            onClick={() => setShowCondDropdown(v => !v)}
            style={{ minHeight: 48 }}
          >
            <span>{evalCond ? opcionesCond.find(opt => opt.value === evalCond)?.label : "Selecciona una condición"}</span>
            <svg className="ml-2" width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {showCondDropdown && (
            <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 animate-fade-in">
              <div className="px-4 pt-3 pb-2 text-sm text-gray-700 font-semibold border-b border-gray-100">Selecciona una condición ({opcionesCond.length})</div>
              <div className="py-1">
                {opcionesCond.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`flex items-center w-full px-4 py-3 text-left hover:bg-indigo-50 border-b last:border-b-0 border-gray-100 transition-colors duration-100 ${evalCond === opt.value ? 'bg-blue-50' : ''}`}
                    onClick={() => { setEvalCond(opt.value); setShowCondDropdown(false); }}
                    style={{ minHeight: 48 }}
                  >
                    <span className="mr-3">
                      <span className={`inline-block w-5 h-5 rounded-full border-2 ${evalCond === opt.value ? 'border-blue-500' : 'border-gray-300'} flex items-center justify-center bg-white transition-all duration-100"`}>
                        {evalCond === opt.value && <span className="w-3 h-3 bg-blue-500 rounded-full"></span>}
                      </span>
                    </span>
                    <span className={`text-base font-medium ${evalCond === opt.value ? 'text-blue-600' : 'text-gray-700'}`}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* End custom dropdown */}
        <input
          type="text"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
          placeholder="Escribe una variable o constante"
          value={evalVarDer}
          onChange={e => setEvalVarDer(e.target.value)}
        />
        <button
          className={`px-6 py-2 rounded-lg w-full font-semibold border ${evalPregunta && evalVarIzq && evalCond && evalVarDer ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"}`}
          disabled={!(evalPregunta && evalVarIzq && evalCond && evalVarDer)}
          onClick={async () => {
            const nuevaCondicion = {
              pregunta: evalPregunta,
              varIzq: evalVarIzq,
              cond: evalCond,
              varDer: evalVarDer
            };
            if (editIndex !== null && editIndex !== undefined) {
              // Editar condición local
              const nuevas = [...condiciones];
              nuevas[editIndex] = nuevaCondicion;
              setCondiciones(nuevas);
              // Editar nodo en backend
              // Debes tener el id del nodo para editarlo
              // await ivrService.editNode(nodoId, { flowId, tipo: "condicion", datos: nuevaCondicion });
            } else {
              // Agregar nueva condición local
              setCondiciones([
                ...condiciones,
                nuevaCondicion
              ]);
              // Crear nodo en backend
              await ivrService.createNode({ flowId, tipo: "condicion", datos: nuevaCondicion });
            }
            setShowEvalForm(false);
            setEditIndex(null);
            setEvalPregunta("");
            setEvalVarIzq("");
            setEvalCond("");
            setEvalVarDer("");
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

export default PropEvalCondicion;
