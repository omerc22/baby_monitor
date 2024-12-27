<?php
// This project uses FPDF library for generating PDF documents.
// FPDF is a free PHP class for creating PDF files (http://www.fpdf.org).
require('fpdf/fpdf.php');


class PDF extends FPDF {

    function Header() {
        $this->SetFont('Poppins', 'B', 14);
        $this->SetFillColor(70, 130, 180); 
        $this->SetTextColor(255, 255, 255);
        $this->Cell(0, 10, 'Baby Monitor Records', 0, 1, 'C', true);
        $this->Ln(5);
    }


    function Footer() {
        $this->SetY(-15); 
        $this->SetFont('Poppins', '', 10);
        $this->SetTextColor(128, 128, 128); 
        $this->Cell(0, 10, 'Page ' . $this->PageNo(), 0, 0, 'C');
    }
}

include 'db_connection.php';
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("SQL Connection Error: " . $conn->connect_error);
}

// Tarih aralığı ve format kontrolü
if (isset($_GET['start_date']) && isset($_GET['end_date']) && isset($_GET['format'])) {
    $start_date = $_GET['start_date'];
    $end_date = $_GET['end_date'];
    $format = $_GET['format'];

    $sql = "SELECT * FROM records WHERE log_time BETWEEN '$start_date 00:00:00' AND '$end_date 23:59:59'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        if ($format == 'csv') {

            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename=records.csv');
            $output = fopen("php://output", "w");

            fputcsv($output, array('ID', 'Temperature', 'Humidity', 'Sound Level', 'Log Time', 'Alert'));

  
            while ($row = $result->fetch_assoc()) {
                fputcsv($output, $row);
            }
            fclose($output);
        } elseif ($format == 'pdf') {
  
            $pdf = new PDF();
            $pdf->AddFont('Poppins', '', 'Poppins-Regular.php');
            $pdf->AddFont('Poppins', 'B', 'Poppins-Bold.php'); 
            $pdf->AddPage();

        
            $pdf->SetFillColor(70, 130, 180); 
            $pdf->SetTextColor(255, 255, 255);
            $pdf->SetFont('Poppins', 'B', 12);
            $pdf->Cell(20, 10, 'ID', 1, 0, 'C', true);
            $pdf->Cell(40, 10, 'Temperature', 1, 0, 'C', true);
            $pdf->Cell(40, 10, 'Humidity', 1, 0, 'C', true);
            $pdf->Cell(40, 10, 'Sound Level', 1, 0, 'C', true);
            $pdf->Cell(50, 10, 'Log Time', 1, 1, 'C', true);

      
            $pdf->SetFont('Poppins', '', 12);
            $pdf->SetFillColor(230, 240, 255);
            $pdf->SetTextColor(0, 0, 0);

            while ($row = $result->fetch_assoc()) {
                $pdf->Cell(20, 10, $row['id'], 1, 0, 'C', true);
                $pdf->Cell(40, 10, $row['temperature'], 1, 0, 'C', true);
                $pdf->Cell(40, 10, $row['humidity'], 1, 0, 'C', true);
                $pdf->Cell(40, 10, $row['sound_level'], 1, 0, 'C', true);
                $pdf->Cell(50, 10, $row['log_time'], 1, 1, 'C', true);
            }

            $pdf->Output('D', 'records.pdf');
        } else {
            echo "Invalid format. Please select 'csv' or 'pdf'.";
        }
    } else {
        echo "No records found for the selected date range.";
    }
} else {
    echo "Please provide a valid date range and format.";
}

$conn->close();
?>
