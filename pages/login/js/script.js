// JavaScript Document

$(document).ready(function () {
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
//loader(false);
            console.log("success");
            alert('Logueado correctamente.');
            document.getElementById("log-in").text = "Cerrar Sesión";
            /*var div = document.createElement("div");
            div.innerHTML = "<b>WELCOME BACK</b>";
            div.setAttribute("class","col-md-12");
            div.setAttribute("id","infoContainer");
            $("#content").load(div);*/
            //document.getElementById("content").removeChild("login_container");
            $("#login_container").remove();
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
