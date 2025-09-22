const pool = require('../../config/db');

class UsersService {
  /**
   * @param {number} id 
   * @returns {Promise<object|null>} 
   */
  async findUserById(id) {
    try {
      const query = `
        SELECT 
          id, 
          email, 
          role_id, 
          empresa_id, 
          nombre, 
          apellido, 
          username, 
          fecha_creacion
        FROM users 
        WHERE id = $1
      `;
      const result = await pool.query(query, [id]);

      if (result.rows.length > 0) {
        return result.rows[0]; 
      }

      return null; 
    } catch (error) {
      console.error("Error en findUserById:", error);
      throw error;
    }
  }
}

module.exports = new UsersService();