/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var current_page = 1;
var total_per_page = 10;

$(document).ready(function () {
    console.log("Eventos document ready.");
    loadMainPanel("eventMainPanel");//loads the main panel
    listAdminCompetition(); //listado de los administradores de competition
});


function listAdminCompetition() {
    var limit = (current_page - 1) * total_per_page;
    var offset = current_page * total_per_page;
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.ADMIN_COMPETITION_LISTAR_DESDE_HASTA + limit + "/" + offset,
        success: function (data) {
            console.log(data);
            $.each(data, function (i, admin_competition) {
                console.log(admin_competition);
                var html = parseEventToHtml(admin_competition);
                $("#ACTable > thead:last").append(html);
            });
        },
    });
}

function parseEventToHtml(admin_competition) {
    var status;
    status = (admin_competition.status) ? "Active" : "Inactive";

    return '<tr>' +
            '<td><a>' + admin_competition.adminId + '</a></td>' +
            '<td>' + admin_competition.nickname + '</td>' +
            '<td>' + admin_competition.email + '</td>' +
            '<td>' + status +'</td>' +
            '<td>' + admin_competition.mainCompetitionId.name + '</td>' +
            '<td class="text-center">' + '<a class="btn btn-info btn-xs" href="#">' +
            '<span class="glyphicon glyphicon-edit">' +
            '</span> Edit</a> <a href="#" class="btn btn-danger btn-xs">' +
            '<span class="glyphicon glyphicon-remove">' +
            '</span> Del</a></td>' +
            '</tr>';
}