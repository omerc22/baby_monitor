<?php
include 'db_connection.php';

$sql = "SELECT log_time, temperature, humidity FROM records ORDER BY log_time DESC LIMIT 30";
$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$conn->close();
?>
