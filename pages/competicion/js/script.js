var current_page = 1;
var total_per_page = 10;
var count = 1;

$(document).ready(function () {
    console.log("Competicion document ready.");
    listCompetitions();
	
	$("body").on("click", ".btnAddCompetitionModalToggle", function (e) {
		console.log("Population events select");
		populateEventSelect("newCompetitionMainCompetitionId");
	});
	
    $("body").on("click", "#btnAddCompetition", function (e) {
        console.log("Adding new competition to ws");
		showLoader();
        var newCompetitionMainCompetitionId = document.getElementById("newCompetitionMainCompetitionId").value;
        var newCompetitionLocationId = document.getElementById("newCompetitionLocationId").value;
        var newCompetitionName = document.getElementById("newCompetitionName").value;
        var newCompetitionDesc = document.getElementById("newCompetitionDesc").value;
        var newCompetitionStartDate = document.getElementById("newCompetitionStartDate").value;
        var newCompetitionStartTime = document.getElementById("newCompetitionStartTime").value;
        var newCompetitionDisciplineId = document.getElementById("newCompetitionDisciplineId").value;
        var newCompetitionStart = newCompetitionStartDate + "T" + newCompetitionStartTime+ ":00";
        addCompetition(newCompetitionMainCompetitionId, newCompetitionLocationId, newCompetitionName, newCompetitionDesc, newCompetitionDisciplineId, newCompetitionStart);
    });
	
	$("body").on("click", ".btnModif", function (e) {
        console.log("Sending modified competition data to ws");
        var competitionId = $(this).attr("id");
		var newCompetitionName = $(this).attr("data-competition-name");
		var newCompetitionDescription = $(this).attr("data-competition-description");
		var newCompetitionStartDate = "" + $(this).attr("data-competition-startdate");
		$("#competitionId").attr("value", function(){return competitionId});
		$("#newCompetitionName2").attr("value", function(){return newCompetitionName;});
		$("#newCompetitionDesc2").val(newCompetitionDescription);
		var startDate = newCompetitionStartDate.substring(0,10);
		$("#newCompetitionStartDate2").attr("value", function(){return startDate;});
		var startHour = newCompetitionStartDate.substring(11,16);
		$("#newCompetitionStartTime2").attr("value", function(){return startHour;});
		populateEventSelect("newCompetitionMainCompetitionId2");
		document.getElementById('newCompetitionMainCompetitionId2').value = $(this).attr("data-competition-mainCompetitionId");
		document.getElementById('newCompetitionDisciplineId2').value = $(this).attr("data-competition-disciplineId");
		document.getElementById('newCompetitionLocationId2').value = $(this).attr("data-competition-locationId-locationId");
    });
	
    $("body").on("click", "#btnModifCompetition", function (e) {
        console.log("Editing competition to ws");
		showLoader();
		var competitionId  = document.getElementById("competitionId").value;
        var newCompetitionMainCompetitionId = document.getElementById("newCompetitionMainCompetitionId2").value;
        var newCompetitionLocationId = document.getElementById("newCompetitionLocationId2").value;
        var newCompetitionName = document.getElementById("newCompetitionName2").value;
        var newCompetitionDesc = document.getElementById("newCompetitionDesc2").value;
        var newCompetitionDisciplineId = document.getElementById("newCompetitionDisciplineId2").value;
        var newCompetitionStartDate = document.getElementById("newCompetitionStartDate2").value;
        var newCompetitionStartTime = document.getElementById("newCompetitionStartTime2").value;
        var newCompetitionStart = newCompetitionStartDate + "T" + newCompetitionStartTime+ ":00";
        modifCompetition(competitionId, newCompetitionMainCompetitionId, newCompetitionLocationId, newCompetitionName, newCompetitionDesc, newCompetitionDisciplineId, newCompetitionStart);
    });
	
	$("body").on("click", ".btnDel", function (e) {
        console.log("Deleting competition data from ws");
        var competitionId = $(this).attr("id");
		delCompetition(competitionId);
    });
	
	$("body").on("click", ".btnParticipation", function (e) {
		if (count == 1){
			console.log("Getting participants data from ws");
			showLoader();
			var competitionId = $(this).attr("id");
			listParticipants(competitionId);
		}
		count = count + 1;
    });
	
});

function listParticipants(competitionId) {
	console.log("getting participants from ws, please wait...");
	localStorage.setItem("listParticipantCompetitionId", competitionId);
	$("#content").load("pages/participacion/participacion.html");
}

function listCompetitions() {
    var limit = (current_page - 1) * total_per_page;
    var offset = current_page * total_per_page;
	var eventId = localStorage.getItem('listCompetitionEventId');
	var	wsurl = "";
	if (localStorage.getItem('listCompetitionEventId') === null){
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
		statusCode: {
			400: function () {
				addAlert(DB_ERROR, 'competitionAlert');
			},
			401: function () {
				addAlert(NOT_AUTHORIZED, 'competitionAlert');
			},
            404: function () {
				$("#listCompetitionsContent").append('<li class="list-group-item"><div class="thumbnail"><div class="caption"><p>No se encontraron Competiciones para este evento ...</p></div></div></li>');
            },
			415: function () {
				addAlert(NOT_ALLOWED_METHOD, 'competitionAlert');
			},
			500: function () {
				addAlert(CONSTANTE_ERROR_MESSAGE_SERVIDOR_500, 'competitionAlert');
			}
        }
    });
	hideLoader();
    localStorage.removeItem("listCompetitionEventId");
}

