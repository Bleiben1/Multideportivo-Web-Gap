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
        var newNickname = document.getElementById("AddNickname").value;
        var newEmail = document.getElementById("AddEmail").value;
        var newPassword = document.getElementById("AddPassword").value;
        var mainCompetitionId = document.getElementById("AddMCId").value;
        addAC(newNickname, newEmail, newPassword, mainCompetitionId);
    });

    $("body").on("click", "#btnEditAC", function (e) {
        console.log("Updating the new data");
        var updateNickname = document.getElementById("ACNickname").value;
        var updateMCId = document.getElementById("ACMCId").value;
        var updateEmail = document.getElementById("ACEmail").value;
        var updatePassword = document.getElementById("ACPassword").value; // quiza se saque en el futuro
        var updateToken = document.getElementById("ACToken").value; // quiza se saque en el futuro
        var ACId = document.getElementById("ACId").value;
        var arr = {nickname: updateNickname, token: updateToken, password: updatePassword, email: updateEmail, mainCompetitionId: {mainCompetitionId: updateMCId}};
        var flag = editAC(ACId, arr);
        if (flag === true) {
            var element = document.getElemenById(updateMCId);
            element.parentNode.parentNode.childNodes[1].text = updateNickname;
        }

    });
    $("body").on("shown.bs.modal", "#addACModal", function (e) {
        aux = document.getElementById("AddMCId");
        if (aux.length === 0) {
            listAC(aux);
        }
    });
    $("body").on("hidden.bs.modal", "#addACModal", function (e) {
        document.getElementById("AddForm").reset();
    });

    $("body").on("hidden.bs.modal", "#seeDetailModal", function (e) {
        document.getElementById("SDForm").reset();
    });

    $("body").on("hidden.bs.modal", "#editACModal", function (e) {
        document.getElementById("editACForm").reset();
    });

    $('.alert .close').on('click', function (e) {
        $(this).parent().hide();
    });
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
            '<td class="text-center">' + '<a class="btn btn-info btn-xs" href="#" id=' + admin_competition.adminId + ' data-toggle="modal" data-target="#editACModal" onclick="chargeACData(this)">' +
            '<span class="glyphicon glyphicon-edit">' +
            '</span> Edit</a> <a href="#" class="btn btn-danger btn-xs">' +
            '<span class="glyphicon glyphicon-remove">' +
            '</span> Change Status</a>' + '</td>'
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
            var aux = document.getElementById("ACNickname");
            aux.value = data.nickname;
            aux = document.getElementById("ACId");
            aux.value = data.adminId;
            aux = document.getElementById("ACEmail");
            aux.value = data.email;
            aux = document.getElementById("ACPassword");
            aux.value = data.password;
            aux = document.getElementById("ACToken");
            aux.value = data.token;
            aux = document.getElementById("ACMCId");
            if (aux.length === 0) { //no permite cargar múltiples veces el combobox
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

function listAC(combo) { //llenar combo con los id de los admines de competición existentes
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
function editAC(idAC, ACUpdatedData) {
    console.log(idAC);
    var flag = false;
    var token = localStorage.getItem('token');

    console.log(token);
    $.ajax({
        url: 'http://tecnocompetition.ddns.net:8080/pfinal/services/entities.admincompetition/' + idAC,
        type: 'PUT',
        data: JSON.stringify(ACUpdatedData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        cache: false,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function () {
            $("#editACOkAlert").show();
            return flag = true;
        },
        statusCode: {
            404: function () {
                addAlert('No se ha encontrado el admin de competición a modificar', 'editACErrorAlert');
                $("#editACErrorAlert").show();
            },
            500: function () {
                addAlert(CONSTANTE_ERROR_MESSAGE_SERVIDOR_500, 'editACErrorAlert');
                $("#editACErrorAlert").show();
            },
            415: function () {
                addAlert(NOT_ALLOWED_METHOD, 'editACErrorAlert');
                $("#editACErrorAlert").show();
            },
            401: function () {
                addAlert(NOT_AUTHORIZED, 'editACErrorAlert');
                $("#editACErrorAlert").show();
            }
        }
    });
}


function addAC(newNickname, newEmail, newPassword, mainCompetitionId) {
    var arr = {nickname: newNickname, token: "DEFAULT_TOKEN", password: newPassword, email: newEmail, mainCompetitionId: {mainCompetitionId: mainCompetitionId}};
    var token = localStorage.getItem('token');
    console.log(token);
    $.ajax({
        url: 'http://tecnocompetition.ddns.net:8080/pfinal/services/entities.admincompetition/',
        type: 'POST',
        data: JSON.stringify(arr),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        cache: false,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function (data) {
            $("#addACOkAlert").show();
            var html = parseEventToHtml(data);
            $("#ACTable > thead:last").append(html);
        },
        statusCode: {
            500: function () {
                addAlert(CONSTANTE_ERROR_MESSAGE_SERVIDOR_500, 'addACErrorAlert');
                $("#addACErrorAlert").show();
            },
            400: function () {
                addAlert(DB_ERROR, 'addACErrorAlert');
                $("#addACErrorAlert").show();

            },
            401: function () {
                addAlert(NOT_AUTHORIZED, 'addACErrorAlert');
                $("#addACErrorAlert").show();
            },
            415: function () {
                addAlert(NOT_ALLOWED_METHOD, 'addACErrorAlert');
                $("#addACErrorAlert").show();
            }
        }
    });
}