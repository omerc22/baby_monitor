<?php
include 'db_connection.php';

// POST ile gelen verileri alın, önce var olup olmadıklarını kontrol et
if (isset($_POST['temperature']) && isset($_POST['humidity']) && isset($_POST['sound_level']) && isset($_POST['alert'])) {
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
} else {
    echo "Eksik veri gönderildi.";
}
?>
