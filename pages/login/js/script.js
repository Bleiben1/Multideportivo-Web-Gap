// JavaScript Document

$(document).ready(function () {
	hideLoader();
$("#login").on("click", function (e) {
    console.log("prueba");
    e.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
console.log(username);
    login(username, password);

});

function login(username, password) {
    var user = {"username": username, "password": password};
    console.log(JSON.stringify(user));
    $.ajax({
        type: "POST",
        url: "http://tecnocompetition.ddns.net:8080/pfinal/services/adminauth",
        data: JSON.stringify(user),
        dataType: "json", crossDomain: true,
        accept: {
            json: 'application/json',
            xml: 'application/xml'
        },
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            var token = data.token;//extraer el token del mensaje
            localStorage.setItem("token", token); //guarda en la cache el token
            var role = data.role;
            localStorage.setItem("role", role);
            localStorage.setItem("adminId", data.adminId);
            if(role == 2){
                chargeMainCompetitionLS(data.adminId, token);
            }
//loader(false);
            console.log("success");
            alert('Logueado correctamente.');
            $("#login_container").remove();
                    $("#content").append('<div class="col-sm-4 col-md-4 col-sm-offset-4 col-md-offset-4 ">'+
            '<div class="alert alert-success">'+
                '<button id="loggedIn" type="button" class="close" data-dismiss="alert" aria-hidden="true">'+
                    '×</button>'+
               '<span class="glyphicon glyphicon-ok"></span> <strong>Success Message</strong>'+
                '<hr class="message-inner-separator">'+
                '<p>'+
                    'You successfully logged in.</p>'+
            '</div>'+
        '</div>');
$("#content div").fadeOut(3000, function(){
    $("#content").append("");
});
        $("#log-in").text("Cerrar Sesión");
            /*var div = document.createElement("div");
            div.innerHTML = "<b>WELCOME BACK</b>";
            div.setAttribute("class","col-md-12");
            div.setAttribute("id","infoContainer");
            $("#content").load(div);*/
            //document.getElementById("content").removeChild("login_container");
            
        },
        statusCode: {
            401:
                    function () {
                        alert(CONSTANTE_ERROR_MESSAGE_NO_AUTORIZADO);
                    },
            500: function () {
                alert(CONSTANTE_ERROR_MESSAGE_SERVIDOR_500);
            }
        }
    });
}
});

function chargeMainCompetitionLS(idAdmin, tokenAdmin){
    
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.ADMIN_COMPETITION_LISTAR_DESDE_HASTA + idAdmin,
        headers: {
            "Authorization": "oauth " + tokenAdmin
        },
        cache: false,
        success: function (data) {
            console.log(data);
            localStorage.setItem("mainCompetition",data.mainCompetitionId.mainCompetitionId);
        }
    });
};
