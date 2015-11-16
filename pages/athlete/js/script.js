/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    console.log("Eventos document ready.");
    loadMainPanel("eventMainPanel");//loads the main panel
    listDelegation(document.getElementById("searchByDel"));
    $("#AthleteTable tr").remove();
    listAthletes(); //listado de los athletas almacenaos en la base de datos
    //--------------------------------------------------------------------------
    $("body").on("click", "#btnAddAthlete", function (e) {
        console.log("Adding new athlete to ws");
        var newName = document.getElementById("AddName").value;
        var newLastName = document.getElementById("AddLastName").value;
        var newDob = document.getElementById("AddDob").value + "T00:00:00-03:00";
        var newFeatured = document.getElementById("AddFeatured").value;
        var delegationId = document.getElementById("AddDelegation").value;
        addAthlete(newName, newLastName, newDob, newFeatured, delegationId);
    });
    $("body").on("click", "#btnEditAthlete", function (e) {
        console.log("Updating the new data");
        var updateName = document.getElementById("editAthleteName").value;
        var updateLName = document.getElementById("editAthleteLastName").value;
        var updateDName = document.getElementById("editAthleteDelegation").options[document.getElementById("editAthleteDelegation").selectedIndex].text; //para modificar en la tabla, hay ciertos errores que lo muestran como unefined, hay que arreglar
        var updateDob = document.getElementById("editAthleteDob").value;
        var updateFeatured = document.getElementById("editAthleteFeatured").value;
        var updateDelegationId = document.getElementById("editAthleteDelegation").value;
        var AthleteId = document.getElementById("editAthleteId").value;
        var arr = {name: updateName, lastname: updateLName, dob: updateDob + "T00:00:00-03:00", featured: updateFeatured, delegationId: {delegationId: updateDelegationId}};
        var flag = editAthlete(AthleteId, arr);
        if (flag === true) {
            var element = document.getElementById("edit" + AthleteId);
            element.parentNode.parentNode.childNodes[1].innerHTML = updateName + " " + updateLName; //necesito sacar el texto que esta puesto en el combobox
            element.parentNode.parentNode.childNodes[2].innerHTML = updateDName;
            element.parentNode.parentNode.childNodes[3].innerHTML = calculateAge(updateDob);
        }

    });
    //--------------------------------------------------------------------------
    $("body").on("hidden.bs.modal", "#seeDetAthleteModal", function (e) {
        document.getElementById("SDAthleteForm").reset();
    });
    //--------------------------------------------------------------------------
    $('.alert .close').on('click', function (e) {
        $(this).parent().hide();
    });
    //--------------------------------------------------------------------------
    $("body").on("shown.bs.modal", "#addAthleteModal", function (e) {
        aux = document.getElementById("AddDelegation");
        if (aux.length === 0) {
            listDelegation(aux);
        }
    });
    //--------------------------------------------------------------------------
    $("body").on("hidden.bs.modal", "#addAthleteModal", function (e) {
        document.getElementById("AddAthleteForm").reset();
        $("#addAthleteOkAlert").hide();
        $("#addAthleteErrorAlert").hide();
    });
    //--------------------------------------------------------------------------
    $("body").on("hidden.bs.modal", "#editAthleteModal", function (e) {
        document.getElementById("editAthleteForm").reset();
        $("#editAthleteOkAlert").hide();
        $("#editAthleteErrorAlert").hide();
    });
    $("body").on("change", "#searchByDel", function (e) {
        $("#AthleteTable tr").remove();
        listAthletesByDelegation(document.getElementById("searchByDel").value);
    });
});


