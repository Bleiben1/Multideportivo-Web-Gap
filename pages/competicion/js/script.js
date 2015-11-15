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
        var newCompetitionMainCompetitionId = document.getElementById("newCompetitionMainCompetitionId").value;
        var newCompetitionLocationId = document.getElementById("newCompetitionLocationId").value;
        var newCompetitionName = document.getElementById("newCompetitionName").value;
        var newCompetitionDesc = document.getElementById("newCompetitionDesc").value;
        var newCompetitionDisciplineId = document.getElementById("newCompetitionDisciplineId").value;
        addCompetition(newCompetitionMainCompetitionId, newCompetitionLocationId, newCompetitionName, newCompetitionDesc, newCompetitionDisciplineId);
    });
	
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
	
	$("body").on("click", ".btnDel", function (e) {
        console.log("Deleting competition data from ws");
        var competitionId = $(this).attr("id");
		delCompetition(competitionId);
    });
	
	$("body").on("click", ".btnParticipation", function (e) {
		if (count == 1){
			console.log("Getting participants data from ws");
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
    });
    localStorage.removeItem("listCompetitionEventId");
}

function parseCompetitionToHtml(event) {
    return '<li class="list-group-item"><div class="thumbnail"><div class="caption"><h2>' + event.name + '</h2><p>Disciplina : ' + event.disciplineId.name + '</p><p>' + event.description +
            '</p><a id="' + event.competitionId + '" class="btn btn-primary btnModif" href="#" data-toggle="modal" data-target="#modifCompetitionModal" data-competition-name="' + event.name + '" data-competition-description="' + event.description + '" data-competition-mainCompetitionId="' + event.mainCompetitionId.mainCompetitionId + '" data-competition-disciplineId="' + event.disciplineId.disciplineId + '" data-competition-disciplineId-name="' + event.disciplineId.name + '" data-competition-locationId-locationId="' + event.locationId.locationId + '" data-competition-locationId-name="' + event.locationId.name + '">Modificar</a> <a class="btn btn-primary btnDel" href="#" id="' + event.competitionId + '">Borrar</a> <a class="btn btn-primary btnParticipation" href="#" id="' + event.competitionId + '">Gestionar Atletas Participantes</a></div></div></li>';
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


function addCompetition(newCompetitionMainCompetitionId, newCompetitionLocationId, newCompetitionName, newCompetitionDesc, newCompetitionDisciplineId) {
    var arr = {mainCompetitionId: {mainCompetitionId: newCompetitionMainCompetitionId}, locationId: {locationId: newCompetitionLocationId}, name: newCompetitionName, description: newCompetitionDesc, disciplineId: {disciplineId: newCompetitionDisciplineId} };
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
        	$('#addCompetitionModal').modal('hide');
		setTimeout(function() { $("#content").load("pages/competicion/competicion.html"); }, 1000);
        }
    });
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
			setTimeout(function() { $("#content").load("pages/competicion/competicion.html"); }, 1000)
        }
    });
}
