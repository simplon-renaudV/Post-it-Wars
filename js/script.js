var couleurs=['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)'];
var numcase=0;
var couleur='';

var largeur=16;
var hauteur=16;

var nbCases = largeur*hauteur;
// var url = 'http://10.200.0.156/js/tutos/jqueryExos/draw.php';
var url = 'PHP/draw.php';
// var urlJSON = 'http://10.200.0.156/js/tutos/jqueryExos/drawing.json';
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

$(".case").droppable({
	addClasses: false,
	over: function(event, ui) {
		var droppe = event.target;
		droppe.style.backgroundColor = couleur;
		numero = droppe.className.substr(9);
		numero2 =/\d+/.exec(numero);
		console.log(numero2);

		$.ajax({
			url: url,
			type: 'POST',
			data: {numcase: numero2[0], couleur: couleur}
		});
	}		
});

$("body").append("<button id='effacer'>Effacer</button>");
$("body").append("<button id='alea'>Aléatoire</button");

// Effacer toutes les cases de la grille
$("#effacer").click(function(){
	for (var i=0; i<nbCases; i++) {
	$.ajax({
			url : url,
			type: 'POST',
			data: {numcase: i, couleur: 'rgb(255, 255, 255)'}
		});
		$(".case"+i).css("background-color", 'rgb(255, 255, 255');
	}
});

// Rafraichissement de la grille distante toutes les 5sec
setInterval(function(){
	$.ajax({
		url: urlJSON,
		datatype: 'JSON',
		data: 'data',
		success: function(fichJSON) {
			$.each(fichJSON, function (index, element) {
				$(".case"+index).css("background-color", element);
			})
		}
	});
	}, 5000);

// Création d'une case aléatoire avec une couleur aléatoire
$("#alea").click(function(){
	caseAlea = Math.floor((255-0)*Math.random());
	coulR = Math.floor((255-0)*Math.random());
	coulG = Math.floor((255-0)*Math.random());
	coulB = Math.floor((255-0)*Math.random());
	coulAlea = "rgb("+coulR+","+coulG+","+coulB+")";

	$(".case"+caseAlea).css("background-color", coulAlea);
	$.ajax({
			url: url,
			type: 'POST',
			data: {numcase: caseAlea, couleur: coulAlea}
		});
})