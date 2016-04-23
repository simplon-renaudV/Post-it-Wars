#Exercice JQuery Post-it Wars

##Enoncé :

###PostIt Wars "Multijoueur"

**Objectif**: Créer une grille "PixelArt" sur laquelle on peut déposer des couleurs en drag'n'drop.

**Etape 1**: Créer la grille de 16x16. et la palette de couleurs à glisser (Javascript/Jquery)

**Etape 2**: A chaque couleur déposée, envoyer les données en Ajax (Méthode POST)

Adresse : http://10.200.0.156/js/tutos/jqueryExos/draw.php

Variables POST à envoyer :
- numcase Numéro de la case (de 0 à 255)
- couleur code couleur de la case (ex: rvb(50,200,80))

**Bonus**: Récupérer le fichier JSON (Adresse : http://10.200.0.156/js/tutos/jqueryExos/drawing.json) et coloriser les couleurs selon les données contenues dans le fichier