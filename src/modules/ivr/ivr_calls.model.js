const pool = require('../../config/db');

const IVRCallModel = {
  /**
   * Estados de llamadas
   */
  CALL_STATUS: {
    INITIATED: 'initiated',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    FAILED: 'failed',
    NO_ANSWER: 'no_answer',
    BUSY: 'busy'
  },

  /**
   * Crear registro de llamada
   */
  async create(callData) {
    const {
      flow_id,
      phone_number,
      call_sid,
      direction = 'inbound',
      status = 'initiated',
      campaign_id
    } = callData;

    const query = `
      INSERT INTO ivr_calls (flow_id, phone_number, call_sid, direction, status, campaign_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [flow_id, phone_number, call_sid, direction, status, campaign_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  /**
   * Obtener todas las llamadas
   */
  async findAll(filters = {}) {
    let query = 'SELECT * FROM ivr_calls WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (filters.flow_id) {
      query += ` AND flow_id = $${paramIndex}`;
      values.push(filters.flow_id);
      paramIndex++;
    }

    if (filters.campaign_id) {
      query += ` AND campaign_id = $${paramIndex}`;
      values.push(filters.campaign_id);
      paramIndex++;
    }

    if (filters.status) {
      query += ` AND status = $${paramIndex}`;
      values.push(filters.status);
      paramIndex++;
    }

    if (filters.phone_number) {
      query += ` AND phone_number = $${paramIndex}`;
      values.push(filters.phone_number);
      paramIndex++;
    }

    if (filters.date_from) {
      query += ` AND started_at >= $${paramIndex}`;
      values.push(filters.date_from);
      paramIndex++;
    }

    if (filters.date_to) {
      query += ` AND started_at <= $${paramIndex}`;
      values.push(filters.date_to);
      paramIndex++;
    }

    query += ' ORDER BY started_at DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramIndex}`;
      values.push(filters.limit);
      paramIndex++;
    }

    const result = await pool.query(query, values);
    return result.rows;
  },

  /**
   * Obtener llamada por ID
   */
  async findById(id) {
    const query = 'SELECT * FROM ivr_calls WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  /**
   * Obtener llamada por Call SID de Twilio
   */
  async findByCallSid(callSid) {
    const query = 'SELECT * FROM ivr_calls WHERE call_sid = $1';
    const result = await pool.query(query, [callSid]);
    return result.rows[0];
  },

  /**
   * Actualizar llamada
   */
  async update(id, updates) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        if (key === 'metadata') {
          fields.push(`${key} = $${paramIndex}`);
          values.push(JSON.stringify(updates[key]));
        } else {
          fields.push(`${key} = $${paramIndex}`);
          values.push(updates[key]);
        }
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return null;
    }

    values.push(id);

    const query = `
      UPDATE ivr_calls
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  /**
   * Registrar interacción en el flujo
   */
  async logInteraction(callId, interactionData) {
    const {
      node_id,
      node_type,
      user_input,
      system_response,
      timestamp = new Date()
    } = interactionData;

    const query = `
      INSERT INTO ivr_call_interactions 
      (call_id, node_id, node_type, user_input, system_response, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [call_id, node_id, node_type, user_input, system_response, timestamp];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  /**
   * Obtener todas las interacciones de una llamada
   */
  async getInteractions(callId) {
    const query = `
      SELECT * FROM ivr_call_interactions 
      WHERE call_id = $1 
      ORDER BY timestamp
    `;
    const result = await pool.query(query, [callId]);
    return result.rows;
  },

  /**
   * Obtener estadísticas de llamadas
   */
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
    const values = [];
    let paramIndex = 1;

    if (filters.flow_id) {
      query += ` AND flow_id = $${paramIndex}`;
      values.push(filters.flow_id);
      paramIndex++;
    }

    if (filters.campaign_id) {
      query += ` AND campaign_id = $${paramIndex}`;
      values.push(filters.campaign_id);
      paramIndex++;
    }

    if (filters.date_from) {
      query += ` AND started_at >= $${paramIndex}`;
      values.push(filters.date_from);
      paramIndex++;
    }

    if (filters.date_to) {
      query += ` AND started_at <= $${paramIndex}`;
      values.push(filters.date_to);
      paramIndex++;
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  }
};

module.exports = IVRCallModel;
