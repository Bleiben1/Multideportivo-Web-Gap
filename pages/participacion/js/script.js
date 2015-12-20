var current_page = 1;
var total_per_page = 10;

$(document).ready(function () {
    console.log("Participacion document ready.");
	$("#listParticipantsContent").empty();
	listParticipants();
	console.log("Populating selects");
	populateSelects();
	
	$("body").on("click", ".btnAddParticipantModalToggle", function (e) {
	});
	
    $("body").on("click", "#btnAddParticipant", function (e) {
        console.log("Adding new participant to ws");
		showLoader();
        var newParticipantAthleteId = document.getElementById("newParticipantAthleteId").value;
        var newParticipantMainCompetitionId = document.getElementById("newParticipantMainCompetitionId").value;
        var newParticipantPosition = document.getElementById("newParticipantPosition").value;
        addParticipant(newParticipantAthleteId, newParticipantMainCompetitionId, newParticipantPosition);
    });
	
	/*
	$("body").on("click", ".btnModif", function (e) {
        console.log("Sending modified competition data to ws");
        var competitionId = $(this).attr("id");
		var newCompetitionName = $(this).attr("data-competition-name");
		var newCompetitionDescription = $(this).attr("data-competition-description");
		$("#competitionId").attr("value", function(){return competitionId});
		$("#newCompetitionName2").attr("value", function(){return newCompetitionName;});
		$("#newCompetitionDesc2").val(newCompetitionDescription);
		populateEventSelect("newCompetitionMainCompetitionId2");
		document.getElementById('newCompetitionMainCompetitionId2').value = $(this).attr("data-competition-mainCompetitionId");
		document.getElementById('newCompetitionDisciplineId2').value = $(this).attr("data-competition-disciplineId");
		document.getElementById('newCompetitionLocationId2').value = $(this).attr("data-competition-locationId-locationId");
    });
	
    $("body").on("click", "#btnModifCompetition", function (e) {
        console.log("Editing competition to ws");
		var competitionId  = document.getElementById("competitionId").value;
        var newCompetitionMainCompetitionId = document.getElementById("newCompetitionMainCompetitionId2").value;
        var newCompetitionLocationId = document.getElementById("newCompetitionLocationId2").value;
        var newCompetitionName = document.getElementById("newCompetitionName2").value;
        var newCompetitionDesc = document.getElementById("newCompetitionDesc2").value;
        var newCompetitionDisciplineId = document.getElementById("newCompetitionDisciplineId2").value;
        modifCompetition(competitionId, newCompetitionMainCompetitionId, newCompetitionLocationId, newCompetitionName, newCompetitionDesc, newCompetitionDisciplineId);
    });
	*/
	
	/*
	$("body").on("click", ".btnDel", function (e) {
        console.log("Deleting competition data from ws");
        var competitionId = $(this).attr("id");
		delCompetition(competitionId);
    });
	*/
});

