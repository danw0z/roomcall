// Instantiate the popup on DOMReady, and enhance its contents
$(function() {
    $( "#logout" ).enhanceWithin().popup();
    $( "#noUser" ).enhanceWithin().popup();
    $( "#dbError" ).enhanceWithin().popup();
    $( "#noOpenWO" ).enhanceWithin().popup();
    $( "#missingInfo" ).enhanceWithin().popup();
});

// Automatic idle logout. idleWait is how long (ms) to wait before logging someone out.
$(function () {
    
	idleTimer = null;
	idleState = false;
	idleWait = 10000;

        $('*').bind('mousemove keydown scroll', function () {
        
            clearTimeout(idleTimer);
            idleState = false;
            idleTimer = setTimeout(function () {               
                // Idle Event
                $.mobile.changePage("#login", { transition: "none"});
                idleState = true; }, idleWait);
        });
    
    });

///////////////////////
///// Login page /////
/////////////////////
$(document).on('pagebeforeshow', '#login', function(){ 
	$('#employeeID').val('');
	sessionStorage.clear();
	localStorage.clear();
	$('#employeeID').focus();	
});

$(document).on('focusout', '#employeeID', function(){ 
	$('#employeeID').focus();	
});

$(document).on('pagecreate', '#login', function(){ 
	$('#employeeID').keyup(function(event){    
	    if(event.keyCode==13){
	       $('#loginBtn').trigger("vclick");
	       console.log("Enter detected")
	    }
	});

});

$(document).on('input', '#employeeID', function() {
	var badgeID = $('#employeeID').val();
	var n = badgeID.length;
	if (badgeID.charAt(n-1) == '?') {
		var employeeID = badgeID.substr(n-7,6);
		console.log(employeeID);
		$('#employeeID').val(employeeID);
		$('#loginBtn').trigger("vclick");
	}
});

$(document).on('vclick', '#loginBtn', function() {
	var employeeID = $('#employeeID').val();    
	if (employeeID != '') {
	    function ajax() {
		    return $.ajax({
		    	beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
	            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		        type:     "post",
		        url:      "inc/getUser.php",
		        dataType: "json",
		        data:      { id : employeeID}
			});
		}

		$.when(ajax()).done(function(user) {
			if (user.message == 'User not found') {
				$("#noUser").popup("open");
	        	$( "#noUser" ).popup({
	        		afterclose: function( event, ui ) {
	        			$('#employeeID').val('');
	            		$('#employeeID').focus();
	        		}
	        	});	

			} else if (user.message == "Failed to connect to server"){
				$("#dbError").popup("open");
				$( "#dbError" ).popup({
	        		afterclose: function( event, ui ) {
	        			$('#employeeID').val('');
	            		$('#employeeID').focus();
	        		}
	        	});

			} else {
				var userInfo = user;
				//localStorage.setItem('campus', userInfo.campus);
				//sessionStorage.setItem('campus', userInfo.campus);
				localStorage.setItem('id', userInfo.IDUser);
				localStorage.setItem('firstName', userInfo.FirstName);
				localStorage.setItem('lastName', userInfo.LastName);
				$.mobile.changePage("#campus", { transition: "none"});	
			}	
		});
	}	
});
/////////////////////////////////////////
// Toolbar buttons on bottom of pages //
///////////////////////////////////////
$(document).on('click', '#newCall', function() {
	sessionStorage.clear();
	$.mobile.changePage("#campus", { transition: "none"});
});

// Save button
$(document).on("click", "#saveBtn", function () {
	if (typeof sessionStorage.getItem('locationDesc') == 'undefined') {
		var locationDesc = '';
	} else {
		var locationDesc = sessionStorage.getItem('locationDesc');
	}


	function ajax() {
	    return $.ajax({
	    	beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
	        type:     "post",
	        url:      "inc/SetWO.php",
	        dataType: "text",
	        data:      { workerID: localStorage.getItem('id'), locationID: sessionStorage.getItem('locationID'),   
	        equipment : sessionStorage.getItem('equipment'), issue : sessionStorage.getItem('issue'), 
	        workOrderID: sessionStorage.getItem('workOrderID'), locationDesc : locationDesc, close : 0}
		});
	}

	$.when(ajax()).done(function(woID) {
		//sessionStorage.setItem(workOrderID, woID)
		$.mobile.changePage("#existing", { transition: "none"});  
	});

});

