const open = document.getElementById('open');
const modal_container = document.getElementById('modal_container');
const close = document.getElementById('close');
const exit = document.getElementById('cancel');

//VENTANA MODAL. Insertamospara indicar nº cliente
open.addEventListener('click', () => {
    modal_container.classList.add('show');
    document.getElementById("open").style.visibility = "hidden";
    document.getElementById("usuario").focus();
});

//CANCELACION DEL FORMULARIO. Sale al principio (No deja volver a acceder al formulario)
var cancel = () => {
    window.location.replace("./index.html");
}

close.addEventListener('click', () => {
    var usuario = document.getElementById('usuario').value;
    var password = document.getElementById('password').value;

    importarUsuarios(usuario, password);
    if ( document.getElementById("confirmuserpassword")) {
        //console.log("Usuario y contraseña correctos2");
        document.getElementById("indexmenu").style.visibility = "visible";
        document.getElementById("lineaencabezado").style.visibility = "hidden";
        //alert("Usuario y contraseña correctos\nBienvenido a Gestor de devoluciones");
        modal_container.classList.remove('show');
       


    } else {
        alert("Usuario o contraseña incorrectos");
        usuario = document.getElementById('usuario').value = "";
        password = document.getElementById('password').value = "";
        document.getElementById("usuario").focus();
    }
});


//IMPORTACIÓN DE USUARIOS >>> Array de verificación
var importarUsuarios = (user, pass) => {
    var Activo = 1;
   // window.confirmation = false;

    $.ajax({
        type: "POST",
        url: "./PHPServidor.php",  //dirección del servidor
        data: {
            UsuarioActivo: Activo
        },
        success: function (response) {
            var index = response.indexOf("[");
            var json = response.substring(index, response.length);
            var jsparse = JSON.parse(json);
            console.log(json);

            for (var i = 0; i < jsparse.length; i++){
                if (jsparse[i].User == user && jsparse[i].Password) {
                    document.getElementById("confirmuserpassword").value = true;
                }
            }
        },
        error: function () {
            alert("Error");
        }
    });
}

