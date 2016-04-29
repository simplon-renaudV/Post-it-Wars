<?php
	require_once 'vendor/autoload.php';
	use ColorThief\ColorThief;

	$sourceImage = 'images/Mario.jpg';
	$tabCouleurs = [];

	$grilleJson = 'Json/drawing.json';
	$couleurs = "";
	$quality = 10;

	for ($i=0; $i<32; $i++) {
		for ($j=0; $j<32; $j++) {
			$area = array ('x' => $j*2, 'y' => $i*2, 'w' => 2, 'h' => 2);

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
