<?php
	require_once 'vendor/autoload.php';
	use ColorThief\ColorThief;

	$largeur = 256;
	$tZone = 4;

	$imageTest = imagecreatefrompng('http://ichef.bbci.co.uk/news/976/cpsprodpb/E64D/production/_85475985_mario1.png');

	$imageTest2 = imagescale($imageTest, $largeur);
	$l = imagesx($imageTest2);
	$h = imagesy($imageTest2);

	$nbCasesH = $h/$tZone-1;
	$nbCasesL = $largeur/$tZone;
	
	echo $nbCasesH."<br/>";
	echo $nbCasesL;
	$tZone = $largeur/$nbCasesL;

	$dimensions = [$nbCasesL, $nbCasesH];
	$dimensions = json_encode($dimensions);
	$jsonDim = 'Json/dim.json';

	file_put_contents($jsonDim, $dimensions);

	$sourceImage = $imageTest2;
	$tabCouleurs = [];

	$grilleJson = 'Json/drawing.json';
	$couleurs = "";
	$quality = 10;

	for ($i=0; $i<$nbCasesH; $i++) {
		for ($j=0; $j<$nbCasesL; $j++) {
			$area = array ('x' => $j*$tZone, 'y' => $i*$tZone, 'w' => $tZone, 'h' => $tZone);

			$dominantColor = ColorThief::getColor($sourceImage, $quality, $area);
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

	file_put_contents($grilleJson, $couleurs);
