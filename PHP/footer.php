<?php
function getNews()
{
    // Parametri di connessione al database
    $servername = "192.168.1.147";
    $username = "ititv";
    $password = "ititv";
    $dbname = "ititv";

// Crea una connessione
    $conn = new mysqli($servername, $username, $password, $dbname);

// Verifica la connessione
    if ($conn->connect_error) {
        die("Connessione al database fallita: " . $conn->connect_error);
    } else {
        // Query per selezionare tutti i dati dalla tabella Programmazione
        $sql = "SELECT * FROM Comunicazione WHERE tag = 'news'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // Array per contenere tutti i risultati
            $rows = array();

            // Itera su ogni riga di risultato e aggiungi al array
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }

            // Restituisci l'intero array come JSON
            header('Content-Type: application/json');
            echo json_encode($rows);
        } else {
            echo "0 risultati";
        }
    }

// Chiudi la connessione
    $conn->close();
}

function getEmergenze()
{
    // Parametri di connessione al database
    $servername = "192.168.1.147";
    $username = "ititv";
    $password = "ititv";
    $dbname = "ititv";

// Crea una connessione
    $conn = new mysqli($servername, $username, $password, $dbname);

// Verifica la connessione
    if ($conn->connect_error) {
        die("Connessione al database fallita: " . $conn->connect_error);
    } else {
        // Query per selezionare tutti i dati dalla tabella Programmazione
        $sql = "SELECT * FROM Comunicazione WHERE tag = 'emergenza'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // Array per contenere tutti i risultati
            $rows = array();

            // Itera su ogni riga di risultato e aggiungi al array
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }

            // Restituisci l'intero array come JSON
            header('Content-Type: application/json');
            echo json_encode($rows);
        } else {
            echo "0 risultati";
        }
    }

// Chiudi la connessione
    $conn->close();
}

if (isset($_GET['action']) && $_GET['action'] == 'getEmergenze') {
    getEmergenze();
} elseif (isset($_GET['action']) && $_GET['action'] == 'getNews') {
    getNews();
}