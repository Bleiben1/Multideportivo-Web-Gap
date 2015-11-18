/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {
    console.log("Eventos document ready.");
    loadMainPanel("eventMainPanel");//loads the main panel
    listLocations(); //listado de las sedes de competición

    $("body").on("click", "#btnEditLocation", function (e) {
        console.log("Updating the new data");
        var updateId = document.getElementById("editLocationId").value;
        var updateName = document.getElementById("editLocationName").value;
        var updateRegionName = document.getElementById("editLocationRegion").options[document.getElementById("editLocationRegion").selectedIndex].text;
        var updateLat = document.getElementById("editLocationLatitude").value;
        var updateLong = document.getElementById("editLocationLongitude").value; // quiza se saque en el futuro
        var updateCapacity = document.getElementById("editLocationCapacity").value; // quiza se saque en el futuro
        var regionId = document.getElementById("editLocationRegion").value;
        var arr = {name: updateName, latitude: updateLat, longitude: updateLong, capacity: updateCapacity, regionId: {regionId: regionId}};
        var flag = editLocation(updateId, arr);
        if (flag === true) {
            var element = document.getElementById(updateId);
            element.parentNode.parentNode.childNodes[1].innerHTML = updateName; //necesito sacar el texto que esta puesto en el combobox
            element.parentNode.parentNode.childNodes[2].innerHTML = updateCapacity;
            element.parentNode.parentNode.childNodes[3].innerHTML = updateRegionName;

        }

    });
    $("body").on("click", "#btnAddLocation", function (e) {
        console.log("Adding new location to ws");
        var newName = document.getElementById("AddName").value;
        var newLatitude = document.getElementById("AddLatitude").value;
        var newLongitude = document.getElementById("AddLongitude").value;
        var newCapacity = document.getElementById("AddCapacity").value;
        var regionId = document.getElementById("AddRegion").value;
        addLocation(newName, newLatitude, newLongitude, newCapacity, regionId);
    });

    $("body").on("shown.bs.modal", "#addLocationModal", function (e) {
        document.getElementById("AddRegion").options.length = 0;
        aux = document.getElementById("AddCountry");
        if (aux.length === 0) {
            listCountries(aux);
        }
    });
    $("body").on("hidden.bs.modal", "#addLocationModal", function (e) {
        document.getElementById("AddLocationForm").reset();
        $("#addLocationOkAlert").hide();
        $("#addLocationErrorAlert").hide();
    });
    $("body").on("hidden.bs.modal", "#seeDetailModal", function (e) {
        document.getElementById("SDLocationForm").reset();
    });

    $("body").on("hidden.bs.modal", "#editLocationModal", function (e) {
        document.getElementById("editLocationCountry").options.lenght = 0;
        document.getElementById("editLocationRegion").options.lenght = 0;
        document.getElementById("editLocationForm").reset();
        $("#editLocationOkAlert").hide();
        $("#editLocationErrorAlert").hide();
    });

    $('.alert .close').on('click', function (e) {
        $(this).parent().hide();
    });

    $("body").on("change", "#AddCountry", function (e) {
        document.getElementById("AddRegion").options.length = 0;
        listRegions(this.options[this.selectedIndex].value, document.getElementById("AddRegion"));
    });
});

function parseEventToHtml(location) {//segun los datos enviados, crea una fila nueva y la devuelve para luego insertarla
    var id = location.locationId;
    return '<tr>' +
            '<td>' + id + '</td>' +
            '<td>' + location.name + '</td>' +
            '<td>' + location.capacity + '</td>' +
            '<td>' + location.regionId.name + '</td>' +
            '<td class="text-center">' + '<a style="margin: 2px;" class="btn btn-info btn-xs" href="#" id=edit' + id + ' data-toggle="modal" data-target="#editLocationModal" onclick="chargeLocationData(this.id)">' +
            '<span class="glyphicon glyphicon-edit">' +
            '</span> Edit</a>' + '<a style="margin: 2px;" class="btn btn-info btn-xs" id=' + id + ' href="#" data-toggle="modal" data-target="#seeDetLocationModal" onclick="seeDetailLocation(this.id)">' +
            '<span class="glyphicon glyphicon-plus-sign">' +
            '</span> See Detail</a>' + '<a href="#" class="btn btn-danger btn-xs" id=del' + id + '><span class="glyphicon glyphicon-remove"></span> Del</a>' + '</td>' + '</tr>';
}
;
function listLocations() {
    var limit = (current_page - 1) * total_per_page;
    var offset = current_page * total_per_page;
    token = localStorage.getItem("token");
    console.log(token);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.LOCATIONS_LISTAR_DESDE_HASTA + limit + "/" + offset,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function (data) {
            console.log(data);
            $.each(data, function (i, location) {
                console.log(location);
                var html = parseEventToHtml(location);
                $("#LocationTable > thead:last").append(html);
            });
        }
    });
}
;

