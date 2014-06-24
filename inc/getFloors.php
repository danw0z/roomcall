<?php
		
	include('dbConnect.php');
	
	$building = $_POST["building"];
	$buildingID = $_POST["buildingID"];
	
	$query = "SELECT [IDLocation]
      ,[LocationDescription]
  FROM [CMS].[dbo].[Location]
  WHERE [LocationVisible]=1 AND [LocationSearch]=1 AND [IDParent]='$buildingID'
  ORDER BY LocationDescription";

	$stmt = sqlsrv_query($conn, $query);
	$data = array(); 

    while($obj = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {

     $data[] = array($obj); 
     $post_data = json_encode($data);
    }
    echo $post_data;
 
 
?>