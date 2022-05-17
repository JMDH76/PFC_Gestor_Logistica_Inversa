const open = document.getElementById('open');
const modal_container = document.getElementById('modal_container');
const close = document.getElementById('close');
const exit = document.getElementById('cancel');


//Abre ventana emergente para indicar nº cliente
open.addEventListener('click', () => {
    modal_container.classList.add('show');
    document.getElementById("cliente").focus();
    document.getElementById("open").style.visibility = "hidden";
    // datosCliente();
});

//Cancela el formulario y sale al principio (No deja volver a acceder al formulario)
var cancel = () => {
    window.location.replace("../forms/pickups.html");
}


//Captura nº cliente, cierra y esconde la ventana y hace visible el formulario
//pone el focus en campo pedido asociado
close.addEventListener('click', () => {

    const cliente_ = document.getElementById('cliente').value;
    //Validación del número
    if (comprobarNumero(cliente_, 7) == true) {
        document.getElementById('codigo-cliente').value = cliente_;
        document.getElementById('cliente').value = "";
        modal_container.classList.remove('show');

        document.getElementById('cont1').style.visibility = "visible";
        document.getElementById('cont2').style.visibility = "visible";
        document.getElementById('limpiarformulario').style.visibility = "visible";
        document.getElementById('salirformulario').style.visibility = "visible";
        document.getElementById("pedido-asociado").focus();

    } else {
        document.getElementById('cliente').value = "";
        alert('Introduzca un número correcto');
        document.getElementById('cliente').focus;
    }
});

//Añade ceros a los parámetros de la fecha cuando son menores de 10
var updatefechahora = (datetime) => {
    if (datetime < 10) {
        return "0" + datetime;
    } else {
        return datetime;
    }
}

//Composición número de recogida >> (Varchar 25)
var generarNumeroRecogida = () => {
    var date = new Date();
    var CompanyClientCode = "4625"; //Debe venir de la tabla buscando por código de agencia
    var day = updatefechahora(date.getDate()).toString();
    var mounth = updatefechahora((date.getMonth() + 1)).toString();
    var year = date.getFullYear().toString();
    var hour = updatefechahora(date.getHours()).toString();
    var minute = updatefechahora(date.getMinutes()).toString();
    var customer = document.getElementById("codigo-cliente").value.toString();
    var preferentialTime = document.getElementById('horario-recogida').value.toString();
    var urgent = document.getElementById('urgente').value.toString();
    var PickUp_ID = CompanyClientCode + year + mounth + day + hour + minute + customer + preferentialTime + urgent;
    /*  console.log("PickUp_ID " + PickUp_ID);
        console.log("Tamaño PickUp_ID " + PickUp_ID.length); */

    if (PickUp_ID.length == 25) {
        return PickUp_ID;
    } else {
        PickUp_ID = "";
        return PickUp_ID;
    }
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
    /* console.log("Diferencia: " + diferenciaFechas);
    console.log("Fecha actual: " + fechaActual);
    console.log("hoy:" + numDay); */
    if (diferenciaFechas >= 0 || numDay == 0 || numDay == 6) {
        return false;
    } else {
        return true;
    }
}

//Comprobación números
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

