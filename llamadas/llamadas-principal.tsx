"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Settings,
  Grid3x3,
  Star,
  MessageSquare,
  Home,
  AlertCircle,
  FileText,
  Copy,
  Trash2,
  Settings2,
  Lock,
} from "lucide-react"
import FloatingPanel from "./floatingpanel"
import AutomatizacionPanel from "./secciones/Automatizacion"
import AccionesPanel, { actions as accionesPanelActions, sectionIcons as accionesPanelSectionIcons } from "./secciones/Acciones"
import ProyectoPanel from "./secciones/Proyecto"
import PropDespedida from "./acciones-config/prop-despedida"
import ActionPanelHeader from "./secciones/header-accions"
import NoNodeSelectedPanel from "./secciones/Propiedades-accion"
import PropTexto from "./acciones-config/prop-texto"
import PropMenuOpciones from "./acciones-config/prop-menu-opciones"
import PropEnviarArchivo from "./acciones-config/prop-enviar-archivo"
import PropPregunta from "./acciones-config/prop-pregunta"
import PropServicioConfig from "./acciones-config/prop-servicio-config"
import PropEvalCondicion from "./acciones-config/prop-eval-condicion"
import HeaderPrincipal from "./header-principal"
import VistaBotIVRGeneral from "./vista-general-bots/vista-botIVR-gnral"
import ModalAccionesCanva from "./flot-acciones-canva"

interface DroppedAction {
  id: string
  name: string
  x: number
  y: number
  icon: React.ReactNode
  message?: string
  category?: string 
  botonEnlace?: boolean
  etiquetaCierre?: string
  activarLista?: boolean
  opciones?: string[]
  tipoPregunta?: string
  infoOculta?: boolean
  conector?: string
  mostrarComo?: string
  variables?: any[]
  customRender?: boolean
  parentId?: string
}

interface Action {
  id: string
  name: string
  icon: React.ReactNode
  category: string
  description?: string
}

const sidebarIcons = [
  { id: "settings", icon: Settings, label: "Proyecto", category: "proyecto" },
  { id: "grid", icon: Grid3x3, label: "Automatización", category: "automatizacion" },
  { id: "star", icon: Star, label: "Acciones", category: "acciones" },
  { id: "message", icon: MessageSquare, label: "Propiedades de la acción", category: "propiedades" },
]

