<?php
	include ('../CORS.php');
	require_once '../vendor/autoload.php';
	
	use ColorThief\ColorThief;

	$grilleJson = '../Json/drawing.json';

	$larg = 48;
	$haut = 48;

	// Fonction pour mettre à jour le fichier drawing.json
	function drawJson($tableau)
	{
		$cases = json_encode($tableau);
		file_put_contents($GLOBALS['grilleJson'], $cases, FILE_APPEND);
		$cases = file_get_contents($GLOBALS['grilleJson']);
		$cases = str_replace("}{", ",", $cases);
		file_put_contents($GLOBALS['grilleJson'], $cases);
	}

	// Fonction pour vérifier si une couleur est bien au format rgb
	function verifCouleur ($color)
	{
		$strCoul=implode(preg_grep("/[0-9,]/", str_split($color)));
		$tabCoul=explode(",", $strCoul);
		if (count($tabCoul)==3) {
			if ($tabCoul[0]>=0 && $tabCoul[0]<256 &&
				$tabCoul[1]>=0 && $tabCoul[1]<256 &&
				$tabCoul[2]>=0 && $tabCoul[2]<256) {
			
				return true;
			}
		
		}
		return false;
	}

	// Stocke la grille dans le fichier drawing.json
	if (isset($_POST['numcase']) && isset($_POST['couleur'])) {
		if (!isset($_POST['totalCases'])) {
			$totalCases = $larg * $haut;
		}
		else {
			$totalCases = $_POST['totalCases'];
		}

		if ($_POST['numcase']>=0 && $_POST['numcase']<$totalCases) {

			if (verifCouleur($_POST['couleur'])) {
				$tabCases[$_POST['numcase']] = $_POST['couleur'];
				drawJson($tabCases);
			}
			else echo "Couleur pas au format rgb";
		}
		else echo "Cette case n'existe pas";
	}

	// Efface le fichier drawing.json
	if (isset($_POST['commande']) && $_POST['commande'] == "effacer") {
		file_put_contents($GLOBALS['grilleJson'], '');
	}
	
	// Colorie de facon aléatoire une case (numero case, couleur, totalcases)
	if (isset($_POST['commande']) && $_POST['commande'] == "aleatoire") {
		if (isset($_POST['parametres'])) {
			$params = explode(";", $_POST['parametres']);
			if (count($params)==3) {
				if ($params[0]>=0 && $params[0]<$params[2]) {
					if (verifCouleur($params[1])) {
						$tabCases[$params[0]] = $params[1];
						drawJson($tabCases);
					}
					else echo "Couleur pas au format rgb";
				}
				else echo "Cette case n'existe pas";
			}
			else echo "Parametres incorrects";
		}
		else echo "Parametres incorrects";
	}

	// Dessine un rectangle a partir des 4 cases des angles et de la couleur (Haut Gauche, Haut Droite, Bas Droite, Bas Gauche, Couleur)
	if (isset($_POST['commande']) && $_POST['commande'] == 'rectangle') {
		if (isset($_POST['parametres'])) {
			$params = explode(";", $_POST['parametres']);
			
			$numCases[0] = $params[1]*$larg + $params[0];
			$numCases[1] = $params[1]*$larg + $params[2];
			$numCases[2] = $params[3]*$larg + $params[2];
			$numCases[3] = $params[3]*$larg + $params[0];

			for ($i=$numCases[0]; $i<$numCases[1]; $i++){
				$tabCases[$i] = $params[4];
				drawJson($tabCases);
			}
		
			for ($i=$numCases[1]; $i<$numCases[2]; $i+=48){
				$tabCases[$i] = $params[4];
				drawJson($tabCases);
			}

			for ($i=$numCases[2]; $i>$numCases[3]; $i--){
				$tabCases[$i] = $params[4];
				drawJson($tabCases);
			}
		
			for ($i=$numCases[3]; $i>$numCases[0]; $i-=48){
				$tabCases[$i] = $params[4];
				drawJson($tabCases);
			}
		}
	}

	// Sauvegarde du fichier en cours
	if (isset($_POST['commande']) && $_POST['commande'] == 'sauvegarder') {
		if (isset($_POST['parametres'])) {
			$params = explode(";", $_POST['parametres']);
			$fichier = '../saves/'.$params[0].'.json';
			copy($GLOBALS['grilleJson'], $fichier);
		}
	}

	// Chargement d'un fichier
	if (isset($_POST['commande']) && $_POST['commande'] == 'charger') {
		if (isset($_POST['parametres'])) {
			$params = explode(";", $_POST['parametres']);
			$fichier = '../saves/'.$params[0].'.json';
			file_put_contents($GLOBALS['grilleJson'], '');
			copy($fichier, $GLOBALS['grilleJson']);
		}
	}

	// Creation d'un dessin à partir d'une image (parametre : chemin de l'image)
	if (isset($_POST['commande']) && $_POST['commande'] == "chargerImage") {
		if (isset($_POST['parametres'])) {

			$sourceImage = imagecreatefromjpeg($_POST['parametres']);

			$lImg = 192;
			$tZone = $lImg/$larg;

			$imageRedim = imagescale($sourceImage, $lImg);
			$l = imagesx($imageRedim);
			$h = imagesy($imageRedim);

			$nbCasesH = $h/$tZone-1;
			$nbCasesL = $lImg/$tZone;

			$tabCouleurs = [];
			$couleurs = "";
			$quality = 10;
						
			for ($i=0; $i<$nbCasesH; $i++) {
				for ($j=0; $j<$nbCasesL; $j++) {
					$area = array ('x' => $j*$tZone, 'y' => $i*$tZone, 'w' => $tZone, 'h' => $tZone);

					$dominantColor = ColorThief::getColor($imageRedim, $quality, $area);
					array_push($tabCouleurs, $dominantColor);
				}
			}

			for ($i=0; $i<count($tabCouleurs); $i++) {
				$couleurs .= '"'.$i.'":';
				$strCoul = implode(',',$tabCouleurs[$i]);
				$strCoul = '"rgb('.$strCoul.')",';
				$couleurs .= $strCoul;
			}

			$couleurs = "{".$couleurs;
			$couleurs = substr($couleurs,0,-1);
			$couleurs .= "}";

			file_put_contents($GLOBALS['grilleJson'], $couleurs);
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