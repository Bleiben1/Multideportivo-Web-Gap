var current_page = 1;
var total_per_page = 10;

$(document).ready(function () {
    console.log("Eventos document ready.");
    loadMainPanel("eventMainPanel");//loads the main panel
    listEvents();//se listan los eventos al cargar la pagina
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
    return '<li><h4>' +
            event.startDate + " " + event.endDate +
            '</h4><h4>' + event.name +
            '</h4><p>' + event.description +
            '</p></li>';
}