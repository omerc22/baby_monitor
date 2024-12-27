<?php
include 'db_connection.php';

$sql = "SELECT name, birth_date, notes FROM baby_info LIMIT 1"; // `baby_info` adında yeni bir tablo varsayıyoruz
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    echo json_encode($data);
} else {
    echo json_encode(["name" => "Bilinmiyor", "birth_date" => "Bilinmiyor", "notes" => "Yok"]);
}

$conn->close();
?>
