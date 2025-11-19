const pool = require('../../config/db');

const NODE_TYPES = {
  MENU_OPCIONES: 'menu_opciones',
  PREGUNTA: 'pregunta',
  TEXTO: 'texto',
  DESPEDIDA: 'despedida',
  DERIVAR_AGENTE: 'derivar_agente',
  DERIVAR_WSP: 'derivar_wsp',
  ENVIAR_ARCHIVO: 'enviar_archivo',
  EVAL_CONDICION: 'eval_condicion',
  SERVICIO: 'servicio'
};

const IVRNodesModel = {
  NODE_TYPES,

  async createNode(nodeData) {
    const { flow_id, name, type, acciones_llamadas } = nodeData;
    const query = `
      INSERT INTO ivr_nodes (flow_id, name, type, acciones_llamadas)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [flow_id, name, type, JSON.stringify(acciones_llamadas || {})];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async updateNode(nodeId, nodeData) {
    const fields = Object.keys(nodeData);
    const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const values = fields.map(field => {
      if (field === 'acciones_llamadas' && typeof nodeData[field] === 'object') {
        return JSON.stringify(nodeData[field]);
      }
      return nodeData[field];
    });

    const query = `
      UPDATE ivr_nodes
      SET ${setString}
      WHERE id = $${fields.length + 1}
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [...values, nodeId]);
    return rows[0];
  },

  async getNodeById(nodeId) {
    const query = 'SELECT * FROM ivr_nodes WHERE id = $1;';
    const { rows } = await pool.query(query, [nodeId]);
    return rows[0];
  },

  async getNodesByFlowId(flowId) {
    const query = 'SELECT * FROM ivr_nodes WHERE flow_id = $1;';
    const { rows } = await pool.query(query, [flowId]);
    return rows;
  }
};

module.exports = IVRNodesModel;
