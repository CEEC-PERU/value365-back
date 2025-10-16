const ResponsesModel = require('./responses.model');

const ResponsesService = {
	async saveResponse({ form_id, session_id, answers }) {
		return ResponsesModel.saveResponse({ form_id, session_id, answers });
	}
};

module.exports = ResponsesService;

