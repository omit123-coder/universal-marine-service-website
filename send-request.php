<?php
// Handles the Request Service form submission and emails it to the shop.
// Update $to below if the destination address ever changes.

header('Content-Type: application/json');

$to = "flyingyacht@aol.com";

function clean_field($value) {
    $value = trim($value);
    $value = str_replace(array("\r", "\n", "%0a", "%0d", "%0A", "%0D"), '', $value);
    return $value;
}

$name       = isset($_POST['name']) ? clean_field($_POST['name']) : '';
$phone      = isset($_POST['phone']) ? clean_field($_POST['phone']) : '';
$email      = isset($_POST['email']) ? clean_field($_POST['email']) : '';
$boatMake   = isset($_POST['boatMake']) ? clean_field($_POST['boatMake']) : '';
$boatModel  = isset($_POST['boatModel']) ? clean_field($_POST['boatModel']) : '';
$engineType = isset($_POST['engineType']) ? clean_field($_POST['engineType']) : '';
$issue      = isset($_POST['issue']) ? clean_field($_POST['issue']) : '';
$honeypot   = isset($_POST['website']) ? trim($_POST['website']) : '';

// Spam trap: bots fill every field, including this hidden one. Pretend success, send nothing.
if ($honeypot !== '') {
    echo json_encode(array('success' => true));
    exit;
}

$errors = array();
if (mb_strlen($name) < 2) $errors[] = 'name';
if (!preg_match('/^[0-9()+\-.\s]{7,20}$/', $phone)) $errors[] = 'phone';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if (mb_strlen($issue) < 10) $errors[] = 'issue';

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(array('success' => false, 'errors' => $errors));
    exit;
}

$subject = "New Service Request from " . $name;

$body  = "New service request submitted through universalmarineservice.com:\n\n";
$body .= "Name: " . $name . "\n";
$body .= "Phone: " . $phone . "\n";
$body .= "Email: " . $email . "\n";
$body .= "Boat Make: " . ($boatMake !== '' ? $boatMake : 'Not provided') . "\n";
$body .= "Boat Model: " . ($boatModel !== '' ? $boatModel : 'Not provided') . "\n";
$body .= "Engine Type: " . ($engineType !== '' ? $engineType : 'Not provided') . "\n";
$body .= "\nDescription of Issue:\n" . $issue . "\n";

$headers  = "From: no-reply@universalmarineservice.com\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(array('success' => true));
} else {
    http_response_code(500);
    echo json_encode(array('success' => false, 'errors' => array('server')));
}
