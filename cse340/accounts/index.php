<?php

// Get the database connection file
require_once '../library/connections.php';
// Get the PHP Motors model for use as needed
require_once '../model/main-model.php';
// Get the accounts model
require_once '../model/accounts-model.php';
// Get the functions library
require_once '../library/functions.php';
// Get the vehicle model for use as needed
require_once '../model/vehicles-model.php';

require_once '../model/reviews-model.php';


// Create or access a Session
session_start();

// Get the array of classifications
$classifications = getClassifications();

$navList = buildNavList($classifications);
 
$action = filter_input(INPUT_POST, 'action');
 if ($action == NULL){
  $action = filter_input(INPUT_GET, 'action');
 }

 switch ($action) { 
   
  case 'newClient':
    include '../view/registration.php';
    break;
  case 'register':
    // Filter and store the data
    $clientFirstname = filter_input(INPUT_POST, 'clientFirstname', FILTER_SANITIZE_STRING);
    $clientLastname = filter_input(INPUT_POST, 'clientLastname', FILTER_SANITIZE_STRING);
    $clientEmail = filter_input(INPUT_POST, 'clientEmail', FILTER_SANITIZE_EMAIL);
    $clientPassword = filter_input(INPUT_POST, 'clientPassword', FILTER_SANITIZE_STRING);
    
    $clientEmail = checkEmail($clientEmail);
    $checkPassword = checkPassword($clientPassword);
    
    // Check for missing data
    if(empty($clientFirstname) || empty($clientLastname) || empty($clientEmail) || empty($clientPassword)){
      $message = '<p>Please provide information for all empty form fields.</p>';
      include '../view/registration.php';
      exit;
    } 
    // Check if email is already registered
    if (checkExistingEmail($clientEmail)) {
      $message = '<p>That email address already exists. Do you want to login instead?</p>';
      include '../view/login.php';
      exit;
    }

    if (!$checkPassword) {
      $message = '<p>Password does not match the requirements, try again.</p>';
      include '../view/registration.php';
      exit;
  }
  
    // Hash the checked password
    $hashedPassword = password_hash($clientPassword, PASSWORD_DEFAULT);
    
    // Send the data to the model
    $regOutcome = regClient($clientFirstname, $clientLastname, $clientEmail, $hashedPassword);

    // Check and report the result
    if ($regOutcome === 1) {
      setcookie("firstname", $clientFirstname, strtotime("+ 1 year"), "/");
      $_SESSION['message'] = "Thanks for registering $clientFirstname. Please use your email and password to login.";
        header('Location: /phpmotors/accounts/?action=login');
        exit;
    } else {
      $message = "<p>Sorry $clientFirstname, but the registration failed. Please try again.</p>";
        include '../view/register.php';
        exit;
       }
       break;

  case 'login':
    include '../view/login.php';
    break;
  case 'Login':
    $clientEmail = filter_input(INPUT_POST, 'clientEmail', FILTER_SANITIZE_EMAIL);
    $clientPassword = filter_input(INPUT_POST, 'clientPassword', FILTER_SANITIZE_STRING);
  
    $clientEmail = checkEmail($clientEmail);
    $passwordCheck = checkPassword($clientPassword);
    
    // Run basic checks, return if errors
    if (empty($clientEmail) || empty($passwordCheck)) {
      $message = '<p class="notice">Please provide a valid email address and password.</p>';
      include '../view/login.php';
      exit;
    }
    
    // Query the client data based on the email address
    $clientData = getClient($clientEmail);
     if($clientData == false) {
       $_SESSION['message'] = '<p>Please check your email and try again</p>';
       include '../view/login.php';
       break;
     }

    // Compare the password just submitted against
    $hashCheck = password_verify($clientPassword, $clientData['clientPassword']);

    if(!$hashCheck) {
      $message = '<p class="notice">Please check your password and try again.</p>';
      include '../view/login.php';
      exit;
    }
    // A valid user exists, log them in
    $_SESSION['loggedin'] = TRUE;
    // Remove the password from the array
    // the array_pop function removes the last
    // element from an array
    array_pop($clientData);
    // Store the array into the session
    $_SESSION['clientData'] = $clientData;
    // Send them to the admin view
    include '../view/admin.php';
    exit;
    
  case 'Logout':
    setcookie(session_name(), '', 100);
    $_SESSION = array();
    session_unset();
    session_destroy();
    header('Location: /phpmotors');
     exit;       
  
   case 'update-account':

    $clientFirstName = filter_input(INPUT_POST, 'clientFirstName', FILTER_SANITIZE_STRING);
    $clientLastName = filter_input(INPUT_POST, 'clientLastName', FILTER_SANITIZE_STRING);
    $clientEmail = filter_input(INPUT_POST, 'clientEmail', FILTER_SANITIZE_EMAIL);
    $clientId = filter_input(INPUT_POST, 'clientId', FILTER_SANITIZE_NUMBER_INT);
    
    $clientEmail = checkEmail($clientEmail);
  
    // Check for missing data
    if (empty($clientFirstName) || empty($clientLastName) || empty($clientEmail) || empty($clientId)) {
      $_SESSION['message'] = '<p>Please provide information for all empty form fields.</p>';
      break;
    }

    if($clientEmail != $_SESSION['clientData']['clientEmail'])
    {
      $emailExists = checkExistingEmail($clientEmail);
      if($emailExists){
        $_SESSION['message'] = '<p>That email address already exists. Do you want to login instead?</p>';
        break;
      }
    }
     // Send the data to the model
     $updateOutcome = updateClient($clientId, $clientFirstName, $clientLastName, $clientEmail);
     // Check and report the result
     if ($updateOutcome === 1) {
       $_SESSION['message'] = "<p class='successMessage'>Account for $clientFirstName $clientLastName has been updated.</p>";   
       $clientData = getClient($clientEmail);
       if($clientData == false)
       {
         $_SESSION['message'] = '<p class="noticeMessage">Please check your email and try again</p>';
         break;
       }
       $_SESSION['clientData'] = $clientData;
       header('Location: /phpmotors/accounts/?action=admin');
       exit;
     } else {
       $_SESSION['message'] = "<p>The update for account $clientFirstName $clientLastName has failed. Please try again.</p>";
     }
 
     break;


  case 'updatePassword':
    $clientId = filter_input(INPUT_POST, 'clientId', FILTER_SANITIZE_NUMBER_INT);
    $clientPassword = filter_input(INPUT_POST, 'clientPassword', FILTER_SANITIZE_STRING);
 
    $clientData = getClientById($_SESSION['clientData']['clientId']);
  
    $clientFirstName = $clientData['clientFirstName'];
    $clientLastName = $clientData['clientLastName'];
    $clientEmail = $clientData['clientEmail'];
    $clientId = $clientData['clientId'];
     
    $checkPassword = checkPassword($clientPassword);
 
     // Check for missing data
    if (empty($checkPassword) || empty($clientId)) {
      $_SESSION['passwordMessage'] = '<p class="errorMessage">Please provide information for the password.</p>';
      break;
     }
       
    // Hash the checked password
    $hashedPassword = password_hash($clientPassword, PASSWORD_DEFAULT); 
    // Send the data to the model
    $updateOutcome = updatePassword($clientId, $hashedPassword);
 
    // Check and report the result
    if ($updateOutcome === 1) {
       $_SESSION['message'] = "<p class='successMessage'>Password for $clientFirstName $clientLastName has been updated.</p>";   
       header('Location: /phpmotors/accounts/?action=admin');
       exit;
     } else {
       $_SESSION['passwordMessage'] = "<p class='errorMessage'>The update for the password on account $clientFirstName $clientLastName has failed. Please try again.</p>";
     }
 
  case 'admin':
    include '../view/admin.php';
    break;

  case 'update-account-page':
    //Get the client data
    $clientData = getClientById($_SESSION['clientData']['clientId']);
    $clientFirstName = $clientData['clientFirstName'];
    $clientLastName = $clientData['clientLastName'];
    $clientEmail = $clientData['clientEmail'];
    $clientId = $clientData['clientId'];
    
    include '../view/client-update.php';
      break;
  
  default:
     include '../view/admin.php';
    break;
}

?>