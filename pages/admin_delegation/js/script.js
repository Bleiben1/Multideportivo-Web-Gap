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
    listAdminDelegation(); //listado de los administradores de de

    $("body").on("click", "#btnEditAD", function (e) {
        console.log("Updating the new data");
        var updateNickname = document.getElementById("ADNickname").value;
        var updateDId = document.getElementById("ADDelegation").value;
        var updateDName = document.getElementById("ADDelegation").options[document.getElementById("ADDelegation").selectedIndex].text;
        var updateEmail = document.getElementById("ADEmail").value;
        var updatePassword = document.getElementById("ADPassword").value; // quiza se saque en el futuro
        var updateToken = document.getElementById("ADToken").value; // quiza se saque en el futuro
        var updateStatus = document.getElementById("ADStatus").value;
        var ADId = document.getElementById("ADId").value;
        var arr = {nickname: updateNickname, token: updateToken, password: updatePassword, status: updateStatus, email: updateEmail, delegationId: {delegationId: updateDId}};
        var flag = editAD(ADId, arr);
        if (flag === true) {
            var element = document.getElementById(ADId);
            console.log(updateDName);
            element.parentNode.parentNode.childNodes[2].innerHTML = updateDName; //necesito sacar el texto que esta puesto en el combobox
            element.parentNode.parentNode.childNodes[3].innerHTML = (updateStatus) ? "Active" : "Inactive";
        }

    });
    $("body").on("click", "#btnAddAD", function (e) {
        console.log("Adding new event to ws");
        var newNickname = document.getElementById("AddNickname").value;
        var newEmail = document.getElementById("AddEmail").value;
        var newPassword = document.getElementById("AddPassword").value;
        var delegationId = document.getElementById("AddDId").value;
        addAD(newNickname, newEmail, newPassword, delegationId);
    });

    $("body").on("shown.bs.modal", "#addADModal", function (e) {
        aux = document.getElementById("AddDId");
        if (aux.length === 0) {
            listDelegation(aux);
        }
    });
    $("body").on("hidden.bs.modal", "#addADModal", function (e) {
        document.getElementById("AddForm").reset();
        $("#addADOkAlert").hide();
        $("#addADErrorAlert").hide();
    });
    $("body").on("hidden.bs.modal", "#seeDetailModal", function (e) {
        document.getElementById("SDForm").reset();
    });

    $("body").on("hidden.bs.modal", "#editADModal", function (e) {
        document.getElementById("editADForm").reset();
        $("#editADOkAlert").hide();
        $("#editADErrorAlert").hide();
    });

    $('.alert .close').on('click', function (e) {
        $(this).parent().hide();
    });
});
function parseEventToHtml(admin_delegation) {//segun los datos enviados, crea una fila nueva y la devuelve para luego insertarla

    var status;
    status = (admin_delegation.status) ? "Active" : "Inactive";

    return '<tr>' +
            '<td><a onclick="seeDetailAD(this)" data-toggle="modal" data-target="#seeDetailModal">' + admin_delegation.adminId + '</a></td>' +
            '<td>' + admin_delegation.email + '</td>' +
            '<td>' + admin_delegation.delegationId.name + '</td>' +
            '<td>' + status + '</td>' +
            '<td class="text-center">' + '<a class="btn btn-info btn-xs" href="#" id=' + admin_delegation.adminId + ' data-toggle="modal" data-target="#editADModal" onclick="chargeADData(this)">' +
            '<span class="glyphicon glyphicon-edit">' +
            '</span> Edit</a>' + '</td>' +'</tr>';
}
;

function listAdminDelegation() {
    var limit = (current_page - 1) * total_per_page;
    var offset = current_page * total_per_page;
    token = localStorage.getItem("token");
    console.log(token);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.ADMIN_DELEGATION_LISTAR_DESDE_HASTA + limit + "/" + offset,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function (data) {
            console.log(data);
            $.each(data, function (i, admin_delegation) {
                console.log(admin_delegation);
                var html = parseEventToHtml(admin_delegation);
                $("#ADTable > thead:last").append(html);
            });
        }
    });
}
;

