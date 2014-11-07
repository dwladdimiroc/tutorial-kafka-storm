$(function(){
	$('#btn-yellow').click(function (event) {
		jQuery.support.cors = true;

		var vote = {
			yellow: 1,
			blue: 0,
			red: 0
		}

		$.ajax({
		    url: "http://localhost:8080/vote/",
		    type: "POST",
		    data: { username : document.getElementById("label-user").innerHTML,
		    		vote: JSON.stringify(vote),
		    		color: "yellow" },
            dataType: "json",
		    success: function(resp) {
		        //Acciones posteriores a la confección del POST
		        console.log('Vote yellow: ' + resp.status);

		    },
		    error: function(req,error) {
		        //En caso de error del POST
		        console.log(req.responseText);
		        console.log(error);

	        	toastr.options = {
				  "closeButton": true,
				  "debug": false,
				  "positionClass": "toast-bottom-full-width",
				  "onclick": null,
				  "showDuration": "300",
				  "hideDuration": "1000",
				  "timeOut": "5000",
				  "extendedTimeOut": "1000",
				  "showEasing": "swing",
				  "hideEasing": "linear",
				  "showMethod": "fadeIn",
				  "hideMethod": "fadeOut"
				}

				toastr.error("Hubo un error al votar, intente más tarde...", "Error");
		    }
		});
	});

	$('#btn-blue').click(function (event) {
		jQuery.support.cors = true;

		var vote = {
			yellow: 0,
			blue: 1,
			red: 0
		}

		$.ajax({
		    url: "http://localhost:8080/vote/",
		    type: "POST",
		    data: { username : document.getElementById("label-user").innerHTML,
		    		vote: JSON.stringify(vote),
		    		color: "blue" },
            dataType: "json",
		    success: function(resp) {
		        //Acciones posteriores a la confección del POST
		        console.log('Vote blue: ' + resp.status);

		    },
		    error: function(req,error) {
		        //En caso de error del POST
		        console.log(req.responseText);
		        console.log(error);

	        	toastr.options = {
				  "closeButton": true,
				  "debug": false,
				  "positionClass": "toast-bottom-full-width",
				  "onclick": null,
				  "showDuration": "300",
				  "hideDuration": "1000",
				  "timeOut": "5000",
				  "extendedTimeOut": "1000",
				  "showEasing": "swing",
				  "hideEasing": "linear",
				  "showMethod": "fadeIn",
				  "hideMethod": "fadeOut"
				}

				toastr.error("Hubo un error al votar, intente más tarde...", "Error");
		    }
		});
	});

	$('#btn-red').click(function (event) {
		jQuery.support.cors = true;

		var vote = {
			yellow: 0,
			blue: 0,
			red: 1
		}

		$.ajax({
		    url: "http://localhost:8080/vote/",
		    type: "POST",
		    data: { username : document.getElementById("label-user").innerHTML,
		    		vote: JSON.stringify(vote),
		    		color: "red" },
            dataType: "json",
		    success: function(resp) {
		        //Acciones posteriores a la confección del POST
		        console.log('Vote red: ' + resp.status);

		    },
		    error: function(req,error) {
		        //En caso de error del POST
		        console.log(req.responseText);
		        console.log(error);

	        	toastr.options = {
				  "closeButton": true,
				  "debug": false,
				  "positionClass": "toast-bottom-full-width",
				  "onclick": null,
				  "showDuration": "300",
				  "hideDuration": "1000",
				  "timeOut": "5000",
				  "extendedTimeOut": "1000",
				  "showEasing": "swing",
				  "hideEasing": "linear",
				  "showMethod": "fadeIn",
				  "hideMethod": "fadeOut"
				}

				toastr.error("Hubo un error al votar, intente más tarde...", "Error");
		    }
		});
	});
});

function updateNumber() { 
//Cada dos segundos se conecta a la Api y obtiene cuantos tweets ha procesado la configuracion
	setTimeout(
    	function(){ $.ajax({ url: 'http://localhost:8080/voteCount/', type: 'GET', async:false, dataType: "json",
        	success: function(resultData) {
	            document.getElementById('voteYellow').innerHTML = resultData.countVoteYellow;
	            document.getElementById('voteBlue').innerHTML = resultData.countVoteBlue;
	            document.getElementById('voteRed').innerHTML = resultData.countVoteRed;
	            setTimeout("updateNumber()", 2000);
        	}
        });
    }, 2000);
}

$(document).ready(function(){
	document.getElementById("label-user").innerHTML = localStorage.getItem("username");

	$('#link-logout').click(function (event) {
		localStorage.clear();
		window.location.href = "http://localhost:8080/"	
	});

	updateNumber();
});