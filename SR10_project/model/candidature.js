const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {

    getCandidaturesByUserId: async function(userId, searchTerm = '', limit = 10, offset = 0) {
        const query = `
          SELECT 
              c.Id AS candidature_id,
              DATE_FORMAT(c.Date, '%d/%m/%Y') AS date_candidature,
              f.Title AS titre,
              org.Name AS organisation,
              f.Location AS localisation,
              sp.Name AS contrat,
              GROUP_CONCAT(pd.Name, '::', pd.Chemin SEPARATOR '||') AS pieces
          FROM Candidature c
          JOIN OffreEmploi o ON c.OffreEmploi = o.Id
          JOIN FichePoste f ON o.FichePoste = f.Id
          JOIN Organisation org ON f.Organisation = org.Siren
          LEFT JOIN StatutPoste sp ON f.StatutPoste = sp.Name
          LEFT JOIN CandidaturePieceDossier cpd ON c.Id = cpd.Candidature
          LEFT JOIN PieceDossier pd ON cpd.PieceDossier = pd.Id
          WHERE c.Candidat = ?
            AND (f.Title LIKE ? OR org.Name LIKE ?)
          GROUP BY c.Id, f.Title, org.Name, f.Location, sp.Name, c.Date
          ORDER BY c.Date DESC
          LIMIT ? OFFSET ?
        `;
        try {
          const results = await db.query(query, [
            userId,
            `%${searchTerm}%`,
            `%${searchTerm}%`,
            limit,
            offset
          ]);
          return results;
        } catch (err) {
          console.error('Erreur lors de la récupération des candidatures (Modèle) :', err);
          throw err;
        }
      },
      

  searchAndPaginate: async function(searchTerm, limit, offset) {
    const query = `
      SELECT 
        o.Id, 
        fp.Title AS titre, 
        org.Name AS organisation,
        fp.Location AS localisation, 
        fp.StatutPoste AS contrat
      FROM OffreEmploi o
      JOIN FichePoste fp ON o.FichePoste = fp.Id
      JOIN Organisation org ON fp.Organisation = org.Siren
      WHERE fp.Title LIKE ? OR org.Name LIKE ?
      LIMIT ? OFFSET ?;
    `;
    try {
      const rows = await db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`, limit, offset]);
      const total = await module.exports.count(searchTerm);
      return { offres: rows, total };
    } catch (err) {
      console.error('Erreur lors de la recherche paginée (Modèle) :', err);
      throw err;
    }
  },

  count: async function(searchTerm) {
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM OffreEmploi o
      JOIN FichePoste fp ON o.FichePoste = fp.Id
      JOIN Organisation org ON fp.Organisation = org.Siren
      WHERE fp.Title LIKE ? OR org.Name LIKE ?;
    `;
    try {
      const [rows] = await db.query(countQuery, [`%${searchTerm}%`, `%${searchTerm}%`]);
      return rows[0].total;
    } catch (err) {
      console.error("Erreur lors de la récupération du total d'offres (Modèle) :", err);
      throw err;
    }
  },
  countCandidaturesByUserId: async function(userId, searchTerm) {
    const query = `
      SELECT COUNT(DISTINCT c.Id) AS total
      FROM Candidature c
      JOIN OffreEmploi o ON c.OffreEmploi = o.Id
      JOIN FichePoste f ON o.FichePoste = f.Id
      JOIN Organisation org ON f.Organisation = org.Siren
      WHERE c.Candidat = ?
        AND (f.Title LIKE ? OR org.Name LIKE ?)
    `;
    try {
      const [row] = await db.query(query, [
        userId,
        `%${searchTerm}%`,
        `%${searchTerm}%`
      ]);
      return row.total;
    } catch (err) {
      console.error("Erreur lors du comptage des candidatures :", err);
      throw err;
    }
  },
  deleteById: async function(candidatureId) {
  const query = `DELETE FROM Candidature WHERE Id = ?`;
  try {
    await db.query(query, [candidatureId]);
  } catch (err) {
    console.error('Erreur lors de la suppression de la candidature :', err);
    throw err;
  }
},

findById: async function(candidatureId) {
  const query = `
    SELECT 
      c.Id AS candidature_id,
      DATE_FORMAT(c.Date, '%Y-%m-%d') AS date_candidature,
      f.Title AS titre,
      org.Name AS organisation,
      f.Location AS localisation,
      sp.Name AS contrat,
      GROUP_CONCAT(pd.Name, '::', pd.Chemin SEPARATOR '||') AS pieces
    FROM Candidature c
    JOIN OffreEmploi o ON c.OffreEmploi = o.Id
    JOIN FichePoste f ON o.FichePoste = f.Id
    JOIN Organisation org ON f.Organisation = org.Siren
    LEFT JOIN StatutPoste sp ON f.StatutPoste = sp.Name
    LEFT JOIN CandidaturePieceDossier cpd ON c.Id = cpd.Candidature
    LEFT JOIN PieceDossier pd ON cpd.PieceDossier = pd.Id
    WHERE c.Id = ?
    GROUP BY c.Id, f.Title, org.Name, f.Location, sp.Name, c.Date
    LIMIT 1
  `;
  try {
    const rows = await db.query(query, [candidatureId]);
    return rows[0];
  } catch (err) {
    console.error('Erreur lors de la récupération de la candidature :', err);
    throw err;
  }
},

updateById: async function(candidatureId, data) {
  const { titre, localisation, contrat } = data;
  const query = `
    UPDATE Candidature c
    JOIN OffreEmploi o ON c.OffreEmploi = o.Id
    JOIN FichePoste f ON o.FichePoste = f.Id
    SET f.Title = ?, f.Location = ?, f.StatutPoste = ?
    WHERE c.Id = ?
  `;
  try {
    await db.query(query, [titre, localisation, contrat, candidatureId]);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la candidature :', err);
    throw err;
  }
}
};
