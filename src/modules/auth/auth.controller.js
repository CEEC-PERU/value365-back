const authService = require('./auth.service');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    const result = await authService.login(email, password);

  res.status(200).json({
      message: 'Login exitoso',
      token: result.token
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, role_id } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    const user = await authService.register(email, password, role_id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout exitoso, token eliminsdo.'
  });
};

module.exports = {
  login,
  register,
  logout
};