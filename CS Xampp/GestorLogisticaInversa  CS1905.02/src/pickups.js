const open = document.getElementById('open');
const modal_container = document.getElementById('modal_container');
const close = document.getElementById('close');
const exit = document.getElementById('cancel');

//Abre ventana emergente para indicar nº cliente
open.addEventListener('click', () => {
    modal_container.classList.add('show');
    document.getElementById("cliente").focus();
    document.getElementById("open").style.visibility = "hidden";
    document.getElementById("fecha-recogida").value = "";
    importarCodigosCliente();   //Listado de códigos de cliente
});

//Cancela el formulario y sale al principio (No deja volver a acceder al formulario)
var cancel = () => {
    window.location.replace("../forms/pickups.html");
}

/* Captura nº cliente, cierra y esconde la ventana y hace visible el formulario
pone el focus en campo pedido asociado */
close.addEventListener('click', () => {

    const cliente_ = document.getElementById('cliente').value;
    //Validación del número
    if (comprobarNumero(cliente_, 7) == true) {
        document.getElementById('codigo-cliente').value = cliente_;
        document.getElementById('cliente').value = "";
        modal_container.classList.remove('show');

        //Importamos los "option" de los 'select'
        importarAgencias();
        importarDepartamentos();

        //Mostramos el formulario
        document.getElementById('cont1').style.visibility = "visible";
        document.getElementById('cont2').style.visibility = "visible";
        document.getElementById('salirformulario').style.visibility = "visible";
        document.getElementById('pedido-asociado').value = "";
        document.getElementById('pedido-asociado').focus();

        datosCliente(cliente_); //Rellena los datos del cliente

    } else {
        document.getElementById('cliente').value = "";
        alert('Introduzca un número correcto');
        document.getElementById('cliente').focus;
    }
});

//Añade ceros a los parámetros de la fecha u hora cuando son menores de 10
var updatefechahora = (datetime) => {
    if (datetime < 10) {
        return "0" + datetime;
    } else {
        return datetime;
    }
}

//VALIDACIÓN números
var comprobarNumero = (numero, long) => {
    let num = "";
    let cont = 0;
    for (let i = 0; i < numero.length; i++) {
        if (numero.charCodeAt(i) <= 57 && numero.charCodeAt(i) >= 48) //ASCII numeros
            num = num + numero.charAt(i);
        cont = cont + 1;
    }
    if (num === numero && cont === long) return true;
    else return false;
}


/*VERIFICACIÓN Fecha de recogida. Compara la fecha actual con la de la solicitud 
y si es para hoy o anterior nos muestra un error, sólo las habilitamos para el día siguiente.*/
var comprobarFecha = (fechaSolicitud) => {
    var date = new Date();
    var day = updatefechahora(date.getDate());
    var mounth = updatefechahora(date.getMonth() + 1);
    var year = date.getFullYear();
    var fechaActual = year + "-" + mounth + "-" + day;
    var diferenciaFechas = parseInt(new Date(fechaActual).getTime()) - parseInt(new Date(fechaSolicitud).getTime());
    var numDay = new Date(fechaSolicitud).getDay();

    if (diferenciaFechas >= 0 || numDay == 0 || numDay == 6) {
        alert('Elija una fecha valida');
        return false;
    } else {
        return true;
    }
}

