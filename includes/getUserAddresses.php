<?php

//this script is responsible for retrieving a list of addresses for the currently logged in user

require_once("db_conn.php");

session_start();

if (!isset($_SESSION["userEmail"])) {
  sendResponse(false, "authentication error");
} else {
  getAddresses($db_conn);
}

function getAddresses($db_conn) {
  $userEmail = $_SESSION["userEmail"];
  $query = "SELECT addressID, street, city, province, postal_code, apt_number FROM addresses WHERE user_fk = '$userEmail'";
  $result = $db_conn->query($query);

  $addresses = [];

  while ($address = $result->fetch_assoc()) {
    $addressString = $address["street"] . ", ";
    if ($address["apt_number"] != NULL) {
      $addressString .= "unit " . $address["apt_number"] . ", ";
    }
    $addressString .= $address["city"] . ", " . $address["province"] . ", " . $address["postal_code"];
    $addr = [];
    $addr["text"] = $addressString;
    $addr["id"] = $address["addressID"];

    array_push($addresses, $addr);
  }

  sendResponse(true, $addresses);
}

function sendResponse($success, $addresses) {
    $response = array();
    $response["addresses"] = $addresses;
    $response["success"] = $success;

    header("type: application/json");
    echo json_encode($response);
}
?>