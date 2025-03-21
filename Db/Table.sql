CREATE TABLE Utilisateur (
    LastName VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255) NOT NULL,
    Phone INT PRIMARY KEY NOT NULL,
    Status ENUM('Active', 'Inactive') NOT NULL,
    Password VARCHAR(255) NOT NULL
);

CREATE TABLE TypeOrganisation (
    Name VARCHAR(255) PRIMARY KEY NOT NULL
);

CREATE TABLE StatutPoste (
    Name VARCHAR(255) PRIMARY KEY NOT NULL
);

CREATE TABLE TypeMetier (
    Name VARCHAR(255) PRIMARY KEY NOT NULL
);

CREATE TABLE Organisation (
    Siren INT PRIMARY KEY NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Headquarters VARCHAR(255) NOT NULL,
    Type VARCHAR(255) NOT NULL,
    FOREIGN KEY (Type) REFERENCES TypeOrganisation(Name)
);

CREATE TABLE Recruteur (
    User INT PRIMARY KEY NOT NULL,
    Organization INT,
    FOREIGN KEY (User) REFERENCES Utilisateur(Phone),
    FOREIGN KEY (Organization) REFERENCES Organisation(Siren)
);

CREATE TABLE Administrateur (
    User INT PRIMARY KEY NOT NULL,
    FOREIGN KEY (User) REFERENCES Utilisateur(Phone)
);

CREATE TABLE Candidat (
    User INT PRIMARY KEY NOT NULL,
    FOREIGN KEY (User) REFERENCES Utilisateur(Phone)
);

CREATE TABLE FichePoste (
    Id INT PRIMARY KEY NOT NULL,
    Title VARCHAR(255) NOT NULL,
    Supervisor VARCHAR(255) NOT NULL,
    Location VARCHAR(255) UNIQUE NOT NULL,
    WorkSchedule VARCHAR(255) NOT NULL,
    MinSalary INT NOT NULL,
    MaxSalary INT NOT NULL,
    Description TEXT,
    Organisation INT NOT NULL,
    StatutPoste VARCHAR(255) NOT NULL,
    Recruteur INT NOT NULL,
    Type VARCHAR(255) NOT NULL,
    FOREIGN KEY (Organisation) REFERENCES Organisation(Siren),
    FOREIGN KEY (StatutPoste) REFERENCES StatutPoste(Name),
    FOREIGN KEY (Recruteur) REFERENCES Recruteur(User),
    FOREIGN KEY (Type) REFERENCES TypeMetier(Name)
);

CREATE TABLE OffreEmploi (
    Id INT PRIMARY KEY NOT NULL,
    State ENUM('NotPublished', 'Editing', 'Published', 'Expired') NOT NULL,
    ExpiryDate DATE NOT NULL,
    Details TEXT,
    Slots INT NOT NULL,
    FichePoste INT NOT NULL,
    FOREIGN KEY (FichePoste) REFERENCES FichePoste(Id)
);

CREATE TABLE Candidature (
    Id INT PRIMARY KEY NOT NULL,
    Date DATE NOT NULL,
    OffreEmploi INT NOT NULL,
    Candidat INT NOT NULL,
    FOREIGN KEY (OffreEmploi) REFERENCES OffreEmploi(Id),
    FOREIGN KEY (Candidat) REFERENCES Candidat(User)
);

CREATE TABLE PieceDossier (
    Id INT PRIMARY KEY NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Chemin VARCHAR(255) NOT NULL
);

CREATE TABLE CandidaturePieceDossier (
    Candidature INT NOT NULL,
    PieceDossier INT NOT NULL,
    PRIMARY KEY (Candidature, PieceDossier),
    FOREIGN KEY (Candidature) REFERENCES Candidature(Id),
    FOREIGN KEY (PieceDossier) REFERENCES PieceDossier(Id)
);

CREATE TABLE OrganisationJoinQuery (
    Recruteur INT,
    Candidat INT,
    Organisation INT NOT NULL,
    PRIMARY KEY (Recruteur, Candidat, Organisation),
    FOREIGN KEY (Recruteur) REFERENCES Recruteur(User),
    FOREIGN KEY (Candidat) REFERENCES Candidat(User),
    FOREIGN KEY (Organisation) REFERENCES Organisation(Siren)
);

CREATE TABLE AdminBecomeQuery (
    Id INT PRIMARY KEY NOT NULL,
    Message VARCHAR(511) NOT NULL,
    Recruteur INT,
    Candidat INT,
    FOREIGN KEY (Recruteur) REFERENCES Recruteur(User),
    FOREIGN KEY (Candidat) REFERENCES Candidat(User)
);

CREATE TABLE RecruteurBecomeQuery (
    Id INT PRIMARY KEY NOT NULL,
    Message VARCHAR(511) NOT NULL,
    Candidat INT NOT NULL,
    FOREIGN KEY (Candidat) REFERENCES Candidat(User)
);

CREATE TABLE AddOrganisationQuery (
    Id INT PRIMARY KEY NOT NULL,
    Siren INT NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Headquarters VARCHAR(255) NOT NULL,
    Recruteur INT NOT NULL,
    FOREIGN KEY (Recruteur) REFERENCES Recruteur(User)
);
