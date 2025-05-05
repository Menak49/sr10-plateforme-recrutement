const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {

    readAllFiltréPaginé: async function(searchTerm, limit, offset) {
        const searchCondition = searchTerm ? 
        `WHERE u.LastName LIKE ? OR u.FirstName LIKE ? OR u.Email LIKE ? OR q.Message LIKE ?` : 
        '';
      
        const query = `
        SELECT
            q.Id,
            q.Message,
            u.Phone as UserId,
            u.LastName,
            u.FirstName,
            u.Email,
            u.Status as UserStatus,
            'Non disponible' as FormattedDate,
            CASE
            WHEN r.User IS NOT NULL THEN 'Validé'
            ELSE 'En attente'
            END as StatutDemande
        FROM RecruteurBecomeQuery q
        JOIN Utilisateur u ON q.Candidat = u.Phone
        LEFT JOIN Recruteur r ON u.Phone = r.User
        ${searchCondition}
        ORDER BY q.Id DESC
        LIMIT ? OFFSET ?
        `;
      
        const queryParams = searchTerm ? 
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, limit, offset] : 
        [limit, offset];

        try {
            const results = await db.query(query, queryParams);
            return results;
        }
        catch (err) {
            console.error('Erreur lors de la récupération des recruteurs(Modèle) :', err);
            throw err;
        }
    },

    count: async function(searchTerm) {
        const searchCondition = searchTerm ? 
        `WHERE u.LastName LIKE ? OR u.FirstName LIKE ? OR u.Email LIKE ? OR q.Message LIKE ?` : 
        '';

        const countQuery = `
        SELECT COUNT(*) as total
        FROM RecruteurBecomeQuery q
        JOIN Utilisateur u ON q.Candidat = u.Phone
        ${searchCondition}
        `;
    
        const countParams = searchTerm ? 
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`] : 
        [];

        try {
            const results = await db.query(countQuery, countParams);
            return results[0].total;
        } catch (err) {
            console.error('Erreur lors de la récupération du nombre total de recruteurs (Modèle) :', err);
            throw err;
        }
    }

}