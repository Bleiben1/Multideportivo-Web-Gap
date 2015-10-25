/* pagination vars */
var current_page = 1;
var total_per_page = 10;

$(document).ready(function () {
    console.log("Eventos document ready.");
    loadMainPanel("eventMainPanel");//loads the main panel
    listEvents();//se listan los eventos al cargar la pagina

    //Jquery Events
    //click on delete event button
    $("#listEventsContent").on("click", ".mainEventDelete", function (e) {
        e.preventDefault();
        var evntid = $(this).attr("data-id");
        //TODO: redirect to erase event Url
    });
    //click on event  detail button
    $("#listEventsContent").on("click", ".mainEventDetail", function (e) {
        e.preventDefault();
        var evntid = $(this).attr("data-id");
        //TODO: redirect to event detail Url
    });
    //click on event  edit button
    $("#listEventsContent").on("click", ".mainEventEdit", function (e) {
        e.preventDefault();
        var evntid = $(this).attr("data-id");
        //TODO: redirect to event edit Url
    });
});


function listEvents() {
    var limit = (current_page - 1) * total_per_page;
    var offset = current_page * total_per_page;
    loader(true);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.EVENTOS_LISTAR_DESDE_HASTA + limit + "/" + offset,
        success: function (data) {
            if (data.length === 0)
                displayEmptyListMessage();
            $.each(data, function (i, evnt) {
                console.log(evnt);
                var html = parseMainEventToHtml(evnt);
                $("#listEventsContent").append(html);
            });
            loader(false);
        },
    });
}
function displayEmptyListMessage() {
    $("#listEventsContent").append('<div class="notice">No hay nada por aquí.</div>');
}
function parseMainEventToHtml(event) {
    return '<li class="mainEvent" data-id="' + event.mainCompetitionId + '"><h4>' +
            event.startDate + " " + event.endDate +
            '</h4><h4>' + event.name + '</h4><p>' + event.description +
            '</p>' +
            '<a class="mainEventDelete"  data-id="' + event.mainCompetitionId + '" href="#">Eliminar</a>' +
            '<a class="mainEventDetail"  data-id="' + event.mainCompetitionId + '" href="#">Ver</a>' +
            '<a class="mainEventEdit"  data-id="' + event.mainCompetitionId + '" href="#">Editar</a>' +
            '</li>';
}