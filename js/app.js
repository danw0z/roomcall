// Instantiate the popup on DOMReady, and enhance its contents
$(function() {
    $( "#logout" ).enhanceWithin().popup();
<<<<<<< HEAD
    $( "#noUser" ).enhanceWithin().popup();
});


=======
});
$(function() {
    $( "#noUser" ).enhanceWithin().popup();
});

>>>>>>> First commit
$(function () {
    
	idleTimer = null;
	idleState = false;
	idleWait = 60000;

        $('*').bind('mousemove keydown scroll', function () {
        
            clearTimeout(idleTimer);
            idleState = false;
            idleTimer = setTimeout(function () {               
                // Idle Event
                $.mobile.changePage("#login", { transition: "none"});
                idleState = true; }, idleWait);
        });
    
    });

$(document).on('pagebeforeshow', '#login', function(){ 
	$('#employeeID').val('');
	sessionStorage.clear();
	localStorage.clear();	
});

$(document).on('pageshow', '#login', function(){ 
	$('#employeeID').focus();
});

$(document).on('change', '#employeeID', function() {
	var badgeID = $('#employeeID').val();
	var n = badgeID.length;
	if (badgeID.charAt(n-1) == '?') {
		var employeeID = badgeID.substr(n-7,6);
		console.log(employeeID);
		$('#employeeID').val(employeeID);
		$('#loginBtn').click();
	}

});


