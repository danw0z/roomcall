<?php

	include('dbConnect.php');
	
	$tech = $_POST["tech"];
	$status = $_POST["status"];
	$campus = $_POST["campus"];
	$building = $_POST["building"];
	$unit = $_POST["unit"];
	$equipment = $_POST["equipment"];
	$issue = $_POST["issue"];
	$time = $_POST["time"];
	$index = $_POST["index"];
	$problem = $equipment . " - " . $issue;

	if (!empty($index)) {
    	$sql ="UPDATE `cms` SET tech='$tech', campus='$campus', building='$building',  
    	unit='$unit', problem='$problem', time='$time', status='$status' 
		WHERE cms.index=$index";
	} else {

		$sql = "INSERT INTO `cms` (tech, campus, building, unit, problem, time, status) 
		VALUES ('$tech', '$campus', '$building', '$unit', '$problem', '$time', '$status')";
	}

	$result = mysql_query($sql) or trigger_error(mysql_error()." ".$sql);

	// if successfully updated. 
	if($result){ 
		echo "Successful"; 
	} 

	else { 
		echo "ERROR"; 
	}

?>