// Validación de datos y envio a la base de datos
var enviarsolicitud = () => {

    var PickUp_ID = generarNumeroRecogida();
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
    if (comprobarFecha(DateRequest) == true) {
        DateRequest = document.getElementById("fecha-recogida").value;
    }
    else {
        alert('Elija una fecha valida');
        document.getElementById("fecha-recogida").value = "";
        document.getElementById("fecha-recogida").focus;
        return;
    };

    var PreferentialTimetable = document.getElementById('horario-recogida').value;
    var Urgently = document.getElementById('agencia-transporte').value;
    var MerchandiseRemarks = document.getElementById("observaciones-mercancia").value;
    var Department_ID = document.getElementById("departamento-destino").value;
    var Agency_ID = document.getElementById("agencia-transporte").value;
    var PickUpRemarks = document.getElementById("observaciones-recogidas").value;


    //Comprobación por consola
    console.log("Customer_ID: " + Customer_ID);
    console.log("ID_User: " + ID_User);
    console.log("AssociatedOrder_ID: " + AssociatedOrder_ID);
    console.log("DateRequest: " + DateRequest);
    console.log("PreferentialTimetable: " + PreferentialTimetable);
    console.log("Urgently: " + Urgently);
    console.log("MerchandiseRemarks: " + MerchandiseRemarks);
    console.log("Department_ID: " + Department_ID);
    console.log("Agency_ID: " + Agency_ID);
    console.log("PickUpRemarks: " + PickUpRemarks);
    console.log("PickUp_ID: " + PickUp_ID);

    if (Customer_ID == "" || AssociatedOrder_ID == "" || DateRequest == "" || PreferentialTimetable == ""
        || Urgently == "" || Department_ID == "" || Agency_ID == "" || PickUp_ID == "") {
        alert('Falta por rellenar algún campo obligatorio')
        return;
    }

    //enviamos datos al servidor con ajax
    $.ajax({
        type: "POST",
        url: "../PHPServidor.php",  //dirección del servidor
        data: {
            /* PickUp_ID: PickUp_ID, */
            Customer_ID: Customer_ID,
            /* ID_User: ID_User,
            AssociatedOrder_ID: AssociatedOrder_ID,
            DateRequest: DateRequest,
            PreferentialTimetable: PreferentialTimetable,
            Urgently: Urgently,
            MerchandiseRemarks: MerchandiseRemarks,
            Department_ID: Department_ID,
            Agency_ID: Agency_ID,
            PickUpRemarks: PickUpRemarks */
        },

        success: function (response) {
    
            var index = response.indexOf("[");
            var data2 = response.substring(index + 1, response.length - 1);
            var json = data2.substring(0, data2.length-1);
            var datosCliente = [];

            console.log(data2);
            var array_companyias = json.split(',');
            for (i = 0; i < array_companyias.length; i++) {
                console.log(array_companyias[i]);
            }

            for (j = 0; j < array_companyias.length; j++) {
                var index2 = array_companyias[j].indexOf(":");
                dato3 = array_companyias[j].substring(index2 + 2, array_companyias[j].length-1);
                datosCliente.add(dato3);
                console.log(j + " >>> " + dato3)
            }

            document.getElementById(datosCliente[1]).value.innerText;

        },
        error: function () {
            alert("Error");
        }
    });
    document.getElementById('cont1').style.visibility = "hidden";
    document.getElementById('cont2').style.visibility = "hidden";
    document.getElementById('limpiarformulario').style.visibility = "hidden";
    document.getElementById('salirformulario').style.visibility = "hidden";
    document.getElementById("open").style.visibility = "visible";
    reset();
    alert("Se ha generado la recogida " + PickUp_ID);
    guardarArchivoTexto(PickUp_ID, PickUp_ID);
    alert("Se ha generado el fichero:" + PickUp_ID);
}

//Función para limpiar todos los campos
var reset = () => {
    ID_User = "1";
    //document.getElementById("codigo-cliente").value = "";
    document.getElementById("nombre-cliente").value = "";
    document.getElementById("direccion-cliente").value = "";
    document.getElementById("direccion-cliente2").value = "";
    document.getElementById("zip-cliente").value = "";
    document.getElementById("poblacion-cliente").value = "";
    document.getElementById("email-cliente").value = "";
    document.getElementById("tlf1-cliente").value = "";
    document.getElementById("tlf2-cliente").value = "";
    document.getElementById("pedido-asociado").value = "";
    document.getElementById("departamento-destino").value = "";
    document.getElementById("observaciones-mercancia").value = "";
    document.getElementById("fecha-recogida").value = "";
    document.getElementById('agencia-transporte').value = "";
    document.getElementById('horario-recogida').value = "1";
    document.getElementById("urgente").value = "0";
    document.getElementById("observaciones-recogidas").value = "";
}

//Genera y rellena el fichero txt. Lo descarga automáticamente en "downloads";
var guardarArchivoTexto = (contenido, nombre) => {
    const a = document.createElement("a");
    const archivo = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(archivo);
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
}


