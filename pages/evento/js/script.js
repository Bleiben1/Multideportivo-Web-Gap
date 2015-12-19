var current_page = 1;
var total_per_page = 10;

$(document).ready(function () {
    console.log("Eventos document ready.");
    loadMainPanel("eventMainPanel");//loads the main panel
    listEvents();//se listan los eventos al cargar la pagina
    
    $("body").on("click", "#btnAddEvent", function (e) {
        console.log("Adding new event to ws");
		showLoader();
        var newEventStartDate = document.getElementById("newEventStartDate").value;
        var newEventStartTime = document.getElementById("newEventStartTime").value;
        var newEventEndDate = document.getElementById("newEventEndDate").value;
        var newEventEndTime = document.getElementById("newEventEndTime").value;
        var newEventName = document.getElementById("newEventName").value;
        var newEventDesc = document.getElementById("newEventDesc").value;
        var newEventStart = newEventStartDate + "T" + newEventStartTime+ ":00";
        var newEventEnd = newEventEndDate + "T" + newEventEndTime+ ":00";
		var newEventTag1 = document.getElementById("newEventTag1").value;
		var newEventTag2 = document.getElementById("newEventTag2").value;
		var newEventTag3 = document.getElementById("newEventTag3").value;				
        addEvent(newEventStart, newEventEnd, newEventName, newEventDesc, newEventTag1, newEventTag2, newEventTag3);
    });
	
	$("body").on("click", ".btnModif", function (e) {
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
    });
	
    $("body").on("click", "#btnModifEvent", function (e) {
        console.log("Adding new event to ws");
		showLoader();
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
    });
	
	$("body").on("click", ".btnDel", function (e) {
        console.log("Deleting event data from ws");
        var eventId = $(this).attr("id");
		delEvent(eventId);
    });
	
	$("body").on("click", ".btnCompetition", function (e) {
		console.log("Getting event competition data from ws");
		showLoader();
        var eventId = $(this).attr("id");
		listCompetition(eventId);
    });
});

function listCompetition(eventId) {
	console.log("getting competition from ws, please wait...");
	localStorage.setItem("listCompetitionEventId", eventId);
	$("#content").load("pages/competicion/competicion.html");
}

function listEvents() {
    var limit = (current_page - 1) * total_per_page;
    var offset = current_page * total_per_page;
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.EVENTOS_LISTAR_DESDE_HASTA + limit + "/" + offset,
        success: function (data) {
            console.log(data);
            $.each(data, function (i, evnt) {
                console.log(evnt);
                var html = parseEventToHtml(evnt);
                $("#listEventsContent").append(html);
            });
        },
		statusCode: {
			400: function () {
				addAlert(DB_ERROR, 'eventAlert');
			},
			401: function () {
				addAlert(NOT_AUTHORIZED, 'eventAlert');
			},
            404: function () {
				addAlert('No se encontraron registros de Eventos', 'eventAlert');
            },
			415: function () {
				addAlert(NOT_ALLOWED_METHOD, 'eventAlert');
			},
			500: function () {
				addAlert(CONSTANTE_ERROR_MESSAGE_SERVIDOR_500, 'eventAlert');
			}
        }
    });
	hideLoader();
}

function parseEventToHtml(event) {
	var eventStartDate = event.startDate;
	var eventEndDate = event.endDate;
	var startDate = eventStartDate.substring(0,10);
	var startHour = eventStartDate.substring(11,16);
	var endDate = eventEndDate.substring(0,10);
	var endHour = eventEndDate.substring(11,16);
    return '<li class="list-group-item"><div class="thumbnail"><div class="caption"><h4>Fecha de inicio: ' +
            startDate + ' Hora de inicio: ' + startHour + '</h4><h4>Fecha de fin: ' + endDate + ' Hora de fin: ' + endHour +
            '</h4><h2>' + event.name + '</h2><p>' + event.description +
            '</p><a id="' + event.mainCompetitionId + '" class="btn btn-primary btnModif" href="#" data-toggle="modal" data-target="#modifEventModal" data-event-name="' + event.name + '" data-event-description="' + event.description + '" data-event-startdate="' + event.startDate + '" data-event-enddate="' + event.endDate + '">Modificar</a> <a class="btn btn-primary btnDel" href="#" id="' + event.mainCompetitionId + '">Borrar</a> <a class="btn btn-primary btnCompetition" href="#" id="' + event.mainCompetitionId + '">Gestionar Competiciones</a></div></div></li>';
    '</p></div></div></li>';
}

function modifEvent(eventId, newEventStart, newEventEnd, newEventName, newEventDesc) {
	$('#modifEventModal').modal('hide');
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
			hideLoader();
			console.log('evento modificado con exito');
			addAlert('Evento modificado con exito', 'eventAlert');
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
	hideLoader();
	setTimeout(function() { $("#content").load("pages/evento/evento.html"); }, 500);
}


function addEvent(newEventStart, newEventEnd, newEventName, newEventDesc, tag1, tag2, tag3) {
	$('#addEventModal').modal('hide');
	console.log("tags enviadas: "+tag1+" | "+tag2+" | "+tag3+"");
    var arr = {description: newEventDesc, endDate: newEventEnd, name: newEventName,startDate: newEventStart, styleType: 0, tagCollection: [{tag: tag1}, {tag: tag2}, {tag: tag3}]};
	console.log("json send : "+JSON.stringify(arr));
/*
{ //funciona
	"description":"evento de prueba de tags",
	"endDate":"2012-01-31T00:00:00",
	"name":"Test Tags",
	"startDate": "2012-01-31T00:00:00",
	"styleType": 0,
	"tagCollection":[{"tag":"tag1"},{"tag":"tag2"},{"tag":"tag3"}]
}

{ //no funciona
	"description":"lalalalalal tags tags tags tags tags tags tags",
	"endDate":"2015-12-27T16:00:00",
	"name":"evento prueba tags",
	"startDate":"2015-12-21T14:00:00",
	"styleType":0,
	"tagCollection":[{"tag":"etiqueta 1"},{"tag":"2daEtiqueta"},{"tag":"esta sería la última etiqueta"}]
}
*/
	/*
	*	problema con tags largos ¿limite x tag?
	*/
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
			hideLoader();
			console.log('evento agregado con exito');
			addAlert('Evento agregado con exito', 'eventAlert');
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
	hideLoader();
	setTimeout(function() { $("#content").load("pages/evento/evento.html"); }, 500);
}

function delEvent(eventId) {
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
			console.log('Evento borrado con exito');
			addAlert('Evento borrado con exito', 'eventAlert');
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
	setTimeout(function() { $("#content").load("pages/evento/evento.html"); }, 500);
}