function listParticipants() {
	var limit = (current_page - 1) * total_per_page;
	var offset = current_page * total_per_page;
	var competitionId = localStorage.getItem('listParticipantCompetitionId');
	var	wsurl = "";
	if (localStorage.getItem('listParticipantCompetitionId') === null){
		console.log("Ha ocurrido un error, no se seleccionó competición");
	}else{
		var token = localStorage.getItem('token');
		console.log(token);
		$.ajax({
			type: "GET",
			dataType: "json",
			url: 'http://tecnocompetition.ddns.net:8080/pfinal/services/entities.participation/competition/' + competitionId,
			success: function (data) {
				console.log(data);
				$.each(data, function (i, evnt) {
                                        var html = parseParticipants2ToHtml(evnt);
                                        console.log("la info del evento es: " + evnt);
                                        $("#ParticipationTable > thead:last").append (html);
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
						$("#listParticipantsContent").append('<li class="list-group-item"><div class="thumbnail"><div class="caption"><p>No se encontraron Atletas participando en esta competición ...</p></div></div></li>');
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
	}
}

function populateSelects() {
	var limit = 0;
    var offset = 50;
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.ATHLETES_LISTAR_DESDE_HASTA + limit + "/" + offset,
        success: function (data) {
            console.log(data);
            $.each(data, function (i, evnt) {
                console.log(evnt);
                var html = parseAthleteToPopulateSelectHtml(evnt);
                $("#newParticipantAthleteId").append(html);
            });
        },
    });
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.COMPETICIONES_LISTAR_DESDE_HASTA + limit + "/" + offset,
        success: function (data) {
            console.log(data);
            $.each(data, function (i, evnt) {
                console.log(evnt);
                var html = parseCompetitionToPopulateSelectHtml(evnt);
                $("#newParticipantMainCompetitionId").append(html);
            });
        },
    });
}

function parseParticipantsToHtml(event) {
    return '<li class="list-group-item"><div class="thumbnail"><div class="caption"><p>Atleta : ' + event.athlete.name + ' ' + event.athlete.lastname + ' Delegación : ' + event.athlete.delegationId.name + '</p></div></div></li>';
}

function parseAthleteToPopulateSelectHtml(event) {
    return '<option value=' + event.athleteId + '>' + event.name + ' ' + event.lastname + '</option>';
}

function parseCompetitionToPopulateSelectHtml(event) {
    return '<option value=' + event.competitionId + '>' + event.name + ' - ' + event.mainCompetitionId.name + '</option>';
}
function parseParticipants2ToHtml(event) {
    var positionAux = event.position;
    if (positionAux == 0){
        positionAux = "No hay registro";
    }
    return "<tr>" + "<td>" +  event.athlete.name + ' ' + event.athlete.lastname + "</td>" + 
            "<td>" + event.athlete.delegationId.name + "</td>" +
            "<td>" + positionAux + "</td>" + '<td class="text-center">' + '<a style="margin: 2px;" class="btn btn-info btn-xs" href="#" id=edit' + event.athlete.athleteId + ' data-toggle="modal" data-target="#editCompetitorModal" onclick="chargeCompetitorData(this.id)">' +
            '<span class="glyphicon glyphicon-edit"></span>Reposition</a> </td>' + "</tr>";
}
/*
function modifCompetition(competitionId, newCompetitionMainCompetitionId, newCompetitionLocationId, newCompetitionName, newCompetitionDesc, newCompetitionDisciplineId) {
    var arr = {mainCompetitionId: {mainCompetitionId: newCompetitionMainCompetitionId}, locationId: {locationId: newCompetitionLocationId}, name: newCompetitionName, description: newCompetitionDesc, disciplineId: {disciplineId: newCompetitionDisciplineId} };
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
        	$('#modifCompetitionModal').modal('hide');
		setTimeout(function() { $("#content").load("pages/competicion/competicion.html"); }, 1000);
        }
    });
}
*/

function addParticipant(newParticipantAthleteId, newParticipantMainCompetitionId, newParticipantPosition) {
        	$('#addParticipantModal').modal('hide');
    var arr = {participationPK:{athleteId: newParticipantAthleteId,competitionId: newParticipantMainCompetitionId},position:newParticipantPosition};
    console.log(arr);
    var token = localStorage.getItem('token');
    console.log(token);
    $.ajax({
        url: 'http://tecnocompetition.ddns.net:8080/pfinal/services/entities.participation/',
        type: 'POST',
        headers: {
		"Authorization":"oauth " + token
        },
        data: JSON.stringify(arr),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function (msg) {
			console.log('participante agregado con exito');
			addAlert('participante agregado con exito', 'participantAlert');
        }
    });
	setTimeout(function() { $("#content").load("pages/participacion/participacion.html"); }, 500);
}

/*
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
			setTimeout(function() { $("#content").load("pages/competicion/competicion.html"); }, 1000)
        }
    });
}
*/
