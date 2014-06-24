<?php
		
	include('dbConnect.php');
		
	$query = "SELECT DISTINCT Equipment FROM issues";
	
	$result = mysql_query($query);
	$data = array(); 

    while($row= mysql_fetch_array($result)){

    	$data[] = array($row{'Equipment'}); 
    	$post_data = json_encode($data);
    }
    echo $post_data;
 
 
?>