const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para acceder a este recurso'
        });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
};

const isAdmin = checkRole(['admin']);
const isUser = checkRole(['user', 'admin']);

module.exports = { checkRole, isAdmin, isUser };