function parseCompetitionToHtml(event) {
	var eventStartDate = event.startDate;
	alert(eventStartDate);
	var startDate = eventStartDate.substring(0,10);
	var startHour = eventStartDate.substring(11,16);
    return '<li class="list-group-item"><div class="thumbnail"><div class="caption"><h2>' + event.name + '</h2><p>Disciplina : ' + event.disciplineId.name + '</p><p>' + event.description +
            '</p><p>Fecha de inicio: ' + startDate + ' Hora de inicio: ' + startHour + '</p><a id="' + event.competitionId + '" class="btn btn-primary btnModif" href="#" data-toggle="modal" data-target="#modifCompetitionModal" data-competition-name="' + event.name + '" data-competition-description="' + event.description + '" data-competition-mainCompetitionId="' + event.mainCompetitionId.mainCompetitionId + '" data-competition-disciplineId="' + event.disciplineId.disciplineId + '" data-competition-disciplineId-name="' + event.disciplineId.name + '" data-competition-locationId-locationId="' + event.locationId.locationId + '" data-competition-startdate="' + event.startDate + '" data-competition-locationId-name="' + event.locationId.name + '">Modificar</a> <a class="btn btn-primary btnDel" href="#" id="' + event.competitionId + '">Borrar</a> <a class="btn btn-primary btnParticipation" href="#" id="' + event.competitionId + '">Gestionar Atletas Participantes</a></div></div></li>';
    '</p></div></div></li>';
}

function populateEventSelect(selector) {
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
                $("#" + selector + "").append(html);
            });
        },
    });
}

function parseEventToPopulateSelectHtml(event) {
    return '<option value=' + event.mainCompetitionId + '>' + event.name + '</option>';
}

function modifCompetition(competitionId, newCompetitionMainCompetitionId, newCompetitionLocationId, newCompetitionName, newCompetitionDesc, newCompetitionDisciplineId, newCompetitionStart) {
   	$('#modifCompetitionModal').modal('hide');
    var arr = {mainCompetitionId: {mainCompetitionId: newCompetitionMainCompetitionId}, locationId: {locationId: newCompetitionLocationId}, name: newCompetitionName, description: newCompetitionDesc, disciplineId: {disciplineId: newCompetitionDisciplineId}, startDate: newCompetitionStart};
    console.log(arr);
    var token = localStorage.getItem('token');
    console.log(token);
	var theURL = "http://tecnocompetition.ddns.net:8080/pfinal/services/entities.competition/" + competitionId;
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
			addAlert('Competición modificada con exito', 'competitionAlert');
        },
		statusCode: {
			400: function () {
				addAlert(DB_ERROR, 'competitionAlert');
			},
			401: function () {
				addAlert(NOT_AUTHORIZED, 'competitionAlert');
			},
			415: function () {
				addAlert(NOT_ALLOWED_METHOD, 'competitionAlert');
			},
			500: function () {
				addAlert(CONSTANTE_ERROR_MESSAGE_SERVIDOR_500, 'competitionAlert');
			}
        }
    });
	hideLoader();
	setTimeout(function() { $("#content").load("pages/competicion/competicion.html"); }, 500);
}


function addCompetition(newCompetitionMainCompetitionId, newCompetitionLocationId, newCompetitionName, newCompetitionDesc, newCompetitionDisciplineId, newCompetitionStart) {
   	$('#addCompetitionModal').modal('hide');
    var arr = {mainCompetitionId: {mainCompetitionId: newCompetitionMainCompetitionId}, locationId: {locationId: newCompetitionLocationId}, name: newCompetitionName, description: newCompetitionDesc, disciplineId: {disciplineId: newCompetitionDisciplineId}, startDate: newCompetitionStart};
    console.log(arr);
    var token = localStorage.getItem('token');
    console.log(token);
    $.ajax({
        url: 'http://tecnocompetition.ddns.net:8080/pfinal/services/entities.competition/',
        type: 'POST',
        headers: {
		"Authorization":"oauth " + token
        },
        data: JSON.stringify(arr),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function (msg) {
			console.log('competicion agregada con exito');
			addAlert('Competicion agregada con exito', 'competitionAlert');
        },
		statusCode: {
			400: function () {
				addAlert(DB_ERROR, 'competitionAlert');
			},
			401: function () {
				alert("actualizado");
				console.log('Ha ocurrido un error: ' + NOT_AUTHORIZED);
				addAlert(NOT_AUTHORIZED, 'competitionAlert');
			},
			415: function () {
				addAlert(NOT_ALLOWED_METHOD, 'competitionAlert');
			},
			500: function () {
				addAlert(CONSTANTE_ERROR_MESSAGE_SERVIDOR_500, 'competitionAlert');
			}
        }
    });
	hideLoader();
	setTimeout(function() { $("#content").load("pages/competicion/competicion.html"); }, 500);
}

function delCompetition(competitionId) {
    var token = localStorage.getItem('token');
    console.log(token);
	var theURL = "http://tecnocompetition.ddns.net:8080/pfinal/services/entities.competition/" + competitionId;
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
			console.log('Competicion borrado con exito');
			addAlert('Competicion borrada con exito', 'competitionAlert');
        },
		statusCode: {
			400: function () {
				addAlert(DB_ERROR, 'eventAlert');
			},
			401: function () {
				addAlert(NOT_AUTHORIZED, 'eventAlert');
			},
			415: function () {
				addAlert(NOT_ALLOWED_METHOD, 'eventAlert');
			},
			500: function () {
				addAlert(CONSTANTE_ERROR_MESSAGE_SERVIDOR_500, 'eventAlert');
			}
        }
    });
	setTimeout(function() { $("#content").load("pages/competicion/competicion.html"); }, 500);
}
