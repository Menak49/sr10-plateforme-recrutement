# Projet SR10 - Readme

## Technologies utilisées

On utilise le stack technique suivant: 
- le serveur web ```Node.js```
- les langages de programmation ```HTML, CSS, JavaScript```
- le framework ```Bootstrap``` (CDN) pour ses styles CSS pré-définis
- le framework ```Express``` qui implémente l'architecture MVC (Modèle Vue Contrôleur)
- le moteur de visualisation ```EJS```
- le framework ```Jest``` pour implémenter les tests unitaires complété du module ```supertest```pour les tests d'intégration


## Pour faire fonctionner le serveur

Cloner le dépôt, copier `SR10_project/.env.example` en `SR10_project/.env` et le remplir (identifiants MySQL et `SESSION_SECRET`, une chaîne aléatoire qui signe les cookies de session), puis ouvrir un terminal et taper: 
```bash
cd sr10-plateforme-recrutement/SR10_project
npm install
npm start
```

Puis ouvrir un navigateur web et taper dans la barre de recherche : 
http://localhost:3000/LogIn.

Pour ne pas avoir d'erreur lors de la connexion, il faut se connecter au **VPN** de l'UTC pour avoir accès à la base de données.

Le compte utilisateur de **Luc Bernard** permet d'avoir accès à toutes les fonctionnalités du site, il a tous les privilèges:
- Adresse email : luc.bernard@mail.com
- Mot de passe : mdp123

**Doe John** n'a pas les privilèges admin, il a un compte candidat/recruteur:
- Adresse email : Doe@gmail.com
- Mot de passe : SecurePass123!

**Nina Robert** a les privilèges admin mais pas les privilèges recruteurs:
- Adresse email : nina.robert@mail.com
- Mot de passe : mdp123

Pour créer un **nouveau compte** utilisateur, taper dans votre navigateur : http://localhost:3000/SignUp. Par défaut, l'utilisateur n'a pas de privilèges, seulement un compte candidat. 

Vous pouvez changer d'espace utilisateur grâce aux boutons en bas à droite des pages d'accueil ou grâce aux routes suivantes:
- http://localhost:3000/candidat/Accueil
- http://localhost:3000/recruteur/accueil
- http://localhost:3000/admin/accueil

Des mesures de sécurité ont été mises en place pour que les routes admin et recruteur ne soient accessibles que si les privilèges ont été accordés. Un message d'erreur "Accès interdit" s'affichera sinon. Pour demander les accès, vous pouvez vous rendre dans l'onglet "privilèges" accessible  depuis tous les espaces. La demande sera alors envoyée aux administrateurs dans l'attente de leur validation.

## Organisation du dépôt Git

