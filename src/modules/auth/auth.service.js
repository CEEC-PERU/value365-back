const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');

class AuthService {
  async login(email, password) {
    try {
      const query = `
        SELECT u.id, u.email, u.password, u.role_id, u.empresa_id, u.nombre, u.apellido, u.username, r.name as role_name, u.fecha_creacion
        FROM users u
        JOIN roles r ON u.role_id = r.id
        LEFT JOIN user_empresas ue ON u.id = ue.user_id
        WHERE u.email = $1
        GROUP BY u.id, r.name
        LIMIT 1; -- Limitar a una empresa si el usuario tiene múltiples
      `;
      const result = await pool.query(query, [email]);

      if (result.rows.length === 0) {
        throw new Error('Email o contraseña incorrectos');
      }

      const user = result.rows[0];

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Email o contraseña incorrectos');
      }

      const empresasQuery = `
        SELECT e.id, e.nombre, e.ruc, e.dominio, e.plan
        FROM empresas e
        JOIN user_empresas ue ON e.id = ue.empresa_id
        WHERE ue.user_id = $1
      `;
      const empresasResult = await pool.query(empresasQuery, [user.id]);
      const empresas = empresasResult.rows;

      const token = jwt.sign(
        {
          user_id: user.id,
          role_id: user.role_id,
          empresa_id: user.empresa_id,
          email: user.email,
          role: user.role_name,
          empresas
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return {
        token
      };
    } catch (error) {
      throw error;
    }
  }

  async register(email, password, roleId = 1) {
    try {
      const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        throw new Error('El email ya está registrado');
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
      const nombre = username;
      const defaultApellido = '';

      const query = `
        INSERT INTO users (
            email, 
            password, 
            role_id, 
            username, 
            nombre, 
            apellido
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, email, role_id, username, nombre, apellido, fecha_creacion
      `;
      const result = await pool.query(query, [email, hashedPassword, roleId, username, nombre, defaultApellido]);
      const newUser = result.rows[0];
      
      const token = jwt.sign(
        {
          user_id: newUser.id,
          role_id: newUser.role_id,
          email: newUser.email,
          role: 'user'
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return {
        token,
        user: newUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);

      if (result.rows.length > 0) {
        return result.rows[0]; 
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

}

module.exports = new AuthService();