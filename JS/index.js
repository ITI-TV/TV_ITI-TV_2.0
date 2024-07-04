function starter() {
    fetch('PHP/index.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(programmazione => {
            console.log(programmazione);
            let orario = getOrario();
            //creo una scaletta con tutti gli orari presenti in programazione
            let scalettaInizi = [];
            for (let i = 0; i < programmazione.length; i++) {
                scalettaInizi.push(programmazione[i]['Ora Inizio']);
            }
            let scalettaFine = [];
            for (let i = 0; i < programmazione.length; i++) {
                scalettaFine.push(programmazione[i]['Ora Fine']);
            }
            console.log(scalettaInizi);
            console.log(scalettaFine);
            //cerco l'indice dell'orario attuale
            let indice = 0;
            console.log(orario);
            let trovato = false;
            for (let i = 0; i < scalettaInizi.length && !trovato; i++) {
                //controllo se l'orario attuale è compreso tra due orari della scaletta, anche i minuti
                if(orario >= scalettaInizi[i] && orario <= scalettaFine[i]){
                    indice = i;
                    trovato = true;
                }
                if (i===scalettaInizi.length-1 && !trovato){
                    alert("Non c'è nessun programma in corso");
                }
            }
            loadFooter();
            //in base all'indice trovato mi salvo, numero comunicazioni, numero eventi giornalieri, numero componenti aggiuntivi e tempo totale in secondi
            let NumeroComunicazioni = programmazione[indice]['Numero Comunicazioni'];
            let NumeroEventiGiornalieri = programmazione[indice]['Numero Eventi Giornalieri'];
            let NumeroComponentiAggiuntivi = programmazione[indice]['Numero Componenti Aggiuntivi'];
            //calcolo i secondi totali di visualizzazione prendendo da Ora inizo e Ora fine
            let oraInizio = programmazione[indice]['Ora Inizio'];
            let oraFine = programmazione[indice]['Ora Fine'];
            let oraInizioSplit = oraInizio.split(':');
            let oraFineSplit = oraFine.split(':');
            let oraInizioSecondi = oraInizioSplit[0]*3600 + oraInizioSplit[1]*60;
            let oraFineSecondi = oraFineSplit[0]*3600 + oraFineSplit[1]*60;
            let TempoTotaleSecondi = oraFineSecondi - oraInizioSecondi;
            console.log(NumeroComunicazioni);
            console.log(NumeroEventiGiornalieri);
            console.log(NumeroComponentiAggiuntivi);
            console.log(TempoTotaleSecondi);
            loader(NumeroComunicazioni, NumeroEventiGiornalieri, NumeroComponentiAggiuntivi, TempoTotaleSecondi);
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
        });
}

function getOrario(){
    let data = new Date();
    let ora = data.getHours();
    let minuti = data.getMinutes();
    if(ora < 10){
        ora = '0' + ora;
    }
    if(minuti < 10){
        minuti = '0' + minuti;
    }
    return ora + ':' + minuti;
}

function loadComunicazioni(){
    $('#header').load('HTML/Comunicazioni/header.html');
    $('#main').load('HTML/Comunicazioni/main.html');
}

function loadEventiGiornalieri(){
    $('#header').load('HTML/Eventi%20Giornalieri/header.html');
    $('#main').load('HTML/Eventi%20Giornalieri/main.html');
}

function loadComponentiAggiuntivi(){
    $('#header').load('HTML/Componenti%20Aggiuntivi/header.html');
    $('#main').load('HTML/Componenti%20Aggiuntivi/main.html');

}

function loadFooter(){
    $('#footer').load('HTML/footer.html');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loader(NumeroComunicazioni, NumeroEventiGiornalieri, NumeroComponentiAggiuntivi, TempoTotaleDisponibile) {
    let programmazione = [];

    // Aggiungi i numeri con il conteggio specificato
    for (let i = 0; i < NumeroComunicazioni; i++) {
        programmazione.push('C'); // Comunicazioni
    }
    for (let i = 0; i < NumeroEventiGiornalieri; i++) {
        programmazione.push('E'); // Eventi Giornalieri
    }
    for (let i = 0; i < NumeroComponentiAggiuntivi; i++) {
        programmazione.push('A'); // Componenti Aggiuntivi
    }

    // Mescola l'array per distribuire equamente i numeri
    programmazione = shuffleArray(programmazione);

    console.log(programmazione);

    let TempoDisponibilePerOgniPagina = TempoTotaleDisponibile / programmazione.length;
    console.log(TempoDisponibilePerOgniPagina);

    let currentIndex = 0;

    function processNext() {
        if (currentIndex < programmazione.length) {
            let pagina = programmazione[currentIndex];
            //ripulisco cache
            $('#header').empty();
            $('#main').empty();
            if (pagina === 'C') {
                loadComunicazioni();
                console.log('Comunicazioni');
            } else if (pagina === 'E') {
                loadEventiGiornalieri();
                console.log('Eventi Giornalieri');
            } else if (pagina === 'A') {
                loadComponentiAggiuntivi();
                console.log('Componenti Aggiuntivi');
            }
            currentIndex++;
            setTimeout(processNext, TempoDisponibilePerOgniPagina * 1000);
        } else {
            starter();
        }
    }

    processNext();
}