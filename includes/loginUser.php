<?php

//this script is responsible for loggin a user in to the system.

require_once("db_conn.php");

if (isset($_SESSION["userEmail"])) {
  session_destroy();
}

if (isset($_POST["email"]) && strlen($_POST["email"]) > 0) {
    $email = $_POST['email'];
}
if (isset($_POST["password"]) && strlen($_POST["password"]) > 0) {
    $password = $_POST['password'];
}

if (isset($email) && isset($password)) {
    $error = validateInput($email, $password);

    if ($error) {
        sendResponse(false, $error);
    } else {
        loginUser($email, $password, $db_conn);
    }

} else {
    sendResponse(false, "Must fill in all fields");
}

function loginUser($email, $password, $db_conn) {
  //authenticate user
  $query = "SELECT email, user_password FROM users where email = '$email'";
  $result = $db_conn->query($query);

  if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user["user_password"])) {
      session_start();
      $_SESSION["userEmail"] = $email;
      sendResponse(true, "Login successful");
    } else {
      sendResponse(false, "Incorrect email or password");
    }
  } else {
    sendResponse(false, "Incorrect email or password");
  }
}

function validateInput($email, $password) {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return "email is incorrectly formatted";
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