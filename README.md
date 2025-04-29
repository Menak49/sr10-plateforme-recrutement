# Projet SR10 - TD03

## Technologies utilisées

On utilise : 
- ```HTML, CSS, JavaScript```
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

## Comment décomposer l'arborescence des routes ?

A partir du use case, on choisit de décomposer et d'organiser les routes par **type d'utilisateurs** et on ajoute une route **commune** :
- espace candidat: ```http://localhost:3000**/candidat/**Accueil```
- espace recruteur : ```http://localhost:3000**/recruteur/**accueil```
- routes communes : ```http://localhost:3000**/commun/**```
- espace admin : ```http://localhost:3000**/admin/**accueil```
Cette stratégie permet de sécuriser simplement l'accès aux routes ; en revanche il peut y avoir des redondances de code. On aurait aussi pu décomposer les routes par **entiés**.

Par défaut, l'utilisateur est considéré comme un candidat. Vous pouvez changer d'espaces grâce aux boutons en bas à droite des pages d'accueil.

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

## Comment filtrer, rechercher et paginer les données ?

Le projet étant de taille réduite, on choisit de développer des scripts qui permettent de filtrer, rechercher et paginer **côté client** ; le serveur envoie toutes les données au client qui ne les affiche pas toutes. Dans le cadre d'un projet avec une grande quantité de données, on aurait pu filtrer les données **côté serveur**, avant l'envoie au client ; cette stratégie est plus optimale en therme de consommation énergétique.

