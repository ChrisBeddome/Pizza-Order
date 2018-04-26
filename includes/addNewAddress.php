<?php

//this script is responsible for adding a new address to a user account

require_once("db_conn.php");

session_start();

if (!isset($_SESSION["userEmail"])) {
  sendResponse(false, "Authentication Error");
  die();
} else {
  $email = $_SESSION["userEmail"];
}

if (isset($_POST["street"]) && strlen($_POST["street"]) > 0) {
    $street = $_POST['street'];
}
if (isset($_POST["city"]) && strlen($_POST["city"]) > 0) {
    $city = $_POST['city'];
}
if (isset($_POST["province"]) && strlen($_POST["province"]) > 0) {
    $province = $_POST['province'];
}
if (isset($_POST["postalCode"]) && strlen($_POST["postalCode"]) > 0) {
    $postalCode = $_POST['postalCode'];
}
if (isset($_POST["aptNumber"]) && strlen($_POST["aptNumber"]) > 0) {
    $aptNumber = $_POST['aptNumber'];
}

if (isset($street) && isset($city) && isset($province) && isset($postalCode)) {
    $error = validateInput($street, $city, $province, $postalCode);

    if ($error) {
        sendResponse(false, $error);
    } else {
        if (isset($aptNumber)) {
             addNewAddress($email, $street, $city, $province, $postalCode, $aptNumber, $db_conn);
        } else {
             addNewAddress($email, $street, $city, $province, $postalCode, NULL, $db_conn);
        }
    }

} else {
    sendResponse(false, "Must fill in all required fields");
}

function addNewAddress($email, $street, $city, $province, $postalCode, $aptNumber, $db_conn) {
    if ($aptNumber !== NULL) {
      $query = "INSERT INTO addresses (user_fk, street, city, province, postal_code, apt_number) VALUES ('$email', '$street', '$city', '$province', '$postalCode', '$aptNumber')";
    } else {
      $query = "INSERT INTO addresses (user_fk, street, city, province, postal_code) VALUES ('$email', '$street', '$city', '$province', '$postalCode')";
    }
   
    $db_conn->query($query);

    $addressID = $db_conn->insert_id;

    $query = "SELECT addressID, street, city, province, postal_code, apt_number FROM addresses WHERE addressID = '$addressID'";
    $address = $db_conn->query($query)->fetch_assoc();

    $addressString = $address["street"] . ", ";
    if ($address["apt_number"] != NULL) {
      $addressString .= "unit " . $address["apt_number"] . ", ";
    }
    $addressString .= $address["city"] . ", " . $address["province"] . ", " . $address["postal_code"];
    $addr = [];
    $addr["text"] = $addressString;
    $addr["id"] = $address["addressID"];

    sendResponse(true, $addr);
}

function validateInput($street, $city, $province, $postalCode) {
    if (strlen($street) > 50) {
        return "street name too long";
    }
    if (strlen($city) > 50) {
        return "city too long";
    }

    $provinces = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"];

    if (!in_array($province, $provinces)) {
        return "province invalid";
    }
    
    $pattern = '/^([a-zA-Z]\d[a-zA-Z])\ {0,1}(\d[a-zA-Z]\d)$/';
    
    if (!preg_match($pattern, $postalCode)) {
        return "postal code incorrectly formatted";
    }
    
    return null;
}

function sendResponse($success, $message) {
    $response = array();
    $response["message"] = $message;
    $response["success"] = $success;

    header("type: application/json");
    echo json_encode($response);
}
?>