/// VALIDACIÓN de datos y envio a la base de datos
var enviarsolicitud = () => {

    //Validación campos
    var Agency_ID = document.getElementById("agencia-transporte").value;
    var idagenciainicial = document.getElementById('id-codigo-agencia').value;

    var cuentas = importarCuentasDevoluciones(Agency_ID);
    var index = cuentas.indexOf(".");
    var agencias = (cuentas.substring(0, index)).split(",");
    var codes = (cuentas.substring(index + 1)).split(",");

    if (Agency_ID != idagenciainicial) {
        for (var i = 0; i < agencias.length; i++) {
            if (agencias[i] == Agency_ID) {
                document.getElementById('codigo-agencia').value = codes[i]
            }
        }
    }
    var Customer_ID = document.getElementById("codigo-cliente").value;  //Ya validado
    var ID_User = "1";
    //Validación número
    var AssociatedOrder_ID = document.getElementById("pedido-asociado").value;
    if (comprobarNumero(AssociatedOrder_ID, 6) == false) {
        alert('Introduzca un Nº de pedido válido');
        document.getElementById("pedido-asociado").value = "";
        document.getElementById("pedido-asociado").focus;
        return;
    }
    //Validación fecha (No puede ser anterior a hoy, )
    var DateRequest = document.getElementById("fecha-recogida").value;
    if (comprobarFecha(DateRequest) == false) {
        document.getElementById("fecha-recogida").value= "";
        document.getElementById("fecha-recogida").focus;
        return;  
    }
    else {
        var DateRequest = DateRequest;
    };
    var PreferentialTimetable = document.getElementById('horario-recogida').value;
    var Urgently = document.getElementById('agencia-transporte').value;
    var MerchandiseRemarks = document.getElementById("observaciones-mercancia").value;

    var Department_ID = document.getElementById("departamento-destino").value;
    if (document.getElementById("departamento-destino").value == "") {
        console.log("ID >>> " + Department_ID);
         alert("Debe incluir un departamento de destino");
        //document.getElementById("departamento-destino").value = "";
        document.getElementById("departamento-destino").focus;
        return;
    }

    var PickUpRemarks = document.getElementById("observaciones-recogidas").value;
    var Code = document.getElementById('codigo-agencia').value;
    var PickUp_ID = generarNumeroRecogida(Code);

    //VALIDACIÓN de parámetros
    if (Customer_ID == "" || AssociatedOrder_ID == "" || DateRequest == "" || PreferentialTimetable == ""
        || Urgently == "" || Department_ID == "" || Agency_ID == "" || PickUp_ID == "") {
        alert('Falta por rellenar algún campo obligatorio')
        return;
    }
    //(Guardar solicitud) Envío de datos al servidor con ajax
    $.ajax({
        type: "POST",
        url: "../PHPServidor.php",  //dirección del servidor
        data: {
            PickUp_ID: PickUp_ID,
            Customer_ID: Customer_ID,
            ID_User: ID_User,
            AssociatedOrder_ID: AssociatedOrder_ID,
            DateRequest: DateRequest,
            PreferentialTimetable: PreferentialTimetable,
            Urgently: Urgently,
            MerchandiseRemarks: MerchandiseRemarks,
            Department_ID: Department_ID,
            Agency_ID: Agency_ID,
            PickUpRemarks: PickUpRemarks
        },
        success: function (response) {
            //console.log(response);
        },
        error: function () {
            alert("Error");
        }
    });

    guardarArchivoTexto(constructorFichero(PickUp_ID), PickUp_ID);
    alert("Se han generado la recogida y el fichero de transportistaa.\nNúmero: " + PickUp_ID);
    document.getElementById('cont1').style.visibility = "hidden";
    document.getElementById('cont2').style.visibility = "hidden";
    document.getElementById('salirformulario').style.visibility = "hidden";
    document.getElementById("open").style.visibility = "visible";
}

