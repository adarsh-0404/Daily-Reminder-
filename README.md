# Daily Reminder System with Multi-Channel Notifications

## Abstract
This project is a comprehensive **Daily Reminder Manager** designed to help users organize their schedules effectively. It addresses the common problem of missed tasks by integrating a robust notification system that delivers alerts via **Email**, **WhatsApp**, and **SMS**. The application is built using a modern **React.js** frontend and a specialized **PHP** backend, ensuring a seamless user experience and reliable message delivery.

## Problem Statement
In today's fast-paced environment, traditional to-do lists are often ignored, and reliable cron jobs are often restricted on free hosting platforms. Users require active intrusions to remind them of critical tasks. This application bridges the gap between static lists and real-time communication channels, ensuring reminders are actionable and timely even without expensive infrastructure.

## Key Features
*   **User Authentication System**: Secure registration and login functionality.
*   **CRUD Operations**: Create, Read, Update, and Delete reminders dynamically.
*   **Multi-Channel Notifications**:
    *   **Email (Default)**: Reliable delivery via **SMTP** (PHPMailer) using Gmail.
    *   **WhatsApp**: Rich media messages sent via Twilio API.
    *   **SMS**: Fallback text messaging.
*   **Smart "Catch-up" Trigger**:
    *   Instead of relying solely on a Cron Job (often blocked on free hosting), the system automatically checks for **any missed reminders from today** whenever a user visits the app.
    *   Ensures you never miss a notification even if the server sleeps!
*   **Responsive Dashboard**: A glassmorphism-inspired UI optimized for all devices.

## Technology Stack
*   **Frontend**: React.js (Vite), CSS3 (Modern Animations)
*   **Backend**: PHP (RESTful API), PHPMailer (SMTP Library)
*   **Database**: MySQL (Relational Data Management)
*   **External APIs**: Twilio, Gmail SMTP
*   **Tools**: Git, Composer (optional)

## Project Structure
```
Daily-Reminder-Manager/
├── backend/                  # PHP API & Logic
│   ├── PHPMailer/            # SMTP Library
│   ├── config.php            # Credentials (GitIgnored)
│   ├── config.example.php    # Template for credentials
│   ├── db.php                # Database Connection
│   ├── auth.php              # Login/Register Logic
│   ├── reminders.php         # CRUD Operations
│   ├── send_notifications.php # Core Notification Engine (SMTP + Twilio)
│   └── router/               # API Routing
├── frontend/                 # React Frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # UI Components
│   │   ├── App.jsx           # Main App Component
│   │   └── main.jsx          # Entry Point
│   ├── dist/                 # Production Build
│   └── vite.config.js        # Build Config
└── database.sql              # Database Schema
```

## System Architecture
The application follows a **Client-Server Architecture** with a unique **Fallback Trigger**:
1.  **Client**: React application handles user inputs and state management.
2.  **Server**: PHP scripts process API requests and interact with MySQL.
3.  **Notification Engine**:
    *   **Trigger 1 (Ideal)**: A Cron Job checks for due tasks every minute.
    *   **Trigger 1 (Ideal)**: A Cron Job checks for due tasks every minute.
    *   **Trigger 2 (Fallback)**: When a user opens the app, the system checks: *"Are there any reminders due today that haven't been sent yet?"* and sends them immediately.

## Future Enhancements
*   Integration with Google Calendar.
*   Voice call reminders for high-priority tasks.
*   Push Notifications via Service Workers.

## ⚠️ Important Configuration Note (Twilio Free Trial)
*   **Twilio Trial Limitations**: This project uses a **Free Trial** Twilio account for demonstration purposes.
*   **Verified Numbers Only**: Notifications (WhatsApp & SMS) will **ONLY** be delivered to the phone number verified during the Twilio registration process.
*   **To Test with Other Numbers**: You must manually add and verify those numbers in the Twilio Console under "Verified Caller IDs".
*   **Production Use**: For a live deployment to any public number, a paid Twilio account is required.
