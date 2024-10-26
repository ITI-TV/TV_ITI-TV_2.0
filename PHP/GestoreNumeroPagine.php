<?php
$NumeroComunicazioni = $NumeroComponentiAggiuntivi = $NumeroEventiGiornalieri = 0;
$PagineComunicazioni = $PagineComponentiAggiuntivi = $PagineEventiGiornalieri = 0;

require ("infoAccess.php");
$db = new mysqli($serverConn, $usernameConn, $passwordConn, $dbnameConn);
if ($db->connect_error) {
    echo json_encode(["success" => false, "message" => "Errore di connessione al database"]);
    exit;
}

// Ottengo il numero di comunicazioni con tag 'comunicazione'
$stmt = $db->prepare("SELECT COUNT(*) AS count FROM comunicazione WHERE Tag = 'comunicazione'");
if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Errore nella query: " . $stmt->error]);
    exit;
}
$result = $stmt->get_result();
$NumeroComunicazioni = $result->fetch_assoc()['count'] - 1;

// Ottengo il numero di componenti aggiuntivi
$stmt = $db->prepare("SELECT COUNT(*) AS count FROM componenti_aggiuntivi");
if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Errore nella query: " . $stmt->error]);
    exit;
}
$result = $stmt->get_result();
$NumeroComponentiAggiuntivi = $result->fetch_assoc()['count'];

// Ottengo il numero di eventi giornalieri per il giorno e mese corrente
$day = date("d");
$mounth = date("m");
$stmt = $db->prepare("SELECT COUNT(*) AS count FROM eventi_giornalieri WHERE Giorno = ? AND Mese = ?");
$stmt->bind_param("ii", $day, $mounth);
if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Errore nella query: " . $stmt->error]);
    exit;
}
$result = $stmt->get_result();
$NumeroEventiGiornalieri = $result->fetch_assoc()['count'];

// Ottengo tutti i record da moltiplicatoriprogrammazione
$stmt = $db->prepare("SELECT * FROM moltiplicatoriprogrammazione");
if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Errore nella query: " . $stmt->error]);
    exit;
}
$result = $stmt->get_result();
$programmazione = [];
while ($row = $result->fetch_assoc()) {
    $programmazione[] = $row;
}
$NumeroProgrammazione = count($programmazione);

if ($NumeroProgrammazione === 0) {
    echo json_encode(["success" => false, "message" => "Nessun record trovato in moltiplicatoriprogrammazione"]);
    exit;
}

// Calcolo i minuti per ogni fascia oraria
$MinutiTotali = [];
foreach ($programmazione as $i => $prog) {
    $datetimeInizio = new DateTime($prog['Ora_Inizio']);
    $datetimeFine = new DateTime($prog['Ora_Fine']);
    if ($datetimeFine < $datetimeInizio) {
        $datetimeFine->modify('+1 day');
    }
    $differenza = $datetimeFine->diff($datetimeInizio);
    $MinutiTotali[$i] = ($differenza->days * 24 * 60) + ($differenza->h * 60) + $differenza->i;
}

// Distribuisco i minuti tra le pagine
$MinutiTotaliComunicazioni = $MinutiTotaliComponentiAggiuntivi = $MinutiTotaliEventiGiornalieri = $MinutiTotaliInformazioniGenerali = [];

foreach ($programmazione as $i => $prog) {
    $tempoResiduo = $MinutiTotali[$i];

    $MinutiTotaliComunicazioni[$i] = floor($tempoResiduo / 3 * $prog['MoltComunicazioni']);
    $tempoResiduo -= $MinutiTotaliComunicazioni[$i];

    $MinutiTotaliComponentiAggiuntivi[$i] = floor($tempoResiduo / 2 * $prog['MoltComponentiAggiuntivi']);
    $tempoResiduo -= $MinutiTotaliComponentiAggiuntivi[$i];

    $MinutiTotaliEventiGiornalieri[$i] = floor($tempoResiduo * $prog['MoltEventiGiornalieri']);
    $MinutiTotaliInformazioniGenerali[$i] = floor($tempoResiduo * $prog['MoltNumeroInformazioniAggiuntive']);

    if ($NumeroComponentiAggiuntivi === 0) {
        $MinutiTotaliComunicazioni[$i] += $MinutiTotaliComponentiAggiuntivi[$i];
        $MinutiTotaliComponentiAggiuntivi[$i] = 0;
    }
    if ($NumeroEventiGiornalieri === 0) {
        $MinutiTotaliComunicazioni[$i] += $MinutiTotaliEventiGiornalieri[$i];
        $MinutiTotaliEventiGiornalieri[$i] = 0;
    }
}

// Aggiorno la tabella programmazione
$stmt = $db->prepare("TRUNCATE TABLE programmazione");
$stmt->execute();

$stmt = $db->prepare("INSERT INTO programmazione (Ora_Inizio, Ora_Fine, Numero_Comunicazioni, Numero_Componenti_Aggiuntivi, Numero_Eventi_Giornalieri, Numero_Informazioni_Generali) VALUES (?, ?, ?, ?, ?, ?)");
foreach ($programmazione as $i => $prog) {
    $stmt->bind_param("ssiiii", $prog['Ora_Inizio'], $prog['Ora_Fine'], $MinutiTotaliComunicazioni[$i], $MinutiTotaliComponentiAggiuntivi[$i], $MinutiTotaliEventiGiornalieri[$i], $MinutiTotaliInformazioniGenerali[$i]);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Errore durante l'inserimento: " . $stmt->error]);
        exit;
    }
}
