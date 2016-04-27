<?php
	include ('AllowCrossOrigin.php');

	$grilleJson = '../Json/drawing.json';

	// Fonction pour mettre à jour le fichier drawing.json
	function drawJson($tableau)
	{
		$cases = json_encode($tableau);
		file_put_contents($GLOBALS['grilleJson'], $cases, FILE_APPEND);
		$cases = file_get_contents($GLOBALS['grilleJson']);
		$cases = str_replace("}{", ",", $cases);
		file_put_contents($GLOBALS['grilleJson'], $cases);
	}

	// Stocke la grille dans le fichier drawing.json
	if (isset($_POST['numcase']) && isset($_POST['couleur'])){
		$tabCases[$_POST['numcase']] = $_POST['couleur'];
		
		drawJson($tabCases);
	}

	// Efface le fichier drawing.json
	if (isset($_POST['commande']) && $_POST['commande'] == "effacer") {
		file_put_contents($GLOBALS['grilleJson'], '');
	}
	
	// Colorie de facon aléatoire une case
	if (isset($_POST['commande']) && $_POST['commande'] == "aleatoire") {
		if (isset($_POST['parametres'])) {
			$params = explode(";", $_POST['parametres']);

			$tabCases[$params[0]] = $params[1];
			drawJson($tabCases);
		}
	}

	// Dessine un rectangle a partir des 4 cases des angles et de la couleur (Haut Gauche, Haut Droite, Bas Droite, Bas Gauche, Couleur)
	if (isset($_POST['commande']) && $_POST['commande'] == 'rectangle') {
		if (isset($_POST['parametres'])) {
			$params = explode(";", $_POST['parametres']);
			
			for ($i=$params[0]; $i<$params[1]; $i++){
				$tabCases[$i] = $params[4];
				drawJson($tabCases);
			}
		
			for ($i=$params[1]; $i<$params[2]; $i+=16){
				$tabCases[$i] = $params[4];
				drawJson($tabCases);
			}

			for ($i=$params[2]; $i>$params[3]; $i--){
				$tabCases[$i] = $params[4];
				drawJson($tabCases);
			}
		
			for ($i=$params[3]; $i>$params[0]; $i-=16){
				$tabCases[$i] = $params[4];
				drawJson($tabCases);
			}
		}
	}

	// Sauvegarde du fichier en cours
	if (isset($_POST['commande']) && $_POST['commande'] == 'sauvegarder') {
		if (isset($_POST['parametres'])) {
			$params = explode(";", $_POST['parametres']);
			$fichier = '../Json/'.$params[0].'.json';
			copy($GLOBALS['grilleJson'], $fichier);
		}
	}

	// Chargement d'un fichier
	if (isset($_POST['commande']) && $_POST['commande'] == 'charger') {
		if (isset($_POST['parametres'])) {
			$params = explode(";", $_POST['parametres']);
			$fichier = '../Json/'.$params[0].'.json';
			copy($fichier, $GLOBALS['grilleJson']);
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