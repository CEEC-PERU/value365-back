const authService = require('./auth.service');
const transporter = require('../../config/mailer'); 
const jwt = require('jsonwebtoken'); 
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
    const { email, password, roleId, empresaIds } = req.body;

    if (!email || !password || !roleId) {
      return res.status(400).json({
        success: false,
        message: 'Email, contraseña y roleId son requeridos'
      });
    }

    const user = await authService.register(email, password, roleId, empresaIds);

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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'El correo electrónico es requerido.' });
    }

    const user = await authService.findUserByEmail(email);
    if (!user) {
      return res.status(200).json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación.' });
    }

    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_RESET_SECRET, 
      { expiresIn: '15m' }
    );

    const verificationLink = `http://localhost:4200/new-password/${resetToken}`;

   const emailHtml = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecimiento de Contraseña</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 0; min-height: 100vh;">
  
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
  
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); overflow: hidden; max-width: 100%;">
  
            <!-- Header con gradiente -->
            <tr>
              <td align="center" style="background: linear-gradient(90deg, #1e3c72 0%, #2a5298 50%, #dc143c 100%); padding: 40px 20px; position: relative;">
                <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 12px; padding: 20px; display: inline-block;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3); letter-spacing: -1px;">Value365</h1>
                  <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #ffffff, #ff6b6b); margin: 10px auto 0; border-radius: 2px;"></div>
                </div>
              </td>
            </tr>
  
            <!-- Contenido principal -->
            <tr>
              <td style="padding: 50px 40px; color: #2c3e50; line-height: 1.7; position: relative;">
                
                <!-- Icono decorativo -->
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; position: relative;">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 36px;">🔐</div>
                  </div>
                </div>
                
                <h2 style="color: #1e3c72; text-align: center; margin: 0 0 25px 0; font-size: 28px; font-weight: 600;">¡Hola!</h2>
                <p style="text-align: center; color: #7f8c8d; margin: 0 0 30px 0; font-size: 16px;">Solicitud para <strong style="color: #2c3e50;">${user.email}</strong></p>
                
                <div style="background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%); border-left: 4px solid #667eea; padding: 25px; border-radius: 8px; margin: 30px 0;">
                  <p style="margin: 0; font-size: 16px; color: #2c3e50;">
                    Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si has sido tú, haz clic en el botón de abajo para continuar con el proceso.
                  </p>
                </div>
                
                <!-- Botón principal mejorado -->
                <div style="text-align: center; margin: 40px 0;">
                  <a href="${verificationLink}" 
                     style="background: linear-gradient(135deg, #dc143c 0%, #ff6b6b 100%); 
                            color: #ffffff; 
                            padding: 18px 40px; 
                            text-decoration: none; 
                            border-radius: 50px; 
                            font-weight: 700; 
                            font-size: 16px;
                            display: inline-block; 
                            box-shadow: 0 8px 25px rgba(220, 20, 60, 0.3);
                            transition: all 0.3s ease;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            border: 2px solid transparent;">
                     🔑 Restablecer Contraseña
                  </a>
                </div>
                
                <!-- Información adicional -->
                <div style="background: linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%); border: 1px solid #ffcdd2; border-radius: 12px; padding: 20px; margin: 30px 0;">
                  <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <span style="color: #dc143c; font-size: 20px; margin-right: 10px;">⏰</span>
                    <strong style="color: #c62828; font-size: 16px;">Importante:</strong>
                  </div>
                  <p style="margin: 0; color: #d32f2f; font-size: 14px; line-height: 1.6;">
                    Este enlace es válido por <strong>15 minutos</strong> por motivos de seguridad.
                  </p>
                </div>
                
                <div style="border-top: 1px solid #e0e0e0; padding-top: 25px; margin-top: 30px;">
                  <p style="color: #7f8c8d; font-size: 14px; text-align: center; margin: 0;">
                    Si no has solicitado este cambio, puedes ignorar este correo de forma segura.<br>
                    Tu contraseña permanecerá sin modificaciones.
                  </p>
                </div>
              </td>
            </tr>
  
            <!-- Footer elegante -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 30px 20px; border-top: 1px solid #dee2e6;">
                <div style="border-top: 3px solid #667eea; width: 100px; margin: 0 auto 20px;"></div>
                <p style="margin: 0; font-size: 14px; color: #6c757d; font-weight: 500;">
                  &copy; ${new Date().getFullYear()} <strong style="color: #1e3c72;">Value365</strong>
                </p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #adb5bd;">
                  Todos los derechos reservados
                </p>
              </td>
            </tr>
  
          </table>
  
        </td>
      </tr>
    </table>
  
  </body>
  </html>
`;

    await transporter.sendMail({
      from: `"Value365" <${process.env.SENDGRID_FROM_EMAIL}>`,
      to: user.email,
      subject: '✔ Restablece tu contraseña de Value365',
      html: emailHtml
    });

    res.status(200).json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación.' });

  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  login,
  register,
  logout,
  forgotPassword
};