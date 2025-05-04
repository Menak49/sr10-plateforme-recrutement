# Projet SR10 - TD03

## Technologies utilisées

On utilise : 
- ```HTML, CSS, JavaScript```
- le framework ```Express``` qui implémente l'architecture MVC (Modèle Vue Contrôleur)
- le serveur web ```Node.js```
- le framework ```Jest``` pour implémenter les tests unitaires complété du module ```supertest```pour les tests d'intégration


## Pour faire fonctionner le serveur

Cloner le dépôt puis ouvrir un terminal et taper: 
```bash
cd .\SR10\SR10_project\
npm start
```
Se connecter au VPN de l'utc pour avoir accès à la base de données puis ouvrir un navigateur et taper : 
```http://localhost:3000/Accueil```

Par défaut, l'utilisateur est considéré comme un candidat. Vous pouvez changer d'espaces grâce aux boutons en bas à droite des pages d'accueil. Sur les trois espaces utilisateurs, des fonctionnalités différentes sont programmées ; pour accéder aux différentes routes, vous pouvez naviguer grâce à la navbar ou cliquer sur les différents boutons.

## Conception (TD1)

Lien vers le figma : [Conception des routes, de l'interface et des fonctionnalités](https://www.figma.com/design/l7j4jq5fwSGC3Mfd4yWi7d/SR10-Maquette?node-id=0-1&t=OZ16zT2FTczzaGUG-1)

## Contrôleur (TD3 - partie 3)

Le dossier `routes` représente la partie contrôleur de l'architecture MVC. Il contient les fichiers qui implémentent une arborescences de routes/sous-routes :

`index.js` permet de décomposer et d'organiser les routes par **type d'utilisateurs** et on ajoute une route **commune**:
- espace candidat: ```http://localhost:3000/candidat/Accueil```
- espace recruteur : ```http://localhost:3000/recruteur/accueil```
- espace admin : ```http://localhost:3000/admin/accueil```
- routes communes : ```http://localhost:3000/commun/```

Cette stratégie permet de sécuriser simplement l'accès aux routes ; en revanche il peut y avoir des redondances de code. On aurait aussi pu décomposer les routes par **entiés**.

`admin.js` contient toutes les **sous-routes** relatives à l'admin
- Gestion des utilisateurs : ```/admin/gestionUtilisateurs```
- Gestion des organisations : ```/admin/organisations```
- Gestion des recruteurs : ```/admin/GestionDemandeRecruteur```
- Privilèges : ```/admin/Privileges```
	- Devenir recruteur : ```/admin/devenirRecruteur```
	- Créer une organisation : ```/adim/creerOrganisation```

`candidat.js` contient toutes les **sous-routes** relatives à l'espace candidat
- Voir les offres : ```/candidat/parcourir```
- Mes candidatures : ```/candidat/candidatures```
- Privilèges : ```/candidat/privileges```
	- Devenir recruteur : ```/candidat/devenirRecruteur```
	- Créer une organisation : ```/candidat/creerOrganisation```

`recruteur.js` contient toutes les **sous-routes** relatives à l'espace recruteur
- Gérer mes offres : ```/recruteur/GererOffres```
- Gérer mes fiches de poste : ```/recruteur/gererFicheDePoste```




## Comment filtrer, rechercher et paginer les données ?

Le projet étant de taille réduite, on choisit de développer des scripts qui permettent de filtrer, rechercher et paginer **côté client** ; le serveur envoie toutes les données au client qui ne les affiche pas toutes. Dans le cadre d'un projet avec une grande quantité de données, on aurait pu filtrer les données **côté serveur**, avant l'envoie au client ; cette stratégie est plus optimale en therme de consommation énergétique.


## Model (TD 3 - partie 2)

Le dossier `Modèle` représente la partie modèle de l'architecture MVC. Il contient : 
- `db.js` qui implémente la connexion à la base de donnée MySQL
- un fichier qui regroupe les opérations de persistance CRUD (create, read, update, delete) pour chaque table principale de notre base de données : Utilisateur, 

Si on prend par exemple la table utilisateur :

```SQL
CREATE TABLE Utilisateur (
    Phone INT PRIMARY KEY,
    LastName VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255) NOT NULL,
    Status ENUM('Active', 'Inactive') NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL
);
```


## Tests (TD qualité du code)

On utilise le framework de tests automatisés pour JavaScript `Jest`.
Pour contrôler la **couverture de code**, c'est-à-dire le poucentage de métriques couvertes par les tests dans le projet, ouvrez un terminal et tapez : 
```bash
cd .\SR10\SR10_project\
npm run test
```

### Tests unitaires : tester les fonctions CRUD

Les tests unitaires permettent de tester chaque fonctions indépendamment des autres. Ainsi, on donne une entrée à cette fonction et on vérifie que la sortie est celle attendue grâce à l'assertion `expect()`.

Le champ des possibles des fonctions à tester est énorme, on décide de se limiter aux tests unitaires permettant de vérifier la persistance des données. On vérifie ainsi le bon fonctionnement des fonctions CRUD :
- CREATE : test de création d'utilisateur (model.create)
- READ : test de lecture d'utilisateur (model.read)
- UPDATE : test de mise à jour d'utilisateur (model.update)
- DELETE : test de suppression d'utilisateur (model.delete)


D'autres tests
- vérification du bon fonctionnement de toutes les routes
- vérification du mot de passe choisi par l'utilisateur, il doit être conforme aux recommandations de la CNIL
- vérifier que toutes les candidatures contiennent une pièce jointe


### Tests d'intégration : tester des routes

Pour faire des tests complets de l'application, il faudrait le décliner sur tous les domaines du dossier route; on se concentre ici sur le domaine candidat. Les tests implémentés sont : 
- marche pas qd nn authent
- recup page qui existe pas => page qui existe pas





