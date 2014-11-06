$(function (){
	$('#btn-login').click(function (event) {
		jQuery.support.cors = true;

		$.ajax({
		    url: "http://localhost:8080/login/",
		    type: "POST",
		    data: { username : document.getElementById("form-login-nick").value,
		            password : document.getElementById("form-login-pass").value },
            dataType: "json",
            async: false,
		    success: function(resp) {
		    	console.log(resp);
		    	console.log(resp.status);
		        //Acciones posteriores a la confección del POST
		        if(resp.status == "true"){
		        	localStorage.setItem("username", document.getElementById("form-login-nick").value);
		        	console.log('Login true');
		        	window.location.href = "http://localhost:8080/home"
		        } else {
        			console.log('Login false');
		        	alert("Error... Su usuario o contraseña no son correctos...")		        	
		        }
		    },
		    error: function(req,error) {
		        //En caso de error del POST
		        console.log(req);
		        console.log(req.responseText);
		        console.log(error);
		    }
		});
	});

	$('#btn-register').click(function (event) {
		jQuery.support.cors = true;

		$.ajax({
		    url: "http://localhost:8080/register/",
		    type: "POST",
		    data: { username : document.getElementById("form-register-nick").value ,
		            password : document.getElementById("form-register-pass").value },
            dataType: "json",
            async: false,
		    success: function(resp) {
		    	console.log(resp.status);
		        //Acciones posteriores a la confección del POST
		        if(resp.status == "true"){
		        	console.log('Register true');
		        	window.location.href = "http://localhost:8080/"
		        } else {
		        	console.log('Register false');
					
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

					toastr.error("Ya existe ese usuario en el sistema", "Error");
		        }
		    },
		    error: function(req,error) {
		        //En caso de error del POST
		        console.log(req);
		        console.log(req.responseText);
		        console.log(error);
		        //console.log(error);
		    }
		});
	});

	$('#link-register').click(function (event) {
        $('#form-login').hide();
        $('#form-register').show();
	});
});

$(document).ready(function(){
	if(localStorage.getItem("username")!=null){
		window.location.href = "http://localhost:8080/home"
	}
});