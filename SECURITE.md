# Sécurité web

Après avoir identifié trois **vulnérabilités** de sécurité de notre application web et la manière dont des **attaques** peuvent les exploiter, on propose des **solutions** pour protéger notre application contre ces menaces et on vérifie leur **efficacité**.

On s'appuie notamment sur les articles sur les applications web de la communauté **OWASP (Open Worldwide Application Security Project)**.

## Sessions fixation

*Vérification de la gestion des sessions et des droits d’accès. Mettre en place des tests pour s’assurer qu’un utilisateur authentifié mais non autorisé ne peut pas accéder à des routes réservées à l’administration. 
Exemple : un candidat connecté ne doit pas pouvoir accéder à /admin/panel.* 

### Menace : vulnérabilité pouvant être exploitée par une attaque

### solution implémentée pour se prémunir de cette attaque 
les sessions

### efficacité de la solution : vérification avec des tests automatisés
Cette solution est efficacice: l'attaquant ne pourra plus exploiter la vulnérabilité



Middleware pour protéger les rôles
 dossier middleware deux fonctions: 
 - appelée qd on se connecter pour vérifier que bons authentifiants
 - appelée dans les routes au moment où on redirige de index.js vers candidat.js etc : intermédiaire qui vérifie qu'on a bien les accès 



## Attaque par force brute

*Simulation d’une attaque par force brute. Tester le comportement de l’application face a  de multiples tentatives de connexion invalides. L’objectif est de ve rifier qu’un me canisme de limitation (compteur, de lai, blocage 
temporaire, etc.) est bien en place. 
Exemple : apre s 5 tentatives e choue es, la connexion doit e tre bloque e 
pendant un certain temps.*

attaque par force brute : 
protection: limite le nombre de requêtes qu'il est possible de faire pendant un temps donné. On utilise la librairie express-session
l 37 à 45 dans app.js : configuration de la librairie

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



## Attaque par injections SQL

[SQL injections attack expliquées par Owasp](https://owasp.org/www-community/attacks/SQL_Injection)

vulnérabilité : injections sql, Code SQL malveillant 
injecte  via des formulaires. 

*Verification de la resistance a  l’injection SQL. Automatiser des tests qui injectent des chaînes malveillantes dans les champs de saisie (comme ' OR 
1=1--) afin de verifier que les requetes sont securisees (parametrees, preparees, etc.). 
Exemple : une tentative d’injection dans le champ “nom d’utilisateur” ne doit pas contourner l’authentification.*
