<?php

	include('dbConnect.php');
	//Get time WO was created
    $query = "SELECT [DateCreated] FROM [CMS].[dbo].[WorkOrder] WHERE [IDWorkOrder]='25A7FA12-A661-4E42-A749-1C94E77AA5D2'";
    $stmt = sqlsrv_query($conn, $query);
    if( $stmt === false ) {
          die( print_r( sqlsrv_errors(), true));
    }
    // Make the first row of the result set available for reading.
    if( sqlsrv_fetch( $stmt ) === false) {
         die( print_r( sqlsrv_errors(), true));
    }
    // Save the WO ID for use in assigning the WO to a user
    $startTime = sqlsrv_get_field($stmt, 0);
    json_encode($startTime);
    $startTime=$startTime->date;
    $d1=new DateTime($startTime);
    $interval = new DateInterval('PT10M');
    print_r($startTime);
    $d1->add($interval);
    $d1 = $d1->format('Y-m-d H:i:s');
    print_r($d1);
    //$endTime = 

?>	