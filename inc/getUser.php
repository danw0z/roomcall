<?php
		
	include('dbConnect.php');
	
	$id = $_POST["id"];
	$query = "SELECT [IDUser]
      ,[FirstName]
      ,[LastName] 
      FROM [CMS].[dbo].[User] 
      WHERE [BadgeNumber]= '$id'";
	
	$stmt = sqlsrv_query($conn, $query);

	$obj = sqlsrv_fetch_object($stmt);
	if ($obj =='') {
		echo json_encode(array('message' => 'User not found'));
	} else {
      	echo json_encode($obj);
	}
    

?>
