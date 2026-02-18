<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../db.php'; // Explicitly include DB to ensure $pdo is available
require_once '../reminders.php';
require_once '../auth.php';
require_once '../send_notifications.php';


$last_run_file = '../last_run.log';
$current_time = time();
$last_run = file_exists($last_run_file) ? (int) file_get_contents($last_run_file) : 0;

if ($current_time - $last_run > 60) {
    checkAndSendNotifications($pdo, false); // No debug output
    file_put_contents($last_run_file, $current_time);
}


$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($method === 'OPTIONS') {
    exit(0);
}



$data = json_decode(file_get_contents('php://input'), true);

$route = $_GET['route'] ?? '';

if ($route === 'register' && $method === 'POST') {
    $result = registerUser($pdo, $data);
    echo json_encode($result);
    exit;
}

if ($route === 'login' && $method === 'POST') {
    $result = loginUser($pdo, $data);
    echo json_encode($result);
    exit;
}


$user_id = $_GET['user_id'] ?? $data['user_id'] ?? null;

if (!$user_id) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized: User ID required']);
    exit;
}


if ($method === 'GET') {
    echo json_encode(getReminders($pdo, $user_id));
} elseif ($method === 'POST') {
    $success = addReminder(
        $pdo,
        $data['title'],
        $data['message'],
        $data['phone_number'],
        $data['email'] ?? null,
        $data['notification_type'],
        $data['scheduled_time'],
        $user_id
    );
    echo json_encode(['success' => $success]);
} elseif ($method === 'PUT') {
    if (isset($data['id'])) {
        $success = updateReminder(
            $pdo,
            $data['id'],
            $data['title'],
            $data['message'],
            $data['phone_number'],
            $data['email'] ?? null,
            $data['notification_type'],
            $data['scheduled_time'],
            $user_id
        );
        echo json_encode(['success' => $success]);
    } else {
        echo json_encode(['error' => 'ID missing for update']);
    }
} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $success = deleteReminder($pdo, $id, $user_id);
        echo json_encode(['success' => $success]);
    } else {
        echo json_encode(['error' => 'ID missing for delete']);
    }
}
?>