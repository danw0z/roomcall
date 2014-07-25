<?php

	include('dbConnect.php');
	
	$tech = $_POST["tech"];


	$query = "SELECT [WorkOrder].[IDWorkOrder]
	  ,[WONumber]
	  ,[WORequestComments]
	  ,[Location].[IDLocation]
	  ,[Location].[HierarchyString] AS 'Location'
	  ,[LocationOther] AS 'Room'
	  ,[WorkOrder].[DateCreated]
	  ,[WorkOrder].[DateUpdated]
	  FROM [CMS].[dbo].[WorkOrder] LEFT JOIN [CMS].[dbo].[Location] ON [Location].[IDLocation]=[WorkOrder].[IDWOLocation]
	      LEFT JOIN [CMS].[dbo].[WorkOrderAssignment] ON [WorkOrder].[IDWorkOrder] = [WorkOrderAssignment].[IDWorkOrder]
	      LEFT JOIN [CMS].[dbo].[Status] ON [WorkOrder].[IDWOStatus] = [Status].[IDStatus]
	  WHERE [IDWOCategory]=24564 AND [WorkOrderAssignment].[IDUser] = '$tech' AND [Status].[HierarchyString] LIKE '%Progress%'";

	$stmt = sqlsrv_query($conn, $query);
	$data = array(); 

    while($obj = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $data[] = array($obj); 
    }
    
    $post_data = json_encode($data);
    echo $post_data;



?>