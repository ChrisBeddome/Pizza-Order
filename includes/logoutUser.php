<?php 

//this script is responsible for loggin a user out of the system

session_start();
session_destroy();

sendResponse(true, "logout successful");

function sendResponse($success, $message) {
  $response = array();
  $response["message"] = $message;
  $response["success"] = $success;

  header("type: application/json");
  echo json_encode($response);
}

?>