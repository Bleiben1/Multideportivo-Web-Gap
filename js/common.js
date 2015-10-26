/* 
 *   Archivo de datos y funciones comunes al sistema.
 *   @Author Nicolás 
 */

/**
 * 
 * Url principal
 */
var BASE_URL = 'http://www.localhost.com:8079/PhonegapPFinal/Multideportivo-Web-Gap/';


/**
 * 
 * URLS DE WEBSERVICES
 */
var WS_URLS =
        {
            LOGIN: "http://www......com/",
            REGISTRO: "http://www......com/",
            //EVENTOS_LISTAR_DESDE_HASTA: "http://localhost.com:8080/PFinal/services/entities.maincompetition/",
            EVENTOS_LISTAR_DESDE_HASTA: "http://tecnocompetition.ddns.net:8080/pfinal/services/entities.maincompetition/",
            OTRO_WS: "http://www......com/",
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
 