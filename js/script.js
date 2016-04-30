var couleurs=['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)'];
var numcase=0;
var couleur='';

var largeur=64;
var hauteur=64;

var nbCases = largeur*hauteur;
var url = 'PHP/draw.php';
var urlJSON = 'Json/drawing.json';

// Fonction servant à afficher la grille blanche ou seront droppees les couleurs
function afficherGrille(h, l) {
	for (var i=0; i<h; i++) {
		for(var j=0; j<l; j++) {
			$("#grille").append("<div class='case case"+numcase+"'></div>");
			numcase++;
		}
		$("#grille").append("<div class='clear'></div>");
	}
}

// Création des cases de couleur qui seront draggees
for (var i=0; i<couleurs.length; i++) {
	$("#palette").append("<div class='couleurs' id='couleur"+i+"' draggable='true'></div>");
	$("#couleur"+i).css("background-color", couleurs[i]);

	$("#couleur"+i).draggable({
		cursor: "grab",
		helper: "clone",
		cache: false,
		drag: function(event, ui) {
			couleur = $(this).css("background-color");
		}
	});
}

$("#palette").append("<div class='clear'></div>");

afficherGrille(hauteur, largeur);

// Ajout de l'event droppable sur les cases
$(".case").droppable({
	addClasses: false,
	over: function(event, ui) {
		var droppe = event.target;
		droppe.style.backgroundColor = couleur;
		numero = droppe.className.substr(9);
		numero2 =/\d+/.exec(numero);
		
		$.ajax({
			url: url,
			type: 'POST',
			cache: false,
			data: {numcase: numero2[0], couleur: couleur, totalCases: nbCases}
		});
	}		
});

// Rafraichissement de la grille distante toutes les 5sec
setInterval(function(){
	$.ajax({
		url: urlJSON,
		datatype: 'JSON',
		cache: false,
		success: function(fichJSON) {
			$.each(fichJSON, function (index, element) {
				$(".case"+index).css("background-color", element);
			})
		}
	});
	}, 5000);

// Zone de texte pour entrer les commandes et les paramètres
$("#outils").append("Commande : <input id='commandes'/>");
$("#outils").append("Parametres : <input id='parametres'/>");
$("#outils").append("<button id='valideCommande'>Valider</button>");

// *******************************
// **** Gestion des commandes ****
// *******************************

$("#valideCommande").click(function () {
	
	commande = $("#commandes").val();

	// Efface la grille locale
	if (commande == 'effacer' || commande == 'charger')
	{
		for (var i=0; i<nbCases; i++) {
			$(".case"+i).css("background-color", 'rgb(255, 255, 255)');
		}
	}

	// Colorie une case aleatoire avec une couleur aléatoire
	if (commande == 'aleatoire')
	{
		caseAlea = Math.floor((nbCases-1)*Math.random());
		coulR = Math.floor((255)*Math.random());
		coulG = Math.floor((255)*Math.random());
		coulB = Math.floor((255)*Math.random());
		coulAlea = "rgb("+coulR+","+coulG+","+coulB+")";

		$("#parametres").val(caseAlea+";"+coulAlea+";"+nbCases);

		$(".case"+caseAlea).css("background-color", coulAlea);
	}

	// Colorie la grille à partir d'une image
	if (commande == 'chargerImage')
	{
		$("#parametres").val();
	}

	// Commande de test
	if (commande == 'test')
	{
		$("#parametres").val();
	}

	// Envoie de la requête ajax contenant la commande ainsi que les paramètres
	$.ajax({
		url: url,
		type: 'POST',
		cache: false,
		data: {commande: commande, parametres: $("#parametres").val()}
	});

	$("#parametres").val('');
})