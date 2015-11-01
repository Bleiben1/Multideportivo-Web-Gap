$(document).bind('mobileinit', function () {
    $.mobile.loader.prototype.options.text = "loading";
    $.mobile.loader.prototype.options.textVisible = false;
    $.mobile.loader.prototype.options.theme = "a";
    $.mobile.loader.prototype.options.html = "";
    $.mobile.changePage.defaults.changeHash = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
});

$(document).ready(function () {
    console.log("Index page ready");
    loadMainPanel("mainPanel");//loads the main panel
    var token = localStorage.getItem("token");
    if (token != null){
    document.getElementById("log-in").text = "Cerrar Sesión";
    }
    //fix para ir al inicio el panel
    $("body").on("click", "#goto_index_page", function (e) {
        window.location.href = BASE_URL + "index.html";
        e.preventDefault();
    });

    //--------------prueba-------------
    $("body").on("click", "#idEventos", function (e) {
		console.log("getting events form ws, please wait...");
        $("#content").load("pages/evento/evento.html");
    });
	
	$("body").on("click", "#idCompeticiones", function (e) {
		console.log("getting events form ws, please wait...");
    	$("#content").load("pages/competicion/competicion.html");
    });
    
    $("body").on("click", "#idAdminCompetition", function (e){
       console.log("getting the data from ws, please wait...");
       $("#content").load("pages/admin_competition/admin_competition.html");

        //$("#infoContainer").load("pages/evento/evento.html"); no se si se usaba para algo, o yo lo deje sin querer
    });
    
     $("body").on("click", "#idAdminDelegation", function (e){
       console.log("getting the data from ws, please wait...");
       $("#content").load("pages/admin_delegation/admin_delegation.html");
   });
    //--------------/prueba------------
	$("#log-in").click(function(event) {
	var token = localStorage.getItem("token");
        if (token == null){
            $("#content").load('pages/login/login.html');
        }
        else 
            if (confirm('¿Seguro que desea cerrar la sesión?')) 
            localStorage.removeItem("token");
                document.getElementById("log-in").text = "Ingresar";

	});

});