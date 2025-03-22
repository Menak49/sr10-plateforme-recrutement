
INSERT INTO TypeOrganisation (Name) VALUES ('Entreprise'), ('Association'), ('Freelance');
INSERT INTO StatutPoste (Name) VALUES ('CDI'), ('CDD'), ('Stage'), ('Alternance');
INSERT INTO TypeMetier (Name) VALUES ('Informatique'), ('Marketing'), ('Finance');

INSERT INTO Utilisateur (Phone, LastName, FirstName, Status, Password, Email) VALUES
(123456789, 'Doe', 'John', 'Active', 'SecurePass123!', 'Doe@gmail.com'),
(987654321, 'Smith', 'Alice', 'Inactive', 'SuperSafePwd456!', 'Alice@gmail.com');

INSERT INTO Organisation (Siren, Name, Headquarters, Status, Type, Creator) VALUES
(111222333, 'Tech Corp', 'Paris', 'Valide', 'Entreprise', 123456789),
(444555666, 'Market Inc', 'Lyon', 'StandBy', 'Entreprise', NULL);

INSERT INTO Recruteur (User, Organization) VALUES
(123456789, 111222333);

INSERT INTO Candidat (User) VALUES
(987654321);

INSERT INTO FichePoste (Title, Supervisor, Location, WorkSchedule, MinSalary, MaxSalary, Description, Organisation, StatutPoste, Recruteur, Type) VALUES
('Développeur Web', 'CTO', 'Paris', 'Temps plein', 30000, 45000, 'Développement de sites web', 111222333, 'CDI', 123456789, 'Informatique');

INSERT INTO OffreEmploi (State, ExpiryDate, Details, Slots, FichePoste) VALUES
('Published', '2025-06-01', 'Offre de développement web pour startup', 2, 1);

INSERT INTO Candidature (Date, OffreEmploi, Candidat) VALUES
('2025-03-20', 1, 987654321);


INSERT INTO Utilisateur (Phone, LastName, FirstName, Status, Password, Email) VALUES
(112233445, 'Martin', 'Sophie', 'Active', 'Pass123!', 'Sophie@gmail.com'),
(556677889, 'Leroy', 'Thomas', 'Inactive', 'Secure456!', 'Thomas@gmail.com'),
(998877665, 'Dubois', 'Emma', 'Active', 'StrongPass789!', 'Emma@gmail.com'),
(223344556, 'Morel', 'Lucas', 'Active', 'UltraSafePwd!', 'Lucas@gmail.com');


INSERT INTO Organisation (Siren, Name, Headquarters, Status, Type, Creator) VALUES
(777888999, 'Data Solutions', 'Marseille', 'Valide', 'Entreprise', 112233445),
(666555444, 'GreenTech', 'Bordeaux', 'StandBy', 'Association', NULL),
(333222111, 'CyberSec', 'Lille', 'Valide', 'Freelance', 556677889);


INSERT INTO Recruteur (User, Organization) VALUES
(112233445, 777888999),
(556677889, 666555444),
(998877665, 333222111);


INSERT INTO Candidat (User) VALUES
(223344556),
(998877665);


INSERT INTO FichePoste (Title, Supervisor, Location, WorkSchedule, MinSalary, MaxSalary, Description, Organisation, StatutPoste, Recruteur, Type) VALUES
('Data Analyst', 'Lead Data Scientist', 'Marseille', 'Temps plein', 35000, 50000, 'Analyse de données et machine learning', 777888999, 'CDI', 112233445, 'Informatique'),
('Développeur Mobile', 'CTO', 'Bordeaux', 'Temps plein', 32000, 47000, 'Développement d’applications mobiles', 666555444, 'CDD', 556677889, 'Informatique'),
('Consultant Cybersécurité', 'Directeur Sécurité', 'Lille', 'Temps plein', 40000, 60000, 'Audit et conseil en cybersécurité', 333222111, 'CDI', 998877665, 'Informatique');


INSERT INTO OffreEmploi (State, ExpiryDate, Details, Slots, FichePoste) VALUES
('Published', '2025-07-15', 'Poste d’analyste de données pour entreprise en pleine expansion', 3, 2),
('NotPublished', '2025-08-20', 'Développement d’applications mobiles Android et iOS', 2, 3),
('Editing', '2025-09-10', 'Mission de conseil en cybersécurité pour clients internationaux', 1, 4);


INSERT INTO Candidature (Date, OffreEmploi, Candidat) VALUES
('2025-03-25', 1, 223344556),
('2025-03-26', 2, 998877665),
('2025-03-27', 3, 223344556);


INSERT INTO PieceDossier (Name, Chemin) VALUES
('CV Thomas', '/uploads/cv_thomas.pdf'),
('Lettre de motivation Thomas', '/uploads/lm_thomas.pdf'),
('CV Emma', '/uploads/cv_emma.pdf'),
('Lettre de motivation Emma', '/uploads/lm_emma.pdf');


INSERT INTO CandidaturePieceDossier (Candidature, PieceDossier) VALUES
(1, 1),
(1, 2),
(2, 3), 
(2, 4); 


INSERT INTO AdminBecomeQuery (Message, User) VALUES
('Je souhaite devenir administrateur pour modérer les offres.', 223344556),
('Je suis intéressé par la gestion de la plateforme.', 556677889);

INSERT INTO RecruteurBecomeQuery (Message, Candidat) VALUES
('Je souhaite recruter pour GreenTech.', 223344556),
('Je veux publier des offres pour CyberSec.', 998877665);
