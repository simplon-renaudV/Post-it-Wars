var couleurs=['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(0, 0, 0)'];
var numcase=0;
var couleur='';

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
for (var i=0; i<16; i++) {
	for(var j=0; j<16; j++) {
		$("body").append("<div class='case case"+numcase+"'></div>");
		numcase++;
		$(".case").droppable({
			addClasses: false,
			drop: function(event, ui) {
				var droppe = event.target;
				droppe.style.backgroundColor = couleur;
				numero = droppe.className.substr(9);
				
				$.ajax({
					url: 'http://10.200.0.156/js/tutos/jqueryExos/draw.php',
					type: 'POST',
					data: 'numcase='+numero+'&couleur='+couleur
				});
			}		
		});
	}
	$("body").append("<div class='clear'></div>");
}