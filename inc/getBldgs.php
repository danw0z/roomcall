<?php
		
	include('dbConnect.php');
	
	$campus = $_POST["campus"];
	$campusID = $_POST["campusID"];
	
	$query = "SELECT [IDLocation]
      ,[LocationDescription]
  FROM [CMS].[dbo].[Location]
  WHERE [LocationVisible]=1 AND [LocationSearch]=1 AND [IDParent]='$campusID'
  ORDER BY LocationDescription";

	$stmt = sqlsrv_query($conn, $query);
	$data = array(); 

    while($obj = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {

     $data[] = array($obj); 
     $post_data = json_encode($data);
    }
    echo $post_data;
 
 
?>