export function CallsManagement({ nombreBot, descripcionBot }: { nombreBot?: string, descripcionBot?: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Generales: true,
    Interactivas: false,
    Derivaciones: false,
    Servicios: false,
  })
  const [zoom, setZoom] = useState(0.8)
  const minZoom = 0.01
  const maxZoom = 2.0
  const stepZoom = 0.05
  const [droppedActions, setDroppedActions] = useState<DroppedAction[]>([])
  const [draggedAction, setDraggedAction] = useState<DroppedAction | null>(null)  
  const [nombreBotLocal, setNombreBotLocal] = useState(nombreBot || "Proyecto")
  const [descripcionBotLocal, setDescripcionBotLocal] = useState(descripcionBot || "")
  const [showVistaBotIVR, setShowVistaBotIVR] = useState(false)
  const [botPublicado, setBotPublicado] = useState<{nombre: string; descripcion: string} | null>(null)
  
  const handleNombreBotChange = (nuevoNombre: string) => {
    setNombreBotLocal(nuevoNombre)
  }

  const handleDescripcionBotChange = (nuevaDescripcion: string) => {
    setDescripcionBotLocal(nuevaDescripcion)
  }

  const handlePublishBot = (botData: {nombre: string; descripcion: string}) => {
    setBotPublicado(botData)
    setShowVistaBotIVR(true)
  }

  // Actualizar el estado local cuando cambien las props
  useEffect(() => {
    setNombreBotLocal(nombreBot || "Proyecto")
    setDescripcionBotLocal(descripcionBot || "")
  }, [nombreBot, descripcionBot])

  const [centerBoxX, setCenterBoxX] = useState(0.5 * window.innerWidth)
  const [centerBoxY, setCenterBoxY] = useState(0.5 * window.innerHeight)

  const [isDraggingCenterBox, setIsDraggingCenterBox] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const [isPanningCanvas, setIsPanningCanvas] = useState(false)
  const [panStartPos, setPanStartPos] = useState({ x: 0, y: 0 })
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })

  const [showHomePanel, setShowHomePanel] = useState(false)
  const [panelPosition, setPanelPosition] = useState({ x: 120, y: window.innerHeight / 2 - 200 })
  const [isDraggingPanel, setIsDraggingPanel] = useState(false)
  const [panelDragOffset, setPanelDragOffset] = useState({ x: 0, y: 0 })

  const [panelAutomatizacion, setPanelAutomatizacion] = useState<"main" | "alerta" | "error" | "autorespuestas">("main")

  const [autorespuestaActiva, setAutorespuestaActiva] = useState(false)
  const [autorespuestaTexto, setAutorespuestaTexto] = useState("")
  const [insistenciaActiva, setInsistenciaActiva] = useState(false)

  const [minutos, setMinutos] = useState(0)
  const [segundos, setSegundos] = useState(0)

  const [flujoError, setFlujoError] = useState("")
  const [etiquetaCierre, setEtiquetaCierre] = useState("")
  const [campania, setCampania] = useState("")
  const [campaniaError, setCampaniaError] = useState(false)

  const [selectedAction, setSelectedAction] = useState<Action | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [isCompactView, setIsCompactView] = useState(false)

  const [showAccionesModal, setShowAccionesModal] = useState(false);
  const [accionesModalPosition, setAccionesModalPosition] = useState<{ x: number, y: number } | null>(null);
  const accionesCategorias = [
    {
      nombre: "Generales",
      icon: <Settings size={24} className="text-gray-400" />,
      acciones: [
        { id: "texto", name: "Texto", icon: <FileText size={20} />, category: "texto" },
        { id: "despedida", name: "Despedida", icon: <AlertCircle size={20} />, category: "despedida" },
      ],
    },
    {
      nombre: "Interactivas",
      icon: <Grid3x3 size={24} className="text-gray-400" />,
      acciones: [
        { id: "pregunta", name: "Pregunta", icon: <MessageSquare size={20} />, category: "pregunta" },
        { id: "menu-opciones", name: "Menú de opciones", icon: <Star size={20} />, category: "menu-opciones" },
      ],
    },
    {
      nombre: "Derivaciones",
      icon: <Copy size={24} className="text-gray-400" />,
      acciones: [
        { id: "derivar-agente", name: "Derivar a agente", icon: <Lock size={20} />, category: "derivar-agente" },
        { id: "derivar-wsp", name: "Derivar a Whatsapp", icon: <MessageSquare size={20} />, category: "derivar-wsp" },
      ],
    },
    {
      nombre: "Servicios",
      icon: <Settings2 size={24} className="text-gray-400" />,
      acciones: [
        { id: "servicio-config", name: "Servicio configurable", icon: <Settings2 size={20} />, category: "servicio-config" },
        { id: "eval-condicion", name: "Evaluar condición", icon: <AlertCircle size={20} />, category: "eval-condicion" },
      ],
    },
  ];

  const tiempoCompleto = minutos > 0 || segundos > 0

  const compactView = () => {
    if (droppedActions.length === 0) return

    // Calcula el centro del canvas
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    setDroppedActions((prev) =>
      prev.map((action, idx) => ({
        ...action,
        x: centerX,
        y: centerY - (prev.length * 60) / 2 + idx * 60,
      })),
    )
  }

  const centerCanvasElements = () => {
    setDroppedActions((prev) =>
      prev.map((action, idx) => ({
        ...action,
        x: 0.5 * window.innerWidth,
        y: 0.5 * window.innerHeight - 100 + idx * 60,
      })),
    )
  }

  const handleCenterBoxMouseDown = (e: React.MouseEvent) => {
    setIsDraggingCenterBox(true)
    setDragOffset({
      x: e.clientX - centerBoxX,
      y: e.clientY - centerBoxY,
    })
  }

  const handleCenterBoxMouseUp = () => {
    setIsDraggingCenterBox(false)
  }

  const handleCenterBoxMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCenterBox) {
      setCenterBoxX(e.clientX - dragOffset.x)
      setCenterBoxY(e.clientY - dragOffset.y)
    }
  }

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Solo click izquierdo
      setIsPanningCanvas(true)
      setPanStartPos({ x: e.clientX, y: e.clientY })
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanningCanvas) {
      const deltaX = e.clientX - panStartPos.x
      const deltaY = e.clientY - panStartPos.y
      setCanvasOffset((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }))
      setPanStartPos({ x: e.clientX, y: e.clientY })
    }
  }

  const handleCanvasMouseUp = () => {
    setIsPanningCanvas(false)
  }
  const handleCanvasWheel = (e: React.WheelEvent) => {
    // Verificar si el evento puede ser cancelado antes de usar preventDefault
    if (e.cancelable) {
      e.preventDefault();
    }
    const delta = e.deltaY < 0 ? stepZoom : -stepZoom;
    setZoom((z) => Math.max(minZoom, Math.min(maxZoom, +(z + delta).toFixed(2))));
  }

  const getNextVerticalPosition = () => {
    const centerX = window.innerWidth / 2 - 60
    const startY = 150
    const spacing = 120
    const nextIndex = droppedActions.length
    return { x: centerX, y: startY + (nextIndex + 2) * spacing } 
  }

  const handlePanelMouseDown = (e: React.MouseEvent) => {
    setIsDraggingPanel(true)
    setPanelDragOffset({
      x: e.clientX - panelPosition.x,
      y: e.clientY - panelPosition.y,
    })
  }

  const handlePanelMouseUp = () => {
    setIsDraggingPanel(false)
  }

  const handlePanelMouseMove = (e: React.MouseEvent) => {
    if (isDraggingPanel) {
      setPanelPosition({
        x: e.clientX - panelDragOffset.x,
        y: e.clientY - panelPosition.y,
      })
    }
  }

  const getVerticalPosition = (index: number) => {
    const centerX = window.innerWidth / 2 - 60 
    const startY = 150
    const spacing = 120
    return { x: centerX, y: startY + index * spacing }
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSelectAction = (action: Action) => {
    setSelectedAction(action)
  }

  const duplicateNode = (nodeId: string) => {
    const nodeToDuplicate = droppedActions.find((a) => a.id === nodeId)
    if (nodeToDuplicate) {
      const idx = droppedActions.findIndex((a) => a.id === nodeId)
      const newNode: DroppedAction = {
        ...nodeToDuplicate,
        id: `${nodeToDuplicate.id}-copia-${Date.now()}`,
        name: `${nodeToDuplicate.name} (COPIA)`,
        y: nodeToDuplicate.y + 80,
      }
      setDroppedActions((prev) => {
        const arr = [...prev]
        arr.splice(idx + 1, 0, newNode)
        return arr
      })
    }
  }

  const deleteNode = (nodeId: string) => {
    setDroppedActions((prev) => prev.filter((a) => a.id !== nodeId))
    setSelectedNodeId(null)
  }

  const handleCompactViewToggle = () => {
    setIsCompactView((prev) => !prev)
  }

  const renderRightPanel = () => {
    if (!selectedCategory) return null;

    if (selectedCategory === "proyecto") {
      return <ProyectoPanel />;
    }
    if (selectedCategory === "automatizacion") {
      return (
        <AutomatizacionPanel
          panelAutomatizacion={panelAutomatizacion}
          setPanelAutomatizacion={setPanelAutomatizacion}
          flujoError={flujoError}
          setFlujoError={setFlujoError}
          minutos={minutos}
          setMinutos={setMinutos}
          segundos={segundos}
          setSegundos={setSegundos}
          campania={campania}
          setCampania={setCampania}
          campaniaError={campaniaError}
          setCampaniaError={setCampaniaError}
          etiquetaCierre={etiquetaCierre}
          setEtiquetaCierre={setEtiquetaCierre}
          autorespuestaActiva={autorespuestaActiva}
          setAutorespuestaActiva={setAutorespuestaActiva}
          autorespuestaTexto={autorespuestaTexto}
          setAutorespuestaTexto={setAutorespuestaTexto}
          insistenciaActiva={insistenciaActiva}
          setInsistenciaActiva={setInsistenciaActiva}
          tiempoCompleto={tiempoCompleto}
        />
      );
    }
    if (selectedCategory === "acciones") {
      return (
        <AccionesPanel
          handleDragStart={(e, action) => {
            setDraggedAction({
              id: action.id,
              name: action.name,
              x: 0,
              y: 0,
              icon: action.icon,
              message: "",
              category: action.category ?? undefined 
            });
          }}
          selectedAction={selectedAction}
          onSelectAction={handleSelectAction}
        />
      );
    }
    if (selectedCategory === "propiedades") {
      if (selectedNodeId) {
        const node = droppedActions.find((a) => a.id === selectedNodeId);
        if (node) {
          if (node.name === "Despedida" || node.name.startsWith("Despedida")) {
            return (
              <PropDespedida
                nombre={node.name}
                mensaje={node.message || ""}
                botonEnlace={node.botonEnlace ?? false}
                etiquetaCierre={node.etiquetaCierre ?? ""}
                onGuardar={(data) => {
                  setDroppedActions(prev => prev.map(a => a.id === node.id ? { ...a, ...data } : a));
                }}
              />
            );
          }
          if (node.name === "Menú De Opciones" || node.name === "Menú de opciones" || node.category === "menu-opciones") {
            return (
              <PropMenuOpciones
                nombre={node.name}
                activarLista={node.activarLista ?? false}
                opciones={node.opciones ?? []}
                onGuardar={data => {
                  setDroppedActions(prev => prev.map(a => a.id === node.id ? { ...a, ...data } : a));
                }}
              />
            );
          }
          if (node.name === "Pregunta" || node.category === "pregunta") {
            return (
              <PropPregunta
                nombre={node.name}
                mensaje={node.message || ""}
                tipoPregunta={node.tipoPregunta || ""}
                infoOculta={node.infoOculta || false}
                onGuardar={data => {
                  setDroppedActions(prev => prev.map(a => a.id === node.id ? { ...a, ...data } : a));
                }}
              />
            );
          }
          if (node.name === "Texto" || node.category === "texto") {
            return (
              <PropTexto
                nombre={node.name}
                mensaje={node.message || ""}
                icon={node.icon}
                onGuardar={(nuevoNombre, nuevoMensaje, botonEnlace) => {
                  setDroppedActions(prev => prev.map(a => a.id === node.id ? { ...a, name: nuevoNombre, message: nuevoMensaje } : a));
                }}
              />
            );
          }
            if (node.name === "Enviar Adjunto" || node.category === "enviar-adjunto") {
              return (
                <PropEnviarArchivo />
              );
            }
          if (node.name === "Derivar A Agente" || node.name === "Derivar a agente" || node.category === "derivar-agente") {
            const PropDerivarAgente = require("./acciones-config/prop-derivar-agente").default;
            return <PropDerivarAgente />;
          }
          if (node.name === "Derivar a Whatsapp" || node.name.startsWith("Derivar a Whatsapp") || node.category === "derivar-wsp") {
            const PropDerivarWsp = require("./acciones-config/prop-derivar-wsp").default;
            return <PropDerivarWsp />;
          }
          if (node.name === "Servicio configurable" || node.category === "servicio-config") {
            return (
              <PropServicioConfig
                nombre={node.name}
                conector={node.conector || ""}
                mostrarComo={node.mostrarComo || "no-aplica"}
                variables={node.variables || []}
                onGuardar={data => {
                  setDroppedActions(prev => prev.map(a => a.id === node.id ? { ...a, ...data } : a));
                }}
              />
            );
          }
          if (node.name === "Evaluar condición" || node.category === "eval-condicion") {
            return <PropEvalCondicion />;
          }
          return (
            <NoNodeSelectedPanel />
          );
        }
      }
      return <NoNodeSelectedPanel />;
    }
    return null;
  }

  // Escuchar el evento de opción-agregada para agregar el bloque visual debajo del menú de opciones
  useEffect(() => {
    const handler = (e: any) => {
      // Buscar el nodo de menú de opciones
      const menuNode = droppedActions.find(a => a.category === "menu-opciones" || a.name === "Menú De Opciones" || a.name === "Menú de opciones")
      if (menuNode) {
        // Calcular posición debajo del menú
        const opcionesActuales = droppedActions.filter(a => a.category === "opcion-menu" && a.parentId === menuNode.id)
        const idx = opcionesActuales.length;
        const baseY = menuNode.y + 120 + idx * 160;
        setDroppedActions(prev => [
          ...prev,
          {
            id: `opcion-nodo-${Date.now()}`,
            name: e.detail.nombreOpcion,
            x: menuNode.x,
            y: baseY,
            icon: null,
            category: "opcion-menu",
            message: "",
            opciones: [],
            customRender: true,
            parentId: menuNode.id
          }
        ])
      }
    }
    window.addEventListener("opcion-agregada", handler)
    return () => window.removeEventListener("opcion-agregada", handler)
  }, [droppedActions])

  // Estado y lógica para mover el modal flotante
  const [isDraggingAccionesModal, setIsDraggingAccionesModal] = useState(false);
  const [accionesModalDragOffset, setAccionesModalDragOffset] = useState<{ x: number, y: number } | null>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (isDraggingAccionesModal && accionesModalPosition && accionesModalDragOffset) {
        setAccionesModalPosition({
          x: e.clientX - accionesModalDragOffset.x,
          y: e.clientY - accionesModalDragOffset.y,
        });
      }
    }
    function handleMouseUp() {
      setIsDraggingAccionesModal(false);
    }
    if (isDraggingAccionesModal) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingAccionesModal, accionesModalPosition, accionesModalDragOffset]);

  const [showDeleteModal, setShowDeleteModal] = useState<{ id: string | null, visible: boolean }>({ id: null, visible: false });
  return (
    showVistaBotIVR ? (
      <VistaBotIVRGeneral 
        botPublicado={botPublicado}
      />
    ) : (
      <div className="flex h-screen bg-gray-50">
        {/* Canvas Central */}
        <div
          className="flex-1 bg-white relative overflow-hidden flex flex-col"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            if (!draggedAction) return

            const { x, y } = getNextVerticalPosition()

            // Si la acción es 'Derivar a Whatsapp', agregar también 'Despedida' automáticamente
            if (draggedAction.name === "Derivar a Whatsapp" || draggedAction.category === "derivar-wsp") {
              const wspAction = {
                id: `${draggedAction.id}-${Date.now()}`,
                name: draggedAction.name,
                x,
                y,
                icon: draggedAction.icon,
                message: draggedAction.message || "",
                category: draggedAction.category,
              }
              const despedidaAction = {
                id: `despedida-${Date.now()}`,
                name: "Despedida",
                x,
                y: y + 120,
                icon: <svg width="32" height="32" fill="none"><circle cx="16" cy="16" r="16" fill="#B1B5C9"/><path d="M16 10v8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="16" cy="22" r="2" fill="#fff"/></svg>,
                category: "despedida",
              }
              setDroppedActions((prev) => [...prev, wspAction, despedidaAction])
              setDraggedAction(null)
              setSelectedNodeId(wspAction.id)
              return
            }

            const newAction: DroppedAction = {
              id: `${draggedAction.id}-${Date.now()}`,
              name: draggedAction.name,
              x,
              y,
              icon: draggedAction.icon,
              message: draggedAction.message || "",
              category: draggedAction.name === "Evaluar Condición" ? "eval-condicion" : (draggedAction.category || undefined),
              ...(draggedAction.name === "Despedida" || draggedAction.name?.startsWith("Despedida") ? {
                botonEnlace: false,
                etiquetaCierre: ""
              } : {}),
              ...(draggedAction.name === "Menú De Opciones" || draggedAction.name === "Menú de opciones" || draggedAction.category === "menu-opciones" ? {
                activarLista: false,
                opciones: []
              } : {}),
              ...(draggedAction.name === "Pregunta" || draggedAction.category === "pregunta" ? {
                tipoPregunta: "",
                infoOculta: false
              } : {})
            }

            setDroppedActions((prev) => [...prev, newAction])
            setDraggedAction(null)
            setSelectedNodeId(newAction.id) 
          }}
        >          {/* Header principal extraído */}          <HeaderPrincipal 
            nombreBot={nombreBotLocal} 
            onPublishBot={handlePublishBot}
            onNombreBotChange={handleNombreBotChange}
            descripcionBot={descripcionBotLocal}
            onDescripcionBotChange={handleDescripcionBotChange}
          />
          {/* Canvas Area */}
          <div
            className="flex-1 flex items-center justify-center relative p-8 overflow-hidden"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={(e) => {
              handleCanvasMouseMove(e)
              handleCenterBoxMouseMove(e)
            }}
            onMouseUp={() => {
              handleCanvasMouseUp()
              handleCenterBoxMouseUp()
            }}
            onMouseLeave={() => {
              handleCanvasMouseUp()
              handleCenterBoxMouseUp()
            }}
            onWheel={handleCanvasWheel}
            style={{ cursor: isPanningCanvas ? "grabbing" : "grab" }}
          >
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                transform: `scale(${zoom}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
                transition: isPanningCanvas ? "none" : "transform 0.2s",
                transformOrigin: "center",
              }}
            >
              {droppedActions.length === 0 ? (
                <div
                  className="flex flex-col items-center gap-0 relative cursor-move"
                  style={{
                    position: "absolute",
                    left: `${centerBoxX}px`,
                    top: `${centerBoxY}px`,
                    transform: "translate(-50%, -50%)",
                    transition: isDraggingCenterBox ? "none" : "left 0.2s, top 0.2s",
                    zIndex: 10,
                    userSelect: "none",
                  }}
                  onMouseDown={handleCenterBoxMouseDown}
                >
                  {/* Home icon con fondo y línea */}
                  <div className="flex flex-col items-center">
                    <button
                      className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center z-10 border-2 border-white shadow"
                      onClick={() => setShowHomePanel(true)}
                      aria-label="Nodo Home"
                    >
                      <Home className="text-white" size={22} />
                    </button>
                    <div className="w-0.5 h-8 bg-blue-400" />
                  </div>
                  {/* Caja gris con texto */}
                  <div
                    className="bg-gray-600 text-white px-8 py-6 rounded-lg text-center mt-[-8px] flex flex-col items-center"
                    style={{ width: 220 }}
                  >
                    <div className="text-3xl mb-2 font-light">+</div>
                    <p className="text-sm">Arrastra una acción para comenzar</p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full flex flex-col items-center pt-20">
                  {/* Nodo Home */}
                  <div className="flex flex-col items-center mb-4">
                    <button
                      className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center z-10 border-2 border-white shadow hover:bg-blue-500 transition-colors"
                      onClick={() => setShowHomePanel(true)}
                      aria-label="Nodo Home"
                    >
                      <Home className="text-white" size={22} />
                    </button>
                    <div className="w-0.5 h-12 bg-blue-400" />
                  </div>

                  {/* Nodo de suma (+) */}
                  <div className="flex flex-col items-center mb-4">
                    <button
                      className="w-10 h-10 rounded-full bg-white border-2 border-blue-400 flex items-center justify-center shadow hover:bg-blue-100 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAccionesModal(true);
                        setAccionesModalPosition({ x: e.currentTarget.getBoundingClientRect().right, y: e.currentTarget.getBoundingClientRect().bottom });
                      }}
                      aria-label="Agregar acción"
                      title="Agregar acción"
                      style={{ position: "relative", zIndex: 20 }}
                    >
                      <span className="text-blue-400 text-xl font-light">+</span>
                    </button>
                    <div className="w-0.5 h-12 bg-blue-400" />
                  </div>

                  {/* Nodos de acciones */}
                  {droppedActions.map((action, idx) => {
                    // Renderizado especial para nodo Despedida
                    if (action.name === "Despedida" || action.category === "despedida") {
                      return (
                        <div key={action.id} className="flex flex-col items-center w-full">
                          {idx > 0 && <div className="w-0.5 h-12 bg-blue-400 mb-4" />}
                          <div
                            className={`rounded-lg cursor-move transition-all group mb-4 ${selectedNodeId === action.id ? "ring-2 ring-blue-400 shadow-lg" : "hover:shadow-md"}`}
                            onClick={() => {
                              setSelectedNodeId(action.id);
                              setSelectedCategory("propiedades");
                            }}
                          >
                            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow relative" style={{ width: 260 }}>
                              <div className="flex flex-col items-start gap-0 relative">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                  {/* Ícono SVG de Despedida igual al panel de acciones */}
                                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
                                    <path d="M20 12v16" stroke="#B1B5C9" strokeWidth="2" />
                                    <path d="M12 20h16" stroke="#B1B5C9" strokeWidth="2" />
                                    <path d="M25 15l5 5-5 5" stroke="#B1B5C9" strokeWidth="2" />
                                  </svg>
                                </div>
                                <p className="text-gray-800 font-medium text-sm text-left mt-2">{action.name}</p>
                                <button className="absolute top-2 right-2 flex flex-col items-center p-1 text-gray-400 hover:text-gray-600 rounded-full" title="Más opciones">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mb-1"></span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mb-1"></span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                </button>
                              </div>
                              <hr className="my-2 border-gray-200" />
                              <div className="flex justify-end gap-4 mt-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteModal({ id: action.id, visible: true });
                                  }}
                                  className="flex flex-col items-center text-gray-500 hover:text-red-500"
                                  title="Eliminar"
                                >
                                  <Trash2 size={22} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateNode(action.id);
                                  }}
                                  className="flex flex-col items-center text-gray-500 hover:text-blue-500"
                                  title="Duplicar"
                                >
                                  <Copy size={22} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAccionesModal(true);
                                  }}
                                  className="flex flex-col items-center text-gray-500 hover:text-blue-600"
                                  title="Agregar acción"
                                  disabled // Deshabilitado porque Despedida cierra el flujo
                                  style={{ opacity: 0.5, cursor: "not-allowed" }}
                                >
                                  <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" stroke="#6B7280" strokeWidth="2"/><path d="M12 8v8M8 12h8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/></svg>
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* Ícono de cierre al final */}
                          <div className="w-0.5 h-8 bg-blue-400" />
                          <div className="flex items-center justify-center">
                            <span className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center">
                              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="18" stroke="#B1B5C9" strokeWidth="2" />
                                <path d="M20 12v16" stroke="#B1B5C9" strokeWidth="2" />
                                <path d="M12 20h16" stroke="#B1B5C9" strokeWidth="2" />
                                <path d="M25 15l5 5-5 5" stroke="#B1B5C9" strokeWidth="2" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      );
                    }
                    if (action.category === "opcion-menu") {
                      return (
                        <div key={action.id} className="flex flex-col items-center w-full">
                          {/* Línea azul arriba del bloque blanco */}
                          <div className="w-0.5 h-8 bg-blue-400 mb-2" />
                          <div className="bg-white rounded-lg shadow border border-gray-200 px-8 py-2 mb-2" style={{ minWidth: 140 }}>
                            <span className="text-blue-500 font-medium text-sm">{idx + 1}. {action.name}</span>
                          </div>
                          {/* Línea azul debajo del bloque blanco */}
                          <div className="w-0.5 h-8 bg-blue-400 mb-2" />
                          <div className="bg-gray-600 rounded-lg shadow flex flex-row items-center justify-center gap-12 px-12 py-8" style={{ minWidth: 320 }}>
                            <div className="flex flex-col items-center">
                              <svg width="32" height="32" fill="none"><rect width="32" height="32" rx="8" fill="#6B7280"/><g><rect x="8" y="14" width="16" height="2" rx="1" fill="#fff"/></g></svg>
                              <span className="text-white text-xs mt-1">Conectar opción</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <svg width="32" height="32" fill="none"><rect width="32" height="32" rx="8" fill="#6B7280"/><g><rect x="16" y="8" width="2" height="16" rx="1" fill="#fff"/><rect x="8" y="16" width="16" height="2" rx="1" fill="#fff"/></g></svg>
                              <span className="text-white text-xs mt-1">Agregar acción</span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return (
                      <div key={action.id} className="flex flex-col items-center w-full">
                        {idx > 0 && <div className="w-0.5 h-12 bg-blue-400 mb-4" />}
                        {isCompactView ? (
                          <div
                            className="rounded-full cursor-pointer transition-all group mb-4 flex items-center justify-center bg-white border-2 border-blue-400 shadow-md hover:shadow-lg p-0 w-12 h-12"
                            onClick={() => {
                              setSelectedNodeId(action.id);
                              setSelectedCategory("propiedades"); 
                            }}
                            style={{ minWidth: 48, minHeight: 48 }}
                          >
                            <span className="flex items-center justify-center w-full h-full text-blue-500 text-2xl">
                              {action.icon}
                            </span>
                          </div>
                        ) : (
                          <div
                            className={`rounded-lg cursor-move transition-all group mb-4 ${selectedNodeId === action.id ? "ring-2 ring-blue-400 shadow-lg" : "hover:shadow-md"}`}
                            onClick={() => {
                              setSelectedNodeId(action.id);
                              setSelectedCategory("propiedades"); 
                            }}
                          >
                            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow relative" style={{ width: 260 }}>
                              <div className="flex flex-col items-start gap-0 relative">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                  <span className="text-2xl">{action.icon}</span>
                                </div>
                                <p className="text-gray-800 font-medium text-sm text-left mt-2">{action.name}</p>
                                <button className="absolute top-2 right-2 flex flex-col items-center p-1 text-gray-400 hover:text-gray-600 rounded-full" title="Más opciones">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mb-1"></span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mb-1"></span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                </button>
                              </div>
                              <hr className="my-2 border-gray-200" />
                              <div className="flex justify-end gap-4 mt-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteModal({ id: action.id, visible: true });
                                  }}
                                  className="flex flex-col items-center text-gray-500 hover:text-red-500"
                                  title="Eliminar"
                                >
                                  <Trash2 size={22} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateNode(action.id);
                                  }}
                                  className="flex flex-col items-center text-gray-500 hover:text-blue-500"
                                  title="Duplicar"
                                >
                                  <Copy size={22} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAccionesModal(true);
                                  }}
                                  className="flex flex-col items-center text-gray-500 hover:text-blue-600"
                                  title="Agregar acción"
                                >
                                  <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" stroke="#6B7280" strokeWidth="2"/><path d="M12 8v8M8 12h8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/></svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {/* Mostrar ícono de cierre si la última acción es 'Despedida' */}
                  {droppedActions.length > 0 && droppedActions[droppedActions.length - 1].category === "despedida" && (
                    <div className="flex flex-col items-center">
                      <div className="w-0.5 h-8 bg-blue-400" />
                      <div className="flex items-center justify-center">
                        <span className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center">
                          {/* Ícono de despedida */}
                          <svg width="32" height="32" fill="none"><circle cx="16" cy="16" r="16" fill="#B1B5C9"/><path d="M16 10v8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="16" cy="22" r="2" fill="#fff"/></svg>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="border-t border-gray-200 p-4 flex items-center bg-white">
            <div
              className="flex gap-3 items-center px-4 py-2 rounded-2xl shadow-lg bg-white border border-gray-100"
              style={{
                boxShadow: "0 4px 24px 0 rgba(60, 80, 180, 0.10)",
                transition: "box-shadow 0.2s",
                minWidth: "220px",
                justifyContent: "center",
              }}
            >
              <div className="relative group">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-blue-200 text-blue-400 hover:bg-blue-50 hover:text-blue-600 shadow transition-all duration-150"
                  aria-label="Anterior"
                  style={{ fontSize: "1.3rem", fontWeight: 600 }}
                  onClick={
                    droppedActions.length === 0
                      ? () => setCenterBoxX((prev) => prev - 40)
                      : () =>
                          setDroppedActions((prev) =>
                            prev.map((action) => ({
                              ...action,
                              x: action.x - 40,
                            }))
                          )
                  }
                >
                  {"<"}
                </button>
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-12 px-3 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-10"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Mover a la izquierda
                </span>
              </div>
              <div className="relative group">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-blue-200 text-blue-400 hover:bg-blue-50 hover:text-blue-600 shadow transition-all duration-150"
                  aria-label="Siguiente"
                  style={{ fontSize: "1.3rem", fontWeight: 600 }}
                  onClick={
                    droppedActions.length === 0
                      ? () => setCenterBoxX((prev) => prev + 40)
                      : () =>
                          setDroppedActions((prev) =>
                            prev.map((action) => ({
                              ...action,
                              x: action.x + 40,
                            }))
                          )
                  }
                >
                  {">"}
                </button>
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-12 px-3 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-10"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Mover a la derecha
                </span>
              </div>
              <div className="relative group">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-blue-200 text-blue-400 hover:bg-blue-50 hover:text-blue-600 shadow transition-all duration-150"
                  aria-label="Home"
                  onClick={() => {
                    setCenterBoxX(0.5 * window.innerWidth)
                    setCenterBoxY(0.5 * window.innerHeight)
                    setCanvasOffset({ x: 0, y: 0 })
                  }}
                >
                  <Home size={20} />
                </button>
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-12 px-3 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-10"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Centrar
                </span>
              </div>
              <div className="relative group">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-blue-200 text-blue-400 hover:bg-blue-50 hover:text-blue-600 shadow transition-all duration-150"
                  aria-label="Nodos"
                  onClick={handleCompactViewToggle}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="6" cy="18" r="2" />
                    <circle cx="12" cy="6" r="2" />
                    <circle cx="18" cy="18" r="2" />
                    <path d="M6 16V8a2 2 0 0 1 2-2h4" />
                    <path d="M18 16V8a2 2 0 0 0-2-2h-4" />
                  </svg>
                </button>
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-12 px-3 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-10"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Vista compacta
                </span>
              </div>
            </div>
            <div className="ml-auto flex items-center">
              <div
                className="flex items-center gap-2 px-5 py-2 rounded-2xl shadow-lg bg-white border border-gray-100"
                style={{
                  boxShadow: "0 4px 24px 0 rgba(60, 80, 180, 0.10)",
                  transition: "box-shadow 0.2s",
                  minWidth: "120px",
                  justifyContent: "center",
                }}
              >
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-blue-100 text-blue-500 border border-gray-200 shadow transition-all duration-150"
                  onClick={() => setZoom((z) => Math.max(minZoom, +(z - stepZoom).toFixed(2)))}
                  aria-label="Disminuir zoom"
                  style={{ fontSize: "1.3rem", fontWeight: 600 }}
                >
                  {"−"}
                </button>
                <span
                  className="font-semibold text-gray-700 text-base select-none"
                  style={{ minWidth: 40, textAlign: "center" }}
                >
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-blue-100 text-blue-500 border border-gray-200 shadow transition-all duration-150"
                  onClick={() => setZoom((z) => Math.min(maxZoom, +(z + stepZoom).toFixed(2)))}
                  aria-label="Aumentar zoom"
                  style={{ fontSize: "1.3rem", fontWeight: 600 }}
                >
                  {"+"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Derecho */}
        <div className="w-20 bg-white border-l border-gray-200 flex flex-col items-center py-6 gap-8">
          {sidebarIcons.map(({ id, icon: Icon, label, category }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={`p-3 rounded-lg transition-colors ${
                selectedCategory === category ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"
              }`}
              title={label}
            >
              <Icon size={24} />
            </button>
          ))}
        </div>

        {/* Right Panel */}
        {renderRightPanel()}

        {showAccionesModal && accionesModalPosition && (
          <div
            className="fixed z-50"
            style={{ left: accionesModalPosition.x + 8, top: accionesModalPosition.y + 8, cursor: 'move' }}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDraggingAccionesModal(true);
              setAccionesModalDragOffset({
                x: e.clientX - (accionesModalPosition?.x ?? 0),
                y: e.clientY - (accionesModalPosition?.y ?? 0),
              });
            }}
          >
            <ModalAccionesCanva
              show={showAccionesModal}
              onClose={() => setShowAccionesModal(false)}
              actions={accionesPanelActions}
              sectionIcons={accionesPanelSectionIcons}
              floating
              onSelectAction={(accion) => {
                const { x, y } = getNextVerticalPosition();

                if (accion.name === "Derivar a Whatsapp" || accion.category === "derivar-wsp") {
                  const wspAction = {
                    id: `${accion.id}-${Date.now()}`,
                    name: accion.name,
                    x,
                    y,
                    icon: accion.icon,
                    message: "",
                    category: accion.category,
                  };
                  const despedidaAction = {
                    id: `despedida-${Date.now()}`,
                    name: "Despedida",
                    x,
                    y: y + 120,
                    icon: <svg width="32" height="32" fill="none"><circle cx="16" cy="16" r="16" fill="#B1B5C9"/><path d="M16 10v8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="16" cy="22" r="2" fill="#fff"/></svg>,
                    category: "despedida",
                  };
                  setDroppedActions((prev) => [...prev, wspAction, despedidaAction]);
                  setShowAccionesModal(false);
                  return;
                }

                setDroppedActions((prev) => [
                  ...prev,
                  {
                    id: `${accion.id}-${Date.now()}`,
                    name: accion.name,
                    x,
                    y,
                    icon: accion.icon,
                    message: "",
                    category: accion.category,
                  },
                ]);
                setShowAccionesModal(false);
              }}
            />
          </div>
        )}

        {showHomePanel && (
          <FloatingPanel show={showHomePanel} onClose={() => setShowHomePanel(false)}>
            <div className="mb-6">
              {/* SVG igual a la foto */}
              <svg width="90" height="60" viewBox="0 0 140 100" fill="none">
                <ellipse cx="70" cy="50" rx="60" ry="40" fill="#F6F8FF" />
                <rect x="50" y="35" width="40" height="40" rx="8" fill="#fff" stroke="#CBD5E1" strokeWidth="2" />
                <rect x="62" y="47" width="16" height="16" rx="4" fill="#fff" stroke="#CBD5E1" strokeWidth="2" />
                <path d="M70 55h8M74 51v8" stroke="#CBD5E1" strokeWidth="2" />
                <circle cx="90" cy="75" r="8" fill="#fff" stroke="#CBD5E1" strokeWidth="2" />
                <path d="M86 75l2 2 4-4" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-center mb-2">
              {/* SVG igual a la foto */}
              <div className="font-bold text-gray-700 text-lg">No tienes nodos seleccionados</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-sm">
                Para ver las propiedades de un mensaje, debes hacer click en una caja de flujo.
              </div>
            </div>
          </FloatingPanel>
        )}

        {showDeleteModal.visible && (
          <div className="fixed inset-0 bg-[rgba(30,32,40,0.18)] flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative border border-red-100">
              <button
                className="absolute right-4 top-2 text-gray-400 text-2xl hover:text-red-400 transition-colors focus:outline-none"
                style={{ padding: 0, lineHeight: 1, minWidth: 32, minHeight: 32 }}
                onClick={() => setShowDeleteModal({ id: null, visible: false })}
                aria-label="Cerrar"
              >
                &times;
              </button>
              <div className="text-center text-xl text-gray-800 font-semibold mb-8 tracking-tight" style={{ lineHeight: 1.3 }}>¿Estás seguro(a) de eliminar este nodo?</div>
              <div className="flex justify-center">
                <button
                  className="px-8 py-2 rounded-lg bg-red-500 text-white font-bold text-base shadow hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-300"
                  style={{ minWidth: 140, boxShadow: '0 2px 12px 0 rgba(255,0,60,0.10)' }}
                  onClick={() => {
                    if (showDeleteModal.id) deleteNode(showDeleteModal.id);
                    setShowDeleteModal({ id: null, visible: false });
                  }}
                >
                  ELIMINAR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  )
}

export default CallsManagement