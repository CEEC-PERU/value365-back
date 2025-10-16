const pool = require('../../config/db');

const ResponsesModel = {
	async saveResponse({ form_id, session_id, answers }) {
		const formResponseQuery = `
			INSERT INTO form_responses (form_id, session_id, fecha_inicio, estado)
			VALUES ($1, $2, NOW(), 'en_progreso')
			RETURNING id;
		`;
		const { rows } = await pool.query(formResponseQuery, [form_id, session_id]);
		const form_response_id = rows[0].id;

		for (const answer of answers) {
			const { question_id, respuesta_texto, respuesta_numerica, respuesta_json } = answer;
			await pool.query(
				`INSERT INTO question_responses (form_response_id, question_id, respuesta_texto, respuesta_numerica, respuesta_json)
				 VALUES ($1, $2, $3, $4, $5)`,
				[form_response_id, question_id, respuesta_texto || null, respuesta_numerica || null, respuesta_json || null]
			);
		}
		return form_response_id;
	}
};

module.exports = ResponsesModel;

