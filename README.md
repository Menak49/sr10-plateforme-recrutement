# Projet SR10 - TD03

## Technologies utilisées

On utilise : 
- le framework ```Express``` qui implémente l'architecture MVC (Modèle Vue Contrôleur)
- le serveur web ```Node.js```


## Pour faire fonctionner le serveur

Cloner le dépôt puis ouvrir un terminal et taper: 
```bash
cd .\SR10\SR10_project\
npm start
```
Se connecter au VPN de l'utc pour avoir accès à la base de données puis ouvrir un navigateur et taper : 
```http://localhost:3000/Accueil```

## Explication de l'arborescence des routes (contrôleur)

Il  a trois espaces utilisateurs différents : **candidat, recruteur, admin**. Par défaut, l'utilisateur est considéré comme un candidat. Vous pouvez changer d'espaces grâce aux boutons en bas à droite des pages d'accueil.
Les routes sont les suivantes:
- espace candidat: ```http://localhost:3000/Accueil```
- espace recruteur : ```http://localhost:3000/recruteur/accueil```
- espace admin : ```http://localhost:3000/admin/accueil```

Sur les trois espaces utilisateurs, des fonctionnalités différentes sont programmées. De manière générale, pour accéder aux différentes routes, vous pouvez naviguer grâce à la navbar.
- **sous-routes espace candidat** : 
	- Voir les offres : ```/candidat/parcourir```
	- Mes candidatures : ```/candidat/candidatures```
	- Privilèges : ```/candidat/privileges```
		- Devenir recruteur : ```/candidat/devenirRecruteur```
		- Créer une organisation : ```/candidat/creerOrganisation```
- **sous-routes espace recruteur** : 
	- Gérer mes offres : ```/recruteur/GererOffres```
	- Gérer mes fiches de poste : ```/recruteur/gererFicheDePoste```
- **sous-routes espace admin** : 
	- Gestion des utilisateurs : ```/admin/gestionUtilisateurs```
	- Gestion des organisations : ```/admin/organisations```
	- Gestion des recruteurs : ```/admin/GestionDemandeRecruteur```
	- Privilèges : ```/admin/Privileges```
		- Devenir recruteur : ```/admin/devenirRecruteur```
		- Créer une organisation : ```/adim/creerOrganisation```

*Lien vers le figma : [Conception des routes](https://www.figma.com/design/l7j4jq5fwSGC3Mfd4yWi7d/SR10-Maquette?node-id=0-1&t=OZ16zT2FTczzaGUG-1)*

