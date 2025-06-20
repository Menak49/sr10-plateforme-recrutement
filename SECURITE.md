# Sécurité web

Après avoir identifié trois **vulnérabilités** de sécurité de notre application web et la manière dont des **attaques** pourraient les exploiter (menace), on propose des **solutions** pour protéger notre application contre ces menaces:
- attaque par force brute avec une **politique de blocage** d'adresse IP
- injections SQL avec des **requêtes préparamétrées** et un **hachage** des mots de passes dans la base de données
- détournement du contrôle d'accès avec les **sessions**

On s'appuie notamment sur les articles à propos des applications web de la communauté **OWASP (Open Worldwide Application Security Project)**.

## Injections SQL

### Menaces CIA

Les [injections SQL](https://owasp.org/www-community/attacks/SQL_Injection) sont un des types d'attaque par injection : des requêtes SQL malveillantes sont injectées via des formulaires afin d'affecter l'éxécution des commandes SQL prédéfinies. "SQL commands are injected into data-plane input in order to affect the execution of predefined SQL commands".

Si l'attaque par injection SQL réussit, l'attaquant peut alors utiliser à des fins malveillantes les **données** des utilisateurs: 
- AUTHENTIFICATION : usurper des identités des utilisateurs
- CONFIDENTIALITE : lire ou divulguer des données
- INTEGRITE (integrity): altérer les données existantes ou les détruire avec les requêtes SQL insert/update/delete (ex : annulation de candidatures ou encore modification des offres)
- ACCESSIBILITE (availability) : rendre les données inaccessibles à l'utilisateur, comme exécuter des opérations d'adminisatration sur la DB pour la shutdown

Cette attaque exploite une vulnérabilité dans la manière dont les requêtes SQL sont adréssées à la base de données. 

### Prévention : prepared statements et hachage des mots de passe

Pour se prémunir des injecctions SQL, on utilise une des méthodes proposées par [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) : déclarer de requêtes SQL paramétrées. "**Prepared statements** ensure that an attacker cannot change the intent of a query, even if SQL commands are inserted by an attacker."

Ainsi, pour interragir avec la base de données, le **contrôleur** fait appelle à des requêtes paramétrées dans le **modèle**. Les requêtes du modèle **comparent** alors les types et si l'équivalence n'est pas trouvée, la requête échoue. Du code malicieux ne sera donc pas éxécuté.

Prenons l'exemple du formulaire de LogIn: le contôleur appelle le modèle et lui fournit l'email et le mot de passe qui sont en réalité du code malveillant comme la chaîne totologique `' OR 1=1--`
```javascript
//CONTRÔLEUR
router.post('/LogIn', async (req, res) => {
  //...
  const isValid = await users.areValid(Email, password);
  //...
})
```

Le modèle envoie à la base de donnée la requête préparamétrée `query` qui essaye de matcher la variable `?` envoyée par le contrôleur avec un Email de la table UTILISATEUR : 

```javascript
areValid: async function (Email, password) {
  const query = 'SELECT Password FROM Utilisateur WHERE Email = ?';
  try {
      const results = await db.query(query, [Email]);
      if (results.length === 1) {
        const storedPassword = results[0].Password;
        
        // Essaye la comparaison directe (mot de passe en clair)
        if (storedPassword === password) {
          return true;
        }
        // Sinon, essaye avec bcrypt (mot de passe haché)
        const isValid = await bcrypt.compare(password, storedPassword);
        if (isValid) {
          return true;
        }
        // Sinon, retourne false
        return false;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Erreur MySQL : ', err);
      throw err;
  }
}
```

On **hache** les mots de passe dans la base de données. Ainsi, si l'attaquant arrivait à récupérer les mots de passes par une injection SQL, les mots de passes seraient hachés inexploitables.



## Attaque par force brute

### Menaces CIA

La [brut force attaque](https://owasp.org/www-community/attacks/Brute_force_attack) peut se manifester de différentes manières ; on se focalise ici sur l'attaque par force brute sur l'authentification. L'attaquant réalise une multitudes de requêtes au serveur avec des valeurs prédéterminées (comme l'attaque par dictionnaire) pour trouver le mot de passe d'un utilisateur et ainsi pouvoir se connecter sur son compte. Dans le cas de notre site, la connexion sur un **compte admministrateur** pourrait être particulièrement dommageable.

- AUTHENTIFICATION : usurper des identités d'un ou plusieurs utilisateurs
- CONFIDENTIALITE : lire ou divulguer des données des tous les utilisateurs
- ACCESSIBILITE (availability) : refuser les demandes des utilisateurs, supprimer des organisations ou des comptes utilisateurs

### Prévention : account lockout policy

On implémente une [politique de blocage de compte](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#account-lockout).

Le nombre de requêtes authorisé par adresse IP est limité sur une période donnée. Pour implémenter cette politique de sécurité, on utilise la librairie express-rate-limit, configurée dans `index.js` (le contrôleur commun pour l'athentification). On ajoute le paramètre `loginLimiter` à la requpete router.post :

```javascript
//brute force attack prevention
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: "Trop de tentatives de connexion, veuillez réessayer plus tard."
});

router.post('/LogIn', loginLimiter, async (req, res) => {})
```



## Détournement du contrôle d'accès

### Menaces CIA


[Broken access control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/) est une attaque qui consiste à détourner le contrôle d'accès pour accéder à une élevation de privilèges et réaliser des requêtes qui dépasse les persissions occtroyées à l'utilisateur. 


Dans notre cas, un compte utilisateur avec les permissions de candidat pourrait contourner le contrôle d'accès pour accéder aux privilèges du compte administrateur. L'attaquant n'usurpe pas d'identité, mais il peut utiliser à des fins malveillantes les **privilèges** du compte administrateur :
- CONFIDENTIALITE : lire ou divulguer des données des tous les utilisateurs
- ACCESSIBILITE (availability) : refuser les demandes des utilisateurs, supprimer des organisations ou des comptes utilisateurs

### Prévention : middleware 

Pour [se prémunir de cette attaque](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), on implémente un middleware `/middlewares/authentification.js` qui protège les rôles. Le middleware est appelé lors des redirections pour vérifier les accès dans `index.js`

 ```javascript
const { isAuthenticated, authorizeRole } = require('../middlewares/authentification');

router.use('/Accueil', isAuthenticated, WelcomePagerouter);
router.use('/candidat', isAuthenticated, candidatRouter);
router.use('/recruteur', isAuthenticated, authorizeRole('recruteur'), recruteurRouter);
router.use('/admin', isAuthenticated, authorizeRole('admin'), adminRouter);
```


### Vérification de la résistance à l'attaque

On vérifie de la gestion des sessions et des droits d’accès avec des tests automatisés de `route2.test.js`. Un utilisateur authentifié avec les seuls privilèges de candidat ne peut pas accéder à des routes réservées à l’administration ou aux recruteurs. On interdit également les accès sans session.

```javascript
const request = require("supertest");
const app = require("../app");

let agent;
beforeAll(async () => {
  agent = request.agent(app);
  await agent
    .post("/LogIn")
    .send({
      Email: "paul@mail.com", // un compte candidat
      password: "pwd"
    })
    .expect(302);
});

  test("Un candidat connecté ne peut pas accéder à /admin/Accueil", async () => {
    const response = await agent.get("/admin/Accueil");
    expect(response.statusCode).toBe(403);
  });

  test("Un candidat connecté ne peut pas accéder à /recruteur/Accueil", async () => {
    const response = await agent.get("/recruteur/Accueil");
    expect(response.statusCode).toBe(403);
  });

  test("GET /candidat/Accueil sans session doit être interdit", async () => {
  const response = await request(app).get("/candidat/Accueil");
  expect([401, 302, 403]).toContain(response.statusCode);
});
  ```
