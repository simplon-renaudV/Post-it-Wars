#Exercice JQuery Post-it Wars

##PostIt Wars "Multijoueur"

### Enoncé original

**Objectif**: Créer une grille "PixelArt" sur laquelle on peut déposer des couleurs en drag'n'drop.

**Etape 1**: Créer la grille de 16x16. et la palette de couleurs à glisser (Javascript/Jquery)

**Etape 2**: A chaque couleur déposée, envoyer les données en Ajax (Méthode POST)

Adresse : http://10.200.0.156/js/tutos/jqueryExos/draw.php

Variables POST à envoyer :
- numcase Numéro de la case (de 0 à 255)
- couleur code couleur de la case (ex: rvb(50,200,80))

**Bonus**: Récupérer le fichier JSON (Adresse : http://10.200.0.156/js/tutos/jqueryExos/drawing.json) et coloriser les couleurs selon les données contenues dans le fichier

###Améliorations personnelles apportées au projet :

- Dessin des cases avec over au lieu de drop
- Ajout d'une zone de texte "commande" servant à passer des commandes

Commandes disponibles :
- effacer : effacer l'ensemble des cases en local et sur le fichier distant
- aléatoire : colorie une case aleatoirement avec une couleur aleatoire en rgb;
- rectangle : Dessine un rectangle a partir des 4 cases des angles (Haug Gauche, Haut Droite, Bas Droite, Bas Gauche) et de la couleur en rgb
- sauvegarder : enregistre le fichier marque dans la case parametre
- charger : charge le fichier marque dans la case parametre
- chargerImage : rempli la grille à partir d'une image (lien vers l'image en paramètre); ==pour le moment l'image doit faire impérativement 64x64 pixels.==

Utilisation du code php de kevin Subileau pour la fonction chargerImage :
- https://github.com/ksubileau/color-thief-php
- http://www.kevinsubileau.fr/