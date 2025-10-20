const pool = require('../../config/db');

const GroupContactsModel = {
    async addContactToGroup(groupId, contactId) {
        const query = `
            INSERT INTO group_contacts (group_id, contact_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING;
        `;
        await pool.query(query, [groupId, contactId]);
    },

    async getContactsByGroup(groupId) {
        const query = `
            SELECT c.* FROM contacts c
            INNER JOIN group_contacts gc ON gc.contact_id = c.id
            WHERE gc.group_id = $1
            ORDER BY c.fecha_creacion DESC;
        `;
        const { rows } = await pool.query(query, [groupId]);
        return rows;
    },

    async removeContactsFromGroup(groupId, contactIds) {
        const query = `
            DELETE FROM group_contacts
            WHERE group_id = $1 AND contact_id = ANY($2::int[]);
        `;
        await pool.query(query, [groupId, contactIds]);
    }
};

module.exports = GroupContactsModel;
