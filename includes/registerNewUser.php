<?php

//this script is responsible for registering a new user account

if (isset($_SESSION["userEmail"])) {
    session_destroy();
}

require_once("db_conn.php");

if (isset($_POST["email"]) && strlen($_POST["email"]) > 0) {
    $email = $_POST['email'];
}
if (isset($_POST["password"]) && strlen($_POST["password"]) > 0) {
    $password = $_POST['password'];
}
if (isset($_POST["firstName"]) && strlen($_POST["firstName"]) > 0) {
    $firstName = $_POST['firstName'];
}
if (isset($_POST["lastName"]) && strlen($_POST["lastName"]) > 0) {
    $lastName = $_POST['lastName'];
}
if (isset($_POST["phoneNumber"]) && strlen($_POST["phoneNumber"]) > 0) {
    $phoneNumber = $_POST['phoneNumber'];
}

if (isset($email) && isset($password) && isset($firstName) && isset($lastName) && isset($phoneNumber)) {
    $error = validateInput($email, $password, $firstName, $lastName, $phoneNumber);

    if ($error) {
        sendResponse(false, $error);
    } else {
        registerNewUser($email, $password, $phoneNumber, $firstName, $lastName, $db_conn);
    }

} else {
    sendResponse(false, "Must fill in all fields");
}

function registerNewUser($email, $password, $phoneNumber, $firstName, $lastName, $db_conn) {
    //check if email already registerdd
    $query = "SELECT COUNT(email) FROM users WHERE email = '$email'";    
    $result = $db_conn->query($query)->fetch_row()[0];
    if ($result > 0) {
        sendResponse(false, "An account has already been registered with this email");
    } else {
        $hashedPassword = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $query = "INSERT INTO users (email, user_password, phone, first_name, last_name ) VALUES ('$email', '$hashedPassword', '$phoneNumber', '$firstName', '$lastName' )";
        $db_conn->query($query);
        sendResponse(true, "user registered");
    }    
}

function validateInput($email, $password, $firstName, $lastName, $phoneNumber) {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return "email is incorrectly formatted";
    }
    if (strlen($password) < 6) {
        return "password too weak";
    }
    if (strlen($password) > 50) {
        return "password too long";
    }
    if (strlen($firstName) > 50) {
        return "first name too long";
    }
    if (strlen($lastName) > 50) {
        return "last name too long";
    }

    //MAKE THIS BETTER
    $pattern = '/^[0-9\-\(\)\/\+\s]*$/';
    
    if (!preg_match($pattern, $phoneNumber)) {
        return "phone number incorrectly formatted";
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