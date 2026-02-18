<?php
// Database credentials
define('DB_HOST', 'your_db_host');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');
define('DB_NAME', 'your_db_name');

// Twilio Credentials
define('TWILIO_SID', 'your_twilio_sid');
define('TWILIO_TOKEN', 'your_twilio_token');

// Sender Numbers
define('TWILIO_WHATSAPP_NUMBER', 'your_twilio_whatsapp_number');
define('TWILIO_SMS_NUMBER', 'your_twilio_sms_number');

// Email Credentials
define('EMAIL_FROM_NAME', 'Daily Reminders');
define('EMAIL_FROM_ADDRESS', 'your_email@example.com');

// SMTP Configuration (Gmail Example)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USER', 'your_email@gmail.com');
define('SMTP_PASS', 'your_app_password');
define('SMTP_PORT', 587);

// Set timezone
date_default_timezone_set('Asia/Kolkata');
?>