function startComponentiAggiuntivi(){
    fetch("PHP/Componenti_Aggiuntivi/main.php")
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
                load(data);
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
        });
}

function load(data){
    //scielgo un numero a caso tra 0 e la dimensione dell'array
    var numeroCasuale = Math.floor(Math.random() * data.length);
    //prendo il componente aggiuntivo
    var componenteAggiuntivo = data[numeroCasuale];
    document.getElementById("TitoloComponentiAggiuntivi").innerHTML = componenteAggiuntivo.Titolo;
    document.getElementById("TestoComponentiAggiuntivi").innerHTML = componenteAggiuntivo.Testo;
    document.getElementById("ImmagineComponentiAggiuntivi").src = componenteAggiuntivo.Immagine;
    document.getElementById("ProfComponentiAggiuntivi").innerHTML = "Prof / Prof.ssa " + componenteAggiuntivo.Prof;
}

startComponentiAggiuntivi();