////////////////////////////
// Campus selection page //
//////////////////////////
$(document).on('pagebeforeshow', '#campus', function(){   

	function ajax() {
	    return $.ajax({
	    	beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
	        type:     "post",
	        url:      "inc/getCampuses.php",
	        dataType: "json"
		});
	}

	$.when(ajax()).done(function(campuses) {
		var li = ""; 
	    $('#campusList').empty();
	    $.each(campuses, function(i, obj) {
	    	$.each(obj, function(key, campus) {
	    		li += "<li><a href='#' class='campusChoice' id='" + campus.IDLocation + "'><h1>" + campus.LocationDescription + "</h1></a></li>";
	    	});	       
	    });    

	    $('#campusList').append(li);      
	    $('#campusList').listview('refresh');  

	});

});

$(document).on("pagecreate", "#campus", function () {
       
    $('#campusList').on("vclick", ".campusChoice", function (e) {
        e.preventDefault();
        sessionStorage.setItem('campus', this.text);
        sessionStorage.setItem('campusID', this.id);
        sessionStorage.setItem('locationID', this.id);
        sessionStorage.removeItem('building');
        sessionStorage.removeItem('floor');
		sessionStorage.removeItem('unit');
        $.mobile.changePage("#building", { transition: "none"});   
    });	        

});

//////////////////////////////
// Building selection page //
////////////////////////////
$(document).on("pagebeforeshow", "#building", function () {
	if ((sessionStorage.getItem("campus") == null) || (sessionStorage.getItem("campus") == '')) {
    	 $.mobile.changePage("#campus", { transition: "none"}); 
    }
    var selectedCampus = sessionStorage.getItem('campus');
    var campusID = sessionStorage.getItem('campusID');
    console.log(selectedCampus + " selected");
    
    function ajax() {
	    return $.ajax({
	    	beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
	        type:     "post",
	        url:      "inc/getBldgs.php",
	        dataType: "json",
	        data:      { campus : selectedCampus, campusID : campusID }
		});
	}

	$.when(ajax()).done(function(buildings) {
		var li = ""; 
	    $('#bldgList').empty();
	    $.each(buildings, function(i, obj) {
	    	$.each(obj, function(key, bldg) {
	    		li += "<li><a href='#' class='bldgChoice' id='" + bldg.IDLocation + "'><h2>" + bldg.LocationDescription + "</h2></a></li>";
	    	});	       
	    });     

	    $('#bldgList').append(li);        
	    $('#bldgList').listview('refresh');  

	});

});

$(document).on("pagecreate", "#building", function () {
       
    $('#bldgList').on("vclick", ".bldgChoice", function (e) {
        e.preventDefault();
        sessionStorage.setItem('building', this.text);
        sessionStorage.setItem('buildingID', this.id);
        sessionStorage.setItem('locationID', this.id);
        sessionStorage.removeItem('floor');
        sessionStorage.removeItem('unit');
        $.mobile.changePage("#floor", { transition: "none"});   
    });	        

});

///////////////////////////
// Floor selection page //
/////////////////////////
$(document).on("pagebeforeshow", "#floor", function () {
	if ((sessionStorage.getItem("building") == null) || (sessionStorage.getItem("building") == '')) {
    	 $.mobile.changePage("#building", { transition: "none"}); 
    }
    var selectedBuilding = sessionStorage.getItem('building');
    var BuildingID = sessionStorage.getItem('buildingID');
    console.log(selectedBuilding + " selected");
    
    function ajax() {
	    return $.ajax({
	    	beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
	        type:     "post",
	        url:      "inc/getFloors.php",
	        dataType: "json",
	        data:      { building : selectedBuilding, buildingID : BuildingID }
		});
	}

	$.when(ajax()).done(function(floors) {
		var li = ""; 
	    $('#floorList').empty();
	    $.each(floors, function(i, obj) {
	    	$.each(obj, function(key, floor) {
	    		li += "<li><a href='#' class='floorChoice' id='" + floor.IDLocation + "'><h2>" + floor.LocationDescription + "</h2></a></li>";
	    	});	       
	    });     

	    $('#floorList').append(li);        
	    $('#floorList').listview('refresh');  

	});

});

$(document).on("pagecreate", "#floor", function () {
       
    $('#floorList').on("vclick", ".floorChoice", function (e) {
        e.preventDefault();
        sessionStorage.setItem('floor', this.text);
        sessionStorage.setItem('floorID', this.id);
        sessionStorage.setItem('locationID', this.id);
        sessionStorage.removeItem('unit');
        $.mobile.changePage("#equipment", { transition: "none"});   //change back to #unit once units are in hierarchy
    });	        

});

