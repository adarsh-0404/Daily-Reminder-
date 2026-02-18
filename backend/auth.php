<?php


require_once __DIR__ . '/db.php';

function registerUser($pdo, $data)
{
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        return ['error' => 'Username and password required'];
    }

    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        return ['error' => 'Username already taken'];
    }

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert user
    $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    if ($stmt->execute([$username, $hashed_password])) {
        return ['success' => 'User registered successfully'];
    } else {
        return ['error' => 'Registration failed'];
    }
}

function loginUser($pdo, $data)
{
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        return ['error' => 'Username and password required'];
    }

    // Fetch user
    $stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Remove password from response
        unset($user['password']);
        return ['success' => true, 'user' => $user];
    } else {
        return ['error' => 'Invalid username or password'];
    }
}
?>