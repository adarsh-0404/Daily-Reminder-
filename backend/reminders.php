<?php


require_once __DIR__ . '/db.php';

function getReminders($pdo, $user_id)
{
    if (!$user_id)
        return [];
    $stmt = $pdo->prepare("SELECT * FROM reminders WHERE user_id = ? ORDER BY scheduled_time ASC");
    $stmt->execute([$user_id]);
    return $stmt->fetchAll();
}

function addReminder($pdo, $title, $message, $phone_number, $email, $notification_type, $scheduled_time, $user_id)
{
    // Validation: Must have title, time, user_id, and at least one contact method (phone or email)
    if (empty($title) || empty($scheduled_time) || empty($user_id)) {
        return false;
    }
    if (empty($phone_number) && empty($email)) {
        return false;
    }
    $stmt = $pdo->prepare("INSERT INTO reminders (title, message, phone_number, email, notification_type, scheduled_time, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
    return $stmt->execute([$title, $message, $phone_number, $email, $notification_type, $scheduled_time, $user_id]);
}

function deleteReminder($pdo, $id, $user_id)
{
    if (empty($id) || empty($user_id))
        return false;
    $stmt = $pdo->prepare("DELETE FROM reminders WHERE id = ? AND user_id = ?");
    return $stmt->execute([$id, $user_id]);
}

function updateReminder($pdo, $id, $title, $message, $phone_number, $email, $notification_type, $scheduled_time, $user_id)
{
    if (empty($id) || empty($user_id))
        return false;
    $stmt = $pdo->prepare("UPDATE reminders SET title = ?, message = ?, phone_number = ?, email = ?, notification_type = ?, scheduled_time = ? WHERE id = ? AND user_id = ?");
    return $stmt->execute([$title, $message, $phone_number, $email, $notification_type, $scheduled_time, $id, $user_id]);
}
?>