//////////////////////////
// Unit selection page //
////////////////////////
$(document).on("pagebeforeshow", "#unit", function () {
    var selectedBuilding = sessionStorage.getItem('building');
    var selectedCampus = sessionStorage.getItem('campus');
    console.log(selectedCampus + " building " + selectedBuilding + " selected");
    
    function ajax() {
	    return $.ajax({
	    	beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
	        type:     "post",
	        url:      "inc/getUnitsJSON.php",
	        dataType: "json",
	        data:      { building : selectedBuilding, campus : selectedCampus }
		});
	}

	$.when(ajax()).done(function(units) {
		var li = ""; 
	    $("#unitList").empty();
	    $.each(units, function(i, row) {
			li += "<li><a href='#' class='unitChoice' id='" + row + "'><h2>" + row + "</h2></a></li>";       
	    });  
	    $("#unitList").append(li);
	    $("#unitList").listview("refresh");  

	});

});

$(document).on("pagecreate", "#unit", function () {
    var selectedBuilding = sessionStorage.getItem('building');
    var selectedCampus = sessionStorage.getItem('campus');  
    $('#unitList').on("vclick", ".unitChoice", function (e) {
        e.preventDefault();
        sessionStorage.setItem('unit', this.id);
        $.mobile.changePage("#equipment", { transition: "none"});   
    });	        

});


///////////////////////////////
// Equipment selection page //
/////////////////////////////
$(document).on("pagebeforeshow", "#equipment", function () {
    
    function ajax() {
	    return $.ajax({
	    	beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
	        type:     "post",
	        url:      "inc/getequipmentJSON.php",
	        dataType: "json"
		});
	}

	$.when(ajax()).done(function(equipment) {
		var li = ""; 
	    $("#equipmentList").empty();
	    $.each(equipment, function(i, row) {
			li += "<li><a href='#' class='equipmentChoice' id='" + row + "'><h2>" + row + "</h2></a></li>";       
	    });  
	    $("#equipmentList").append(li);
	    $("#equipmentList").listview("refresh");  

	});

});

$(document).on("pagecreate", "#equipment", function () {
    $('#equipmentList').on("vclick", ".equipmentChoice", function (e) {
        e.preventDefault();
        sessionStorage.setItem('equipment', this.id);
        sessionStorage.removeItem('issue');
        $.mobile.changePage("#issue", { transition: "none"});   
    });	        

});


///////////////////////////
// Issue selection page //
/////////////////////////
$(document).on("pagebeforeshow", "#issue", function () {
	if ((sessionStorage.getItem("equipment") == null) || (sessionStorage.getItem("equipment") == '')) {
    	 $.mobile.changePage("#equipment", { transition: "none"}); 
    }
    function ajax() {
	    return $.ajax({
	    	beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
	        type:     "post",
	        url:      "inc/getissueJSON.php",
	        dataType: "json",
	        data:      { equipment : sessionStorage.getItem('equipment') }
		});
	}

	$.when(ajax()).done(function(issue) {
		var li = ""; 
	    $("#issueList").empty();
	    $.each(issue, function(i, row) {
			li += "<li><a href='#' class='issueChoice' id='" + row + "'><h2>" + row + "</h2></a></li>";       
	    });  
	    $("#issueList").append(li);
	    $("#issueList").listview("refresh");  

	});

});

$(document).on("pagecreate", "#issue", function () {
    $('#issueList').on("vclick", ".issueChoice", function (e) {
        e.preventDefault();
        sessionStorage.setItem('issue', this.id);
        $.mobile.changePage("#review", { transition: "none"});   
    });	        
});

//////////////////
// Review page //
////////////////
$(document).on("pagebeforeshow", "#review", function () {
	if ((sessionStorage.getItem("campus") != null) && (sessionStorage.getItem("campus") != '')) {
    	$('#campusReview').text(sessionStorage.getItem('campus')).removeClass("missing");
	}else {
		$('#campusReview').text("Select a Campus").addClass("missing");
	}
	if ((sessionStorage.getItem("building") != null) && (sessionStorage.getItem("building") != '') && (sessionStorage.getItem("building") != 'undefined')) {
    	$('#buildingReview').text(sessionStorage.getItem('building')).removeClass("missing");
    }else {
		$('#buildingReview').text("Select a Building").addClass("missing");
	}
    if ((sessionStorage.getItem("floor") != null) && (sessionStorage.getItem("floor") != '') && (sessionStorage.getItem("floor") != 'undefined')) {
    	$('#floorReview').text(sessionStorage.getItem('floor')).removeClass("missing"); 
	}else {
		$('#floorReview').text("Select a Floor").addClass("missing");
	}
	if ((sessionStorage.getItem("equipment") != null) && (sessionStorage.getItem("equipment") != '')) {
    	$('#equipmentReview').text(sessionStorage.getItem('equipment')).removeClass("missing");
    }else {
		$('#equipmentReview').text("Select Equipment Type").addClass("missing");
	}
    if ((sessionStorage.getItem("issue") != null) && (sessionStorage.getItem("issue") != '')) {
    	$('#issueReview').text(sessionStorage.getItem('issue')).removeClass("missing");
    }else {
		$('#issueReview').text("Select Issue Type").addClass("missing");
	}
});

