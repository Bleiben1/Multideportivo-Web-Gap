var current_page = 1;
var total_per_page = 10;

$(document).ready(function () {
    console.log("Competicion document ready.");
    listCompetitions();
	
	$("body").on("click", ".btnAddCompetitionModalToggle", function (e) {
		console.log("Population events select");
		populateEventSelect();
	});
	
    /*$("body").on("click", "#btnAddEvent", function (e) {
        console.log("Adding new competition to ws");
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
	
	$("body").on("click", ".btnModif", function (e) {
        console.log("Sending modified competition data to ws");
        var competitionId = $(this).attr("id");
		var newCompetitionName = $(this).attr("data-competition-name");
		var newCompetitionDescription = $(this).attr("data-competition-description");
		/* var newEventStartDate = "" + $(this).attr("data-event-startdate");
        var newEventEndDate = "" + $(this).attr("data-event-enddate");
		var newEventName = $(this).attr("data-event-name");
        var newEventDesc = $(this).attr("data-event-description");*/
		$("#competitionId").attr("value", function(){return competitionId});
		$("#newCompetitionName").attr("value", function(){return newCompetitionName;});
		$("#newCompetitionDescription").val(newCompetitionDescription);
    });
	
/*    $("body").on("click", "#btnModifCompetition", function (e) {
        console.log("Adding new event to ws");
		var competitionId  = document.getElementById("competitionId").value;
        var newCompetitionName = document.getElementById("newCompetitionName").value;
        var newCompetitionDescription = document.getElementById("newCompetitionDescription").value;
        modifCompetition(competitionId, newCompetitionName, newCompetitionDescription);
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
	var	wsurl = "";
	if (eventId === null){
		wsurl = WS_URLS.COMPETICIONES_LISTAR_DESDE_HASTA + limit + "/" + offset;
	}else{
		wsurl = WS_URLS.COMPETICIONES_LISTAR_DESDE_HASTA+ eventId + "/" + limit + "/" + offset;
	}
	var token = localStorage.getItem('token');
    console.log(token);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: wsurl,
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
    localStorage.removeItem("listCompetitionEventId");
}

function parseCompetitionToHtml(event) {
    return '<li class="list-group-item"><div class="thumbnail"><div class="caption"><h2>' + event.name + '</h2><p>Disciplina : ' + event.disciplineId.name + '</p><p>' + event.description +
            '</p><a id="' + event.competitionId + '" class="btn btn-primary btnModif" href="#" data-toggle="modal" data-target="#modifCompetitionModal" data-competition-name="' + event.name + '" data-competition-description="' + event.description + '" data-competition-disciplineId-name="' + event.disciplineId.name + '" data-competition-locationId-name="' + event.locationId.name + '">Modificar</a> <a class="btn btn-primary btnDel" href="#" id="' + event.competitionId + '">Borrar</a></div></div></li>';
    '</p></div></div></li>';
}

function populateEventSelect() {
	var limit = 0;
    var offset = 50;
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.EVENTOS_LISTAR_DESDE_HASTA + limit + "/" + offset,
        success: function (data) {
            console.log(data);
            $.each(data, function (i, evnt) {
                console.log(evnt);
                var html = parseEventToPopulateSelectHtml(evnt);
                $("#newCompetitionMainCompetitionId").append(html);
            });
        },
    });
}

function parseEventToPopulateSelectHtml(event) {
    return '<option value=' + event.mainCompetitionId + '>' + event.name + '</option>';
}

/* se consultará por la def. del ws sobre esta funcionalidad 
function modifCompetition(competitionId, newCompetitionName, newCompetitionDescription) {
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