//Composición número de recogida >> (Varchar 25)
var generarNumeroRecogida = (code) => {
    var date = new Date();

    var CompanyClientCode = code; //Debe venir de la tabla buscando por código de agencia
    var day = updatefechahora(date.getDate()).toString();
    var mounth = updatefechahora((date.getMonth() + 1)).toString();
    var year = date.getFullYear().toString();
    var hour = updatefechahora(date.getHours()).toString();
    var minute = updatefechahora(date.getMinutes()).toString();
    var customer = document.getElementById("codigo-cliente").value.toString();
    var preferentialTime = document.getElementById('horario-recogida').value.toString();
    var urgent = document.getElementById('urgente').value.toString();
    var PickUp_ID = CompanyClientCode + year + mounth + day + hour + minute + customer + preferentialTime + urgent;
    if (PickUp_ID.length == 25) {
        return PickUp_ID;
    } else {
        PickUp_ID = "";
        return PickUp_ID;
    }
}
//Constructor fichero para la agencia (txt, separado por ; para poder importar como CSV)
var constructorFichero = (PickUp_ID) => {

    var nombre = document.getElementById('nombre-cliente').value;
    var dir1 = document.getElementById("direccion-cliente").value;

    //Comprueba si se ha eliminado el campo anteriormente
    if (document.getElementById("direccion-cliente2")) {
        var dir2 = document.getElementById("direccion-cliente2").value;
    } else {
        var dir2 = "";
    }

    var zip = document.getElementById("zip-cliente").value;
    var email = document.getElementById("email-cliente").value;
    var tel1 = document.getElementById("tlf1-cliente").value;

    if (document.getElementById("tlf2-cliente")) {
        var tel2 = document.getElementById("tlf2-cliente").value;
    } else {
        var tel2 = "";
    }

    var fecha = document.getElementById("fecha-recogida").value;
    var observ = document.getElementById("observaciones-recogidas").value;
    var ficheroAgencia = "\"" + PickUp_ID + "\"" + ";" + nombre + ";" + dir1 + ";" + dir2 + ";" + zip + ";" + email + ";" + tel1 + ";" + tel2 + ";" + fecha + ";" + observ;

    return (ficheroAgencia);
}


//Genera y rellena el fichero txt. Lo descarga automáticamente en "downloads";
var guardarArchivoTexto = (contenido, nombre) => {
    const a = document.createElement("a");
    const archivo = new Blob([contenido], { type: 'csv' });
    const url = URL.createObjectURL(archivo);
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
}

//Rellena los campos con los datos del cliente en la solicitud de recogida.
var datosCliente = (codigocliente) => {
    var Customer_ID = codigocliente;
    $.ajax({
        type: "POST",
        url: "../PHPServidor.php",  //dirección del servidor
        data: {
            Customer_ID: Customer_ID,
        },
        success: function (response) {
            var index = response.indexOf("[");
            var json = response.substring(index + 1, response.length - 1);
            var jsparse = JSON.parse(json);

            //Asignamos valores a campos del formulario
            document.getElementById('nombre-cliente').value = jsparse.Name;
            document.getElementById('direccion-cliente').value = jsparse.Direction1;

            //Borra campo si no hay dato en la BDD
            if (!jsparse.Direction2) {
                var direccion2 = document.getElementById("direccion-cliente2");
                direccion2.parentNode.removeChild(direccion2)
            } else {
                document.getElementById('direccion-cliente2').value = jsparse.Direction2;
            }
            document.getElementById('zip-cliente').value = jsparse.ZIPCode;
            document.getElementById('poblacion-cliente').value = jsparse.Town;
            document.getElementById('provincia-cliente').value = jsparse.Province;
            document.getElementById('email-cliente').value = jsparse.Email;
            document.getElementById('tlf1-cliente').value = jsparse.Phone1;

            //Borra campo si no hay dato en la BDD
            if (jsparse.Phone2 == 0) {
                var phone2 = document.getElementById("tlf2-cliente");
                document.getElementById('tlf1-cliente').style.marginTop = "5px";
                phone2.parentNode.removeChild(phone2)
            } else {
                document.getElementById('tlf2-cliente').value = jsparse.Phone2;
            }
            document.getElementById('agencia-transporte').value = jsparse.Agency_ID;
            document.getElementById('horario-recogida').value = 1;
            document.getElementById('urgente').value = 0;

            importarCuentasDevoluciones(jsparse.Agency_ID);
        },
        error: function () {
            alert("Error");
        }
    });
}

