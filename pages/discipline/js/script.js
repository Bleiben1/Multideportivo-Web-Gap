/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var current_page = 1;
var total_per_page = 10;

$(document).ready(function () {
    console.log("Disciplines document ready.");
    loadMainPanel("eventMainPanel");//loads the main panel
    listDisciplines(); //listado de los administradores de de
    //--------------------------------------------------------------------------
    $("body").on("click", "#btnAddDiscipline", function (e) {
        console.log("Adding a new discipline to ws");
        var newName = document.getElementById("AddName").value;
        var newDescription = document.getElementById("AddDescription").value;
        //var newImg = document.getElementById("AddImg").value; 
        addDiscipline(newName, newDescription, "/noimage/");
    });
    //--------------------------------------------------------------------------
    $("body").on("click", "#btnEditDiscipline", function (e) {
        console.log("Updating the new data");
        var disciplineId = document.getElementById("editDiscId").value;
        var updateName = document.getElementById("editDiscName").value;
        //var updateImg = document.getElementById("editDiscImg").value; 
        var updateDescription = document.getElementById("editDiscDescription").value;
        var arr = {name: updateName, description: updateDescription, imageUrl: "/noimage/"};
        var flag = editDiscipline(disciplineId, arr);
        if (flag === true) {
            var element = document.getElementById('edit' + disciplineId);
            element.parentNode.parentNode.childNodes[1].innerHTML = updateName; //necesito sacar el texto que esta puesto en el combobox
            element.parentNode.parentNode.childNodes[2].innerHTML = updateDescription;
            //element.parentNode.parentNode.childNodes[3].innerHTML = updateImg;
        }

    });
    //--------------------------------------------------------------------------

    $('.alert .close').on('click', function (e) {
        $(this).parent().hide();
    });
    $("body").on("shown.bs.modal", "#addDisciplineModal", function (e) {
        /*aux = document.getElementById("AddCountry");
         if (aux.length === 0) {
         listCountries(aux);
         }*/
    });
    $("body").on("hidden.bs.modal", "#addDiscplineModal", function (e) {
        document.getElementById("AddDiscForm").reset();
        $("#addDiscOkAlert").hide();
        $("#addDiscErrorAlert").hide();
    });
    $("body").on("hidden.bs.modal", "#editDisciplineModal", function (e) {
        document.getElementById("editDiscForm").reset();
        $("#editDiscOkAlert").hide();
        $("#editDiscErrorAlert").hide();
    });
    $("body").on("hidden.bs.modal", "#editDisciplineModal", function (e) {
        document.getElementById("editDisciplineForm").reset();
        $("#editDiscOkAlert").hide();
        $("#editDiscErrorAlert").hide();
    });
});
function parseEventToHtml(discipline) {//segun los datos enviados, crea una fila nueva y la devuelve para luego insertarla

    return '<tr>' +
            '<td>' + discipline.disciplineId + '</td>' +
            '<td>' + discipline.name + '</td>' +
            '<td>' + discipline.description + '</td>' +
            '<td class="text-center">' + '<a style="margin: 2px;" class="btn btn-info btn-xs" href="#" id=edit' + discipline.disciplineId + ' data-toggle="modal" data-target="#editDisciplineModal" onclick="chargeDisciplineData(this.id)">' +
            '<span class="glyphicon glyphicon-edit">' +
            '</span> Edit</a>' + '<a href="#" class="btn btn-danger btn-xs" id=del' + discipline.disciplineId + '><span class="glyphicon glyphicon-remove"></span> Del</a>' + '</td>' + '</tr>';
}
;
function chargeDisciplineData(idDiscipline) {
    idDisc = idDiscipline.substring(4);
    console.log(idDisc);
    token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.DISCIPLINES_LISTAR_DESDE_HASTA + idDisc,
        headers: {
            "Authorization": "oauth " + token
        },
        cache: false,
        success: function (data) {
            var aux = document.getElementById("editDiscId");
            aux.value = data.disciplineId;
            aux = document.getElementById("editDiscName");
            aux.value = data.name;
            aux = document.getElementById("editDiscDescription");
            aux.value = data.description;
//            aux = document.getElementById("editDiscImg");
//            aux.value = data.imgUrl;
//            aux = document.getElementById("editDelCountry");
//            if (aux.length === 0) { //no permite cargar múltiples veces el combobox
//                listCountries(aux);
//            }
//            //console.log(aux.options);
//            $.each(aux.options, function (i, option) {
//                console.log(option.value);
//                console.log(data.countryId.countryId); //revisar cuando anden los ws de delegation
//                if (option.value == data.countryId.countryId)
//                {
//                    console.log("ok");
//                    console.log(option.index);
//                    aux.selectedIndex = option.index;
//                    return true;
//                }
//            });
        }
    });
}
function listDisciplines() {
    var limit = (current_page - 1) * total_per_page;
    var offset = current_page * total_per_page;
    token = localStorage.getItem("token");
    console.log(token);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.DISCIPLINES_LISTAR_DESDE_HASTA + limit + "/" + offset,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function (data) {
            console.log(data);
            $.each(data, function (i, discipline) {
                console.log(discipline);
                var html = parseEventToHtml(discipline);
                $("#DisciplineTable > thead:last").append(html);
            });
        }
    });
}
;

