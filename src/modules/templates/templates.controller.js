const templatesService = require('./templates.service');

const create = async (req, res) => {
  try {
    const templateData = req.body;
    const userId = req.user.user_id; 

    if (!templateData.nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del template es requerido'
      });
    }

    const template = await templatesService.create(templateData, userId);

    res.status(201).json({
      success: true,
      message: 'Template creado exitosamente',
      data: template
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getAll = async (req, res) => {
  try {
    const empresaId = req.query.empresa_id || 2;
    const templates = await templatesService.getAll(empresaId);

    res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await templatesService.getById(id);

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const templateData = req.body;
    const userId = req.user.user_id;

    const template = await templatesService.update(id, templateData, userId);

    res.status(200).json({
      success: true,
      message: 'Template actualizado exitosamente',
      data: template
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    await templatesService.delete(id, userId);

    res.status(200).json({
      success: true,
      message: 'Template eliminado exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const incrementarUso = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await templatesService.incrementarUso(id);

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteTemplate,
  incrementarUso
};