Le dépôt git est organisé selon l'arborescence suivante:
- le package `json` gère les dépendances
- le dossier `/conception` contient le **diagramme des cas d'utilisation** (UseCaseDiagram), le **diagramme de classes** (UML) et le **modèle logique de données** (MLD). La **carte du site web** est accessible sur le figma suivant : [Conception des routes, de l'interface et des fonctionnalités](https://www.figma.com/design/l7j4jq5fwSGC3Mfd4yWi7d/SR10-Maquette?node-id=0-1&t=OZ16zT2FTczzaGUG-1)
- le dossier `/Db` contient les **requêtes SQL** qui ont été exécutées pour créer les tables SQL et insérer les jeux de données dans notre base de données
- le dossier `/SR10_project` contient notre application et est structuré selon l'architecture **MVC (Modèle Vue Contrôleur)**. En voici le diagramme de séquence :

![alt text](MVC_diag_sequence.png)

Pour implémenter l'architecture MVC, on utilise un framework de node.js : le **framework express**. Le projet express généré contient déjà la partie Vue `/views` et la partie Contrôleur `/routes` de l'architecture MVC. On a crée un dossier pour la partie Modèle `/model`. La création de routes permet de connecter les trois parties de l'architecture.

### Contrôleur
Le **contrôleur** contient les scripts JS qui traitent les requêtes http. Décomposer le contrôleur en plusieurs scripts rend le code plus lisible et strucuré. On organise les routes par **type d'utilisateurs** :
- `index.js` prend en charge les requêtes de *création de compte et de connexion*, il redirige ensuite vers la route qui gère l'espace candidat.
- `candidat.js` contient toutes les **sous-routes** relatives à l'espace candidat : *Voir les offres, Mes candidatures, Privilèges*
- `admin.js` contient toutes les **sous-routes** relatives à l'admin : *Gestion des utilisateurs, Gestion des demandes, Gestion des organisations, Privilèges*
- `recruteur.js` contient toutes les **sous-routes** relatives à l'espace recruteur : *Gérer mes offres, Gérer mes fiches de poste, Privilèges*

Cette stratégie permet de sécuriser simplement l'accès aux routes avec les sessions.


### Modèle

Le dossier `/model` représente la partie modèle de l'architecture MVC. Il contient : 
- `db.js` qui implémente la connexion à la base de donnée MySQL, configurée via les variables d'environnement `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (voir `.env.example` à copier en `.env` avec vos identifiants)
- pour chaque table utile de notre base de données, un fichier qui contient les opérations de **persistance CRUD** (create, read, update, delete) et d'autres plus spécifiques

### Vue

Le dossier `/views` contient les vues .ejs ; les **rendus dynamiques** permmettent de mettre en forme (render) les données récupérées. L'arborescence du dossier se structure par type d'utilisateurs, par templates communs et par utilitaires.

## Quelques fonctionnalités expliquées


### Tests

On utilise le framework de tests automatisés pour JavaScript `Jest`.
Pour contrôler la **couverture de code**, c'est-à-dire le poucentage de métriques couvertes par les tests dans le projet, ouvrir un terminal et tapez : 
```bash
cd .\SR10\SR10_project\
npm run test
```

Les **tests unitaires** permettent de tester chaque fonctions indépendamment des autres. Ainsi, on donne une entrée à cette fonction et on vérifie que la sortie est celle attendue grâce à l'assertion `expect()`. Dans `/test/utilisateur.test.js`, on se limite aux tests unitaires permettant de vérifier le bon fonctionnement de nos requêtes SQL sur la table `utilisateur`, en particulier la persistance des données assurée par les fonctions CRUD.

Les **tests d'intégration** permettent de tester les routes http et la bonne connexion entre les différentes parties de l'application MVC. Dans `/test/routes1.test.js` on vérifie notamment que le code *succès 200* est retourné: la requête est donc fonctionnelle. Dans `/test/routes2.test.js` on teste le bon fonctionnement du mécanisme de session, en particulier le *code erreur 403 (accès refusé)* devrait être renvoyé si un utilisateur essaye d'accéder à des routes pour lesquelles il n'a pas les privilèges.


### Formulaires

Pour **ajouter et modifier des données** dans notre base de données, on utilise des formulaires. On présente ici l'exemple du formulaire de **création de compte**.

D'abord, pour rendre le formulaire accessible à l'utilisateur, on crée une vue EJS avec des champs à remplir qu'on affiche avec une requête GET :

```javascript
//CONTROLEUR
router.get('/SignUp', function(req, res, next) {
  res.render('SignUp', { title: 'Accueil', text: 'Bienvenue' });
});
```

Une fois la vue affichée, l'utilisateur peut remplir les différents champs puis, grâce à un bouton, envoyer les valeurs remplies dans un objet `body` avec une requête POST. Le contrôleur récupère ces données et demande la création d'un nouvel utilisateur au modèle à partir de ces données.


```javascript
//CONTROLEUR
router.post('/SignUp', async (req, res) => {
    //récupération des valeurs de l'objet body de la requête req
    const { phone, lastname, firstname, email, password } = req.body;
    const status = 'Active'; //par défaut, on active le compte
    //appelle le modèle
    await users.create(phone, lastname, firstname, status, password, email);
    // Redirection vers la page de connexion
    res.redirect('/LogIn');
});
```

Le contrôleur fait une requête SQL à la base de données pour insérer dans les champs de la table Utilisateur les valeurs transmises par le contrôleur:

```javascript
//MODELE
create: async function (phone, lastName, firstName, status, password, email) {
    const query = 'INSERT INTO Utilisateur (Phone, LastName, FirstName, Status, Password, Email) VALUES (?, ?, ?, ?, ?, ?)';
    const result = await db.query(query, [phone, lastName, firstName, status, password, email]);
    return result
  },
  ```

On affiche ensuite un popup pour avertir l'utilisateur que son compte a bien été créé.

#### Vérification du bon fonctionnement


On ajoute une ligne ```console.log("req.body", req.body);``` dans le contrôleur pour vérifier qu'on récupère bien les valeurs rentrées par l'utilisateur. Ici, on voit d'abord l'affichage de la vue avec GET, puis la récupération de l'objet body par le controleur dans la requête POST, puis la redirection vers la page /LogIn avec GET.

```bash
GET /SignUp 304 12.952 ms - -
req.body [Object: null prototype] {
  phone: '668',
  lastname: 'Jean',
  firstname: 'Cholet',
  email: 'jean@gmail.com',
  password: 'MDP8--_'
}
POST /SignUp 302 239.308 ms - 56
GET /LogIn 304 8.249 ms - -
```



## Améliorations possibles
- filtrer et rechercher les données côté client
- imposer à l'utilisateur de choisir un mot de passe conforme aux recommandations de la CNIL
- imposer à l'utilisateur d'upload au moins une pièce jointe par candidature


