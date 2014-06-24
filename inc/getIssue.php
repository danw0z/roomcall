<?php
		
	include('dbConnect.php');
	
	$equipment = $_POST["equipment"];
	
	$query = "SELECT DISTINCT problem FROM issues WHERE equipment ='$equipment'";
	
	$result = mysql_query($query);
	$data = array(); 

    while($row= mysql_fetch_array($result)){
    	$data[] = array($row{'problem'}); 
    	$post_data = json_encode($data);
    }
    echo $post_data;
 
?>