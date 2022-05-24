<?php
  
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

    $sql = "SELECT Agency_ID, ReturnsAccount FROM transportagencies WHERE Disponible = $Disponible ORDER BY ReturnsAccount ASC";
    $select = mysqli_query($conexion, $sql);
    while ($dat=mysqli_fetch_assoc($select)){
        $arr[]=$dat;
    }
        
    if (mysqli_query($conexion, $sql)) {
    } else {
        echo "Error: ".mysqli_error($conexion);
    }
    mysqli_close($conexion);
    echo json_encode($arr); 

}
?>