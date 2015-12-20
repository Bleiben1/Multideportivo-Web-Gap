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
    var nickname = localStorage.getItem("nickname");
    if (token != null) {
        console.log("ok");
        $("#log-in").text("Cerrar Sesión");
        $("#nickname").text(" " + nickname);
        $("#nickname-li").show();
        $("#nav-menu").show();
    }
    var role = localStorage.getItem("role");
    if (role == 2){
    $("#1, #dividerCompetition, #dividerAC, #3, #dividerDelegation, #5, #dividerDiscipline, #6, #dividerAthlete, #7").remove();
    }
    else if (role == 1){
    $("#1, #dividerCompetition, #3, #dividerAD, #4, #dividerDelegation, #5, #dividerDiscipline, #6, #dividerAthlete, #dividerLocation, #8, #dividerPost, #9").remove();
    }
    //fix para ir al inicio el panel
    
    /*$("body").on("click", "#logo", function (e) {
        token = localStorage.getItem("token");
        if (token != null) {
                            alert("ok");
        $("#log-in").text("Cerrar Sesión");
    }
    });*/
    $("body").on("click", "#goto_index_page", function (e) {
        alert("ok");
        window.location.href = BASE_URL + "index.html";
        e.preventDefault();
    });

    $("body").on("click", "#idEventos", function (e) {
        console.log("getting events form ws, please wait...");
        showLoader();
        $("#content").load("pages/evento/evento.html");
    });

    $("body").on("click", "#idCompeticiones", function (e) {
        console.log("getting events form ws, please wait...");
        showLoader();
        $("#content").load("pages/competicion/competicion.html");
        setTimeout(function () {
            hideLoader();
        }, 1000);
    });

    $("body").on("click", "#idAdminCompetition", function (e) {
        console.log("getting the data from ws, please wait...");
        showLoader();
        $("#content").load("pages/admin_competition/admin_competition.html");
        setTimeout(function () {
            hideLoader();
        }, 1000);
        //$("#infoContainer").load("pages/evento/evento.html"); no se si se usaba para algo, o yo lo deje sin querer
    });

    $("body").on("click", "#idAdminDelegation", function (e) {
        console.log("getting the data from ws, please wait...");
        showLoader();
        $("#content").load("pages/admin_delegation/admin_delegation.html");
        setTimeout(function () {
            hideLoader();
        }, 1000);
    });
    $("body").on("click", "#idDelegation", function (e) {
        console.log("getting the delegations from the ws, please wait...");
        showLoader();
        $("#content").load("pages/delegation/delegation.html");
        setTimeout(function () {
            hideLoader();
        }, 1000);
    });
    $("body").on("click", "#idDiscipline", function (e) {
        console.log("getting the disciplines from the ws, please wait...");
        showLoader();
        $("#content").load("pages/discipline/discipline.html");
        setTimeout(function () {
            hideLoader();
        }, 1000);
    });
    $("body").on("click", "#idAthlete", function (e) {
        console.log("getting the athletes from the ws, please wait...");
        showLoader();
        $("#content").load("pages/athlete/athlete.html");
        setTimeout(function () {
            hideLoader();
        }, 1000);
    });
    $("body").on("click", "#idLocation", function (e) {
        console.log("getting the locations from the ws, please wait...");
        showLoader();
        $("#content").load("pages/location/location.html");
        setTimeout(function () {
            hideLoader();
        }, 1000);
    });
    $("body").on("click", "#idPost", function (e) {
        console.log("getting the posts from the ws, please wait...");
        showLoader();
        $("#content").load("pages/post/post.html");
        setTimeout(function () {
            hideLoader();
        }, 1000);
    });
    $("body").on("click", "#idParticipation", function (e) {
        console.log("getting the participants from the ws, please wait...");
        showLoader();
        $("#content").load("pages/participacion/participacion.html");
        setTimeout(function () {
            hideLoader();
        }, 1000);
    });

    $("#log-in").click(function (event) {
        console.log("ok");
        var token = localStorage.getItem("token");
        if (token == null) {
            showLoader();
            $("#content").load('pages/login/login.html');
        }
        else
        if (confirm('¿Seguro que desea cerrar la sesión?')) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("mainCompetition");
            localStorage.removeItem("adminId");
            localStorage.removeItem("nickname");
            $("#nickname-li").css("display","none");
            $("#log-in").text("Ingresar");
            $("#nav-menu").css("display","none");
            window.location = "index.html";
        }  

    });

});