<?php

      include('dbConnect.php');

      $workerID = $_POST["workerID"];
      $locationID = $_POST["locationID"];
      $locationDesc = $_POST["locationDesc"];
      $problemDesc = $_POST["problemDesc"];
      $workOrderID = $_POST["workOrderID"];
      $completionComments = $_POST["completionComments"];

      //GET Next Work Order Number
      $query = "SELECT [WorkOrderNumber].[NextWO] FROM [CMS].[dbo].[WorkOrderNumber]";
      $stmt = sqlsrv_query($conn, $query);
      if( $stmt === false ) {
            die( print_r( sqlsrv_errors(), true));
      }

      if( sqlsrv_fetch( $stmt ) === false) {
           die( print_r( sqlsrv_errors(), true));
      }
      // Save the returned WO# and increment by one (the returned number seems to be the last WO# used)
      $newWO = sqlsrv_get_field( $stmt, 0);
      $newWO++;                                 
      echo "WO# ".$newWO."</br>"; 


      // Get current time and date
      date_default_timezone_set('America/New_York');
      $date = date('Y-m-d h:i:s');
      //echo $date;
 
      //INSERT New Work Order
      $query = "INSERT INTO [CMS].[dbo].[WorkOrder]
            ([IDCustomer],[IDCustomerSegment],[WONumber],[WODescription],[WORequestComments],[WORequestorName],[IDWOCategory],[IDWOLocation],[LocationOther]
            ,[IDWOStatus],[IDUserCreated],[DateCreated],[IDUserUpdated],[DateUpdated])
      VALUES
            (1,                                             
            1,                                              
            '$newWO',                                         
            'QuickSupport-Logged WO',
            '$problemDesc',  
            'QuickSupport Logger',              
            24564,                                          
            '$locationID',         
            '$locationDesc',                                       
            761,                                            
            '3C5246A9-3B66-45C0-8F91-D9A8AD65836F',         
            '$date',                          
            '3C5246A9-3B66-45C0-8F91-D9A8AD65836F',         
            '$date');";     

      $stmt = sqlsrv_query($conn, $query); 
      if( $stmt === false ) {
            die( print_r( sqlsrv_errors(), true));          
      }      
       
      //IDCustomer: Always 1
      //IDCustomerSegment: Always 1
      //WONumber: Next WO number. Uses variable read from database in query above
      //WODescription: Always 'QuickSupport-Logged WO' so that these are recognizable as entered by the external system
      //WORequestComments: Text describing the reason for the WO.  Should be built from the selected problem
      //WORequestorName: Always 'QuickSupport Logger' so that these are recognizable as entered by the external system
      //IDWOCategory: Category of Work Order. Always = 24564 which is the code for 'Quick Support'
      //IDLocation: Replace GUID with the ID code for the lowest level selected in the location hierarchy
      //LocationOther:
      //IDWOStatus: Always 761 = In Progress
      //IDUserCreated: Always '3C5246A9-3B66-45C0-8F91-D9A8AD65836F' = CMS system
      //DateCreated: Date the work order was created.  Capture external system time at the time of submission
      //IDUserUpdated: Always '3C5246A9-3B66-45C0-8F91-D9A8AD65836F' = CMS system
      //DateUpdated: Use system generated current date/time when posting


      //GET the WO GUID for the work order just created (used to add an assignment)
      //Note: Because there is a possibility that a WorkOrderNumber may not be unique, we match on both WONumber and DateCreated
      //where DateCreated is the date used in the above WO creation.
      $query = "SELECT [IDWorkOrder] FROM [CMS].[dbo].[WorkOrder] WHERE ([WONumber]='$newWO' AND [DateCreated]='$date')";
      $stmt = sqlsrv_query($conn, $query);
      if( $stmt === false ) {
            die( print_r( sqlsrv_errors(), true));
      }
      // Make the first row of the result set available for reading.
      if( sqlsrv_fetch( $stmt ) === false) {
           die( print_r( sqlsrv_errors(), true));
      }
      // Save the WO ID for use in assigning the WO to a user
      $workOrderID = sqlsrv_get_field( $stmt, 0);
      echo $workOrderID; 

      //INSERT New Assignment
      $query = "INSERT INTO [CMS].[dbo].[WorkOrderAssignment]
            ([IDCustomer],[IDCustomerSegment],[IDWorkOrder],[IDUser],[IDUserCreated],[DateCreated],[IDUserUpdated],[DateUpdated])
      VALUES
            (1,                                           
            1,                                            
            '$workOrderID',       
            '$workerID',       
            '3C5246A9-3B66-45C0-8F91-D9A8AD65836F',       
            '$date',                        
            '3C5246A9-3B66-45C0-8F91-D9A8AD65836F',       
            '$date');";                        

      //IDCustomer: Always 1
      //IDCustomerSegment: Always 1   
      //IDWorkOrder: Replace GUID with the ID code for the work order
      //IDUser: The GUID user ID for the employee being assigned
      //IDUserCreated: Always '3C5246A9-3B66-45C0-8F91-D9A8AD65836F' = CMS system
      //DateCreated: Date the work order was created.  Capture external system time at the time of submission
      //IDUserUpdated: Always '3C5246A9-3B66-45C0-8F91-D9A8AD65836F' = CMS system
      //DateUpdated: Use system generated current date/time when posting

      $stmt = sqlsrv_query($conn, $query);
      if( $stmt === false ) {
            die( print_r( sqlsrv_errors(), true));          
      }

      ?>