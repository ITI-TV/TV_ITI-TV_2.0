<?php
function connectDatabase() {
    // Parametri di connessione al database
    $servername = "192.168.1.147";
    $username = "ititv";
    $password = "ititv";
    $dbname = "ititv";

    // Crea una connessione
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verifica la connessione
    if ($conn->connect_error) {
        die(json_encode(array("error" => "Connessione al database fallita: " . $conn->connect_error)));
    }

    return $conn;
}

function getEntries($conn) {
    $sql = "SELECT * FROM `Eventi Giornalieri` WHERE  Mese = MONTH(CURDATE()) AND Giorno = DAY(CURDATE())";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $rows = array();
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    $stmt->close();
    return $rows;
}

function getEventiGiornalieri() {
    $conn = connectDatabase();
    $rows = getEntries($conn);
    $conn->close();
    header('Content-Type: application/json');
    echo json_encode($rows);
}

getEventiGiornalieri();