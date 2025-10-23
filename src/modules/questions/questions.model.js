const pool = require('../../config/db');

const QuestionModel = {
    async create(questionData, client = pool) {
        const {
            form_id,
            question_type_id,
            titulo,
            descripcion,
            es_obligatorio,
            posicion_orden,
            configuraciones,
            validaciones
        } = questionData;

        const configString = JSON.stringify(configuraciones || {});
        const valString = JSON.stringify(validaciones || {});

        const query = `
            INSERT INTO questions (
                form_id, question_type_id, titulo, descripcion,
                es_obligatorio, posicion_orden, configuraciones, validaciones
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [
            form_id, question_type_id, titulo, descripcion,
            es_obligatorio, posicion_orden, configString, valString
        ];
        const { rows } = await client.query(query, values);
        return rows[0];
    },

    async findByFormId(formId) {
        const query = `
            SELECT * FROM questions 
            WHERE form_id = $1 
            ORDER BY posicion_orden ASC;
        `;
        const { rows } = await pool.query(query, [formId]);
        return rows;
    },

    async countByFormId(formId, client = pool) {
        const query = 'SELECT COUNT(*) FROM questions WHERE form_id = $1;';
        const { rows } = await client.query(query, [formId]);
        return parseInt(rows[0].count, 10);
    },

    async findById(id) {
        const query = 'SELECT * FROM questions WHERE id = $1;';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    },

    async update(id, dataToUpdate) {
        const keys = Object.keys(dataToUpdate);
        const setString = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

        const query = `
            UPDATE questions
            SET ${setString}, fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = $${keys.length + 1}
            RETURNING *;
        `;
        
        const values = [...Object.values(dataToUpdate), id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    async delete(id) {
        const query = 'DELETE FROM questions WHERE id = $1 RETURNING *;';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
};

module.exports = QuestionModel;
