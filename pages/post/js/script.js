/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function () {
    console.log("Post document ready.");
    loadMainPanel("eventMainPanel");//loads the main panel
    listPosts();
    var d = new Date();


    //--------------------------------------------------------------------------
    $("body").on("click", "#btnAddPost", function (e) {
        console.log("Adding new post wn to ws");
        var newTitle = document.getElementById("AddTitle").value;
        var newDescription = document.getElementById("AddDescription").value;
        var d = new Date();
        var month, day, minute,hour;
        if (d.getMonth() < 10) {
            var month = "0" + d.getMonth;
        }
        else {
            month = d.getMonth();
        }
        if (d.getDay() < 10) {
            day = "0" + d.getDay();
        }
        else {
            day = d.getDay();
        }
        if (d.getMinutes() < 10)
        {
            minute = "0" + d.getMinutes();
        }
        else {
            minute = d.getMinutes();
        }
        if (d.getHours() < 10) {
            hour = "0" + d.getHours();
        }
        else {
            hour = d.getHours();
        }
        var newCreatedDate = d.getFullYear() + "-" + month + "-" + day +
                "T" + d.getHours("HH") + ":" + d.getMinutes("MM") + ":00-03:00";
        console.log(newCreatedDate);
        var adminId = localStorage.getItem("adminId");
        var mainCompetitionId = localStorage.getItem("mainCompetition");
        console.log("adminId" + adminId);
        console.log("mainComp" + mainCompetitionId);
        console.log("La fecha complete es: " + newCreatedDate);
        addPost(newTitle, newDescription, newCreatedDate, adminId, mainCompetitionId);
    });
    //--------------------------------------------------------------------------
    $("body").on("hidden.bs.modal", "#seeDetPostModal", function (e) {
        document.getElementById("SDPostForm").reset();
    });
    //--------------------------------------------------------------------------
    $('.alert .close').on('click', function (e) {
        $(this).parent().hide();
    });
    //--------------------------------------------------------------------------
    $("body").on("hidden.bs.modal", "#addPostModal", function (e) {
        document.getElementById("AddPostForm").reset();
        //$("#AddPostForm").reset();
        $("#addPostOkAlert").css("display", "none");
        $("#addPostErrorAlert").css("display", "none");
    });
});


function parseEventToHtml(post) {//segun los datos enviados, crea una fila nueva y la devuelve para luego insertarla
    console.log(post.createdDate);
    return '<tr class="normal_row">' +
            '<td>' + post.postId + '</td>' +
            '<td>' + "Date: " + post.createdDate.substring(0, 10) + " Time: " + post.createdDate.substring(11, 16) + '</td>' +
            '<td>' + post.title + '</td>' +
            '<td>' + post.description + '</td>' +
            '<td class="text-center">' + '<a style="margin: 2px;" class="btn btn-info btn-xs" href="#" id=edit' + post.postId + ' data-toggle="modal" data-target="#editPostModal" onclick="chargePostData(this.id)">' +
            '<span class="glyphicon glyphicon-edit">' +
            '</span> Edit</a>' + '<a style="margin: 2px;" class="btn btn-info btn-xs" id=' + post.postId + ' href="#" data-toggle="modal" data-target="#seeDetPostModal" onclick="seeDetailPost(this.id)">' +
            '<span class="glyphicon glyphicon-plus-sign">' +
            '</span> See Detail</a>' + '<a href="#" class="btn btn-danger btn-xs" id=del' + post.postId + '><span class="glyphicon glyphicon-remove"></span> Del</a>' + '</td>' + '</tr>';
}
;
function listPosts() {
    var limit = (current_page - 1) * total_per_page;
    var offset = current_page * total_per_page;
    mainCompetitionId = localStorage.getItem("mainCompetition");
    token = localStorage.getItem("token");
    console.log(token);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.POST_LISTAR_DESDE_HASTA + "mainCompetition/" + mainCompetitionId,
        headers: {
            "Authorization": "oauth " + token
        },
        success: function (data) {
            console.log(data);
            $.each(data, function (i, location) {
                console.log(location);
                var html = parseEventToHtml(location);
                $("#PostTable > thead:last").append(html);
            });
        },
        statusCode: {
            404: function () {
                //$("#PostTable tr .normal_row").remove();
                $(".normal_row").remove();
                html = '<tr class="normal_row">' +
                        '<td>' + "No hay registro de posts relacionados a tal evento, seleccione otro evento." + '</td>' +
                        '<td></td>' +
                        '<td></td>' +
                        '<td></td>' +
                        '<td </td>' + '</tr>';

                $("#PostTable > thead:last").append(html);
            }
        }
    });
}
;
/*function listPostsByMC(idMC) {
 var limit = (current_page - 1) * total_per_page;
 var offset = current_page * total_per_page;
 token = localStorage.getItem("token");
 console.log(token);
 $.ajax({
 type: "GET",
 dataType: "json",
 url: WS_URLS.POST_LISTAR_DESDE_HASTA + "mainCompetition/" + idMC,
 headers: {
 "Authorization": "oauth " + token
 },
 cache: false,
 success: function (data) {
 //$("#PostTable tr .normal_row").remove();
 $(".normal_row").remove();
 $.each(data, function (i, post) {
 var html = parseEventToHtml(post);
 $("#PostTable > thead:last").append(html);
 });
 },
 statusCode: {
 404: function () {
 $(".normal_row").remove();
 //$("#PostTable tr .normal_row").remove();
 html = '<tr class="normal_row">' +
 '<td>' + "No hay registro de posts relacionados a tal evento, seleccione otro evento." + '</td>' +
 '<td></td>' +
 '<td></td>' +
 '<td></td>' +
 '<td </td>' + '</tr>';
 
 $("#PostTable > thead:last").append(html);
 }
 }
 });
 }
 ;*/
