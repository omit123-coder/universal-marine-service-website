<?php
// Handles the Request Service form submission and emails it to the shop.
// Update $to below if the destination address ever changes.

header('Content-Type: application/json');

$to = "JosephPmuia@gmail.com";

function clean_field($value) {
    $value = trim($value);
    $value = str_replace(array("\r", "\n", "%0a", "%0d", "%0A", "%0D"), '', $value);
    return $value;
}

$vesselName         = isset($_POST['vesselName']) ? clean_field($_POST['vesselName']) : '';
$requestDate        = isset($_POST['requestDate']) ? clean_field($_POST['requestDate']) : '';
$customerName       = isset($_POST['customerName']) ? clean_field($_POST['customerName']) : '';
$address            = isset($_POST['address']) ? clean_field($_POST['address']) : '';
$city               = isset($_POST['city']) ? clean_field($_POST['city']) : '';
$state              = isset($_POST['state']) ? clean_field($_POST['state']) : '';
$zip                = isset($_POST['zip']) ? clean_field($_POST['zip']) : '';
$phone              = isset($_POST['phone']) ? clean_field($_POST['phone']) : '';
$email              = isset($_POST['email']) ? clean_field($_POST['email']) : '';
$vesselManufacturer = isset($_POST['vesselManufacturer']) ? clean_field($_POST['vesselManufacturer']) : '';
$vesselModel        = isset($_POST['vesselModel']) ? clean_field($_POST['vesselModel']) : '';
$vesselYear         = isset($_POST['vesselYear']) ? clean_field($_POST['vesselYear']) : '';
$length             = isset($_POST['length']) ? clean_field($_POST['length']) : '';
$hullNumber         = isset($_POST['hullNumber']) ? clean_field($_POST['hullNumber']) : '';
$vesselLocation     = isset($_POST['vesselLocation']) ? clean_field($_POST['vesselLocation']) : '';
$issue              = isset($_POST['issue']) ? clean_field($_POST['issue']) : '';
$honeypot           = isset($_POST['website']) ? trim($_POST['website']) : '';

// Spam trap: bots fill every field, including this hidden one. Pretend success, send nothing.
if ($honeypot !== '') {
    echo json_encode(array('success' => true));
    exit;
}

$errors = array();
if (mb_strlen($customerName) < 2) $errors[] = 'customerName';
if (!preg_match('/^[0-9()+\-.\s]{7,20}$/', $phone)) $errors[] = 'phone';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if (mb_strlen($issue) < 10) $errors[] = 'issue';

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(array('success' => false, 'errors' => $errors));
    exit;
}

$subject = "New Service Request from " . $customerName;

$notProvided = 'Not provided';

function e($value) {
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function field_row($label, $value, $notProvided) {
    $display = $value !== '' ? e($value) : $notProvided;
    return '<tr>'
        . '<td style="padding:10px 16px;border-bottom:1px solid #eceff2;font-weight:700;color:#0b2942;white-space:nowrap;">' . e($label) . '</td>'
        . '<td style="padding:10px 16px;border-bottom:1px solid #eceff2;color:#3d4750;">' . $display . '</td>'
        . '</tr>';
}

$rows = '';
$rows .= field_row('Vessel Name', $vesselName, $notProvided);
$rows .= field_row('Date', $requestDate, $notProvided);
$rows .= field_row('Customer Name', $customerName, $notProvided);
$rows .= field_row('Address', $address, $notProvided);
$rows .= field_row('City', $city, $notProvided);
$rows .= field_row('State', $state, $notProvided);
$rows .= field_row('Zip', $zip, $notProvided);
$rows .= field_row('Phone', $phone, $notProvided);
$rows .= field_row('Email', $email, $notProvided);
$rows .= field_row('Vessel Manufacturer', $vesselManufacturer, $notProvided);
$rows .= field_row('Model', $vesselModel, $notProvided);
$rows .= field_row('Year', $vesselYear, $notProvided);
$rows .= field_row('Length', $length, $notProvided);
$rows .= field_row('Hull #', $hullNumber, $notProvided);
$rows .= field_row('Location of Vessel', $vesselLocation, $notProvided);

$body = '<!doctype html><html><body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">'
    . '<div style="max-width:600px;margin:0 auto;background:#ffffff;">'
    . '<div style="background:#0b2942;padding:24px 28px;">'
    . '<h1 style="margin:0;color:#ffffff;font-size:20px;">New Service Request</h1>'
    . '<p style="margin:6px 0 0;color:#2f96d6;font-size:13px;">Submitted through universalmarineservice.com</p>'
    . '</div>'
    . '<table style="width:100%;border-collapse:collapse;font-size:14px;">' . $rows . '</table>'
    . '<div style="padding:20px 16px;">'
    . '<div style="font-weight:700;color:#0b2942;margin-bottom:8px;">Description of Problem/Work Request</div>'
    . '<div style="background:#f4f6f8;border:1px solid #eceff2;border-radius:6px;padding:14px 16px;color:#3d4750;white-space:pre-wrap;">' . e($issue) . '</div>'
    . '</div>'
    . '<div style="padding:16px 28px;background:#f4f6f8;color:#6b7785;font-size:12px;">Reply directly to this email to respond to ' . e($customerName) . '.</div>'
    . '</div>'
    . '</body></html>';

$headers  = "From: no-reply@universalmarineservice.com\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(array('success' => true));
} else {
    http_response_code(500);
    echo json_encode(array('success' => false, 'errors' => array('server')));
}
