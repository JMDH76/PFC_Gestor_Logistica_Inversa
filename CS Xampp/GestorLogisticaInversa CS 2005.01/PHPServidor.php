<?php
    //Guardar "Solicitud de recogida"
    if(isset($_POST["PickUp_ID"], $_POST["Customer_ID"])){
        
        $PickUp_ID = $_POST["PickUp_ID"];
        $Customer_ID = $_POST["Customer_ID"];
        $ID_User = $_POST["ID_User"];
        $AssociatedOrder_ID = $_POST["AssociatedOrder_ID"];
        $DateRequest = $_POST["DateRequest"];
        $PreferentialTimetable = $_POST["PreferentialTimetable"];
        $Urgently = $_POST["Urgently"];
        $MerchandiseRemarks = $_POST["MerchandiseRemarks"];
        $Department_ID = $_POST["Department_ID"];
        $Agency_ID = $_POST["Agency_ID"];
        $PickUpRemarks = $_POST["PickUpRemarks"];
        
        $servidor = "localhost";
        $usuario = "root";
        $password = "";
        $dbname = "reverselogisticsmng";

        $conexion = mysqli_connect($servidor, $usuario, $password, $dbname);
        if (!$conexion) {
            echo(alert("Fallo en la conexion"));
            echo "MySQL connection error: ".mysqli_connect_error();
            exit();

        } else {
            echo("Conexion establecida correctamente.");
        }

        $sql = "INSERT INTO pickups (PickUp_ID, Customer_ID, ID_User, AssociatedOrder_ID, DateRequest, PreferentialTimetable, Urgently, MerchandiseRemarks, Department_ID, Agency_ID, PickUpRemarks)
        VALUES ('".addslashes($PickUp_ID)."','".addslashes($Customer_ID)."','".addslashes($ID_User)."', 
        '".addslashes($AssociatedOrder_ID)."','".addslashes($DateRequest)."', '".addslashes($PreferentialTimetable)."', 
        '".addslashes($Urgently)."','".addslashes($MerchandiseRemarks)."', 
        '".addslashes($Department_ID)."','".addslashes($Agency_ID)."','".addslashes($PickUpRemarks)."')";

        if (mysqli_query($conexion, $sql)) {
            echo "\nRegistros guardados.";
            
        } else {
            echo "Error: ".mysqli_error($conexion);
        }
        mysqli_close($conexion);
    }

    //Consulta datos del cliente
    if(isset($_POST["Customer_ID"])){
       
         $Customer_ID = $_POST["Customer_ID"];      

         $servidor = "localhost";
         $usuario = "root";
         $password = "";
         $dbname = "reverselogisticsmng";
 
         $conexion = mysqli_connect($servidor, $usuario, $password, $dbname);
         
         if (!$conexion) {
             echo(alert("Fallo en la conexion"));
             echo "MySQL connection error: ".mysqli_connect_error();
             exit();
 
         } else {
             echo("Conexion establecida correctamente.");
         }
         $sql = "SELECT * FROM customers WHERE Customer_ID = $Customer_ID" ;      
         $select = mysqli_query($conexion, $sql);

         while ($dat=mysqli_fetch_assoc($select)){
             $arr[]=$dat;
         }
         echo json_encode($arr);     
 
         if (mysqli_query($conexion, $sql)) {
         } else {
             echo "Error: ".mysqli_error($conexion);
         }
         mysqli_close($conexion);
     }

     //Nombres de agencias para desplegable
     if(isset($_POST["Disponible"])){
       
        $Disponible = $_POST["Disponible"];      

        $servidor = "localhost";
        $usuario = "root";
        $password = "";
        $dbname = "reverselogisticsmng";
        $conexion = mysqli_connect($servidor, $usuario, $password, $dbname);
        if (!$conexion) {
            echo(alert("Fallo en la conexion"));
            echo "MySQL connection error: ".mysqli_connect_error();
            exit();
        } else {
            echo("Conexion establecida correctamente.");
        }

        $sql = "SELECT  Agency_ID, Name, ReturnsAccount FROM transportagencies WHERE Disponible = $Disponible ORDER BY Name ASC";
        $select = mysqli_query($conexion, $sql);
        while ($dat=mysqli_fetch_assoc($select)){
            $arr[]=$dat;
        }
        echo json_encode($arr); 
          
        if (mysqli_query($conexion, $sql)) {
        } else {
            echo "Error: ".mysqli_error($conexion);
        }
        mysqli_close($conexion);
    }


    //Nombres de departamentos para desplegable
    if(isset($_POST["Activo"])){
       
        $Activo = $_POST["Activo"];      

        $servidor = "localhost";
        $usuario = "root";
        $password = "";
        $dbname = "reverselogisticsmng";
        $conexion = mysqli_connect($servidor, $usuario, $password, $dbname);
        if (!$conexion) {
            echo(alert("Fallo en la conexion"));
            echo "MySQL connection error: ".mysqli_connect_error();
            exit();
        } else {
            echo("Conexion establecida correctamente.");
        }

        $sql = "SELECT  Department_ID, Name FROM departments WHERE Activo = $Activo ORDER BY Name ASC";
        $select = mysqli_query($conexion, $sql);
        while ($dat=mysqli_fetch_assoc($select)){
            $arr[]=$dat;
        }
        echo json_encode($arr);  

        if (mysqli_query($conexion, $sql)) {
        } else {
            echo "Error: ".mysqli_error($conexion);
        }
        mysqli_close($conexion);
    }


    //Consulta codigos de cliente
    if(isset($_POST["ClienteActivo"])){
       
        $ClienteActivo = $_POST["ClienteActivo"];      

        $servidor = "localhost";
        $usuario = "root";
        $password = "";
        $dbname = "reverselogisticsmng";
        $conexion = mysqli_connect($servidor, $usuario, $password, $dbname);
        
        if (!$conexion) {
            echo(alert("Fallo en la conexion"));
            echo "MySQL connection error: ".mysqli_connect_error();
            exit();

        } else {
            echo("Conexion establecida correctamente.");
        }
        $sql = "SELECT Customer_ID FROM customers WHERE ClienteActivo = $ClienteActivo ORDER BY Customer_ID ASC";      
        $select = mysqli_query($conexion, $sql);

        while ($dat=mysqli_fetch_assoc($select)){
            $arr[]=$dat;
        }
        echo json_encode($arr);     

        if (mysqli_query($conexion, $sql)) {
        } else {
            echo "Error: ".mysqli_error($conexion);
        }
        mysqli_close($conexion);
    }


    //Consulta Ordenes
    if(isset($_POST["Qty"])){
        
        $Qty = $_POST["Qty"];      

        $servidor = "localhost";
        $usuario = "root";
        $password = "";
        $dbname = "reverselogisticsmng";
        $conexion = mysqli_connect($servidor, $usuario, $password, $dbname);
        
        if (!$conexion) {
            echo(alert("Fallo en la conexion"));
            echo "MySQL connection error: ".mysqli_connect_error();
            exit();

        } else {
            echo("Conexion establecida correctamente.");
        }

        $sql = "SELECT DISTINCT Order_ID FROM orders WHERE Qty >= $Qty ORDER BY Order_ID ASC;";      
        $select = mysqli_query($conexion, $sql);

        while ($dat=mysqli_fetch_assoc($select)){
            $arr[]=$dat;
        }
        echo json_encode($arr);     

        if (mysqli_query($conexion, $sql)) {
        } else {
            echo "Error: ".mysqli_error($conexion);
        }
        mysqli_close($conexion);
    }    

     //CONSULTA Solicitudes pendientes de recepcionar
     if(isset($_POST["Received"])){
        
        $Received = $_POST["Received"];      

        $servidor = "localhost";
        $usuario = "root";
        $password = "";
        $dbname = "reverselogisticsmng";
        $conexion = mysqli_connect($servidor, $usuario, $password, $dbname);
        
        if (!$conexion) {
            echo(alert("Fallo en la conexion"));
            echo "MySQL connection error: ".mysqli_connect_error();
            exit();

        } else {
            echo("Conexion establecida correctamente.");
        }

        $sql = "SELECT count(Received) FROM pickups WHERE Received = $Received";      
        $select = mysqli_query($conexion, $sql);

        $dat=mysqli_fetch_assoc($select);
        echo json_encode($dat);     

        if (mysqli_query($conexion, $sql)) {
        } else {
            echo "Error: ".mysqli_error($conexion);
        }
        mysqli_close($conexion);
    }    


?>