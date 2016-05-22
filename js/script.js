var couleurs=['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)',  'rgb(255, 255, 255)',  'rgb(255, 255, 255)',  'rgb(255, 255, 255)'];
var numcase=0;
var couleur='';

var largeur=48;
var hauteur=48;

var nbCases = largeur*hauteur;
var url = 'PHP/draw.php';
var urlJSON = 'Json/drawing.json';

var tailleCase = $("#grille").width()/largeur-1;
var hauteurGrille = $("#grille").width();

var sourisDown = false;

// Fonction servant à afficher la grille blanche ou seront droppees les couleurs
function afficherGrille(h, l) {

	$("#grille").css("height", hauteurGrille);

	for (var i=0; i<h; i++) {
		for(var j=0; j<l; j++) {
			$("#grille").append("<div class='case case"+numcase+" col"+j+" lig"+i+"' id='case"+numcase+"'></div>");
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

	if (i==0)
	{
		$("#couleur"+i).addClass("coulActive");
	}

	$("#couleur"+i).draggable({
		cursor: "grab",
		helper: "clone",
		cache: false,
		drag: function(event, ui) {
			couleur = $(this).css("background-color");
		}
	});
}

$('.couleurs').click(function() {
	var id = $(this).attr('id');
	$('.couleurs').removeClass('coulActive');
	$('#'+id).addClass('coulActive'); 
});

$("#palette").append("<div class='clear'></div>");

afficherGrille(hauteur, largeur);

$(".case").css("width", tailleCase+"px");
$(".case").css("height", tailleCase+"px");

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

// change la valeur de sourisDown lorsque le bouton de la souris est enfoncé
$(".case").mousedown(function(){
	sourisDown = true;
});

// change la valeur de sourisDown lorsque le bouton de la souris est relaché
$(".case").mouseup(function(){
	sourisDown = false;
})

// Ajout de l'event hover sur les cases (uniquement lorsque le bouton de la souris est enfoncé)
$(".case").hover(function(event, ui) {
	
	if (sourisDown) {
		$(this).css("background-color", $(".coulActive").css('background-color'));

		var droppe = event.target;
		droppe.style.backgroundColor = $(".coulActive").css('background-color');
		numero = droppe.className.substr(9);
		numero2 =/\d+/.exec(numero);
	
		$.ajax({
			url: url,
			type: 'POST',
			cache: false,
			data: {numcase: numero2[0], couleur: $(".coulActive").css("background-color"), totalCases: nbCases}
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

// Mise en place des sliders du colorPicker
var r = $("#slideR");
var g = $("#slideG");
var b = $("#slideB");

r.slider({min: 0, max: 255, slide: function(event, ui) {
	$("#coulChoisie").css('background-color', 'rgb('+r.slider("value")+','+g.slider("value")+','+b.slider("value")+')');
}
});

g.slider({min: 0, max: 255, slide: function(event, ui) {
	$("#coulChoisie").css('background-color', 'rgb('+r.slider("value")+','+g.slider("value")+','+b.slider("value")+')');
}
});

b.slider({min: 0, max: 255, slide: function(event, ui) {
	$("#coulChoisie").css('background-color', 'rgb('+r.slider("value")+','+g.slider("value")+','+b.slider("value")+')');
}
});

$("#validCouleur").click(function () {
	$(".coulActive").css('background-color', 'rgb('+r.slider("value")+','+g.slider("value")+','+b.slider("value")+')');
});

// Mise en place du spinner pour le zoom zoom
var zoom = $("#zoom");
var largGrille = $("#grille").width();

zoom.slider();
zoom.slider("value", 100);
zoom.slider({min: 0, max: 100, slide: function(event, ui) {
	largGrille = 1068*zoom.slider("value")/100;
	tailleCase = largGrille/largeur-1;
	$(".case").css("width", tailleCase+"px");
	$(".case").css("height", tailleCase+"px");
}});

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

		$("#divParametres").append("<br/>x1 : <input id='x1'/>");
		$("#divParametres").append("<br/>y1 : <input id='y1'/>");
		$("#divParametres").append("<br/>x2 : <input id='x2'/>");
		$("#divParametres").append("<br/>y2 : <input id='y2'/>");

		$("#divParametres").append("<br/>Couleur r,g,b: <input id='coulrgb'/>");
		$("#divParametres").append("<button id='valideParametres'>Valider</button>");

		$("#valideParametres").click(function () {
			
			var $listeParams = $('#x1').val()+";"+$('#y1').val()+";"+$('#x2').val()+";"+$('#y2').val()+";rgb("+$('#coulrgb').val()+")";


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