$(document).on('vclick', '#loginBtn', function() {
	var employeeID = $('#employeeID').val();    
    function ajax() {
	    return $.ajax({
	        type:     "post",
	        url:      "inc/getUser.php",
	        dataType: "json",
	        data:      { id : employeeID }
		});
	}

	$.when(ajax()).done(function(user) {
		if (user.message == 'User not found') {
			$("#noUser").popup("open");
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
	
});


$(document).on('click', '#newCall', function() {
	sessionStorage.clear();
	$.mobile.changePage("#campus", { transition: "none"});
});

$(document).on('pagebeforeshow', '#campus', function(){   

	function ajax1() {
	    return $.ajax({
	        type:     "post",
	        url:      "inc/getCampuses.php",
	        dataType: "json"
		});
	}

	$.when(ajax1()).done(function(campuses) {
		var li = ""; 
	    $('#campusList').empty();
	    $.each(campuses, function(i, obj) {
	    	$.each(obj, function(key, campus) {
	    		li += "<li><a href='#' class='campusChoice' id='" + campus.IDLocation + "'><h2>" + campus.LocationDescription + "</h2></a></li>";
	    	});	       
	    });    

	    $('#campusList').append(li);      
	    $('#campusList').listview('refresh');  

	});

});

$(document).on("pageinit", "#campus", function () {
       
    $('#campusList').on("vclick", ".campusChoice", function (e) {
        e.preventDefault();
        sessionStorage.setItem('campus', this.text);
        sessionStorage.setItem('campusID', this.id);
        sessionStorage.removeItem('building');
        sessionStorage.removeItem('floor');
		sessionStorage.removeItem('unit');
        $.mobile.changePage("#building", { transition: "none"});   
    });	        

});


$(document).on("pagebeforeshow", "#building", function () {

    var selectedCampus = sessionStorage.getItem('campus');
    var campusID = sessionStorage.getItem('campusID');
    console.log(selectedCampus + " selected");
    
    function ajax2() {
	    return $.ajax({
	        type:     "post",
	        url:      "inc/getBldgs.php",
	        dataType: "json",
	        data:      { campus : selectedCampus, campusID : campusID }
		});
	}

	$.when(ajax2()).done(function(buildings) {
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

$(document).on("pageinit", "#building", function () {
       
    $('#bldgList').on("vclick", ".bldgChoice", function (e) {
        e.preventDefault();
        sessionStorage.setItem('building', this.text);
        sessionStorage.setItem('buildingID', this.id);
        sessionStorage.removeItem('floor');
        sessionStorage.removeItem('unit');
        $.mobile.changePage("#floor", { transition: "none"});   
    });	        

});



$(document).on("pagebeforeshow", "#floor", function () {

    var selectedBuilding = sessionStorage.getItem('building');
    var BuildingID = sessionStorage.getItem('buildingID');
    console.log(selectedBuilding + " selected");
    
    function ajax2() {
	    return $.ajax({
	        type:     "post",
	        url:      "inc/getFloors.php",
	        dataType: "json",
	        data:      { building : selectedBuilding, buildingID : BuildingID }
		});
	}

	$.when(ajax2()).done(function(floors) {
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

$(document).on("pageinit", "#floor", function () {
       
    $('#floorList').on("vclick", ".floorChoice", function (e) {
        e.preventDefault();
        sessionStorage.setItem('floor', this.text);
        sessionStorage.setItem('floorID', this.id);
        sessionStorage.removeItem('unit');
        $.mobile.changePage("#unit", { transition: "none"});   
    });	        

});



$(document).on("pagebeforeshow", "#unit", function () {
    var selectedBuilding = sessionStorage.getItem('building');
    var selectedCampus = sessionStorage.getItem('campus');
    console.log(selectedCampus + " building " + selectedBuilding + " selected");
    
    function ajax3() {
	    return $.ajax({
	        type:     "post",
	        url:      "inc/getUnitsJSON.php",
	        dataType: "json",
	        data:      { building : selectedBuilding, campus : selectedCampus }
		});
	}

	$.when(ajax3()).done(function(units) {
		var li = ""; 
	    $("#unitList").empty();
	    $.each(units, function(i, row) {
			li += "<li><a href='#' class='unitChoice' id='" + row + "'><h2>" + row + "</h2></a></li>";       
	    });  
	    $("#unitList").append(li);
	    $("#unitList").listview("refresh");  

	});

});

$(document).on("pageinit", "#unit", function () {
    var selectedBuilding = sessionStorage.getItem('building');
    var selectedCampus = sessionStorage.getItem('campus');  
    $('#unitList').on("vclick", ".unitChoice", function (e) {
        e.preventDefault();
        sessionStorage.setItem('unit', this.id);
        $.mobile.changePage("#equipment", { transition: "none"});   
    });	        

});

$(document).on("pagebeforeshow", "#equipment", function () {
    
    function ajax4() {
	    return $.ajax({
	        type:     "post",
	        url:      "inc/getequipmentJSON.php",
	        dataType: "json"
		});
	}

	$.when(ajax4()).done(function(equipment) {
		var li = ""; 
	    $("#equipmentList").empty();
	    $.each(equipment, function(i, row) {
			li += "<li><a href='#' class='equipmentChoice' id='" + row + "'><h2>" + row + "</h2></a></li>";       
	    });  
	    $("#equipmentList").append(li);
	    $("#equipmentList").listview("refresh");  

	});

});

$(document).on("pageinit", "#equipment", function () {
    $('#equipmentList').on("vclick", ".equipmentChoice", function (e) {
        e.preventDefault();
        sessionStorage.setItem('equipment', this.id);
        sessionStorage.removeItem('issue');
        $.mobile.changePage("#issue", { transition: "none"});   
    });	        

});

$(document).on("pagebeforeshow", "#issue", function () {
    var selectedEquipment = sessionStorage.getItem('equipment');
    function ajax4() {
	    return $.ajax({
	        type:     "post",
	        url:      "inc/getissueJSON.php",
	        dataType: "json",
	        data:      { equipment : selectedEquipment }
		});
	}

	$.when(ajax4()).done(function(issue) {
		var li = ""; 
	    $("#issueList").empty();
	    $.each(issue, function(i, row) {
			li += "<li><a href='#' class='issueChoice' id='" + row + "'><h2>" + row + "</h2></a></li>";       
	    });  
	    $("#issueList").append(li);
	    $("#issueList").listview("refresh");  

	});

});

$(document).on("pageinit", "#issue", function () {
    $('#issueList').on("vclick", ".issueChoice", function (e) {
        e.preventDefault();
        sessionStorage.setItem('issue', this.id);
        $.mobile.changePage("#time", { transition: "none"});   
    });	        

});

$(document).on("pageinit", "#time", function () {
    $('#timeList').on("vclick", ".timeChoice", function (e) {
        e.preventDefault();
        sessionStorage.setItem('time', this.id);
        $.mobile.changePage("#review", { transition: "none"});   
    });	        

});

$(document).on("pagebeforeshow", "#review", function () {
	if (sessionStorage.getItem("campus") != '') {
    	$('#campusReview').text(sessionStorage.getItem('campus'));
	}else {
		$('#campusReview').text("Select a Campus");
	}
	if (sessionStorage.getItem("building") != '') {
    	$('#buildingReview').text(sessionStorage.getItem('building')); 
    }else {
		$('#buildingReview').text("Select a Building");
	}
    if (sessionStorage.getItem("unit") != '') {
    	$('#unitReview').text(sessionStorage.getItem('unit')); 
	}else {
		$('#unitReview').text("Select a Unit");
	}
	if (sessionStorage.getItem("equipment") != '') {
    	$('#equipmentReview').text(sessionStorage.getItem('equipment')); 
    }else {
		$('#equipmentReview').text("Select Equipment Type");
	}
    if (sessionStorage.getItem("issue") != '') {
    	$('#issueReview').text(sessionStorage.getItem('issue')); 
    }else {
		$('#issueReview').text("Select Issue Type");
	}
    if (sessionStorage.getItem("time") != '') {
    	$('#timeReview').text(sessionStorage.getItem('time') + " mins");     
	}else {
		$('#timeReview').text("Select Time");
	}
});

$(document).on("click", "#closeCallBtn", function () {
	function ajax() {
	    return $.ajax({
	        type:     "post",
	        url:      "inc/setWO.php",
	        dataType: "text",
	        data:      { tech: sessionStorage.getItem('username'), status: 'Complete',   
	        campus: sessionStorage.getItem('campus'), building : sessionStorage.getItem('building'),
	        unit: sessionStorage.getItem('unit'), equipment: sessionStorage.getItem('equipment'),
	        issue: sessionStorage.getItem('issue'), time: sessionStorage.getItem('time'),
	    	index: sessionStorage.getItem('index') }
		});
	}

	$.when(ajax()).done(function(units) {
		$.mobile.changePage("#existing", { transition: "none"});  
	});

});

$(document).on("click", "#saveBtn", function () {
	if (typeof sessionStorage.getItem('equipment') == 'undefined') {
		var selectedEquipment = '';
	} else {
		var selectedEquipment = sessionStorage.getItem('equipment');
	}

	if (sessionStorage.getItem('issue') == 'undefined') {
		var selectedIssue = '';
	} else {
		var selectedIssue = sessionStorage.getItem('issue');
	}

	if (sessionStorage.getItem('time') == 'undefined') {
		var selectedTime = '';
	} else {
		var selectedTime = sessionStorage.getItem('time');
	}

	function ajax() {
	    return $.ajax({
	        type:     "post",
	        url:      "inc/setWO.php",
	        dataType: "text",
	        data:      { tech: sessionStorage.getItem('username'), status: 'In Progress',   
	        campus: sessionStorage.getItem('campus'), building : sessionStorage.getItem('building'),
	        unit: sessionStorage.getItem('unit'), equipment: selectedEquipment,
	        issue: selectedIssue, time: selectedTime,
	    	index: sessionStorage.getItem('index') }
		});
	}

	$.when(ajax()).done(function(units) {
		$.mobile.changePage("#existing", { transition: "none"});  
	});

});

$(document).on("pagebeforeshow", "#existing", function () {
	function ajax() {
	    return $.ajax({
	        type:     "post",
	        url:      "inc/getWO.php",
	        dataType: "json",
	        data:      { tech: localStorage.getItem('id') }
		});
	}

	$.when(ajax()).done(function(wo) {
		var li = ""; 
		var woInfo = wo;
	    $("#woList").empty();
	    if (woInfo == ''){
	    	alert("No Open Room calls")
	    } else {
	    	$.each(woInfo, function(i, obj) {
	    		$.each(obj, function(key, wo) {
	    			sessionStorage.setItem('WO#' + wo.WONumber, JSON.stringify(wo));
				li += "<li><a href='#' class='woChoice' id='WO#"+wo.WONumber+"'><h2>WO #: " + wo.WONumber + "</h2><p>Date: <p>Location: " + wo.Location +"</p></a></li>";
		    	});	       
		    }); 
 
		    $("#woList").append(li);
		    $("#woList").listview("refresh");  
	    }  
	});
});


$(document).on("click", ".woChoice", function () {
	var chosenWO = JSON.parse(sessionStorage.getItem(this.id));
	//var problem = chosenWO.problem.split(" - ");
	console.log(problem);
	sessionStorage.setItem('campus', chosenWO.campus);
	sessionStorage.setItem('building', chosenWO.building);
	sessionStorage.setItem('unit', chosenWO.unit);
	sessionStorage.setItem('equipment', problem[0]);
	sessionStorage.setItem('issue', problem[1]);
	sessionStorage.setItem('time', chosenWO.time);
	sessionStorage.setItem('index', chosenWO.index);

	$.mobile.changePage("#review", { transition: "none"});

});