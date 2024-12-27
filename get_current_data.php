<?php
include 'db_connection.php';

$sql = "SELECT temperature, humidity, sound_level FROM records ORDER BY log_time DESC LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    echo json_encode($data);
} else {
    echo json_encode(["temperature" => "--", "humidity" => "--", "sound_level" => "--"]);
}

$conn->close();
?>
