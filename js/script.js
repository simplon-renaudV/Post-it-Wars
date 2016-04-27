var couleurs=['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)'];
var numcase=0;
var couleur='';

var largeur=16;
var hauteur=16;

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
			data: {numcase: numero2[0], couleur: couleur}
		});
	}		
});

// Rafraichissement de la grille distante toutes les 5sec
setInterval(function(){
	$.ajax({
		url: urlJSON,
		datatype: 'JSON',
		success: function(fichJSON) {
			$.each(fichJSON, function (index, element) {
				$(".case"+index).css("background-color", element);
			})
		}
	});
	}, 5000);

// Zone de texte pour entrer des commandes
$("body").append("Commande : <input id='commandes'/>");
$("body").append("Parametres : <input id='parametres'/>");
$("body").append("<button id='valideCommande'>Valider</button>");


$("#valideCommande").click(function () {
	
	commande = $("#commandes").val();

	if (commande == 'effacer')
	{
		for (var i=0; i<nbCases; i++) {
			$(".case"+i).css("background-color", 'rgb(255, 255, 255');
		}
		/*$.ajax({
			url: url,
			type: 'POST',
			data: {commande: commande}
		});*/
	}

	if (commande == 'aleatoire')
	{
		caseAlea = Math.floor((nbCases-1)*Math.random());
		coulR = Math.floor((255)*Math.random());
		coulG = Math.floor((255)*Math.random());
		coulB = Math.floor((255)*Math.random());
		coulAlea = "rgb("+coulR+","+coulG+","+coulB+")";

		$("#parametres").val(caseAlea+";"+coulAlea);

		$(".case"+caseAlea).css("background-color", coulAlea);
		/*$.ajax({
			url: url,
			type: 'POST',
			data: {commande: commande, parametres: $("#parametres").val()}
		});*/
	}
	
	if (commande == 'test')
	{
		test="TEST1;TEST2";
		$("#parametres").val(test);
		/*$.ajax({
			url: url,
			type: 'POST',
			data: {commande: commande, parametres: test}
		});*/
	}

	$.ajax({
		url: url,
		type: 'POST',
		data: {commande: commande, parametres: $("#parametres").val()}
	});
})