function seeDetailPost(idPost) {
    console.log(idPost);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.POST_LISTAR_DESDE_HASTA + idPost,
        headers: {
            "Authorization": "oauth " + token
        },
        cache: false,
        success: function (data) {
            console.log(data);
            $("#createdBy").val(data.adminId.nickname);
            $("#email").val(data.adminId.email);
            $("#MCName").val(data.mainCompetitionId.name);
        }
    });
}
;
function addPost(title, description, createdDate, adminId, mainCompetitionId) {
    var arr = {adminId: {adminId: adminId}, createdDate: createdDate, description: description, mainCompetitionId: {mainCompetitionId: mainCompetitionId}, title: title};
    console.log(arr);
    var token = localStorage.getItem('token');
    console.log(token);
    $.ajax({
        url: WS_URLS.POST_LISTAR_DESDE_HASTA,
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
            $("#addPostOkAlert").show();
            var html = parseEventToHtml(data);
            $("#PostTable > thead:last").append(html);
        },
        statusCode: {
            500: function () {
                $("#addPostErrorAlert").empty();
                $("#addPostErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + CONSTANTE_ERROR_MESSAGE_SERVIDOR_500);
                $("#addPostErrorAlert").show();
                $("#addPostErrorAlert").fadeOut(2000);
            },
            400: function () {
                $("#addPostErrorAlert").empty();
                $("#addPostErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + DB_ERROR);
                $("#addPostErrorAlert").show();
                $("#addPostErrorAlert").fadeOut(2000);

            },
            401: function () {
                $("#addPostErrorAlert").empty();
                $("#addPostErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_AUTHORIZED);
                $("#addPostErrorAlert").show();
                $("#addPostErrorAlert").fadeOut(2000);
            },
            415: function () {
                $("#addPostErrorAlert").empty();
                $("#addPostErrorAlert").append('<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>¡Error!</strong>' + NOT_ALLOWED_METHOD);
                $("#addPostErrorAlert").show();
                $("#addPostErrorAlert").fadeOut(2000);
            }
        }

    });
}
;
function chargePostData(idPost) {
    token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        dataType: "json",
        url: WS_URLS.POST_LISTAR_DESDE_HASTA + idPost.substring(4),
        headers: {
            "Authorization": "oauth " + token
        },
        cache: false,
        success: function (data) {
            $("#editPostId").val(data.postId);
            $("#editPostTitle").val(data.title);
            $("#editPostDescription").val(data.description);
        }
    });
}
;