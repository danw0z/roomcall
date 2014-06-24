<?php
		
	include('dbConnect.php');
	
	$query = "SELECT [IDLocation]
      ,[LocationDescription]
  FROM [CMS].[dbo].[Location]
  WHERE [LocationVisible]=1 AND [LocationSearch]=1 AND [Level]=0
  ORDER BY LocationDescription";
	
	$stmt = sqlsrv_query($conn, $query);
	$data = array(); 

    while($obj = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {

     $data[] = array($obj); 
     $post_data = json_encode($data);
    }
    echo $post_data;
 
?>