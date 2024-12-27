<?php
$servername = "localhost";
$username = "root"; // MySQL kullanıcı adı
$password = ""; // MySQL şifreniz
$dbname = "baby_monitor";

// POST ile gelen verileri alın
$temperature = $_POST['temperature'];
$humidity = $_POST['humidity'];
$sound_level = $_POST['sound_level'];
$alert = $_POST['alert'];

$conn = new mysqli($servername, $username, $password, $dbname);

// Bağlantıyı kontrol edin
if ($conn->connect_error) {
    die("Bağlantı hatası: " . $conn->connect_error);
}

// Veriyi ekle
$sql = "INSERT INTO records (temperature, humidity, sound_level, alert) 
        VALUES ('$temperature', '$humidity', '$sound_level', '$alert')";

if ($conn->query($sql) === TRUE) {
    echo "Veri başarıyla eklendi";
} else {
    echo "Hata: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
