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

const IVRNodeModel = {
  NODE_TYPES,

  async create({ flow_id, node_type, node_name, position_x = 0, position_y = 0, config = {}, connections = {} }) {
    const query = `
      INSERT INTO ivr_nodes (flow_id, node_type, node_name, position_x, position_y, config, connections)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [flow_id, node_type, node_name, position_x, position_y, JSON.stringify(config), JSON.stringify(connections)];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByFlowId(flowId) {
    const query = 'SELECT * FROM ivr_nodes WHERE flow_id = $1 ORDER BY position';
    const result = await pool.query(query, [flowId]);
    return result.rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM ivr_nodes WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async update(id, updates) {
    const allowedFields = ['node_name', 'position_x', 'position_y', 'config', 'connections'];
    const updateFields = [];
    const params = [];
    let paramCounter = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        if (key === 'config' || key === 'connections') {
          updateFields.push(`${key} = $${paramCounter++}`);
          params.push(JSON.stringify(value));
        } else {
          updateFields.push(`${key} = $${paramCounter++}`);
          params.push(value);
        }
      }
    }

    if (updateFields.length === 0) {
      return this.findById(id);
    }

    params.push(id);
    const query = `
      UPDATE ivr_nodes 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCounter}
      RETURNING *
    `;

    const result = await pool.query(query, params);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM ivr_nodes WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async bulkUpdate(nodes) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const updatedNodes = [];
      for (const node of nodes) {
        const { id, ...updates } = node;
        const result = await this.update(id, updates);
        updatedNodes.push(result);
      }

      await client.query('COMMIT');
      return updatedNodes;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async findHomeNode(flowId) {
    const query = 'SELECT * FROM ivr_nodes WHERE flow_id = $1 AND node_type = \'home\' LIMIT 1';
    const result = await pool.query(query, [flowId]);
    
    if (result.rows.length > 0) {
      return result.rows[0];
    }

    const fallbackQuery = 'SELECT * FROM ivr_nodes WHERE flow_id = $1 ORDER BY position LIMIT 1';
    const fallbackResult = await pool.query(fallbackQuery, [flowId]);
    return fallbackResult.rows[0];
  }
};

module.exports = IVRNodeModel;
