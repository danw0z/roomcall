<?php
	
	$campus = $_POST["campus"];
	$building = $_POST["building"];
	
	$obj = file_get_contents("../JSON/location.json");
	$json=json_decode($obj);
	$data=array();
	

	foreach($json->locations as $item) {
		if (isset($item->campus) && $item->campus == $campus) {
			foreach ($item->buildings as $buildings) {
				if ($buildings->building == $building) {
						$data=$buildings->units;
						$post_data=json_encode($data);
				}
			}
		}		
	}

	echo $post_data;
?>