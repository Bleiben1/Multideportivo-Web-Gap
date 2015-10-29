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

    $("body").on("click", "#btnAddAC", function (e) {
        console.log("Adding new event to ws");
        var newNickname = document.getElementById("nickname").value;
        var newEmail = document.getElementById("email").value;
        var newPassword = document.getElementById("password").value;
        addAC(newNickname, newEmail, newPassword);
    });

    $("body").on("click", "btnEditAC", function (e) {

    })
});


function listAdminCompetition() {
    var limit = (current_page - 1) * total_per_page;
    var offset = current_page * total_per_page;
    token = localStorage.getItem("token");
    console.log(token);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.ADMIN_COMPETITION_LISTAR_DESDE_HASTA + limit + "/" + offset,
        headers: {
            "Authorization": "oauth " + token
        },
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

function seeDetailAC(Object) {
    var ACId = Object.text;
    console.log(Object.text);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.ADMIN_COMPETITION_VER_DETALLE + ACId,
        headers: {
            "Authorization": "oauth " + token
        },
        cache: false,
        success: function (data) {
            console.log(data);
            var aux = document.getElementById("evntMId");
            aux.value = data.mainCompetitionId.mainCompetitionId;
            aux = document.getElementById("evntMName");
            aux.value = data.mainCompetitionId.name;
            aux = document.getElementById("evntMDesc");
            aux.value = data.mainCompetitionId.description;
        }
    });
}

function parseEventToHtml(admin_competition) {
    var status;
    status = (admin_competition.status) ? "Active" : "Inactive";

    return '<tr>' +
            '<td><a onclick="seeDetailAC(this)" data-toggle="modal" data-target="#seeDetailModal">' + admin_competition.adminId + '</a></td>' +
            '<td>' + admin_competition.nickname + '</td>' +
            '<td>' + admin_competition.email + '</td>' +
            '<td>' + status + '</td>' +
            //'<td>' + admin_competition.mainCompetitionId.name + '</td>' +
            '<td class="text-center">' + '<a class="btn btn-info btn-xs" href="#"  data-toggle="modal" data-target="#editACModal" onclick="chargeACData(this)">' +
            '<span class="glyphicon glyphicon-edit">' +
            '</span> Edit</a> <a href="#" class="btn btn-danger btn-xs">' +
            '<span class="glyphicon glyphicon-remove">' +
            '</span> Del</a>' + '</td>'
    '</tr>';
}
function chargeACData(Object) {
    ACId = Object.parentNode.parentNode.childNodes[0].childNodes[0].text;
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.ADMIN_COMPETITION_VER_DETALLE + ACId,
        headers: {
            "Authorization": "oauth " + token
        },
        cache: false,
        success: function (data) {
            var aux = document.getElementById("ACPassword");
            aux.value = data.password;
            aux = document.getElementById("ACMCId");
            if (aux.length === 0) {
                listAC(aux);
            }
            //console.log(aux.options);
            $.each(aux.options, function (i, option) {
                console.log(option.value);
                console.log(data.mainCompetitionId.mainCompetitionId);
                if (option.value == data.mainCompetitionId.mainCompetitionId)
                {
                    console.log("ok");
                    console.log(option.index);
                    aux.selectedIndex = option.index;
                    return true;
                }
            });
        }
    });
}

function listAC(combo) {
    var i = 0;
    console.log(combo);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.EVENTOS_LISTAR_DESDE_HASTA + 0 + "/" + 900,
        headers: {
            "Authorization": "oauth " + token
        },
        
        success: function (data) {
            console.log(data);
            $.each(data, function (i, evnt) {
                var option = document.createElement("option");
                option.text = evnt.mainCompetitionId;
                combo.add(option);
                i++;
            });
        }
    });
}
function editAC(idAC, ACNewData) {
    var arr;
    var token = localStorage.getItem('token');
    console.log(token);
    $.ajax({
        url: 'http://tecnocompetition.ddns.net:8080/pfinal/services/entities.admincompetition/' + idAC,
        type: 'POST',
        data: JSON.stringify(arr),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function () {
            listAdminCompetition();
        }
    });
}
function addAC(newNickname, newEmail, newPassword) {
    var arr = {nickname: newNickname, email: newEmail, password: newPassword};
    console.log(arr);
    var token = localStorage.getItem('token');
    console.log(token);
    $.ajax({
        url: 'http://tecnocompetition.ddns.net:8080/pfinal/services/entities.admincompetition/',
        type: 'POST',
        /*headers: {
         "token": token
         },*/
        data: JSON.stringify(arr),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function (msg) {
            alert(msg);
            listAdminCompetition();
        }
    });
}