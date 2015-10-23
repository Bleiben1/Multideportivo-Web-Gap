$.ajax({
		type:POST,
		url:"http://localhost:8080/PFinal/services/list/",
		data:JSON.stringify({"list":evento}),
		success: function(data){
				$.each(data.evento, function(){
						var elemento = '<li><img src="' + evento.imgLink + '"><h4>'+ evento.titulo +'</h4><p>'+ evento.contenido +'</p></li>';
						$(elemento).appendTo('#listEventsConten');
					});
			},
	})