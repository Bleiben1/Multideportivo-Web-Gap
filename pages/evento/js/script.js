$(document).ready(function () {
    console.log("Eventos document ready.");
    loadMainPanel("eventMainPanel");//loads the main panel
    //listEvents();
});

function listEvents() {
    $.ajax({
        type: POST,
        url: WS_URLS.EVENTO_LISTAR,
        data: JSON.stringify({"list": evento}),
        success: function (data) {
            $.each(data.evento, function (event) {
                var html = parseEventToHtml(event);
                $(html).appendTo('#listEventsContent');
                /* var elemento = '<li><img src="' + evento.imgLink + '"><h4>' + evento.titulo + '</h4><p>' + evento.contenido + '</p></li>';
                 
                 */
            });
        },
    });
}
function parseEventToHtml(event) {
    return '<li><img src="' + event.imgLink + '"><h4>' + event.titulo + '</h4><p>' + event.contenido + '</p></li>';
}