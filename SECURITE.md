


Après avoir identifié trois **vulnérabilités** de sécurité de notre application web et la manière dont des **attaques** peuvent les exploiter, on propose des **solutions** pour protéger notre application contre ces menaces et on vérifie leur **efficacité**.

# Vulnérabilité 1: 

Vérification de la gestion des sessions et des droits d’accès. Mettre en place des 
tests pour s’assurer qu’un utilisateur authentifié mais non autorisé ne peut pas 
accéder à des routes réservées à l’administration. 
Exemple : un candidat connecté ne doit pas pouvoir accéder à /admin/panel. 

## Menace : vulnérabilité pouvant être exploitée par une attaque

## solution implémentée pour se prémunir de cette attaque 
les sessions

## efficacité de la solution : vérification avec des tests automatisés
Cette solution est efficacice: l'attaquant ne pourra plus exploiter la vulnérabilité

