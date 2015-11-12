var current_page = 1;
var total_per_page = 10;

$(document).ready(function () {
    console.log("Participacion document ready.");
    listParticipants();
	
	$("body").on("click", ".btnAddParticipantModalToggle", function (e) {
		console.log("Populating selects");
		populateSelects();
	});
	
    $("body").on("click", "#btnAddParticipant", function (e) {
        console.log("Adding new participant to ws");
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
			headers: {
				"Authorization":"oauth " + token
			},
			success: function (data) {
				console.log(data);
				$.each(data, function (i, evnt) {
					console.log(evnt);
					var html = parseParticipantsToHtml(evnt);
					$("#listParticipantsContent").append(html);
				});
			},
		});
	}
    localStorage.removeItem("listParticipantCompetitionId");
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
    return '<li class="list-group-item"><div class="thumbnail"><div class="caption"><p>Atleta : ' + event.name + ' ' + event.lastname + ' Delegación : ' + event.delegationId.name + '</p></div></div></li>';
}

function parseAthleteToPopulateSelectHtml(event) {
    return '<option value=' + event.athleteId + '>' + event.name + ' ' + event.lastname + '</option>';
}

function parseCompetitionToPopulateSelectHtml(event) {
    return '<option value=' + event.competitionId + '>' + event.name + ' - ' + event.mainCompetitionId.name + '</option>';
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
        	$('#addParticipantModal').modal('hide');
		setTimeout(function() { $("#content").load("pages/participacion/participacion.html"); }, 1000);
        }
    });
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
