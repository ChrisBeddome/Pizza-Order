<?php

//this script is responsible for connecting to the database

$db_conn = new mysqli('localhost', 'pizzaUser', 'pizza123', 'pizzadb');
if ($db_conn->connect_errno) {
    die ("Could not connect to database server".$db_host."\n Error: ".$db_conn->connect_errno ."\n Report: ".$db_conn->connect_error."\n");
}

?>

