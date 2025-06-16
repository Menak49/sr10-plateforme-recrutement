# Sécurité web

Après avoir identifié trois **vulnérabilités** de sécurité de notre application web et la manière dont des **attaques** peuvent les exploiter, on propose des **solutions** pour protéger notre application contre ces menaces et on vérifie leur **efficacité**.

On s'appuie notamment sur les articles sur les applications web de la communauté **OWASP (Open Worldwide Application Security Project)**.

## Sessions fixation

### Menace : vulnérabilité pouvant être exploitée par une attaque

### solution implémentée pour se prémunir de cette attaque 
Middleware pour protéger les rôles
 dossier middleware deux fonctions: 
 - appelée qd on se connecter pour vérifier que bons authentifiants
 - appelée dans les routes au moment où on redirige de index.js vers candidat.js etc : intermédiaire qui vérifie qu'on a bien les accès 

### efficacité de la solution : vérification avec des tests automatisés
Cette solution est efficacice: l'attaquant ne pourra plus exploiter la vulnérabilité

*Vérification de la gestion des sessions et des droits d’accès. Mettre en place des tests pour s’assurer qu’un utilisateur authentifié mais non autorisé ne peut pas accéder à des routes réservées à l’administration. 
Exemple : un candidat connecté ne doit pas pouvoir accéder à /admin/panel.* 



## Attaque par force brute

### Attaque: force brute

Selon [OWASP](https://owasp.org/www-community/attacks/Brute_force_attack), la brut force attaque peut se manifester de différentes manières ; l'attaque par force brute sur l'authentification en est une, elle peut aussi être utilisée pour découvrir des pages ou des contenus cachés.

### Prévention : account lockout policy

On implémente une [politique de blocage de compte](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#account-lockout).

Le nombre de requêtes authorisé par compte est limité. Pour implémenter cette politique de sécurité, on utilise la librairie express-session, configurée dans `app.js`.

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
### Vérification de la résistance à l'attaque

*Simulation d’une attaque par force brute. Tester le comportement de l’application face a  de multiples tentatives de connexion invalides. L’objectif est de ve rifier qu’un me canisme de limitation (compteur, de lai, blocage 
temporaire, etc.) est bien en place. 
Exemple : apre s 5 tentatives e choue es, la connexion doit e tre bloque e 
pendant un certain temps.*


## Attaque par injections SQL

### Attaque : injection SQL
Exploite une vulnérabilité pour [injecter du code SQL malveillant via des formulaires dans le but d'exécuter des requêtes incidieuses
injecte](https://owasp.org/www-community/attacks/SQL_Injection) donne des exemples.

### Prévention : prepared statements
Pour se prémunir des injecctions SQL, on utilise une des méthodes proposées par [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) : déclarer de requêtes SQL paramétrées. "**Prepared statements** ensure that an attacker cannot change the intent of a query, even if SQL commands are inserted by an attacker"

### Verification de la résistance à l’attaque
*On automatise des tests qui injectent des chaînes malveillantes dans les champs de saisie (comme ' OR 
1=1--) afin de verifier que les requetes sont securisees (parametrees, preparees, etc.). 
Exemple : une tentative d’injection dans le champ “nom d’utilisateur” ne doit pas contourner l’authentification.*
