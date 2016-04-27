<?php
	include ('AllowCrossOrigin.php');

	if (isset($_POST['numcase']) && isset($_POST['couleur'])){
		$tabCases[$_POST['numcase']] = $_POST['couleur'];
		$grilleJson = '../Json/drawing.json';
		
		$cases = json_encode($tabCases);
		file_put_contents($grilleJson, $cases, FILE_APPEND);

		$cases = file_get_contents($grilleJson);

		$cases = str_replace("}{", ",", $cases);
		file_put_contents($grilleJson, $cases);
	}