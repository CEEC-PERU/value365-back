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

    async createUserWithEmpresas(userData, empresaIds) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const insertUserQuery = `
                INSERT INTO users (email, role_id, nombre, apellido, username, fecha_creacion)
                VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
                RETURNING id;
            `;
            const userResult = await client.query(insertUserQuery, [
                userData.email,
                userData.role_id,
                userData.nombre,
                userData.apellido,
                userData.username
            ]);

            const userId = userResult.rows[0].id;

            const insertEmpresasQuery = `
                INSERT INTO user_empresas (user_id, empresa_id)
                VALUES ($1, unnest($2::int[]));
            `;
            await client.query(insertEmpresasQuery, [userId, empresaIds]);

            await client.query('COMMIT');
            return userId;
        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Error en createUserWithEmpresas:", error);
            throw error;
        } finally {
            client.release();
        }
    }

    async assignEmpresasToUser(userId, empresaIds) {
        try {
            const query = `
                INSERT INTO user_empresas (user_id, empresa_id)
                VALUES ($1, unnest($2::int[]))
                ON CONFLICT DO NOTHING;
            `;
            await pool.query(query, [userId, empresaIds]);
        } catch (error) {
            console.error("Error en assignEmpresasToUser:", error);
            throw error;
        }
    }
}

module.exports = new UsersService();
