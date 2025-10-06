const pool = require('../../config/db');

const QuestionOptionsModel = {
    async bulkCreate(questionId, options, client = pool) {
        const baseColumns = ['question_id', 'texto_opcion', 'posicion_orden'];
        const columnsToInsert = [...baseColumns];
        const hasImages = options[0] && options[0].imagen_url;
        if (hasImages) {
            columnsToInsert.push('imagen_url');
        }
        const columnNames = columnsToInsert.join(', ');
        const numColumns = columnsToInsert.length;
        const values = [];
        const placeholders = options.map((option, index) => {
            const base = index * numColumns;
            const rowPlaceholders = [];
            values.push(questionId, option.texto_opcion, index + 1);
            rowPlaceholders.push(`$${base + 1}`, `$${base + 2}`, `$${base + 3}`);
            if (hasImages) {
                values.push(option.imagen_url);
                rowPlaceholders.push(`$${base + 4}`);
            }
            return `(${rowPlaceholders.join(', ')})`;
        }).join(', ');
        const query = `
            INSERT INTO question_options (${columnNames})
            VALUES ${placeholders}
            RETURNING *;
        `;
        const { rows } = await client.query(query, values);
        return rows;
    }
};

module.exports = QuestionOptionsModel;

