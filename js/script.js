var couleurs=['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)'];
var numcase=0;
var couleur='';

var largeur=48;
var hauteur=48;

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
	$("#grille").append("<br/>Parametres : <label id='parametres'></label>");
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
	drop: function(event, ui) {
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
$("#outils").append("<button id='valideCommande'>Valider</button>");

// *******************************
// **** Gestion des commandes ****
// *******************************

$("#valideCommande").click(function () {
	
	commande = $("#commandes").val();

	// Efface la grille
	if (commande == 'effacer')
	{
		for (var i=0; i<nbCases; i++) {
			$(".case"+i).css("background-color", 'rgb(255, 255, 255)');
		}
	
		// Envoie de la requête ajax contenant la commande ainsi que les paramètres
		$.ajax({
			url: url,
			type: 'POST',
			cache: false,
			data: {commande: commande, parametres: $("#parametres").text()}
		});
	}

	// Colorie une case aleatoire avec une couleur aléatoire
	if (commande == 'aleatoire')
	{
		caseAlea = Math.floor((nbCases-1)*Math.random());
		coulR = Math.floor((255)*Math.random());
		coulG = Math.floor((255)*Math.random());
		coulB = Math.floor((255)*Math.random());
		coulAlea = "rgb("+coulR+","+coulG+","+coulB+")";

		$("#parametres").text(caseAlea+";"+coulAlea+";"+nbCases);

		$(".case"+caseAlea).css("background-color", coulAlea);
	
		// Envoie de la requête ajax contenant la commande ainsi que les paramètres
		$.ajax({
			url: url,
			type: 'POST',
			cache: false,
			data: {commande: commande, parametres: $("#parametres").text()}
		});
	}

	// Sauvegarder une image
	if (commande == 'sauvegarder')
	{
		$("#outils").append("<div id='divParametres'></div>");
		$("#divParametres").append("<br/>Nom de l'image : <input id='save'/>");
		$("#divParametres").append("<button id='valideParametres'>Valider</button>");
	
		$("#valideParametres").click(function () {
			$("#parametres").text($("#save").val());
			$.ajax({
				url: url,
				type: 'POST',
				cache: false,
				data: {commande: commande, parametres: $("#parametres").text()}
			});
			$("#divParametres").remove();
		})
	}

	// charger une image
	if (commande == 'charger')
	{
		$("#outils").append("<div id='divParametres'></div>");
		$("#divParametres").append("<br/>Nom de l'image : <input id='load'/>");
		$("#divParametres").append("<button id='valideParametres'>Valider</button>");
	
		$("#valideParametres").click(function () {
			$("#parametres").text($("#load").val());
			$.ajax({
				url: url,
				type: 'POST',
				cache: false,
				data: {commande: commande, parametres: $("#parametres").text()}
			});
			$("#divParametres").remove();
		})
	}

	// Dessine un rectangle à partir des cases des 4 angles et de la couleur
	// (HautGauche, HautDroite, BasDroite, BasGauche, Couleur)

	if (commande == 'rectangle')
	{
		$("#outils").append("<div id='divParametres'></div>");
		$("#divParametres").append("<br/>Haut Gauche : <input id='hg'/>");
		$("#divParametres").append("<br/>Haut Droite : <input id='hd'/>");
		$("#divParametres").append("<br/>Bas Droite : <input id='bd'/>");
		$("#divParametres").append("<br/>Bas Gauche : <input id='bg'/>");
		$("#divParametres").append("<br/>Couleur r,g,b: <input id='coulrgb'/>");
		$("#divParametres").append("<button id='valideParametres'>Valider</button>");

		$("#valideParametres").click(function () {
			var $listeParams = $('#hg').val()+";"+$('#hd').val()+";"+$('#bd').val()+";"+$('#bg').val()+";rgb("+$('#coulrgb').val()+")";
			$("#parametres").text($listeParams);
			$.ajax({
				url: url,
				type: 'POST',
				cache: false,
				data: {commande: commande, parametres: $("#parametres").text()}
			});
			$("#divParametres").remove();
		})
	}

	// Colorie la grille à partir d'une image
	if (commande == 'chargerImage')
	{
		$("#outils").append("<div id='divParametres'></div>");
		$("#divParametres").append("<br/>Lien de l'image : <input id='lienImage'/>");
		$("#divParametres").append("<button id='valideParametres'>Valider</button>");

		$("#valideParametres").click(function () {
			$("#parametres").text($("#lienImage").val());
			$.ajax({
				url: url,
				type: 'POST',
				cache: false,
				data: {commande: commande, parametres: $("#parametres").text()}
			});
			$("#divParametres").remove();
		})
	}

	$("#parametres").text('');
})