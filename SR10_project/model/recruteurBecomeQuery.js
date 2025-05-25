const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {

    readAllFiltrePagine: async function(searchTerm, limit, offset) {
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
    },
    deleteById: async function(id) {
    const query = `DELETE FROM RecruteurBecomeQuery WHERE Id = ?`;
    try {
        await db.query(query, [id]);
    } catch (err) {
        console.error('Erreur lors de la suppression de la demande (Modèle) :', err);
        throw err;
    }
},
accepterDemande: async function(demandeId) {
    try {
        // Récupérer le numéro du candidat à partir de la demande
        const rows = await db.query(
            'SELECT Candidat, Organisation FROM RecruteurBecomeQuery WHERE Id = ?', [demandeId]
        );
        if (!rows[0]) throw new Error('Demande non trouvée');
        const userId = rows[0].Candidat;
        const organisation = rows[0].Organisation;

        // Ajouter dans la table Recruteur
        await db.query('INSERT INTO Recruteur (User, Organization) VALUES (?, ?)', [userId, organisation]);
        await db.query('DELETE FROM RecruteurBecomeQuery WHERE Id = ?', [demandeId]);

    } catch (err) {
        console.error('Erreur lors de l\'acceptation de la demande (Modèle) :', err);
        throw err;
    }
},create: async function({ candidat, organisation, message }) {
    const query = `
        INSERT INTO RecruteurBecomeQuery (Candidat, Organisation, Message)
        VALUES (?, ?, ?)
    `;
    try {
        await db.query(query, [candidat, organisation, message]);
    } catch (err) {
        console.error('Erreur lors de la création de la demande (Modèle) :', err);
        throw err;
    }
},


}