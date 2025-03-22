
CREATE TABLE Utilisateur (
    Phone INT PRIMARY KEY,
    LastName VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255) NOT NULL,
    Status ENUM('Active', 'Inactive') NOT NULL,
    Password VARCHAR(255) NOT NULL
    Email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE TypeOrganisation (
    Name VARCHAR(255) PRIMARY KEY
);

CREATE TABLE StatutPoste (
    Name VARCHAR(255) PRIMARY KEY
);

CREATE TABLE TypeMetier (
    Name VARCHAR(255) PRIMARY KEY
);

CREATE TABLE PieceDossier (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Chemin VARCHAR(255) NOT NULL
);

CREATE TABLE Organisation (
    Siren INT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Headquarters VARCHAR(255) NOT NULL,
    Status ENUM('Valide', 'StandBy') NOT NULL,
    Type VARCHAR(255),
    Creator INT NULL,
    FOREIGN KEY (Type) REFERENCES TypeOrganisation(Name),
    FOREIGN KEY (Creator) REFERENCES Utilisateur(Phone)
);

CREATE TABLE Recruteur (
    User INT PRIMARY KEY,
    Organization INT,
    FOREIGN KEY (User) REFERENCES Utilisateur(Phone),
    FOREIGN KEY (Organization) REFERENCES Organisation(Siren)
);

CREATE TABLE Administrateur (
    User INT PRIMARY KEY,
    FOREIGN KEY (User) REFERENCES Utilisateur(Phone)
);

CREATE TABLE Candidat (
    User INT PRIMARY KEY,
    FOREIGN KEY (User) REFERENCES Utilisateur(Phone)
);

CREATE TABLE FichePoste (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Supervisor VARCHAR(255) NOT NULL,
    Location VARCHAR(255) UNIQUE NOT NULL,
    WorkSchedule VARCHAR(255) NOT NULL,
    MinSalary INT NOT NULL,
    MaxSalary INT NOT NULL,
    Description TEXT,
    Organisation INT,
    StatutPoste VARCHAR(255),
    Recruteur INT,
    Type VARCHAR(255),
    FOREIGN KEY (Organisation) REFERENCES Organisation(Siren),
    FOREIGN KEY (StatutPoste) REFERENCES StatutPoste(Name),
    FOREIGN KEY (Recruteur) REFERENCES Recruteur(User),
    FOREIGN KEY (Type) REFERENCES TypeMetier(Name)
);

CREATE TABLE OffreEmploi (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    State ENUM('NotPublished', 'Editing', 'Published', 'Expired') NOT NULL,
    ExpiryDate DATE NOT NULL,
    Details TEXT,
    Slots INT NOT NULL,
    FichePoste INT,
    FOREIGN KEY (FichePoste) REFERENCES FichePoste(Id)
);

CREATE TABLE Candidature (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Date DATE NOT NULL,
    OffreEmploi INT,
    Candidat INT,
    FOREIGN KEY (OffreEmploi) REFERENCES OffreEmploi(Id),
    FOREIGN KEY (Candidat) REFERENCES Candidat(User)
);

CREATE TABLE CandidaturePieceDossier (
    Candidature INT,
    PieceDossier INT,
    PRIMARY KEY (Candidature, PieceDossier),
    FOREIGN KEY (Candidature) REFERENCES Candidature(Id),
    FOREIGN KEY (PieceDossier) REFERENCES PieceDossier(Id)
);

CREATE TABLE OrganisationJoinQuery (
    User INT,
    Organisation INT,
    PRIMARY KEY (User, Organisation),
    FOREIGN KEY (User) REFERENCES Utilisateur(Phone),
    FOREIGN KEY (Organisation) REFERENCES Organisation(Siren)
);

CREATE TABLE AdminBecomeQuery (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Message VARCHAR(511) NOT NULL,
    User INT,
    FOREIGN KEY (User) REFERENCES Utilisateur(Phone)
);

CREATE TABLE RecruteurBecomeQuery (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Message VARCHAR(511) NOT NULL,
    Candidat INT,
    FOREIGN KEY (Candidat) REFERENCES Candidat(User)
);

