function startEventiGiornalieri(){
    fetch("PHP/Eventi_Giornalieri/main.php")
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

function load(data){
    //scielgo un numero a caso tra 0 e la dimensione dell'array
    var numeroCasuale = Math.floor(Math.random() * data.length);
    //prendo il componente aggiuntivo
    var eventoGiornaliero = data[numeroCasuale];
    document.getElementById("TitoloEventiGiornalieri").innerHTML = eventoGiornaliero.Titolo;
    document.getElementById("TestoEventiGiornalieri").innerHTML = eventoGiornaliero.Testo;
    document.getElementById("ImmagineEventiGiornalieri").src = eventoGiornaliero.Immagine;
}

startEventiGiornalieri();