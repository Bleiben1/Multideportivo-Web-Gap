/* 
 *   Archivo de datos y funciones comunes al sistema.
 *   @Author Nicolás 
 */

/**
 * 
 * Url principal
 */
var current_page = 1;
var total_per_page = 10;
var BASE_URL = 'localhost:8282/Multideportivo-Web-Gap/';
var CONSTANTE_ERROR_MESSAGE_NO_AUTORIZADO = "No autorizado";
var CONSTANTE_ERROR_MESSAGE_SERVIDOR_500 = "Error interno del servidor";
var BASE_URL_SERVER = "http://tecnocompetition.ddns.net:8080/pfinal/services/";
var NOT_ALLOWED_METHOD = "Método no permitido";
var NOT_AUTHORIZED = "No autorizado";
var DB_ERROR = "Error de base de datos";
/**
 * 
 * URLS DE WEBSERVICES
 */
var WS_URLS =
        {
            LOGIN: "http://www......com/",
            REGISTRO: "http://www......com/",
            //EVENTOS_LISTAR_DESDE_HASTA: "http://localhost.com:8080/PFinal/services/entities.maincompetition/",
            EVENTOS_LISTAR_DESDE_HASTA: BASE_URL_SERVER+"entities.maincompetition/",
            COMPETICIONES_LISTAR_DESDE_HASTA: BASE_URL_SERVER+"entities.competition/",
            ADMIN_COMPETITION_LISTAR_DESDE_HASTA: BASE_URL_SERVER+"entities.admincompetition/",
            ADMIN_DELEGATION_LISTAR_DESDE_HASTA: BASE_URL_SERVER+"entities.admindelegation/",
            ADMIN_COMPETITION_VER_DETALLE: BASE_URL_SERVER+"entities.admincompetition/",
            DELEGATIONS_LISTAR_DESDE_HASTA: BASE_URL_SERVER+"entities.delegation/",
            COUNTRIES_LISTAR_DESDE_HASTA: BASE_URL_SERVER+"entities.country/",
            DISCIPLINES_LISTAR_DESDE_HASTA: BASE_URL_SERVER+"entities.discipline/",
            ATHLETES_LISTAR_DESDE_HASTA: BASE_URL_SERVER+"entities.athlete/",
            LOCATIONS_LISTAR_DESDE_HASTA: BASE_URL_SERVER+"entities.location/",
            REGION_LISTAR_DESDE_HASTA: BASE_URL_SERVER+"entities.region/",
            ETC: "http://www.......com/"
        };


/**
 * 
 * Devuelve el panel (menu a la izquierda) y lo inserta en el componente con el id panelId.
 */
function loadMainPanel(panelId) {
    console.log("Main panel being created...");
    var r = $('#' + panelId + '').load(BASE_URL + "pages/content/main_panel.html", function () {
        $(this).trigger('create');
    });
    console.log("Main panel created and appended to " + panelId + ".");
    return r;
}

function addAlert(message, id) { //cargar mensajes de error 
    $('#' + id).append(
            '<div class="alert">' +
            '<button type="button" class="close" data-dismiss="alert">' +
            '&times;</button>' + message + '</div>');
}

function calculateAge(date){
    var values=date.split("-");
        var day = values[2];
        var month = values[1];
        var year = values[0];
 
        // cogemos los valores actuales
        var date_today = new Date();
        var today_year = date_today.getYear();
        var today_month = date_today.getMonth()+1;
        var today_day = date_today.getDate();
 
        // realizamos el calculo
        var age = (today_year + 1900) - year;
        if ( today_month < month )
        {
            age--;
        }
        if ((month == today_month) && (today_day < day))
        {
            age--;
        }
        if (age > 1900)
        {
            age -= 1900;
        }
        return age;
}
function listDelegation(combo) {
    var i = 0;
    console.log(combo);
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.DELEGATIONS_LISTAR_DESDE_HASTA + 0 + "/" + 900,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function (data) {
            console.log(data);
            $.each(data, function (i, delegation) {
                var option = document.createElement("option");
                option.text = delegation.name;
                option.value = delegation.delegationId;
                combo.add(option);
                i++;
            });
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
function listRegions(idCountry, combo){
    var i = 0;
    console.log(combo);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.REGION_LISTAR_DESDE_HASTA + idCountry,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function (data) {
            console.log(data);
            $.each(data, function (i, region) {
                var option = document.createElement("option");
                option.text = region.name;
                option.value = region.regionId;
                combo.add(option);
                i++;
            });
        }
    });
};

function showLoader(){
	$("#loading").removeClass("hidden");
	}
	
function hideLoader(){
	$("#loading").addClass("hidden");
	}