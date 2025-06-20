# Sécurité web

Après avoir identifié trois **vulnérabilités** de sécurité de notre application web et la manière dont des **attaques** pourraient les exploiter (menace), on propose des **solutions** pour protéger notre application contre ces menaces et on vérifie leur **efficacité** avec des tests.

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

### Prévention : prepared statements

Pour se prémunir des injecctions SQL, on utilise une des méthodes proposées par [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) : déclarer de requêtes SQL paramétrées. "**Prepared statements** ensure that an attacker cannot change the intent of a query, even if SQL commands are inserted by an attacker."

Ainsi, pour interragir avec la base de données, le **contrôleur** fait appelle à des requêtes paramétrées dans le **modèle**. Les requêtes du modèle **comparent** alors les types et si l'équivalence n'est pas trouvée, la requête échuoue. Du code malicieux ne sera donc pas éxécuté.

Prenons l'exemple du formulaire de LogIn: le contôleur appelle le modèle et lui fournit l'email et le mot de passe qui sont en réalité du code malveillant.
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

### Verification de la résistance à l’attaque

Supposons que la requête ne soit pas correctement préparamétrée, l'attaquant pourrait contourner l'authentification avec une injection SQL dans le champ Email avec la chaîne totologique `' OR 1=1--`. La requête pourrait alors renvoyer tous les mot de passe : 
```SQL
SELECT Password FROM Utilisateur WHERE Email = '' OR '1'='1'
```

On automatise un test qui injecte cette chaine malveillante dans le champs de saisie Email afin de verifier que notre requête est securisée.


## Sessions fixation

### Menaces CIA

Les [sessions fixation](https://owasp.org/www-community/attacks/Session_fixation) : 

### Prévention : middleware 

Pour se prémunir de cette attaque, on implémente un middleware qui protège les rôles
 dossier middleware deux fonctions: 
 - appelée qd on se connecter pour vérifier que bons authentifiants
 - appelée dans les routes au moment où on redirige de index.js vers candidat.js etc : intermédiaire qui vérifie qu'on a bien les accès 

https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html

### Vérification de la résistance à l'attaque

Cette solution est efficacice: l'attaquant ne pourra plus exploiter la vulnérabilité

*Vérification de la gestion des sessions et des droits d’accès. Mettre en place des tests pour s’assurer qu’un utilisateur authentifié mais non autorisé ne peut pas accéder à des routes réservées à l’administration. 
Exemple : un candidat connecté ne doit pas pouvoir accéder à /admin/panel.* 
```java
//configuration de la session
app.use(session({
  secret: 'une string complexe qui sera utilise pour signé',   
  resave: false,// ne pas forcer l'enregistrement
  cookie: { secure: false, httpOnly: true, maxAge: 1000*60*15 //durée de vie max de 15 min
   }, // true si HTTPS, false sinon
  name: 'sessionId', // nom du cookie de session
  saveUninitialized: true
}));
```


## Attaque par force brute

### Menaces CIA

La (brut force attaque)(https://owasp.org/www-community/attacks/Brute_force_attack) peut se manifester de différentes manières ; on se focalise ici sur l'attaque par force brute sur l'authentification. L'attaquant réalise une multitudes de requêtes au serveur avec des valeurs prédéterminées (comme l'attaque par dictionnaire) pour trouver le mot de passe d'un utilisateur et ainsi pouvoir se connecter sur son compte. Dans le cas de notre site, la connexion sur un **compte admministrateur** pourrait être particulièrement dommageable.

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