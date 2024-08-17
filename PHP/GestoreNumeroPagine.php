<?php
$NumeroComunicazioni = 0;
$NumeroComponentiAggiuntivi = 0;
$NumeroEventiGiornalieri = 0;

$PagineComunicazioni = 0;
$PagineComponentiAggiuntivi = 0;
$PagineEventiGiornalieri = 0;

//prendo il numero di comunicazioni salvate sul database con tag comunicazione
require ("infoAccess.php");
$db = new mysqli($serverConn, $usernameConn, $passwordConn, $dbnameConn);
if ($db->connect_error) {
    echo json_encode(["success" => false, "message" => "Errore di connessione al database"]);
    exit;
}
$stmt = $db->prepare("SELECT * FROM comunicazione WHERE Tag = 'comunicazione' ORDER BY Data ");
$stmt->execute();
$result = $stmt->get_result();
$comunicazioni = [];
while($row = $result->fetch_assoc()){
    $comunicazioni[] = $row;
}
//prendo la quantità di row meno 1
$NumeroComunicazioni = count($comunicazioni);
$NumeroComunicazioni = $NumeroComunicazioni - 1;

//prendo il numero di COmponentiAggiuntivi salvate sul database
$stmt = $db->prepare("SELECT * FROM componenti_aggiuntivi ORDER BY Data ");
$stmt->execute();
$result = $stmt->get_result();
$componenti_aggiuntivi = [];
while($row = $result->fetch_assoc()){
    $componenti_aggiuntivi[] = $row;
}
//prendo la quantità di row
$NumeroComponentiAggiuntivi = count($componenti_aggiuntivi);

//prendo il numero di eventi giornalieri salvate sul database
//prendo il giorno di oggi in numero e il mese in numero
$day = date("d");
$mounth = date("m");
$stmt = $db->prepare("SELECT * FROM eventi_giornalieri WHERE Giorno = $day AND Mese = $mounth");
$stmt->execute();
$result = $stmt->get_result();
$eventi_giornalieri = [];
while($row = $result->fetch_assoc()){
    $eventi_giornalieri[] = $row;
}
//prendo la quantità di row
$NumeroEventiGiornalieri = count($eventi_giornalieri);

//prendo tutta la tabella moltiplicatoriprogrammazione
$stmt = $db->prepare("SELECT * FROM moltiplicatoriprogrammazione");
$stmt->execute();
$result = $stmt->get_result();
//metto result in una matrice chiamata programmazione
$programmazione = [];
while($row = $result->fetch_assoc()){
    $programmazione[] = $row;
}
//prendo la quantità di row
$NumeroProgrammazione = count($programmazione);

//calcolo i minuti per ogni fascia oraria Ora_Inizio e Ora_Fine
$MinutiTotali = [];
for ($i = 0; $i < $NumeroProgrammazione; $i++){
    $orarioInizio = $programmazione[$i]['Ora_Inizio'];
    $orarioFine = $programmazione[$i]['Ora_Fine'];

    // Creiamo oggetti DateTime per gli orari di inizio e fine
    $datetimeInizio = new DateTime($orarioInizio);
    $datetimeFine = new DateTime($orarioFine);

    // Controlliamo se l'ora di fine è precedente all'ora di inizio
    if ($datetimeFine < $datetimeInizio) {
        // Se sì, aggiungiamo un giorno all'ora di fine per simulare il passaggio al giorno successivo
        $datetimeFine->modify('+1 day');
    }

    // Calcola la differenza tra i due orari
    $differenza = $datetimeFine->diff($datetimeInizio);

    // Estrai il numero totale di minuti dalla differenza
    $MinutiTotali[$i] = ($differenza->days * 24 * 60) + ($differenza->h * 60) + $differenza->i;
}

//calcolo per ogni pagina quanto gli spetta di minuti considerando anche i moltiplicaotori, che si chiamamno rispettivamente MoltComunicazioni, MoltComponentiAggiuntivi, MoltEventiGiornalieri e ogni pagina deve avere 1 minuto
$MinutiTotaliComunicazioni = [];
$MinutiTotaliComponentiAggiuntivi = [];
$MinutiTotaliEventiGiornalieri = [];

//Si considera che ogni pagina dura un minuto e le somme dei minuti totali per ogni pagina devono essere minori o uguali a TempoTotale
for($i = 0; $i < $NumeroProgrammazione; $i++){
    //calcolo i minuti totali per le comunicazioni
    $MinutiTotaliComunicazioni[$i] = $MinutiTotali[$i]/3 * $programmazione[$i]['MoltComunicazioni'];
    //considero solo il numero intero
    $MinutiTotaliComunicazioni[$i] = floor($MinutiTotaliComunicazioni[$i]);
    $MinutiTotali[$i]= $MinutiTotali[$i] - $MinutiTotaliComunicazioni[$i];
    //calcolo i minuti totali per i componenti aggiuntivi
    $MinutiTotaliComponentiAggiuntivi[$i] = $MinutiTotali[$i]/2 * $programmazione[$i]['MoltComponentiAggiuntivi'];
    //considero solo il numero intero
    $MinutiTotaliComponentiAggiuntivi[$i] = floor($MinutiTotaliComponentiAggiuntivi[$i]);
    $MinutiTotali[$i]= $MinutiTotali[$i] - $MinutiTotaliComponentiAggiuntivi[$i];
    //calcolo i minuti totali per gli eventi giornalieri
    $MinutiTotaliEventiGiornalieri[$i] = $MinutiTotali[$i] * $programmazione[$i]['MoltEventiGiornalieri'];
    //considero solo il numero intero
    $MinutiTotaliEventiGiornalieri[$i] = floor($MinutiTotaliEventiGiornalieri[$i]);
    if ($NumeroComponentiAggiuntivi === 0){
        $MinutiTotaliComunicazioni[$i] = $MinutiTotaliComunicazioni[$i] + $MinutiTotaliComponentiAggiuntivi[$i];
        $MinutiTotaliComponentiAggiuntivi[$i] = 0;
    }
    if ($NumeroEventiGiornalieri === 0){
        $MinutiTotaliComunicazioni[$i] = $MinutiTotaliComunicazioni[$i] + $MinutiTotaliEventiGiornalieri[$i];
        $MinutiTotaliEventiGiornalieri[$i] = 0;
    }
}

//carico i dati in proggrammazione svuotando la tabella e ricreando tutte le righe
$stmt = $db->prepare("TRUNCATE TABLE programmazione");
$stmt->execute();
for($i = 0; $i < $NumeroProgrammazione; $i++){
    $stmt = $db->prepare("INSERT INTO programmazione (Ora_Inizio, Ora_Fine, Numero_Comunicazioni, Numero_Componenti_Aggiuntivi, Numero_Eventi_Giornalieri) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssiii", $programmazione[$i]['Ora_Inizio'], $programmazione[$i]['Ora_Fine'], $MinutiTotaliComunicazioni[$i], $MinutiTotaliComponentiAggiuntivi[$i], $MinutiTotaliEventiGiornalieri[$i]);
    $stmt->execute();
}