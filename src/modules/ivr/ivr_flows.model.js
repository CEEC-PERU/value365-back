const pool = require('../../config/db');

const IVRFlowModel = {
  /**
   * Crear un nuevo flujo IVR
   */
  async create({ name, description, campaign_id, user_id, is_active = true }) {
    const query = `
      INSERT INTO ivr_flows (name, description, campaign_id, user_id, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [name, description, campaign_id, user_id, is_active];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  /**
   * Obtener todos los flujos IVR
   */
  async findAll(filters = {}) {
    let query = 'SELECT * FROM ivr_flows WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (filters.campaign_id) {
      query += ` AND campaign_id = $${paramIndex}`;
      values.push(filters.campaign_id);
      paramIndex++;
    }

    if (filters.user_id) {
      query += ` AND user_id = $${paramIndex}`;
      values.push(filters.user_id);
      paramIndex++;
    }

    if (filters.is_active !== undefined) {
      query += ` AND is_active = $${paramIndex}`;
      values.push(filters.is_active);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  },

  /**
   * Obtener un flujo por ID
   */
  async findById(id) {
    const query = 'SELECT * FROM ivr_flows WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  /**
   * Actualizar un flujo IVR
   */
  async update(id, updates) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(updates[key]);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return null;
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE ivr_flows
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  /**
   * Eliminar un flujo IVR
   */
  async delete(id) {
    const query = 'DELETE FROM ivr_flows WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  /**
   * Obtener el flujo con todos sus nodos
   */
  async findWithNodes(id) {
    const flowQuery = 'SELECT * FROM ivr_flows WHERE id = $1';
    const nodesQuery = 'SELECT * FROM ivr_nodes WHERE flow_id = $1 ORDER BY position';
    
    const [flowResult, nodesResult] = await Promise.all([
      pool.query(flowQuery, [id]),
      pool.query(nodesQuery, [id])
    ]);

    if (flowResult.rows.length === 0) {
      return null;
    }

    return {
      ...flowResult.rows[0],
      nodes: nodesResult.rows
    };
  }
};

module.exports = IVRFlowModel;
