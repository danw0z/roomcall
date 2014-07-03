<?php
		
	$equipment = $_POST["equipment"];
	
	$obj = file_get_contents("../JSON/equipment.json");
	$json=json_decode($obj);
	$data=array();
	

	foreach($json->equipment as $item) {
		if ($item->device == $equipment) {
			$data=$item->issue;
			$post_data=json_encode($data);
		}
	}

	$json_array=json_decode($post_data, true);
	sort($json_array);
	$post_data = json_encode($json_array);

	echo $post_data;
 
 
?>