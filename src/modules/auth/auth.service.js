const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');

class AuthService {
  async login(email, password) {
    try {
      const query = `
        SELECT u.id, u.email, u.password, u.role_id, r.name as role_name
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.email = $1
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

      const token = jwt.sign(
        { 
          user_id: user.id,
          role_id: user.role_id,
          email: user.email,
          role: user.role_name
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          role_id: user.role_id,
          role: user.role_name
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async register(email, password, roleId = 2) { 
    try {

        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        throw new Error('El email ya está registrado');
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const query = `
        INSERT INTO users (email, password, role_id)
        VALUES ($1, $2, $3)
        RETURNING id, email, role_id, created_at
      `;
      const result = await pool.query(query, [email, hashedPassword, roleId]);
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
