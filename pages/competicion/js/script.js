var current_page = 1;
var total_per_page = 10;

$(document).ready(function () {
    console.log("Competicion document ready.");
	var spliter = location.search.replace('?', '').split('=');
	var eventId = spliter[1];
    listCompetitions();
	
/*    $("body").on("click", "#btnAddEvent", function (e) {
        console.log("Adding new event to ws");
        var newEventStartDate = document.getElementById("newEventStartDate").value;
        var newEventStartTime = document.getElementById("newEventStartTime").value;
        var newEventEndDate = document.getElementById("newEventEndDate").value;
        var newEventEndTime = document.getElementById("newEventEndTime").value;
        var newEventName = document.getElementById("newEventName").value;
        var newEventDesc = document.getElementById("newEventDesc").value;
        var newEventStart = newEventStartDate + "T" + newEventStartTime+ ":00";
        var newEventEnd = newEventEndDate + "T" + newEventEndTime+ ":00";
        addEvent(newEventStart, newEventEnd, newEventName, newEventDesc);
    }); */
	
/*	$("body").on("click", ".btnModif", function (e) {
        console.log("Sending modified event data to ws");
        var eventId = $(this).attr("id");
        var newEventStartDate = "" + $(this).attr("data-event-startdate");
        var newEventEndDate = "" + $(this).attr("data-event-enddate");
		var newEventName = $(this).attr("data-event-name");
        var newEventDesc = $(this).attr("data-event-description");
		$("#eventId").attr("value", function(){return eventId});
		$("#newEventName2").attr("value", function(){return newEventName;});
		$("#newEventDesc2").val(newEventDesc);
		var startDate = newEventStartDate.substring(0,10);
		$("#newEventStartDate2").attr("value", function(){return startDate;});
		var startHour = newEventStartDate.substring(11,16);
		$("#newEventStartTime2").attr("value", function(){return startHour;});
		var endDate = newEventEndDate.substring(0,10);
		$("#newEventEndDate2").attr("value", function(){return endDate;});
		var endHour = newEventEndDate.substring(11,16);
		$("#newEventEndTime2").attr("value", function(){return endHour;});
    });*/
	
/*    $("body").on("click", "#btnModifEvent", function (e) {
        console.log("Adding new event to ws");
		var eventId  = document.getElementById("eventId").value;
        var newEventStartDate = document.getElementById("newEventStartDate2").value;
        var newEventStartTime = document.getElementById("newEventStartTime2").value;
        var newEventEndDate = document.getElementById("newEventEndDate2").value;
        var newEventEndTime = document.getElementById("newEventEndTime2").value;
        var newEventName = document.getElementById("newEventName2").value;
        var newEventDesc = document.getElementById("newEventDesc2").value;
        var newEventStart = newEventStartDate + "T" + newEventStartTime+ ":00";
        var newEventEnd = newEventEndDate + "T" + newEventEndTime+ ":00";
        modifEvent(eventId, newEventStart, newEventEnd, newEventName, newEventDesc);
    });*/
	
/*	$("body").on("click", ".btnDel", function (e) {
        console.log("Deleting event data from ws");
        var eventId = $(this).attr("id");
		delEvent(eventId);
    });*/
});


function listCompetitions() {
    var limit = (current_page - 1) * total_per_page;
    var offset = current_page * total_per_page;
	var eventId = localStorage.getItem('listCompetitionEventId');
	var token = localStorage.getItem('token');
    console.log(token);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.COMPETICIONES_LISTAR_DESDE_HASTA+ eventId + "/" + limit + "/" + offset,
		headers: {
			"Authorization":"oauth " + token
        },
        success: function (data) {
            console.log(data);
            $.each(data, function (i, evnt) {
                console.log(evnt);
                var html = parseCompetitionToHtml(evnt);
                $("#listCompetitionsContent").append(html);
            });
        },
    });
}

function parseCompetitionToHtml(event) {
    return '<li class="list-group-item"><div class="thumbnail"><div class="caption"><h2>' + event.name + '</h2><p>Disciplina : ' + event.disciplineId.name + '</p><p>' + event.description +
            '</p><a id="' + event.competitionId + '" class="btn btn-primary btnModif" href="#" data-toggle="modal" data-target="#modifCompetitionModal" data-competition-name="' + event.name + '" data-competition-description="' + event.description + '" data-competition-disciplineId-name="' + event.disciplineId.name + '" data-competition-locationId-name="' + event.locationId.name + '">Modificar</a> <a class="btn btn-primary btnDel" href="#" id="' + event.competitionId + '">Borrar</a></div></div></li>';
    '</p></div></div></li>';
}

/*function modifEvent(eventId, newEventStart, newEventEnd, newEventName, newEventDesc) {
    var arr = {description: newEventDesc, endDate: newEventEnd, name: newEventName,startDate: newEventStart, styleType: 0 };
    console.log(arr);
    var token = localStorage.getItem('token');
    console.log(token);
	var theURL = "http://tecnocompetition.ddns.net:8080/pfinal/services/entities.maincompetition/" + eventId;
    $.ajax({
        url: theURL,
        type: 'PUT',
        headers: {
		"Authorization":"oauth " + token
        },
        data: JSON.stringify(arr),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function (msg) {
		$('#modifEventModal').modal('hide');
		setTimeout(function() { $("#content").load("pages/evento/evento.html"); }, 1000);
        }
    });
}*/


/*function addEvent(newEventStart, newEventEnd, newEventName, newEventDesc) {
    var arr = {description: newEventDesc, endDate: newEventEnd, name: newEventName,startDate: newEventStart, styleType: 0 };
    console.log(arr);
    var token = localStorage.getItem('token');
    console.log(token);
    $.ajax({
        url: 'http://tecnocompetition.ddns.net:8080/pfinal/services/entities.maincompetition/',
        type: 'POST',
        headers: {
		"Authorization":"oauth " + token
        },
        data: JSON.stringify(arr),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function (msg) {
        	$('#addEventModal').modal('hide');
		setTimeout(function() { $("#content").load("pages/evento/evento.html"); }, 1000);
        }
    });
}*/

/*function delEvent(eventId) {
    var token = localStorage.getItem('token');
    console.log(token);
	var theURL = "http://tecnocompetition.ddns.net:8080/pfinal/services/entities.maincompetition/" + eventId;
    $.ajax({
        url: theURL,
        type: 'DELETE',
        headers: {
		"Authorization":"oauth " + token
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function (msg) {
			setTimeout(function() { $("#content").load("pages/evento/evento.html"); }, 1000)
        }
    });
}*/