function addLocation(name, latitude, longitude, capacity, regionId) {
    var arr = {name: name, latitude: latitude, longitude: longitude, capacity: capacity, regionId: {regionId: regionId}};
    var token = localStorage.getItem('token');
    console.log(token);
    $.ajax({
        url: WS_URLS.LOCATIONS_LISTAR_DESDE_HASTA,
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
            $("#addLocationOkAlert").show();
            var html = parseEventToHtml(data);
            $("#LocationTable > thead:last").append(html);
        },
        statusCode: {
            500: function () {
                $("#addLocationErrorAlert").empty();
                $("#addLocationErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + CONSTANTE_ERROR_MESSAGE_SERVIDOR_500);
                $("#addLocationErrorAlert").show();
                $("#addLocationErrorAlert").fadeOut(2000);
            },
            400: function () {
                $("#addLocationErrorAlert").empty();
                $("#addLocationErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + DB_ERROR);
                $("#addLocationErrorAlert").show();
                $("#addLocationErrorAlert").fadeOut(2000);

            },
            401: function () {
                $("#addLocationErrorAlert").empty();
                $("#addLocationErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_AUTHORIZED);
                $("#addLocationErrorAlert").show();
                $("#addLocationErrorAlert").fadeOut(2000);
            },
            415: function () {
                $("#addLocationErrorAlert").empty();
                $("#addLocationErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_ALLOWED_METHOD);
                $("#addLocationErrorAlert").show();
                $("#addLocationErrorAlert").fadeOut(2000);
            }
        }

    });
}
;
function seeDetailLocation(id) {
    var LocationId = id;
    var token = localStorage.getItem('token');
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.LOCATIONS_LISTAR_DESDE_HASTA + LocationId,
        headers: {
            "Authorization": "oauth " + token
        },
        cache: false,
        success: function (data) {
            console.log(data);
            var aux = document.getElementById("longitude");
            aux.value = data.longitude;
            aux = document.getElementById("latitude");
            aux.value = data.latitude;
        }
    });
}

function editLocation(idLocation, LocationUpdatedData) {
    var flag = false;
    var token = localStorage.getItem('token');

    console.log(token);
    $.ajax({
        url: WS_URLS.LOCATIONS_LISTAR_DESDE_HASTA + idLocation,
        type: 'PUT',
        data: JSON.stringify(LocationUpdatedData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        cache: false,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function () {
            $("#editLocationOkAlert").show();
            flag = true;
        },
        statusCode: {
            404: function () {
                $("#editLocationErrorAlert").empty();
                $("#editLocationErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + 'No se ha encontrado la sede a modificar');
                $("#editLocationErrorAlert").show();
                $("#editLocationErrorAlert").fadeOut(2000);
            },
            500: function () {
                $("#editLocationErrorAlert").empty();
                $("#editLocationErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + CONSTANTE_ERROR_MESSAGE_SERVIDOR_500);
                $("#editLocationErrorAlert").show();
                $("#editLocationErrorAlert").fadeOut(2000);
            },
            415: function () {
                $("#editLocationErrorAlert").empty();
                $("#editLocationErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_ALLOWED_METHOD);
                $("#editLocationErrorAlert").show();
                $("#editLocationErrorAlert").fadeOut(2000);
            },
            401: function () {
                $("#editLocationErrorAlert").empty();
                $("#editLocationErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_AUTHORIZED);
                $("#editLocationErrorAlert").show();
                $("#editLocationErrorAlert").fadeOut(2000);
            }
        }
    });
    return flag;
}
;

function chargeLocationData(id) {
    idLoc = id.substring(4);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.LOCATIONS_LISTAR_DESDE_HASTA + idLoc,
        headers: {
            "Authorization": "oauth " + token
        },
        cache: false,
        success: function (data) {
            var aux = document.getElementById("editLocationId");
            aux.value = data.locationId;
            aux = document.getElementById("editLocationName");
            aux.value = data.name;
            aux = document.getElementById("editLocationLatitude");
            aux.value = data.latitude;
            aux = document.getElementById("editLocationLongitude");
            aux.value = data.longitude;
            aux = document.getElementById("editLocationCapacity");
            aux.value = data.capacity;
            aux = document.getElementById("editLocationCountry");
            if (aux.length === 0) { //no permite cargar múltiples veces el combobox
                listCountries(aux); //faltaria indicar que pais es segun la region pero no se si hay ws
            }
            $.each(aux.options, function (i, option) {
                console.log(option.value);
                console.log(data.regionId.countryId.countryId); //revisar cuando anden los ws de delegation
                if (option.value == data.regionId.countryId.countryId)
                {
                    console.log("ok");
                    console.log(option.index);
                    aux.selectedIndex = option.index;
                    aux = document.getElementById("editLocationRegion");
                    if (aux.length === 0) { //no permite cargar múltiples veces el combobox
                        listRegions(data.regionId.countryId.countryId, aux);
                    }
                    return true;
                }
            });
        }
    });
}
