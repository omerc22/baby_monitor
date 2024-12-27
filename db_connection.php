<?php
$servername = "localhost";
$username = "root"; // XAMPP'de varsayılan kullanıcı adı
$password = ""; // Varsayılan şifre boş
$dbname = "baby_monitor";

// Bağlantıyı oluştur
$conn = new mysqli($servername, $username, $password, $dbname);

// Bağlantıyı kontrol et
if ($conn->connect_error) {
    die("Bağlantı hatası: " . $conn->connect_error);
}
?>