$(document).on("click", "#closeCallBtn", function () {
	if ($("#reviewList a").hasClass("missing")) {
		$("#missingInfo").popup("open");
	} else {
    $.mobile.changePage("#time", { transition: "none"});
	}
});

//////////////////////////
// Time slection page ///
////////////////////////
$(document).on("pagecreate", "#time", function () {
    $('#timeList').on("vclick", ".timeChoice", function (e) {
        e.preventDefault();
        sessionStorage.setItem('time', this.id);

        function ajax() {
	    return $.ajax({
	    	beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
	        type:     "post",
	        url:      "inc/setWO.php",
	        dataType: "text",
	        data:      { workerID: localStorage.getItem('id'), locationID: sessionStorage.getItem('locationID'), 
	        equipment: sessionStorage.getItem('equipment'),issue: sessionStorage.getItem('issue'), 
	        time: sessionStorage.getItem('time'), workOrderID: sessionStorage.getItem('workOrderID'), close: 1}
		});
	}

		$.when(ajax()).done(function(units) {
			$.mobile.changePage("#existing", { transition: "none"});  
		});   
    });	        
});



//////////////////////////
// Existing calls page //
////////////////////////
$(document).on("pagebeforeshow", "#existing", function () {
	$("#woList").empty();
	function ajax() {
	    return $.ajax({
	    	beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
	        type:     "post",
	        url:      "inc/getWO.php",
	        dataType: "json",
	        data:      { tech: localStorage.getItem('id') }
		});
	}

	$.when(ajax()).done(function(wo) {
		var li = ""; 
		var woInfo = wo;
	    if ((woInfo == '') || woInfo == null){
	    	$("#noOpenWO").popup("open");
	    	$( "#noOpenWO" ).popup({
	        		afterclose: function( event, ui ) {
	        			$.mobile.changePage("#campus", { transition: "none"});
	        		}
	        	});	
	    	
	    } else {
	    	$.each(woInfo, function(i, obj) {
	    		$.each(obj, function(key, wo) {
	    			sessionStorage.setItem('WO#' + wo.WONumber, JSON.stringify(wo));
	    			var DateCreated = wo.DateCreated.date.replace(/-/g, "/");
	    			var dateCreated = new Date(DateCreated);
	    			var day = dateCreated.getDate();
	    			var month = dateCreated.getMonth()+1;
					var year = dateCreated.getFullYear();
					var hour = dateCreated.getHours();
					var min = dateCreated.getMinutes();
	    			var date=month + "/" + day + "/" + year + "  " + hour + ":" + min;
				li += "<li><a href='#' class='woChoice' id='WO#"+wo.WONumber+"'>" +
						"<h2>" + wo.WORequestComments + "</h2>" +
						"<p>Date: " + date + "</br> Location: " + wo.Location + "</p>" +
						"<p class='ui-li-aside'>WO: " + wo.WONumber +"</p>" +
						"</a></li>";
		    	});	       
		    }); 
 
		    $("#woList").append(li);
		    $("#woList").listview("refresh");  
	    }  
	});
});

$(document).on("click", ".woChoice", function () {
	var chosenWO = JSON.parse(sessionStorage.getItem(this.id));
	if (chosenWO.WORequestComments != null) {
		var problem = chosenWO.WORequestComments.split(" - ");
		sessionStorage.setItem('equipment', problem[0]);
		sessionStorage.setItem('issue', problem[1]);
	}

	if (chosenWO.Location != null) {
		var location = chosenWO.Location.split(" - ");
		sessionStorage.setItem('campus', location[0]);
		sessionStorage.setItem('building', location[1]);
		sessionStorage.setItem('floor', location[2]);
	}
	
	sessionStorage.setItem('locationID', chosenWO.IDLocation);
	sessionStorage.setItem('workOrderID', chosenWO.IDWorkOrder);
	
	$.mobile.changePage("#review", { transition: "none"});

});