function parseEventToHtml(athlete) {//segun los datos enviados, crea una fila nueva y la devuelve para luego insertarla
    var dob = athlete.dob.substring(0, 10);
    console.log(dob);
    age = calculateAge(dob);
    return '<tr>' +
            '<td>' + athlete.athleteId + '</td>' +
            '<td>' + athlete.name + " " + athlete.lastname + '</td>' +
            '<td>' + athlete.delegationId.name + '</td>' +
            '<td>' + age + '</td>' +
            '<td class="text-center">' + '<a style="margin: 2px;" class="btn btn-info btn-xs" href="#" id=edit' + athlete.athleteId + ' data-toggle="modal" data-target="#editAthleteModal" onclick="chargeAthleteData(this.id)">' +
            '<span class="glyphicon glyphicon-edit">' +
            '</span> Edit</a>' + '<a style="margin: 2px;" class="btn btn-info btn-xs" id=' + athlete.athleteId + ' href="#" data-toggle="modal" data-target="#seeDetAthleteModal" onclick="seeDetailAthlete(this.id)">' +
            '<span class="glyphicon glyphicon-plus-sign">' +
            '</span> See Detail</a>' + '<a href="#" class="btn btn-danger btn-xs" id=del' + athlete.athleteId + '><span class="glyphicon glyphicon-remove"></span> Del</a>' + '</td>' + '</tr>';
}
;
//------------------------------------------------------------------------------
function listAthletes() {
    var limit = (current_page - 1) * total_per_page;
    var offset = current_page * total_per_page;
    token = localStorage.getItem("token");
    console.log(token);
    var selectedDelegation;
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.ATHLETES_LISTAR_DESDE_HASTA + limit + "/" + offset,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function (data) {
            $.each(data, function (i, athlete) {
                var html = parseEventToHtml(athlete);
                $("#AthleteTable > thead:last").append(html);
            });
        }
    });
}
;
function listAthletesByDelegation(idDelegation) {
    var limit = (current_page - 1) * total_per_page;
    var offset = current_page * total_per_page;
    token = localStorage.getItem("token");
    console.log(token);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.ATHLETES_LISTAR_DESDE_HASTA + "delegation/" + idDelegation + "/" + limit + "/" + offset,
        headers: {
            "Authorization": "oauth " + token
        },
        cache: false,
        success: function (data) {
            $("#AthleteTable tr").remove();
            $.each(data, function (i, athlete) {
                var html = parseEventToHtml(athlete);
                $("#AthleteTable > thead:last").append(html);
            });
        },
        statusCode: {
            404: function () {
                $("#AthleteTable tr").remove();
                html = '<tr>' +
                        '<td>' + "No hay registro de atletas de tal delegación" + '</td>' +
                        '<td></td>' +
                        '<td></td>' +
                        '<td></td>' +
                        '<td </td>' + '</tr>';

                $("#AthleteTable > thead:last").append(html);
                alert("No hay registro de ningun atleta proveniente de tal delegación");
            }
        }
    });
}
;
function seeDetailAthlete(idAthlete) {
    console.log(idAthlete);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.ATHLETES_LISTAR_DESDE_HASTA + idAthlete,
        headers: {
            "Authorization": "oauth " + token
        },
        cache: false,
        success: function (data) {
            console.log(data);
            var aux = document.getElementById("dob");
            aux.value = data.dob.substring(0, 10);
            aux = document.getElementById("featured");
            aux.value = (data.featured) ? "Yes" : "No";
        }
    });
}
;
function addAthlete(name, lastName, dob, featured, delegationId) {
    var arr = {name: name, lastname: lastName, dob: dob, featured: featured, delegationId: {delegationId: delegationId}};
    console.log(arr);
    var token = localStorage.getItem('token');
    console.log(token);
    var selectedDelegation = document.getElementById("searchByDel").value;
    $.ajax({
        url: WS_URLS.ATHLETES_LISTAR_DESDE_HASTA,
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
            $("#addAthleteOkAlert").show();
            if (delegationId === selectedDelegation) {
                var html = parseEventToHtml(data);
                $("#AthleteTable > thead:last").append(html);
            }
        },
        statusCode: {
            500: function () {
                $("#addAthleteErrorAlert").empty();
                $("#addAthleteErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + CONSTANTE_ERROR_MESSAGE_SERVIDOR_500);
                $("#addAthleteErrorAlert").show();
                $("#addAthleteErrorAlert").fadeOut(2000);
            },
            400: function () {
                $("#addAthleteErrorAlert").empty();
                $("#addAthleteErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + DB_ERROR);
                $("#addAthleteErrorAlert").show();
                $("#addAthleteErrorAlert").fadeOut(2000);

            },
            401: function () {
                $("#addAthleteErrorAlert").empty();
                $("#addAthleteErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_AUTHORIZED);
                $("#addAthleteErrorAlert").show();
                $("#addAthleteErrorAlert").fadeOut(2000);
            },
            415: function () {
                $("#addAthleteErrorAlert").empty();
                $("#addAthleteErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_ALLOWED_METHOD);
                $("#addAthleteErrorAlert").show();
                $("#addAthleteErrorAlert").fadeOut(2000);
            }
        }

    });
}
;
function editAthlete(idAthlete, AthleteUpdatedData) {
    var flag = false;
    var token = localStorage.getItem('token');

    console.log(token);
    $.ajax({
        url: WS_URLS.ATHLETES_LISTAR_DESDE_HASTA + idAthlete,
        type: 'PUT',
        data: JSON.stringify(AthleteUpdatedData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        cache: false,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function () {
            $("#editAthleteOkAlert").show();
            flag = true;
        },
        statusCode: {
            404: function () {
                $("#editAthleteErrorAlert").empty();
                $("#editAthleteErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + 'No se ha encontrado el atleta a modificar');
                $("#editAthleteErrorAlert").show();
                $("#editAthleteErrorAlert").fadeOut(2000);
            },
            500: function () {
                $("#editAthleteErrorAlert").empty();
                $("#editAthleteErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + CONSTANTE_ERROR_MESSAGE_SERVIDOR_500);
                $("#editAthleteErrorAlert").show();
                $("#editAthleteErrorAlert").fadeOut(2000);
            },
            415: function () {
                $("#editAthleteErrorAlert").empty();
                $("#editAthleteErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_ALLOWED_METHOD);
                $("#editAthleteErrorAlert").show();
                $("#editAthleteErrorAlert").fadeOut(2000);
            },
            401: function () {
                $("#editAthleteErrorAlert").empty();
                $("#editAthleteErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_AUTHORIZED);
                $("#editAthleteErrorAlert").show();
                $("#editAthleteErrorAlert").fadeOut(2000);
            }
        }
    });
    return flag;
}
;
function chargeAthleteData(idAthlete) {
    idAth = idAthlete.substring(4);
    token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.ATHLETES_LISTAR_DESDE_HASTA + idAth,
        headers: {
            "Authorization": "oauth " + token
        },
        cache: false,
        success: function (data) {
            var aux = document.getElementById("editAthleteId");
            aux.value = data.athleteId;
            aux = document.getElementById("editAthleteName");
            aux.value = data.name;
            aux = document.getElementById("editAthleteLastName");
            aux.value = data.lastname;
            aux = document.getElementById("editAthleteDob");
            aux.value = data.dob.substring(0, 10);
            aux = document.getElementById("editAthleteFeatured");
            aux.selectedIndex = (data.featured) ? 1 : 0;
            aux = document.getElementById("editAthleteDelegation");
            if (aux.length === 0) { //no permite cargar múltiples veces el combobox
                listDelegation(aux);
            }
            //console.log(aux.options);
            $.each(aux.options, function (i, option) {
                console.log(option.value);
                console.log(data.delegationId.delegationId);
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
;