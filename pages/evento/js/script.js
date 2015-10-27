var current_page = 1;
var total_per_page = 10;

$(document).ready(function () {
    console.log("Eventos document ready.");
    loadMainPanel("eventMainPanel");//loads the main panel
    listEvents();//se listan los eventos al cargar la pagina

    $("body").on("click", "#btnAddEvent", function (e) {
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
    });
});


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
    });
}

function parseEventToHtml(event) {
    return '<li class="list-group-item"><div class="thumbnail"><div class="caption"><h3>' +
            event.startDate + " " + event.endDate +
            '</h3><h2>' + event.name + '</h2><p>' + event.description +
            '</p><a class="btn btn-primary" href="#">Modificar</a> <a class="btn btn-primary" href="#">Borrar</a></div></div></li>';
    '</p><a class="btn btn-primary" href="#">Modificar</a> <a class="btn" href="#">Borrar</a></div></div></li>';
}

function addEvent(newEventStart, newEventEnd, newEventName, newEventDesc) {
    var arr = {description: newEventDesc, endDate: newEventEnd, name: newEventName,startDate: newEventStart, styleType: 0 };
    console.log(arr);
    var token = localStorage.getItem('token');
    console.log(token);
    $.ajax({
        url: 'http://tecnocompetition.ddns.net:8080/pfinal/services/entities.maincompetition/',
        type: 'POST',
        /*headers: {
            "token": token
        },*/
        data: JSON.stringify(arr),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function (msg) {
            alert(msg);
            listEvents();
        }
    });
}