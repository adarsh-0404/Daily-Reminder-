<?php


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/db.php';

function checkAndSendNotifications($pdo, $debug = false)
{
    // Check for reminders due on or before NOW, that haven't been sent today
    $current_time = date('H:i') . ':00';
    $today_date = date('Y-m-d');

    if ($debug)
        echo "Time Check: $current_time<br>\n";

    // Select reminders where scheduled_time <= current_time
    // AND (last_sent_at is NULL OR last_sent_at is not today)
    $sql = "SELECT * FROM reminders 
            WHERE scheduled_time <= ? 
            AND (last_sent_at IS NULL OR DATE(last_sent_at) != ?)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$current_time, $today_date]);
    $reminders = $stmt->fetchAll();

    if (count($reminders) > 0) {
        if ($debug)
            echo "Found " . count($reminders) . " pending reminders.<br>\n";

        foreach ($reminders as $reminder) {
            $msg = "🔔 *" . $reminder['title'] . "*\n" . $reminder['message'];
            $type = $reminder['notification_type'];
            $sent = false;

            if (empty($type))
                $type = 'WhatsApp';

            if ($type === 'Email') {
                $sent = sendEmail($reminder['email'], $msg, $debug);
            } else {
                $sent = sendTwilioMessage($reminder['phone_number'], $msg, $type, $debug);
            }

            // If sent successfully, update last_sent_at
            if ($sent) {
                $updateStmt = $pdo->prepare("UPDATE reminders SET last_sent_at = NOW() WHERE id = ?");
                $updateStmt->execute([$reminder['id']]);
                if ($debug)
                    echo "Updated last_sent_at for ID: " . $reminder['id'] . "<br>\n";
            }
        }
    } else {
        if ($debug)
            echo "No pending reminders found.<br>\n";
    }
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

function sendEmail($to, $message, $debug = false)
{
    if (empty($to)) {
        if ($debug)
            echo "Error: Email address is empty.<br>\n";
        return false;
    }

    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USER;
        $mail->Password = SMTP_PASS;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = SMTP_PORT;

        //Recipients
        $mail->setFrom(SMTP_USER, EMAIL_FROM_NAME);
        $mail->addAddress($to);
        $mail->addReplyTo(EMAIL_FROM_ADDRESS, EMAIL_FROM_NAME);

        //Content
        $titleLine = explode("\n", $message)[0];
        $bodyContent = nl2br($message);

        $mail->isHTML(true);
        $mail->Subject = "Daily Reminder: " . substr($titleLine, 0, 50);
        $mail->Body = $bodyContent;
        $mail->AltBody = $message;

        $mail->send();
        if ($debug)
            echo "Email Sent to $to<br>\n";
        return true;
    } catch (Exception $e) {
        if ($debug)
            echo "Email Failed to $to. Mailer Error: {$mail->ErrorInfo}<br>\n";
        return false;
    }
}

function sendTwilioMessage($to, $message, $type = 'WhatsApp', $debug = false)
{

    $to = preg_replace('/[^0-9+]/', '', $to);
    if (strpos($to, '+') !== 0) {
        $to = '+' . $to;
    }

    if ($debug)
        echo "Debug: Sending $type to $to<br>\n";

    if (!function_exists('curl_init')) {
        if ($debug)
            echo "CRITICAL ERROR: CURL is not enabled.<br>\n";
        return false;
    }

    if (defined('TWILIO_SID') && TWILIO_SID === 'YOUR_TWILIO_SID') {
        if ($debug)
            echo "Twilio credentials not configured.<br>\n";
        return false;
    }

    $sid = TWILIO_SID;
    $token = TWILIO_TOKEN;
    $url = "https://api.twilio.com/2010-04-01/Accounts/$sid/Messages.json";

    if ($type === 'WhatsApp') {
        $from = "whatsapp:" . TWILIO_WHATSAPP_NUMBER;
        $to_formatted = "whatsapp:" . $to;
    } else {
        $from = TWILIO_SMS_NUMBER;
        $to_formatted = $to;
    }

    $data = [
        'From' => $from,
        'To' => $to_formatted,
        'Body' => $message,
    ];

    $auth = "$sid:$token";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_USERPWD, $auth);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) {
        if ($debug)
            echo "$type Sent to $to<br>\n";
        return true;
    } else {
        if ($debug)
            echo "$type Failed to $to (HTTP $httpCode). Response: $response<br>\n";
        return false;
    }
}

if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    checkAndSendNotifications($pdo, true);
}
?>