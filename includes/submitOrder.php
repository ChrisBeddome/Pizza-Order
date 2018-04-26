<?php

//this script is responsible for submitting an order to the database

require_once("db_conn.php");

if (isset($_POST["pizzas"]) && count($_POST["pizzas"]) > 0) {
    $pizzas = $_POST['pizzas'];
} 
else {
    sendResponse(false, "No Pizzas To Submit");
    die();
}

if (isset($_POST["address"])) {
    $address = $_POST['address'];
} 
else {
    sendResponse(false, "No address selected");
    die();
}

$error = validateInput($pizzas);
if($error) {
    sendResponse(false, $error);
} else {
    submitOrder($pizzas, $address, $db_conn);
}

function submitOrder($pizzas, $address, $db_conn) {

    session_start();
    $email = $_SESSION["userEmail"];
    $addressID = $address["id"];

    $query = "INSERT INTO orders (user, order_time, address_fk) VALUES ('$email', NOW(), $addressID)"; 

    $db_conn->query($query);

    $orderID = $db_conn->insert_id;
    
    foreach($pizzas as $pizza) {
        $sizeID = $pizza["size"]["sizeID"];
        $doughID = $pizza["dough"]["doughID"];
        $sauceID = $pizza["sauce"]["sauceID"];
        $cheeseID = $pizza["cheese"]["cheeseID"];
        $query = "INSERT INTO pizzas (orderID_fk, size_fk, dough_fk, sauce_fk, cheese_fk) VALUES ($orderID, $sizeID, $doughID, $sauceID, $cheeseID)";  
        $db_conn->query($query);
        $pizzaID = $db_conn->insert_id;

        if (isset($pizza["toppings"])) {
            foreach($pizza["toppings"] as $topping) {
                $toppingID = $topping["toppingID"];
                $query = "INSERT INTO pizzaToppings (pizza_fk, topping_fk) VALUES ($pizzaID, $toppingID)";  
                $db_conn->query($query);
            }
        }
    }

    $db_conn->close();
    sendResponse(true, $pizzas);
}

function validateInput($pizzas) {

    foreach($pizzas as $pizza) {
        if(isset($pizza["toppings"]) && count($pizza["toppings"]) > 7 ) {
            return "Each pizza must have a max of 7 toppings";
        }
        if (!isset($pizza["dough"])) {
            return "must select dough type for all pizzas";
        }
        if (!isset($pizza["size"])) {
            return "must select size type for all pizzas";
        }
        if (!isset($pizza["sauce"])) {
            return "must select sauce type for all pizzas";
        }
        if (!isset($pizza["cheese"])) {
            return "must select cheese type for all pizzas";
        }
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