//Añadimos Options al desplegable de las agencias
var importarAgencias = () => {
    var Disponibilidad = 1
    $.ajax({
        type: "POST",
        url: "../PHPServidor.php",  //dirección del servidor
        data: {
            Disponible: Disponibilidad
        },
        success: function (response) {
            var index = response.indexOf("[");
            var json = response.substring(index, response.length);
            var jsparse = JSON.parse(json);

            //Creamos los 'option' del select
            const $select = document.getElementById("agencia-transporte")
            //Borramos los anteriores
            for (let i = $select.options.length; i >= 0; i--) {
                $select.remove(i);
            }
            var option;
            var valor;
            var texto;
            for (var i = -1; i < jsparse.length; i++) {
                option = document.createElement('option');
                if (i == -1) {
                    valor = "";
                    texto = "Elija una opción";
                } else {
                    valor = jsparse[i].Agency_ID;
                    texto = jsparse[i].Name;
                }
                option.value = valor;
                option.text = texto;
                $select.appendChild(option);
            }
        },
        error: function () {
            alert("Error");
        }
    });
}

//Añadimos Options al desplegable de los departamentos
var importarDepartamentos = () => {
    var Activo = 1
    $.ajax({
        type: "POST",
        url: "../PHPServidor.php",  //dirección del servidor
        data: {
            Activo: Activo
        },
        success: function (response) {
            var index = response.indexOf("[");
            var json = response.substring(index, response.length);
            var jsparse = JSON.parse(json);

            //Creamos los 'option' del select
            const $select = document.getElementById("departamento-destino")
            //Borramos los anteriores
            for (let i = $select.options.length; i >= 0; i--) {
                $select.remove(i);
            }
            var option;
            var valor;
            var texto;
            for (var i = -1; i < jsparse.length; i++) {
                option = document.createElement('option');
                if (i == -1) {
                    valor = "";
                    texto = "Elija una opción";
                } else {
                    if (jsparse[i].Department_ID == 1) {
                        option.selected = true;
                    }
                    valor = jsparse[i].Department_ID;
                    texto = jsparse[i].Name;
                }
                option.value = valor;
                option.text = texto;
                $select.appendChild(option);
            }
        },
        error: function () {
            alert("Error");
        }
    });
}

//Añadimos Options al listado desplegable de los clientes
var importarCodigosCliente = () => {
    var ClienteActivo = 1;
    $.ajax({
        type: "POST",
        url: "../PHPServidor.php",  //dirección del servidor
        data: {
            ClienteActivo: ClienteActivo,
        },
        success: function (response) {
            var index = response.indexOf("[");
            var json = response.substring(index, response.length);
            var jsparse = JSON.parse(json);

            //Creamos los 'option' del select
            const $datalist = document.getElementById("CustomerList")

            var option;
            var valor;
            for (var i = 0; i < jsparse.length; i++) {
                option = document.createElement('option');
                valor = jsparse[i].Customer_ID;
                option.value = valor;
                $datalist.appendChild(option);
            }
        },
        error: function () {
            alert("Error");
        }
    });
}

var importarCuentasDevoluciones = (id_agencia) => {
    //console.log("Parametro agencia_id >>> " + id_agencia + " - " + id_agencia.length);
    var Disponibilidad = 1;
    window.ag = [];
    window.code = [];
    window.cadena;
    $.ajax({
        type: "POST",
        url: "../PHPServidor2.php",  //dirección del servidor
        data: {
            Disponible: Disponibilidad
        },
        success: function (response) {
            var index = response.indexOf("[");
            var json = response.substring(index, response.length);
            var jsparse = JSON.parse(json);

            //window.todo = [[], []];
            for (var i = 0; i < jsparse.length; i++) {
                ag.push(jsparse[i].Agency_ID);
                code.push(jsparse[i].ReturnsAccount);
                if (jsparse[i].Agency_ID == id_agencia) {
                    document.getElementById("codigo-agencia").value = jsparse[i].ReturnsAccount;
                    document.getElementById("id-codigo-agencia").value = jsparse[i].Agency_ID;
                }
            }
            cadena = (ag.toString() + "." + code.toString())
        },
        error: function () {
            alert("Error");
        }
    });
    return window.cadena;
} 
