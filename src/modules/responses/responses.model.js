
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

			// Consultar el tipo de pregunta
			const qRes = await pool.query('SELECT question_type_id FROM questions WHERE id = $1', [question_id]);
			const tipo = qRes.rows[0]?.question_type_id;

			let texto = null, numerica = null, json = null;

			// Si el tipo es subir_archivo o multiple_imagen, guardar la URL correctamente
			if ([2, 4].includes(tipo)) { // subir_archivo, multiple_imagen
				// Si la respuesta viene como string, la guardamos como objeto { url: ... }
				if (typeof respuesta_json === 'string') {
					json = { url: respuesta_json };
				} else if (respuesta_json && respuesta_json.url) {
					json = respuesta_json;
				} else if (typeof respuesta_texto === 'string') {
					json = { url: respuesta_texto };
				} else {
					json = null;
				}
			} else if ([8, 9].includes(tipo)) { // respuesta_corta, texto_descriptivo
				texto = respuesta_texto ?? respuesta_numerica ?? (typeof respuesta_json === 'string' ? respuesta_json : null);
			} else if ([7].includes(tipo)) { // puntuacion
				numerica = respuesta_numerica ?? (typeof respuesta_texto === 'number' ? respuesta_texto : null);
			} else if ([3].includes(tipo)) { // multiple_choice
				json = respuesta_json ?? respuesta_texto ?? respuesta_numerica;
			} else {
				texto = respuesta_texto ?? respuesta_numerica ?? (typeof respuesta_json === 'string' ? respuesta_json : null);
			}

			await pool.query(
				`INSERT INTO question_responses (form_response_id, question_id, respuesta_texto, respuesta_numerica, respuesta_json)
				 VALUES ($1, $2, $3, $4, $5)`,
				[form_response_id, question_id, texto, numerica, json]
			);
		}
		return form_response_id;
	},


	async getResponsesByFormId(form_id) {
		// Consulta todas las respuestas de un formulario, agrupadas por envío (form_response)
		const query = `
			SELECT fr.id as form_response_id, fr.session_id, fr.fecha_inicio, fr.estado,
				   qr.id as question_response_id, qr.question_id, q.titulo AS pregunta, qt.nombre AS tipo_nombre,
				   qr.respuesta_texto, qr.respuesta_numerica, qr.respuesta_json
			FROM form_responses fr
			LEFT JOIN question_responses qr ON fr.id = qr.form_response_id
			LEFT JOIN questions q ON qr.question_id = q.id
			LEFT JOIN question_types qt ON q.question_type_id = qt.id
			WHERE fr.form_id = $1
			ORDER BY fr.fecha_inicio DESC, qr.question_id;
		`;
		const { rows } = await pool.query(query, [form_id]);

		// Agrupa por form_response_id
		const agrupado = {};
		for (const row of rows) {
			if (!row.form_response_id) continue;
			if (!agrupado[row.form_response_id]) {
				agrupado[row.form_response_id] = {
					form_response_id: row.form_response_id,
					session_id: row.session_id,
					fecha_inicio: row.fecha_inicio,
					estado: row.estado,
					respuestas: []
				};
			}
			if (row.question_id) {
				agrupado[row.form_response_id].respuestas.push({
					question_response_id: row.question_response_id,
					question_id: row.question_id,
					pregunta: row.pregunta,
					tipo: row.tipo_nombre, // Usar el nombre del tipo
					respuesta_texto: row.respuesta_texto,
					respuesta_numerica: row.respuesta_numerica,
					respuesta_json: row.respuesta_json
				});
			}
		}

		// Devuelve un array de envíos, cada uno con sus respuestas
		return Object.values(agrupado);
	},

	async getResponsesBySessionId(form_id, session_id) {
		const query = `
			SELECT qr.*, q.titulo AS pregunta, qt.nombre AS tipo_nombre
			FROM question_responses qr
			JOIN form_responses fr ON qr.form_response_id = fr.id
			JOIN questions q ON qr.question_id = q.id
			JOIN question_types qt ON q.question_type_id = qt.id
			WHERE fr.form_id = $1 AND fr.session_id = $2
			ORDER BY qr.question_id;
		`;
		const { rows } = await pool.query(query, [form_id, session_id]);
		// Procesar para que el campo tipo sea el nombre
		return rows.map(row => ({
			...row,
			tipo: row.tipo_nombre
		}));
	}
};

module.exports = ResponsesModel;

