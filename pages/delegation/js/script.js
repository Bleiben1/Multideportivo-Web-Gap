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
    listDelegations(); //listado de los administradores de de
    //--------------------------------------------------------------------------
    $("body").on("click", "#btnAddDelegation", function (e) {
        console.log("Adding a new delegation to ws");
        var newName = document.getElementById("AddName").value;
        var newEmail = document.getElementById("AddEmail").value;
        var newMQ = document.getElementById("AddMemQty").value;
        var countryId = document.getElementById("AddCountry").value;
        var newTelephone = document.getElementById("AddTelephone").value;
        addDelegation(newName, newEmail, newMQ, newTelephone, countryId);
    });
    //--------------------------------------------------------------------------
    $("body").on("click", "#btnEditDelegation", function (e) {
        console.log("Updating the new data");
        var delegationId = document.getElementById("editDelId").value;
        var updateName = document.getElementById("editDelName").value;
        var updateDName = document.getElementById("editDelCountry").options[document.getElementById("editDelCountry").selectedIndex].text;
        var updateEmail = document.getElementById("editDelEmail").value;
        var updateTel = document.getElementById("editDelTel").value; // quiza se saque en el futuro
        var updateMQ = document.getElementById("editDelMQ").value; // quiza se saque en el futuro
        var updateCId = document.getElementById("editDelCountry").value;
        var arr = {name: updateName, telephone: updateTel,imageUrl: "//", membersQty: updateMQ, email: updateEmail, countryId: {countryId: updateCId}};
        var flag = editDelegation(delegationId, arr);
        if (flag === true) {
            var element = document.getElementById(delegationId);
            console.log(updateDName);
            element.parentNode.parentNode.childNodes[1].innerHTML = updateName; //necesito sacar el texto que esta puesto en el combobox
            element.parentNode.parentNode.childNodes[2].innerHTML = updateEmail;
        }

    });
    //--------------------------------------------------------------------------

    $("body").on("hidden.bs.modal", "#seeDetDelegationModal", function (e) {
        document.getElementById("SDDelForm").reset();
    });
    $('.alert .close').on('click', function (e) {
        $(this).parent().hide();
    });
    $("body").on("shown.bs.modal", "#addDelegationModal", function (e) {
        aux = document.getElementById("AddCountry");
        if (aux.length === 0) {
            listCountries(aux);
        }
    });
    $("body").on("hidden.bs.modal", "#addDelegationModal", function (e) {
        document.getElementById("AddDelForm").reset();
        $("#addDelOkAlert").hide();
        $("#addDelErrorAlert").hide();
    });
    $("body").on("hidden.bs.modal", "#editDelegationModal", function (e) {
        document.getElementById("editDelegationForm").reset();
        $("#editDelOkAlert").hide();
        $("#editDelErrorAlert").hide();
    });
});

