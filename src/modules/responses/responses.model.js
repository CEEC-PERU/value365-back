
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
	},

	async getResponsesByFormId(form_id) {
		// Obtiene todas las respuestas de un formulario, agrupadas por sesión
		const formResponsesQuery = `
			SELECT fr.id as form_response_id, fr.session_id, fr.fecha_inicio, fr.estado,
				   qr.question_id, qr.respuesta_texto, qr.respuesta_numerica, qr.respuesta_json
			FROM form_responses fr
			LEFT JOIN question_responses qr ON fr.id = qr.form_response_id
			WHERE fr.form_id = $1
			ORDER BY fr.id, qr.question_id;
		`;
		const { rows } = await pool.query(formResponsesQuery, [form_id]);
		return rows;
	}
};

module.exports = ResponsesModel;

