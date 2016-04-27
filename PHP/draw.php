<?php
	include ('AllowCrossOrigin.php');

	$grilleJson = '../Json/drawing.json';

	// Stocke la grille dans le fichier drawing.json
	if (isset($_POST['numcase']) && isset($_POST['couleur'])){
		$tabCases[$_POST['numcase']] = $_POST['couleur'];
		
		$cases = json_encode($tabCases);
		file_put_contents($grilleJson, $cases, FILE_APPEND);

		$cases = file_get_contents($grilleJson);

		$cases = str_replace("}{", ",", $cases);
		file_put_contents($grilleJson, $cases);
	}

	// Efface le fichier drawing.json
	if (isset($_POST['commande'])) {
		if ($_POST['commande'] == "effacer") {
			file_put_contents($grilleJson, '');
		}
	}