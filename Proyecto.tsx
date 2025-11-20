import * as React from "react";
import { ivrService } from "@/lib/services/endpoints/ivr/api";
import { Settings, Plus, Loader2 } from "lucide-react";
import VistaBotIVRGeneral from "../vista-general-bots/vista-botIVR-gnral";

const ProyectoPanel: React.FC = () => {
  const [showVistaBotIVR, setShowVistaBotIVR] = React.useState(false);
  const [editNombre, setEditNombre] = React.useState(false);
  const [nombre, setNombre] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  
  // Estados para flujos IVR
  const [flows, setFlows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showCreateFlow, setShowCreateFlow] = React.useState(false);
  const [newFlowName, setNewFlowName] = React.useState("");

  // Cargar flujos del backend
  const loadFlows = async () => {
    try {
      setLoading(true);
      const result = await ivrService.getFlows();
      setFlows(result.data || []);
    } catch (error) {
      console.error('Error loading flows:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo flujo
  const createNewFlow = async () => {
    if (!newFlowName.trim()) return;
    
    try {
      setLoading(true);
      const flowData = {
        name: newFlowName,
        description: descripcion || "Flujo IVR generado desde el panel",
        is_active: true
      };
      const result = await ivrService.createFlow(flowData);
      if (result.success) {
        await loadFlows(); // Recargar lista
        setNewFlowName("");
        setShowCreateFlow(false);
      }
    } catch (error) {
      console.error('Error creating flow:', error);
      alert('Error al crear el flujo');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!nombre || nombre.trim() === "") {
      setNombre("");
    }
    if (!descripcion || descripcion.trim() === "") {
      setDescripcion("");
    }
    // Cargar flujos al montar el componente
    loadFlows();
  }, []);

  if (showVistaBotIVR) return <VistaBotIVRGeneral />;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-0 flex flex-col gap-0 border border-gray-100">
      <div className="pt-0 pb-2 border-b border-gray-100">
        <div className="bg-blue-50 rounded-t-2xl px-8 py-5 flex items-center gap-2 w-full">
          <Settings size={24} className="text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 m-0">{nombre && nombre.trim() !== "" ? nombre : "Proyecto"}</h2>
        </div>
      </div>
      <form className="flex flex-col gap-6 p-8">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Nombre del Bot</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={nombre || "Bot IVR"}
              readOnly
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 transition cursor-default"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Descripción del Bot</label>
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-800 transition resize-none"
            rows={3}
            maxLength={1500}
            placeholder="Describe tu bot..."
          />
          <div className="text-xs text-gray-400 mt-1 text-right">{descripcion.length} / 1500</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Tipo de Bot</label>
          <input
            type="text"
            defaultValue="IVR"
            className="w-full px-4 py-2 rounded-xl border border-gray-100 bg-gray-100 text-gray-500"
            disabled
          />
        </div>
        <button
          type="button"
          className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition flex items-center justify-center gap-2"
          onClick={() => setShowCreateFlow(!showCreateFlow)}
        >
          <Plus size={20} />
          Crear Flujo IVR
        </button>
        
        {/* Modal para crear flujo */}
        {showCreateFlow && (
          <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
            <input
              type="text"
              placeholder="Nombre del flujo IVR..."
              value={newFlowName}
              onChange={(e) => setNewFlowName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-2">
              <button
                onClick={createNewFlow}
                disabled={loading || !newFlowName.trim()}
                className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Crear"}
              </button>
              <button
                onClick={() => setShowCreateFlow(false)}
                className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de flujos */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600 mb-2">Flujos IVR Existentes</label>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 size={24} className="animate-spin text-blue-500" />
            </div>
          ) : flows.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {flows.map((flow) => (
                <div key={flow.id} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                  <h4 className="font-medium text-gray-800">{flow.name}</h4>
                  <p className="text-sm text-gray-600">{flow.description}</p>
                  <span className={`text-xs px-2 py-1 rounded ${flow.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {flow.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No hay flujos creados</p>
          )}
        </div>

        <button
          type="button"
          className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition"
          onClick={() => setShowVistaBotIVR(true)}
        >
          Guardar
        </button>
      </form>
    </div>
  );
};

export default ProyectoPanel;
