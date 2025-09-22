const usersService = require('./users.service');


const getProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;

       if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'No se encontró el ID de usuario en el token.'
      });
    }

    const user = await usersService.findUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener el perfil.',
      error: error.message
    });
  }
};

module.exports = {
  getProfile,
};