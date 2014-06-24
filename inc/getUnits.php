<?php
		
	include('dbConnect.php');
	
	$campus = $_POST["campus"];
	$building = $_POST["building"];
	
	$query = "SELECT DISTINCT Unit FROM locations WHERE Campus ='$campus' AND Building = '$building'";
	
	$result = mysql_query($query);
	$data = array(); 

    while($row= mysql_fetch_array($result)){
    	$data[] = array($row{'Unit'}); 
    	$post_data = json_encode($data);
    }
    echo $post_data;
?>