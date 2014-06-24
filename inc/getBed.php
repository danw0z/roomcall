<?php
		
	include('dbConnect.php');
	
	$campus = str_replace("_"," ",mysql_real_escape_string($_GET['campus']));
	$building = str_replace("_"," ",mysql_real_escape_string($_GET['building']));
	$unit = str_replace("_", " ",mysql_real_escape_string($_GET['unit']));
	
	$query = "SELECT DISTINCT Bed FROM locations WHERE Campus ='$campus' AND Building = '$building' AND Unit = '$unit'";
	
	$result = mysql_query($query);

	echo "<option></option>";
	
	while ($row = mysql_fetch_array($result)) {
   		echo "<option>" . $row{'Bed'} . "</option>";
	}
 
?>