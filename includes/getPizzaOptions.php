<?php 

//this script is responsible for sending a list of pizza options and toppings to the client

require_once("db_conn.php");

$query = "SELECT * FROM doughLU";
$crustArray = $db_conn->query($query)->fetch_all(MYSQLI_ASSOC);

$query = "SELECT * FROM sauceLU";
$sauceArray = $db_conn->query($query)->fetch_all(MYSQLI_ASSOC);

$query = "SELECT * FROM cheeseLU";
$cheeseArray = $db_conn->query($query)->fetch_all(MYSQLI_ASSOC);

$query = "SELECT * FROM sizeLU";
$sizeArray = $db_conn->query($query)->fetch_all(MYSQLI_ASSOC);

$query = "SELECT * FROM toppings";
$toppingsArray= $db_conn->query($query)->fetch_all(MYSQLI_ASSOC);

$options = ["dough"=>$crustArray, "sauce"=>$sauceArray, "cheese"=>$cheeseArray, "size"=>$sizeArray, "toppings"=>$toppingsArray];

sendResponse(true, $options);

function sendResponse($success, $options) {
    $response = array();
    $response["options"] = $options;
    $response["success"] = $success;

    header("type: application/json");
    echo json_encode($response);
}