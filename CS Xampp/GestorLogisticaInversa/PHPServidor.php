<?php
    if(isset($_POST["Customer_ID"])){
        
       /*  $PickUp_ID = $_POST["PickUp_ID"]; */
        $Customer_ID = $_POST["Customer_ID"];
       /*  $ID_User = $_POST["ID_User"];
        $AssociatedOrder_ID = $_POST["AssociatedOrder_ID"];
        $DateRequest = $_POST["DateRequest"];
        $PreferentialTimetable = $_POST["PreferentialTimetable"];
        $Urgently = $_POST["Urgently"];
        $MerchandiseRemarks = $_POST["MerchandiseRemarks"];
        $Department_ID = $_POST["Department_ID"];
        $Agency_ID = $_POST["Agency_ID"];
        $PickUpRemarks = $_POST["PickUpRemarks"]; */
        
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
        mysqli_close($conexion);

        echo json_encode($arr);

       /*  $sql = "INSERT INTO pickups (PickUp_ID, Customer_ID, ID_User, AssociatedOrder_ID, DateRequest, PreferentialTimetable, Urgently, MerchandiseRemarks, Department_ID, Agency_ID, PickUpRemarks)
        VALUES ('".addslashes($PickUp_ID)."','".addslashes($Customer_ID)."','".addslashes($ID_User)."', 
        '".addslashes($AssociatedOrder_ID)."','".addslashes($DateRequest)."', '".addslashes($PreferentialTimetable)."', 
        '".addslashes($Urgently)."','".addslashes($MerchandiseRemarks)."', 
        '".addslashes($Department_ID)."','".addslashes($Agency_ID)."','".addslashes($PickUpRemarks)."')"; */
              
       /*  if (mysqli_query($conexion, $sql)) {
            echo "\nRegistros guardados.";
            echo json_encode($list);
            include ('$list');

        } else {
            echo "Error: ".mysqli_error($conexion);
        } */
    }
    /* else if(isset($_POST["Customer_ID"])){
       
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

        $sql = "SELECT * FROM customers WHERE Customer_ID = 1000001";

        if (mysqli_query($conexion, $sql)) {
            echo "\nRegistros enviados.";
        } else {
            echo "Error: ".mysqli_error($conexion);
        }
    } */

?>