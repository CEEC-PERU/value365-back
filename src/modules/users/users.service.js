const pool = require('../../config/db');

class UsersService {
    async findUserById(id) {
        try {
            const query = `
                SELECT 
                    id, 
                    email, 
                    role_id, 
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

    async findEmpresasByUserId(userId) {
        try {
            const query = `
                SELECT 
                    e.id,
                    e.nombre,
                    e.ruc,
                    e.dominio,
                    e.plan
                FROM empresas e
                JOIN user_empresas ue ON e.id = ue.empresa_id
                WHERE ue.user_id = $1
                ORDER BY e.nombre ASC;
            `;
            const result = await pool.query(query, [userId]);
            return result.rows;
        } catch (error) {
            console.error("Error en findEmpresasByUserId:", error);
            throw error;
        }
    }
}

module.exports = new UsersService();
