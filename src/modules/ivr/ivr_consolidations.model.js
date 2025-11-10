const pool = require('../../config/db');

const IVRConsolidationModel = {
  async create({ call_id, collected_data, final_node_id, completion_status = 'completed' }) {
    const query = `
      INSERT INTO ivr_call_consolidations (call_id, collected_data, final_node_id, completion_status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [
      call_id, 
      JSON.stringify(collected_data), 
      final_node_id, 
      completion_status
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByCallId(callId) {
    const query = 'SELECT * FROM ivr_call_consolidations WHERE call_id = $1';
    const result = await pool.query(query, [callId]);
    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = 'SELECT * FROM ivr_call_consolidations WHERE 1=1';
    const params = [];
    let paramCounter = 1;

    if (filters.call_id) {
      query += ` AND call_id = $${paramCounter++}`;
      params.push(filters.call_id);
    }

    if (filters.completion_status) {
      query += ` AND completion_status = $${paramCounter++}`;
      params.push(filters.completion_status);
    }

    if (filters.date_from) {
      query += ` AND created_at >= $${paramCounter++}`;
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      query += ` AND created_at <= $${paramCounter++}`;
      params.push(filters.date_to);
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramCounter++}`;
      params.push(filters.limit);
    }

    const result = await pool.query(query, params);
    return result.rows;
  },

  async update(callId, updates) {
    const allowedFields = ['collected_data', 'final_node_id', 'completion_status'];
    const updateFields = [];
    const params = [];
    let paramCounter = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        if (key === 'collected_data') {
          updateFields.push(`${key} = $${paramCounter++}`);
          params.push(JSON.stringify(value));
        } else {
          updateFields.push(`${key} = $${paramCounter++}`);
          params.push(value);
        }
      }
    }

    if (updateFields.length === 0) {
      return this.findByCallId(callId);
    }

    params.push(callId);
    const query = `
      UPDATE ivr_call_consolidations 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE call_id = $${paramCounter}
      RETURNING *
    `;

    const result = await pool.query(query, params);
    return result.rows[0];
  },

  async delete(callId) {
    const query = 'DELETE FROM ivr_call_consolidations WHERE call_id = $1 RETURNING *';
    const result = await pool.query(query, [callId]);
    return result.rows[0];
  },

  async getConsolidationStats(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_consolidations,
        COUNT(CASE WHEN completion_status = 'completed' THEN 1 END) as completed_consolidations,
        COUNT(CASE WHEN completion_status = 'partial' THEN 1 END) as partial_consolidations,
        COUNT(CASE WHEN completion_status = 'abandoned' THEN 1 END) as abandoned_consolidations
      FROM ivr_call_consolidations 
      WHERE 1=1
    `;

    const params = [];
    let paramCounter = 1;

    if (filters.date_from) {
      query += ` AND created_at >= $${paramCounter++}`;
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      query += ` AND created_at <= $${paramCounter++}`;
      params.push(filters.date_to);
    }

    const result = await pool.query(query, params);
    return result.rows[0];
  },

  async getCollectedDataByField(fieldName, filters = {}) {
    let query = `
      SELECT 
        collected_data->>'${fieldName}' as field_value,
        COUNT(*) as count
      FROM ivr_call_consolidations 
      WHERE collected_data->>'${fieldName}' IS NOT NULL
    `;

    const params = [];
    let paramCounter = 1;

    if (filters.date_from) {
      query += ` AND created_at >= $${paramCounter++}`;
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      query += ` AND created_at <= $${paramCounter++}`;
      params.push(filters.date_to);
    }

    query += ' GROUP BY collected_data->>\'' + fieldName + '\' ORDER BY count DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }
};

module.exports = IVRConsolidationModel;