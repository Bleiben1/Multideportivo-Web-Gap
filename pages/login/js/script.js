// JavaScript Document
  $("#log_in").on("click", function (e) {
console.log("ok");
var username = document.getElementById("username").value;
var password = document.getElementById("password").value;
console.log(username);
//loader(true);
$.ajax({

 type: "POST",

 url: "http://tecnocompetition.ddns.net:8080/pfinal/services/adminauth", 

data: JSON.stringify({ "username": username,"pasword":password }), 

dataType: "json",
success: function(data){ 
console.log(data);
var token=data.token;//extraer el token del mensaje
localStorage.setItem("token", token); //guarda en la cache el token
//loader(false);
console.log("ok");
alert('Logueado correctamente.'); 
}, 

statusCode: { 
401: 
function() { 
alert(CONSTANTE_ERROR_MESSAGE_NO_AUTORIZADO); 
}, 
500: function() {
 alert(CONSTANTE_ERROR_MESSAGE_SERVIDOR_500); 
} 
} 
});
});
var username = localStorage.getItem('username');
console.log(username);