function addAD(nickname, email, password, delegationId) {
    var arr = {nickname: nickname, token: "DEFAULT_TOKEN", password: password, email: email, delegationId: {delegationId: delegationId}};
    var token = localStorage.getItem('token');
    console.log(token);
    $.ajax({
        url: WS_URLS.ADMIN_DELEGATION_LISTAR_DESDE_HASTA,
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
            console.log("success?")
            $("#addADOkAlert").show();
            var html = parseEventToHtml(data);
            $("#ADTable > thead:last").append(html);
        },
        statusCode: {
            500: function () {
                console.log("error 500");
                addAlert(CONSTANTE_ERROR_MESSAGE_SERVIDOR_500, 'addADErrorAlert');
                $("#addADErrorAlert").show();
            },
            400: function () {
                console.log("error 400");
                addAlert(DB_ERROR, 'addADErrorAlert');
                $("#addADErrorAlert").show();

            },
            401: function () {
                console.log("error 401");
                addAlert(NOT_AUTHORIZED, 'addADErrorAlert');
                $("#addADErrorAlert").show();
            },
            415: function () {
                console.log("error 415");
                addAlert(NOT_ALLOWED_METHOD, 'addADErrorAlert');
                $("#addADErrorAlert").show();
            }
        }

    });
};
function seeDetailAD(Object) {
    var ACId = Object.text;
    console.log(Object.text);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.ADMIN_DELEGATION_LISTAR_DESDE_HASTA + ACId,
        headers: {
            "Authorization": "oauth " + token
        },
        cache: false,
        success: function (data) {
            console.log(data);
            var aux = document.getElementById("nickname");
            aux.value = data.nickname;
            aux = document.getElementById("delCountry");
            aux.value = data.delegationId.countryId.name;
            aux = document.getElementById("delEmail");
            aux.value = data.delegationId.email;
        }
    });
}

function editAD(idAD, ADUpdatedData) {
    var flag = false;
    var token = localStorage.getItem('token');

    console.log(token);
    $.ajax({
        url: WS_URLS.ADMIN_DELEGATION_LISTAR_DESDE_HASTA + idAD,
        type: 'PUT',
        data: JSON.stringify(ADUpdatedData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        cache: false,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function () {
            $("#editADOkAlert").show();
            flag = true;
        },
        statusCode: {
            404: function () {
                addAlert('No se ha encontrado el admin de delegación a modificar', 'editADErrorAlert');
                $("#editADErrorAlert").show();
            },
            500: function () {
                addAlert(CONSTANTE_ERROR_MESSAGE_SERVIDOR_500, 'editADErrorAlert');
                $("#editADErrorAlert").show();
            },
            415: function () {
                addAlert(NOT_ALLOWED_METHOD, 'editADErrorAlert');
                $("#editADErrorAlert").show();
            },
            401: function () {
                addAlert(NOT_AUTHORIZED, 'editADErrorAlert');
                $("#editADErrorAlert").show();
            }
        }
    });
    return flag;
};

function chargeADData(Object) {
    ACId = Object.parentNode.parentNode.childNodes[0].childNodes[0].text;
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.ADMIN_DELEGATION_LISTAR_DESDE_HASTA + ACId,
        headers: {
            "Authorization": "oauth " + token
        },
        cache: false,
        success: function (data) {
            var aux = document.getElementById("ADNickname");
            aux.value = data.nickname;
            aux = document.getElementById("ADId");
            aux.value = data.adminId;
            aux = document.getElementById("ADEmail");
            aux.value = data.email;
            aux = document.getElementById("ADPassword");
            aux.value = data.password;
            aux = document.getElementById("ADToken");
            aux.value = data.token;
            aux = document.getElementById("ADStatus");
            console.log("el valor es: "+aux);
            aux.selectedIndex = (data.status) ? 1 : 0 ;
            aux = document.getElementById("ADDelegation");
            if (aux.length === 0) { //no permite cargar múltiples veces el combobox
                listDelegation(aux);
            }
            //console.log(aux.options);
            $.each(aux.options, function (i, option) {
                console.log(option.value);
                console.log(data.delegationId.delegationId); //revisar cuando anden los ws de delegation
                if (option.value == data.delegationId.delegationId)
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
