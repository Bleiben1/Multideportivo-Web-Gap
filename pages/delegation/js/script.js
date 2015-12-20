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
    //
    //--------------------------------------------------------------------------
    $("body").on("click", "#btnAddDelegation", function (e) {
        console.log("Adding a new delegation to ws");
        fail = false;
        fail_log = '';
        email_fail = false;
        tel_fail = false;
        $('#AddDelForm').find('select, textarea, input').each(function () {
            if (!$(this).prop('required')) {

            } else {
                if (!$(this).val()) {
                    fail = true;
                }
                if ($("#AddEmail").val().indexOf('@', 0) == -1 || $("#AddEmail").val().indexOf('.', 0) == -1) {
                    email_fail = true;
                    console.log("damn");
                }

            }
        });
        if ($("#AddTelephone").val().length < 9 || isNaN($("#AddTelephone").val())) {
            tel_fail = true;
        }
        console.log(email_fail + " " + fail);
        if (!fail && !email_fail) {
            var newName = document.getElementById("AddName").value;
            var newEmail = document.getElementById("AddEmail").value;
            var newMQ = document.getElementById("AddMemQty").value;
            var countryId = document.getElementById("AddCountry").value;
            var newTelephone = document.getElementById("AddTelephone").value;
            addDelegation(newName, newEmail, newMQ, newTelephone, countryId);
        }
        $("#addDelErrorAlert").empty();
        if (fail) {
            console.log("paso x aqui");
            $("#addDelErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>¡Error! </strong> <br>' + 'No pueden haber campos vacíos <br> ');
        }
        if (email_fail) {
            $("#addDelErrorAlert").append('Email no válido. Ej: ejemplo@correo.com. ');
        }
        if (tel_fail) {
            if (email_fail) {
                $("#addDelErrorAlert").append('<br>');
            }
            $("#addDelErrorAlert").append('El teléfono debe tener 9 caracteres, Ej:999888777');
        }
        if (fail || email_fail)
        {
            $("#addDelErrorAlert").show();
            $("#addDelErrorAlert").fadeOut(4000);
        }
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
        var arr = {name: updateName, telephone: updateTel, imageUrl: "//", membersQty: updateMQ, email: updateEmail, countryId: {countryId: updateCId}};
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
            '</span> See Detail</a>' + '</td>' + '</tr>';
}
;
function chargeDelegationData(idDelegation) {
    idDel = idDelegation.substring(4);
    console.log(idDel);
    token = localStorage.getItem("token");
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
                listCountries(aux, function () {
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
                });
            }
            else {
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
            //console.log(aux.options);

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
                $("#addDelErrorAlert").empty();
                $("#addDelErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + CONSTANTE_ERROR_MESSAGE_SERVIDOR_500);
                $("#addDelErrorAlert").show();
                $("#addDelErrorAlert").fadeOut(2000);
            },
            400: function () {
                $("#addDelErrorAlert").empty();
                $("#addDelErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + DB_ERROR);
                $("#addDelErrorAlert").show();
                $("#addDelErrorAlert").fadeOut(2000);
            },
            401: function () {
                $("#addDelErrorAlert").empty();
                $("#addDelErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_AUTHORIZED);
                $("#addDelErrorAlert").show();
                $("#addDelErrorAlert").fadeOut(2000);
            },
            415: function () {
                $("#addDelErrorAlert").empty();
                $("#addDelErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_ALLOWED_METHOD);
                $("#addDelErrorAlert").show();
                $("#addDelErrorAlert").fadeOut(2000);
            }
        }

    });
}


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
                $("#editDelErrorAlert").empty();
                $("#editDelErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + 'No se ha encontrado la delegación a modificar');
                $("#editDelErrorAlert").show();
                $("#editDelErrorAlert").fadeOut(2000);
            },
            500: function () {
                $("#editDelErrorAlert").empty();
                $("#editDelErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + CONSTANTE_ERROR_MESSAGE_SERVIDOR_500);
                $("#editDelErrorAlert").show();
                $("#editDelErrorAlert").fadeOut(2000);
            },
            415: function () {
                $("#editDelErrorAlert").empty();
                $("#editDelErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_ALLOWED_METHOD);
                $("#editDelErrorAlert").show();
                $("#editDelErrorAlert").fadeOut(2000);
            },
            401: function () {
                $("#editDelErrorAlert").empty();
                $("#editDelErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_AUTHORIZED);
                $("#editDelErrorAlert").show();
                $("#editDelErrorAlert").fadeOut(2000);
            }
        }
    });
    return flag;
}