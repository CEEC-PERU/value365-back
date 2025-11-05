const pool = require('../../config/db');

const IVRNodeModel = {
  /**
   * Tipos de nodos disponibles
   */
  NODE_TYPES: {
    MENU: 'menu_opciones',
    PREGUNTA: 'pregunta',
    TEXTO: 'texto',
    DESPEDIDA: 'despedida',
    DERIVAR_AGENTE: 'derivar_agente',
    DERIVAR_WSP: 'derivar_wsp',
    ENVIAR_ARCHIVO: 'enviar_archivo',
    EVAL_CONDICION: 'eval_condicion',
    SERVICIO: 'servicio'
  },

  /**
   * Crear un nuevo nodo
   */
  async create(nodeData) {
    const {
      flow_id,
      node_type,
      node_name,
      position,
      config = {},
      connections = {}
    } = nodeData;

    const query = `
      INSERT INTO ivr_nodes (flow_id, node_type, node_name, position, config, connections)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      flow_id,
      node_type,
      node_name,
      position || 0,
      JSON.stringify(config),
      JSON.stringify(connections)
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  /**
   * Obtener todos los nodos de un flujo
   */
  async findByFlowId(flowId) {
    const query = 'SELECT * FROM ivr_nodes WHERE flow_id = $1 ORDER BY position';
    const result = await pool.query(query, [flowId]);
    return result.rows;
  },

  /**
   * Obtener un nodo por ID
   */
  async findById(id) {
    const query = 'SELECT * FROM ivr_nodes WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  /**
   * Actualizar un nodo
   */
  async update(id, updates) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        if (key === 'config' || key === 'connections') {
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

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE ivr_nodes
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  /**
   * Eliminar un nodo
   */
  async delete(id) {
    const query = 'DELETE FROM ivr_nodes WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  /**
   * Actualizar múltiples nodos (para reorganización)
   */
  async bulkUpdate(nodes) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const results = [];
      for (const node of nodes) {
        const { id, ...updates } = node;
        const fields = [];
        const values = [];
        let paramIndex = 1;

        Object.keys(updates).forEach(key => {
          if (updates[key] !== undefined) {
            if (key === 'config' || key === 'connections') {
              fields.push(`${key} = $${paramIndex}`);
              values.push(JSON.stringify(updates[key]));
            } else {
              fields.push(`${key} = $${paramIndex}`);
              values.push(updates[key]);
            }
            paramIndex++;
          }
        });

        if (fields.length > 0) {
          fields.push(`updated_at = NOW()`);
          values.push(id);

          const query = `
            UPDATE ivr_nodes
            SET ${fields.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
          `;

          const result = await client.query(query, values);
          results.push(result.rows[0]);
        }
      }

      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Obtener el nodo inicial (home) de un flujo
   */
  async findHomeNode(flowId) {
    const query = `
      SELECT * FROM ivr_nodes 
      WHERE flow_id = $1 AND node_type = 'home'
      LIMIT 1
    `;
    const result = await pool.query(query, [flowId]);
    return result.rows[0];
  }
};

module.exports = IVRNodeModel;