function addDiscipline(name, description, imgUrl) {
    var arr = {name: name, description: description, imageUrl: imgUrl};
    console.log(arr);
    var token = localStorage.getItem('token');
    console.log(token);
    $.ajax({
        url: WS_URLS.DISCIPLINES_LISTAR_DESDE_HASTA,
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
            $("#addDiscOkAlert").show();
            var html = parseEventToHtml(data);
            $("#DisciplineTable > thead:last").append(html);
        },
        statusCode: {
            500: function () {
                $("#addDiscErrorAlert").empty();
                $("#addDiscErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + CONSTANTE_ERROR_MESSAGE_SERVIDOR_500);
                $("#addDiscErrorAlert").show();
                $("#addDiscErrorAlert").fadeOut(2000);
            },
            400: function () {
                $("#addDiscErrorAlert").empty();
                $("#addDiscErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + DB_ERROR);
                $("#addDiscErrorAlert").show();
                $("#addDiscErrorAlert").fadeOut(2000);
            },
            401: function () {
                $("#addDiscErrorAlert").empty();
                $("#addDiscErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_AUTHORIZED);
                $("#addDiscErrorAlert").show();
                $("#addDiscErrorAlert").fadeOut(2000);
            },
            415: function () {
                $("#addDiscErrorAlert").empty();
                $("#addDiscErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_ALLOWED_METHOD);
                $("#addDiscErrorAlert").show();
                $("#addDiscErrorAlert").fadeOut(2000);
            }
        }

    });
}

function editDiscipline(idDiscipline, DisciplineUpdatedData) {
    var flag = false;
    var token = localStorage.getItem('token');

    console.log(token);
    $.ajax({
        url: WS_URLS.DISCIPLINES_LISTAR_DESDE_HASTA + idDiscipline,
        type: 'PUT',
        data: JSON.stringify(DisciplineUpdatedData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        cache: false,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function () {
            $("#editDiscOkAlert").show();
            flag = true;
        },
        statusCode: {
            404: function () {
                $("#editDiscErrorAlert").empty();
                $("#editDiscErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + 'No se ha encontrado la disciplina a modificar');
                $("#editDiscErrorAlert").show();
                $("#editDiscErrorAlert").fadeOut(2000);
            },
            500: function () {
                $("#editDiscErrorAlert").empty();
                $("#editDiscErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + CONSTANTE_ERROR_MESSAGE_SERVIDOR_500);
                $("#editDiscErrorAlert").show();
                $("#editDiscErrorAlert").fadeOut(2000);
            },
            415: function () {
                $("#editDiscErrorAlert").empty();
                $("#editDiscErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_ALLOWED_METHOD);
                $("#editDiscErrorAlert").show();
                $("#editDiscErrorAlert").fadeOut(2000);
            },
            401: function () {
                $("#editDiscErrorAlert").empty();
                $("#editDiscErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_AUTHORIZED);
                $("#editDiscErrorAlert").show();
                $("#editDiscErrorAlert").fadeOut(2000);
            }
        }
    });
    return flag;
}