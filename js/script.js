var couleurs=['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)'];
var numcase=0;
var couleur='';

var largeur=32;
var hauteur=32;

var nbCases = largeur*hauteur;
//var url = 'http://10.200.0.156/js/tutos/jqueryExos/draw.php';
var url = 'PHP/draw.php';
//var urlJSON = 'http://10.200.0.156/js/tutos/jqueryExos/drawing.json';
var urlJSON = 'Json/drawing.json';

// Création des cases de couleur qui seront draggees
for (var i=0; i<couleurs.length; i++) {
	$("body").append("<div class='couleurs' id='couleur"+i+"' draggable='true'></div>");
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

$("body").append("<div class='clear'></div>");

// Création de la grille de cases blanches ou seront droppees les couleurs
for (var i=0; i<hauteur; i++) {
	for(var j=0; j<largeur; j++) {
		$("body").append("<div class='case case"+numcase+"'></div>");
		numcase++;
	}
	$("body").append("<div class='clear'></div>");
}

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
$("body").append("Commande : <input id='commandes'/>");
$("body").append("Parametres : <input id='parametres'/>");
$("body").append("<button id='valideCommande'>Valider</button>");

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
		$tmp =$("#parametres").val($("#parametres").val() +";"+nbCases);
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