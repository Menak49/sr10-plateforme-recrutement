# Projet SR10 - TD03

## Pour faire fonctionner le serveur

Cloner le dépôt
Ouvrir un terminal et taper: 
```bash
cd .\SR10\SR10_project\
npm start
```

Ouvrir un navigateur et taper : 
```http://localhost:3000/Accueil```

## Explication de l'arborescence des routes (controleur)

Il  a trois espaces utilisateurs différents : candidat, recruteur, admin. Par défaut, l'utilisateur est considéré comme un candidat. Vous pouvez changer d'espaces grâces aux boutons en bas à droite des pages d'accueil.
Les routes sont les suivantes:
- espace candidat: ```http://localhost:3000/Accueil```
- espace recruteur : ```http://localhost:3000/recruteur/accueil```
- espace admin : ```http://localhost:3000/admin/accueil```

Sur les trois espaces utilisateurs, des fonctionnalités différentes sont programmées. De manière générale, pour accéder aux différentes routes, vous pouvez naviguer grâce à la navbar.
- sous-routes espace candidat : 
	- Voir les offres : ```/candidat/parcourir```
	- Mes candidatures : ```/candidat/candidatures```
	- Privilèges : ```/candidat/privileges```
		- Devenir recruteur : ```/candidat/devenirRecruteur```
		- Créer une organisation : ```/candidat/creerOrganisation```
- sous-routes espace recruteur : 
	- gérer mes offres : ```/recruteur/GererOffres```
	- gérer mes fiches de poste : ```/recruteur/gererFicheDePoste```
- sous-routes espace admin : 
	- gestion des utilisateurs : ```/admin/gestionUtilisateurs```
	- gestion des organisations : ```/admin/organisations```
	- gestion des recruteurs : ```/admin/GestionDemandeRecruteur```
	- privilèges : ```/admin/Privileges```
		- Devenir recruteur : ```/admin/devenirRecruteur```
		- Créer une organisation : ```/adim/creerOrganisation```

