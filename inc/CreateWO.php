<?php
      //GET Next Work Order Number
      $query = "DECLARE @NewWO AS INT
      SET @NewWO = (SELECT [WorkOrderNumber].[NextWO] FROM [CMS].[dbo].[WorkOrderNumber]);";
 
      //INSERT New Work Order
      $query .= "INSERT INTO [CMS].[dbo].[WorkOrder]
            ([IDCustomer],[IDCustomerSegment],[WONumber],[WODescription],[WORequestComments],[WORequestorName],[IDWOCategory],[IDWOLocation],[LocationOther]
            ,[IDWOStatus],[IDUserCreated],[DateCreated],[IDUserUpdated],[DateUpdated])
      VALUES
            (1,                                             
            1,                                              
            @NewWO,                                         
            'QuickSupport-Logged WO',           
            'Anesthesia Machine - Leak',  
            'QuickSupport Logger',              
            24564,                                          
            18695,         
            'H OR',                                       
            761,                                            
            '3C5246A9-3B66-45C0-8F91-D9A8AD65836F',         
            '2014-06-19 17:45:32',                          
            '3C5246A9-3B66-45C0-8F91-D9A8AD65836F',         
            '2014-06-19 17:45:32');";                        
       
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


      //INSERT New Assignment
      $query .= "INSERT INTO [CMS].[dbo].[WorkOrderAssignment]
            ([IDCustomer],[IDCustomerSegment],[IDWorkOrder],[IDUser],[IDUserCreated],[DateCreated],[IDUserUpdated],[DateUpdated])
      VALUES
            (1,                                           
            1,                                            
            '3C5246A9-3B66-45C0-8F91-D9A8AD65836F',       
            '2BD77FC4-5A07-4718-83A7-7DF3E90F5EEF',       
            '3C5246A9-3B66-45C0-8F91-D9A8AD65836F',       
            '2014-06-19 17:45:32',                        
            '3C5246A9-3B66-45C0-8F91-D9A8AD65836F',       
            '2014-06-19 17:45:32');";                        

      //IDCustomer: Always 1
      //IDCustomerSegment: Always 1   
      //IDWorkOrder: Replace GUID with the ID code for the work order
      //IDUser: The GUID user ID for the employee being assigned
      //IDUserCreated: Always '3C5246A9-3B66-45C0-8F91-D9A8AD65836F' = CMS system
      //DateCreated: Date the work order was created.  Capture external system time at the time of submission
      //IDUserUpdated: Always '3C5246A9-3B66-45C0-8F91-D9A8AD65836F' = CMS system
      //DateUpdated: Use system generated current date/time when posting

      ?>