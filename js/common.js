/* 
 *   Archivo de datos y funciones comunes al sistema.
 *   @Author Nicolás 
 */

/**
 * 
 * Url principal
 */
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
            ADMIN_COMPETITION_LISTAR_DESDE_HASTA: BASE_URL_SERVER+"entities.admincompetition/",
            ADMIN_DELEGATION_LISTAR_DESDE_HASTA: BASE_URL_SERVER+"entities.admindelegation/",
            ADMIN_COMPETITION_VER_DETALLE: BASE_URL_SERVER+"entities.admincompetition/",
            DELEGATIONS_LISTAR_DESDE_HASTA: BASE_URL_SERVER+"entities.delegation/",
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