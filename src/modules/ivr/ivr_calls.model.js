const pool = require('../../config/db');

const CALL_STATUS = {
  INITIATED: 'initiated',
  RINGING: 'ringing',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  NO_ANSWER: 'no_answer',
  BUSY: 'busy'
};

const IVRCallModel = {
  CALL_STATUS,

  async create({ flow_id, campaign_id, phone_number, call_sid, direction = 'outbound', status = 'initiated' }) {
    const query = `
      INSERT INTO ivr_calls (flow_id, campaign_id, phone_number, call_sid, direction, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [flow_id, campaign_id, phone_number, call_sid, direction, status];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = 'SELECT * FROM ivr_calls WHERE 1=1';
    const params = [];
    let paramCounter = 1;

    if (filters.flow_id) {
      query += ` AND flow_id = $${paramCounter++}`;
      params.push(filters.flow_id);
    }

    if (filters.campaign_id) {
      query += ` AND campaign_id = $${paramCounter++}`;
      params.push(filters.campaign_id);
    }

    if (filters.status) {
      query += ` AND status = $${paramCounter++}`;
      params.push(filters.status);
    }

    if (filters.phone_number) {
      query += ` AND phone_number = $${paramCounter++}`;
      params.push(filters.phone_number);
    }

    if (filters.date_from) {
      query += ` AND started_at >= $${paramCounter++}`;
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      query += ` AND started_at <= $${paramCounter++}`;
      params.push(filters.date_to);
    }

    query += ' ORDER BY started_at DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramCounter++}`;
      params.push(filters.limit);
    }

    const result = await pool.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM ivr_calls WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findByCallSid(callSid) {
    const query = 'SELECT * FROM ivr_calls WHERE call_sid = $1';
    const result = await pool.query(query, [callSid]);
    return result.rows[0];
  },

  async update(id, updates) {
    const allowedFields = ['status', 'duration', 'ended_at', 'recording_url'];
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
      UPDATE ivr_calls 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCounter}
      RETURNING *
    `;

    const result = await pool.query(query, params);
    return result.rows[0];
  },

  async logInteraction(callId, { node_id, node_type, user_input, system_response }) {
    const query = `
      INSERT INTO ivr_call_interactions (call_id, node_id, node_type, user_input, system_response)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [callId, node_id, node_type, user_input, system_response];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getInteractions(callId) {
    const query = 'SELECT * FROM ivr_call_interactions WHERE call_id = $1 ORDER BY created_at ASC';
    const result = await pool.query(query, [callId]);
    return result.rows;
  },

  async getStats(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_calls,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_calls,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_calls,
        COUNT(CASE WHEN status = 'no_answer' THEN 1 END) as no_answer_calls,
        AVG(duration) as avg_duration,
        MAX(duration) as max_duration,
        MIN(duration) as min_duration
      FROM ivr_calls 
      WHERE 1=1
    `;

    const params = [];
    let paramCounter = 1;

    if (filters.flow_id) {
      query += ` AND flow_id = $${paramCounter++}`;
      params.push(filters.flow_id);
    }

    if (filters.campaign_id) {
      query += ` AND campaign_id = $${paramCounter++}`;
      params.push(filters.campaign_id);
    }

    if (filters.date_from) {
      query += ` AND started_at >= $${paramCounter++}`;
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      query += ` AND started_at <= $${paramCounter++}`;
      params.push(filters.date_to);
    }

    const result = await pool.query(query, params);
    return result.rows[0];
  }
};

module.exports = IVRCallModel;
