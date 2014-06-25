<?php

      $workOrderID = $_POST["workOrderID"];
      $completionComments = $_POST["completionComments"];

      // Get current time and date
      date_default_timezone_set('America/New_York');
      $date = date('Y-m-d h:i:s');

      //UPDATE Existing Work Order
      $query = "UPDATE [CMS].[dbo].[WorkOrder]
      SET [DateUpdated] = '$date',                  
            [IDWOStatus] = 781,                                   
            [WODateCompleted]='$date',              
            [WOCompletionComments]='$completionComments'    
      WHERE [IDWorkOrder]='$workOrderID'" ;
      $stmt = sqlsrv_query($conn, $query);
      if( $stmt === false ) {
            die( print_r( sqlsrv_errors(), true));
      }

      //DateUpdated: Use system generated current date/time when posting
      //IDWOStatus: Always 781 = Complete
      //WODateCompleted: Date/time stamp for when work was completed.  If Status = In Progress, return 'NULL'
      //WOCompletionComments: If closing the WO, place problem description here.  If Status = In Progress, return 'NULL'
      //Replace GUID with the appropriate WO ID for the item to be updated
       
      //INSERT New Time Entry
      $query = "INSERT INTO [CMS].[dbo].[TimeCharge]
            ([IDCustomer],[IDCustomerSegment],[IDWorkOrder],[IDUser]
            ,[TimeChargeStartDateTime],[TimeChargeHours],[TimeChargeEndDateTime],[Billable],[TimeCategory]
            ,[IDUserCreated],[DateCreated],[IDUserUpdated],[DateUpdated])
      VALUES
            (1,                                            
            1,                                             
            '3C5246A9-3B66-45C0-8F91-D9A8AD65836F',        
            '3C5246A9-3B66-45C0-8F91-D9A8AD65836F',        
            '2014-06-19 17:15:32',                         
            0.5,                                           
            '2014-06-19 17:45:32',                         
            0,                                             
            2388,                                          
            '3C5246A9-3B66-45C0-8F91-D9A8AD65836F',        
            '2014-06-19 17:45:32',                         
            '3C5246A9-3B66-45C0-8F91-D9A8AD65836F',        
            '2014-06-19 17:45:32')";            

      //IDCustomer: Always 1
      //IDCustomerSegment: Always 1   
      //IDWorkOrder: Replace GUID with the ID code for the work order
      //IDUser: The GUID user ID for the employee being assigned
      //[TimeChargeStartDateTime]: Time when the call was first logged
      //[TimeChargeHours]: Time (in hours or decimal portion of an hour)
      //[TimeChargeEndDateTime]: Start Time + Duration
      //[Billable]: Always 0 = not billable
      //[TimeCategory]: Always = 2388 which is the code for 'Hands-on Equipment'
      //IDUserCreated: Always '3C5246A9-3B66-45C0-8F91-D9A8AD65836F' = CMS system
      //DateCreated: Date the work order was created.  Capture external system time at the time of submission
      //IDUserUpdated: Always '3C5246A9-3B66-45C0-8F91-D9A8AD65836F' = CMS system
      //DateUpdated: Use system generated current date/time when posting           
      
      $stmt = sqlsrv_query($conn, $query); 
      if( $stmt === false ) {
            die( print_r( sqlsrv_errors(), true));          
      } else { 
            echo "Successfully Added Time</br>";
      }  
?>