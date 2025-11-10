const IVRFlowModel = require('./ivr_flows.model');
const IVRNodeModel = require('./ivr_nodes.model');
const IVRCallModel = require('./ivr_calls.model');
const IVRConsolidationModel = require('./ivr_consolidations.model');

const IVRService = {
  async createFlow(flowData) {
    return await IVRFlowModel.create(flowData);
  },

  async getFlows(filters) {
    return await IVRFlowModel.findAll(filters);
  },

  async getFlowById(id) {
    return await IVRFlowModel.findById(id);
  },

  async getFlowWithNodes(id) {
    return await IVRFlowModel.findWithNodes(id);
  },

  async updateFlow(id, updates) {
    return await IVRFlowModel.update(id, updates);
  },

  async deleteFlow(id) {
    const nodes = await IVRNodeModel.findByFlowId(id);
    for (const node of nodes) {
      await IVRNodeModel.delete(node.id);
    }
    return await IVRFlowModel.delete(id);
  },

  async createNode(nodeData) {
    return await IVRNodeModel.create(nodeData);
  },

  async getNodesByFlowId(flowId) {
    return await IVRNodeModel.findByFlowId(flowId);
  },

  async getNodeById(id) {
    return await IVRNodeModel.findById(id);
  },

  async updateNode(id, updates) {
    return await IVRNodeModel.update(id, updates);
  },

  async deleteNode(id) {
    return await IVRNodeModel.delete(id);
  },

  async bulkUpdateNodes(nodes) {
    return await IVRNodeModel.bulkUpdate(nodes);
  },

  async createCall(callData) {
    return await IVRCallModel.create(callData);
  },

  async getCalls(filters) {
    return await IVRCallModel.findAll(filters);
  },

  async getCallById(id) {
    return await IVRCallModel.findById(id);
  },

  async getCallByCallSid(callSid) {
    return await IVRCallModel.findByCallSid(callSid);
  },

  async updateCall(id, updates) {
    return await IVRCallModel.update(id, updates);
  },

  async logCallInteraction(callId, interactionData) {
    return await IVRCallModel.logInteraction(callId, interactionData);
  },

  async getCallInteractions(callId) {
    return await IVRCallModel.getInteractions(callId);
  },

  async getCallStats(filters) {
    return await IVRCallModel.getStats(filters);
  },

  // Funciones de consolidación
  async createConsolidation(consolidationData) {
    return await IVRConsolidationModel.create(consolidationData);
  },

  async getConsolidationByCallId(callId) {
    return await IVRConsolidationModel.findByCallId(callId);
  },

  async updateConsolidation(callId, updates) {
    return await IVRConsolidationModel.update(callId, updates);
  },

  async getConsolidations(filters) {
    return await IVRConsolidationModel.findAll(filters);
  },

  async getConsolidationStats(filters) {
    return await IVRConsolidationModel.getConsolidationStats(filters);
  },

  async getCollectedDataByField(fieldName, filters) {
    return await IVRConsolidationModel.getCollectedDataByField(fieldName, filters);
  },

  async executeNode(nodeId, userInput = null, callContext = {}) {
    const node = await IVRNodeModel.findById(nodeId);
    if (!node) {
      throw new Error('Nodo no encontrado');
    }

    const config = typeof node.config === 'string' 
      ? JSON.parse(node.config) 
      : node.config;

    let response = {
      nodeId: node.id,
      nodeType: node.node_type,
      nodeName: node.node_name,
      actions: []
    };

    switch (node.node_type) {
      case 'menu_opciones':
        response.actions.push({
          action: 'gather',
          message: config.mensaje || 'Seleccione una opción',
          options: config.opciones || [],
          numDigits: config.numDigitos || 1,
          timeout: config.timeout || 5
        });
        break;

      case 'pregunta':
        response.actions.push({
          action: 'gather',
          message: config.pregunta || '',
          speech: config.usarVoz || false,
          timeout: config.timeout || 5
        });
        break;

      case 'texto':
        response.actions.push({
          action: 'say',
          message: config.mensaje || '',
          voice: config.voz || 'es-ES'
        });
        break;

      case 'despedida':
        response.actions.push({
          action: 'say',
          message: config.mensajeDespedida || 'Gracias por su llamada. Hasta pronto.',
          voice: config.voz || 'es-ES'
        });
        response.actions.push({
          action: 'hangup'
        });
        break;

      case 'derivar_agente':
        response.actions.push({
          action: 'dial',
          number: config.numeroAgente || '',
          timeout: config.timeout || 30
        });
        break;

      case 'derivar_wsp':
        response.actions.push({
          action: 'redirect',
          type: 'whatsapp',
          number: config.numeroWhatsapp || ''
        });
        break;

      case 'enviar_archivo':
        response.actions.push({
          action: 'play',
          url: config.archivoUrl || ''
        });
        break;

      case 'eval_condicion':
        const condition = config.condicion || {};
        const result = this.evaluateCondition(condition, userInput, callContext);
        response.nextNode = result ? config.nodeSiTrue : config.nodeSiFalse;
        break;

      case 'servicio':
        response.actions.push({
          action: 'webhook',
          url: config.servicioUrl || '',
          method: config.metodo || 'POST',
          data: config.datos || {}
        });
        break;

      default:
        response.actions.push({
          action: 'say',
          message: 'Nodo no configurado correctamente'
        });
    }

    if (!response.nextNode && userInput && node.connections) {
      const connections = typeof node.connections === 'string' 
        ? JSON.parse(node.connections) 
        : node.connections;
      
      response.nextNode = connections[userInput] || connections.default;
    }

    return response;
  },

  evaluateCondition(condition, userInput, callContext) {
    const { field, operator, value } = condition;
    const actualValue = callContext[field] || userInput;

    switch (operator) {
      case 'equals':
        return actualValue == value;
      case 'not_equals':
        return actualValue != value;
      case 'greater_than':
        return Number(actualValue) > Number(value);
      case 'less_than':
        return Number(actualValue) < Number(value);
      case 'contains':
        return String(actualValue).includes(value);
      default:
        return false;
    }
  },

  async getInitialNode(flowId) {
    const nodes = await IVRNodeModel.findByFlowId(flowId);
    const homeNode = nodes.find(n => n.node_type === 'home' || n.position === 0);
    return homeNode || nodes[0];
  }
};

module.exports = IVRService;
