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
	if (isset($_POST['commande']) && $_POST['commande'] == "effacer") {
		file_put_contents($grilleJson, '');
	}
	
	// Colorie de facon aléatoire une case
	if (isset($_POST['commande']) && $_POST['commande'] == "aleatoire") {
		if (isset($_POST['parametres'])) {
			$params = explode(";", $_POST['parametres']);

			$tabCases[$params[0]] = $params[1];
			$cases = json_encode($tabCases);
			file_put_contents($grilleJson, $cases, FILE_APPEND);

			$cases = file_get_contents($grilleJson);

			$cases = str_replace("}{", ",", $cases);
			file_put_contents($grilleJson, $cases);
		}
	}

	// Commande de test
	if (isset($_POST['commande']) && $_POST['commande'] == 'test') {
		if (isset($_POST['parametres'])) {
			$params = explode(";", $_POST['parametres']);
			for ($i=0; $i<count($params); $i++) {
				echo $params[$i]."<br/>";
			}
		}
		echo "Ceci est un test";
	}

	