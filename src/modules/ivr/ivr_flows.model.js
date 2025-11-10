const pool = require('../../config/db');

const IVRFlowModel = {
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

  async findAll(filters = {}) {
    let query = 'SELECT * FROM ivr_flows WHERE 1=1';
    const params = [];
    let paramCounter = 1;

    if (filters.campaign_id) {
      query += ` AND campaign_id = $${paramCounter++}`;
      params.push(filters.campaign_id);
    }

    if (filters.user_id) {
      query += ` AND user_id = $${paramCounter++}`;
      params.push(filters.user_id);
    }

    if (filters.is_active !== undefined) {
      query += ` AND is_active = $${paramCounter++}`;
      params.push(filters.is_active);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM ivr_flows WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findWithNodes(id) {
    const flowQuery = 'SELECT * FROM ivr_flows WHERE id = $1';
    const nodesQuery = 'SELECT * FROM ivr_nodes WHERE flow_id = $1 ORDER BY position';

    const flowResult = await pool.query(flowQuery, [id]);
    const nodesResult = await pool.query(nodesQuery, [id]);

    if (flowResult.rows.length === 0) {
      return null;
    }

    return {
      ...flowResult.rows[0],
      nodes: nodesResult.rows
    };
  },

  async update(id, updates) {
    const allowedFields = ['name', 'description', 'campaign_id', 'is_active'];
    const updateFields = [];
    const params = [];
    let paramCounter = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = $${paramCounter++}`);
        params.push(value);
      }
    }

    if (updateFields.length === 0) {
      return this.findById(id);
    }

    params.push(id);
    const query = `
      UPDATE ivr_flows 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCounter}
      RETURNING *
    `;

    const result = await pool.query(query, params);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM ivr_flows WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = IVRFlowModel;
