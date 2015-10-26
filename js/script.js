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

    //fix para ir al inicio el panel
    $("body").on("click", "#goto_index_page", function (e) {
        window.location.href = "index.html";
        e.preventDefault();
    });
});
