function startComponentiAggiuntivi() {
    document.body.style.backgroundColor = "#00152D";
    checkServer();
    fetch("PHP/getters.php?action=getComponentiAggiuntivi")
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            load(data);
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
        });
}

function load(data) {
    //scielgo un numero a caso tra 0 e la dimensione dell'array
    var numeroCasuale = Math.floor(Math.random() * data.length);
    //prendo il componente aggiuntivo
    var componenteAggiuntivo = data[numeroCasuale];
    if (componenteAggiuntivo == null) {
        document.getElementById("TitoloComponentiAggiuntivi").innerHTML = "Nessun componente aggiuntivo disponibile";
        document.getElementById("TestoComponentiAggiuntivi").innerHTML = "Nessun componente aggiuntivo disponibile";
        document.getElementById("ProfComponentiAggiuntivi").innerHTML = "ITI-TV";
        return;
    }
    document.getElementById("TitoloComponentiAggiuntivi").innerHTML = componenteAggiuntivo.Titolo;
    document.getElementById("TestoComponentiAggiuntivi").innerHTML = componenteAggiuntivo.Testo;
    document.getElementById("ImmagineComponentiAggiuntivi").src = componenteAggiuntivo.Immagine;
    document.getElementById("ProfComponentiAggiuntivi").innerHTML = componenteAggiuntivo.Prof;
}

startComponentiAggiuntivi();