function parseEventToHtml(delegation) {//segun los datos enviados, crea una fila nueva y la devuelve para luego insertarla

    return '<tr>' +
            '<td>' + delegation.delegationId + '</td>' +
            '<td>' + delegation.name + '</td>' +
            '<td>' + delegation.email + '</td>' +
            '<td class="text-center">' + '<a style="margin: 2px;" class="btn btn-info btn-xs" href="#" id=edit' + delegation.delegationId + ' data-toggle="modal" data-target="#editDelegationModal" onclick="chargeDelegationData(this.id)">' +
            '<span class="glyphicon glyphicon-edit">' +
            '</span> Edit</a>' + '<a style="margin: 2px;" class="btn btn-info btn-xs" id=' + delegation.delegationId + ' href="#" data-toggle="modal" data-target="#seeDetDelegationModal" onclick="seeDetailDelegation(this.id)">' +
            '<span class="glyphicon glyphicon-plus-sign">' +
            '</span> See Detail</a>' + '<a href="#" class="btn btn-danger btn-xs" id=del' + delegation.delegationId + '><span class="glyphicon glyphicon-remove"></span> Del</a>' + '</td>' + '</tr>';
}
;
function chargeDelegationData(idDelegation) {
    idDel = idDelegation.substring(4);
    console.log(idDel);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.DELEGATIONS_LISTAR_DESDE_HASTA + idDel,
        headers: {
            "Authorization": "oauth " + token
        },
        cache: false,
        success: function (data) {
            var aux = document.getElementById("editDelId");
            aux.value = data.delegationId;
            aux = document.getElementById("editDelName");
            aux.value = data.name;
            aux = document.getElementById("editDelEmail");
            aux.value = data.email;
            aux = document.getElementById("editDelTel");
            aux.value = data.telephone;
            aux = document.getElementById("editDelMQ");
            aux.value = data.membersQty;
            aux = document.getElementById("editDelCountry");
            if (aux.length === 0) { //no permite cargar múltiples veces el combobox
                listCountries(aux);
            }
            //console.log(aux.options);
            $.each(aux.options, function (i, option) {
                console.log(option.value);
                console.log(data.countryId.countryId); //revisar cuando anden los ws de delegation
                if (option.value == data.countryId.countryId)
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

function listDelegations() {
    var limit = (current_page - 1) * total_per_page;
    var offset = current_page * total_per_page;
    token = localStorage.getItem("token");
    console.log(token);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.DELEGATIONS_LISTAR_DESDE_HASTA + limit + "/" + offset,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function (data) {
            console.log(data);
            $.each(data, function (i, delegation) {
                console.log(delegation);
                var html = parseEventToHtml(delegation);
                $("#DelegationTable > thead:last").append(html);
            });
        }
    });
}
;
function seeDetailDelegation(idDelegation) {
    console.log(idDelegation);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.DELEGATIONS_LISTAR_DESDE_HASTA + idDelegation,
        headers: {
            "Authorization": "oauth " + token
        },
        cache: false,
        success: function (data) {
            console.log(data);
            var aux = document.getElementById("ctryName");
            console.log(data.countryId.name);
            aux.value = data.countryId.name;
            aux = document.getElementById("memQty");
            aux.value = data.membersQty;
            aux = document.getElementById("telephone");
            aux.value = data.telephone;
        }
    });
}
;
function addDelegation(name, email, membersQty, telephone, countryId) {
    var arr = {name: name, membersQty: membersQty, imageUrl: "//", telephone: telephone, email: email, countryId: {countryId: countryId}};
    console.log(arr);
    var token = localStorage.getItem('token');
    console.log(token);
    $.ajax({
        url: WS_URLS.DELEGATIONS_LISTAR_DESDE_HASTA,
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
            $("#addDelOkAlert").show();
            var html = parseEventToHtml(data);
            $("#DelegationTable > thead:last").append(html);
        },
        statusCode: {
            500: function () {
                console.log("error 500");
                addAlert(CONSTANTE_ERROR_MESSAGE_SERVIDOR_500, 'addDelErrorAlert');
                $("#addDelErrorAlert").show();
            },
            400: function () {
                console.log("error 400");
                addAlert(DB_ERROR, 'addDelErrorAlert');
                $("#addDelErrorAlert").show();

            },
            401: function () {
                console.log("error 401");
                addAlert(NOT_AUTHORIZED, 'addDelErrorAlert');
                $("#addDelErrorAlert").show();
            },
            415: function () {
                console.log("error 415");
                addAlert(NOT_ALLOWED_METHOD, 'addDelErrorAlert');
                $("#addDelErrorAlert").show();
            }
        }

    });
}
function listCountries(combo) {
    var i = 0;
    console.log(combo);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.COUNTRIES_LISTAR_DESDE_HASTA,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function (data) {
            console.log(data);
            $.each(data, function (i, country) {
                var option = document.createElement("option");
                option.text = country.name;
                option.value = country.countryId;
                combo.add(option);
                i++;
            });
        }
    });
}
;

function editDelegation(idDelegation, DelegationUpdatedData) {
    var flag = false;
    var token = localStorage.getItem('token');

    console.log(token);
    $.ajax({
        url: WS_URLS.DELEGATIONS_LISTAR_DESDE_HASTA + idDelegation,
        type: 'PUT',
        data: JSON.stringify(DelegationUpdatedData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        cache: false,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function () {
            $("#editDelOkAlert").show();
            flag = true;
        },
        statusCode: {
            404: function () {
                addAlert('No se ha encontrado la delegación a modificar', 'editDelErrorAlert');
                $("#editDelErrorAlert").show();
            },
            500: function () {
                addAlert(CONSTANTE_ERROR_MESSAGE_SERVIDOR_500, 'editDelErrorAlert');
                $("#editDelErrorAlert").show();
            },
            415: function () {
                addAlert(NOT_ALLOWED_METHOD, 'editDelErrorAlert');
                $("#editDelErrorAlert").show();
            },
            401: function () {
                addAlert(NOT_AUTHORIZED, 'editDelErrorAlert');
                $("#editDelErrorAlert").show();
            }
        }
    });
    return flag;
}