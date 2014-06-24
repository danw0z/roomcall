<?php
		
	$obj = file_get_contents("../JSON/equipment.json");
	$json=json_decode($obj);
	$data=array();
	

	foreach($json->equipment as $item) {
		$data[]=array($item->device);
		$post_data=json_encode($data);
	}

	echo $post_data;
 
 
?>