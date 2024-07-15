// Costanti configurabili
const PERIODO_NATALE_INIZIO = 8; // Inizio periodo di Natale (8 dicembre)
const PERIODO_NATALE_FINE = 6; // Fine periodo di Natale (6 gennaio)

function loadComunicazioni(periodo) {
    $('#main').load(`HTML/${periodo}/Comunicazioni/main.html`);
}

function loadEventiGiornalieri(periodo) {
    $('#main').load(`HTML/${periodo}/Eventi%20Giornalieri/main.html`);
}

function loadComponentiAggiuntivi(periodo) {
    $('#main').load(`HTML/${periodo}/Componenti%20Aggiuntivi/main.html`);
}

// Funzione per determinare il periodo festivo corrente
function getPeriodoFestivo() {
    let data = new Date();
    let anno = data.getFullYear();

    // Calcolo della data della Pasqua
    let a = anno % 19;
    let b = Math.floor(anno / 100);
    let c = anno % 100;
    let d = Math.floor(b / 4);
    let e = b % 4;
    let f = Math.floor((b + 8) / 25);
    let g = Math.floor((b - f + 1) / 3);
    let h = (19 * a + b - d - g + 15) % 30;
    let i = Math.floor(c / 4);
    let k = c % 4;
    let l = (32 + 2 * e + 2 * i - h - k) % 7;
    let m = Math.floor((a + 11 * h + 22 * l) / 451);

    // Calcolo del giorno e mese della Pasqua
    let pasquaGiorno = h + l - 7 * m + 22;
    let pasquaMese = Math.floor((h + l - 7 * m + 22) / 31) - 1;

    // Imposta la data della Pasqua
    let giornoPasqua = pasquaGiorno % 31 + 1;
    let mesePasqua = pasquaMese;

    // Periodo di Natale: dall'8 dicembre al 6 gennaio (Epifania)
    let dataInizioNatale = new Date(anno, 11, PERIODO_NATALE_INIZIO);
    let dataFineNatale = new Date(anno + 1, 0, PERIODO_NATALE_FINE);

    // Determina se siamo nel periodo di Natale, Halloween o Pasqua
    let dataCorrente = new Date();
    if (
        (dataCorrente >= dataInizioNatale && dataCorrente <= dataFineNatale) // Periodo di Natale
    ) {
        return 'Natalizia';
    } else if (
        (dataCorrente >= new Date(anno, mesePasqua, giornoPasqua - 5) && dataCorrente <= new Date(anno, mesePasqua, giornoPasqua + 6)) // Periodo di Pasqua: inizia 5 giorni prima della Pasqua
    ) {
        return 'Pasqua';
    } else if (
        (dataCorrente >= new Date(anno, 9, 1) && dataCorrente <= new Date(anno, 10, 2)) // Periodo di Halloween: dall'1 ottobre al 2 novembre
    ) {
        return 'Halloween';
    } else {
        return 'Classico'; // Se non è un periodo festivo, carica il periodo Classico
    }
}

function starter() {
    fetch('PHP/index.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(programmazione => {
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
            //cerco l'indice dell'orario attuale
            let indice = 0;
            let trovato = false;
            for (let i = 0; i < scalettaInizi.length && !trovato; i++) {
                //controllo se l'orario attuale è compreso tra due orari della scaletta, anche i minuti
                if (orario >= scalettaInizi[i] && orario <= scalettaFine[i]) {
                    indice = i;
                    trovato = true;
                }
                if (i === scalettaInizi.length - 1 && !trovato) {
                    alert("Non c'è nessun programma in corso");
                }
            }
            //in base all'indice trovato mi salvo, numero comunicazioni, numero eventi giornalieri, numero componenti aggiuntivi e tempo totale in secondi
            let NumeroComunicazioni = programmazione[indice]['Numero Comunicazioni'];
            let NumeroEventiGiornalieri = programmazione[indice]['Numero Eventi Giornalieri'];
            let NumeroComponentiAggiuntivi = programmazione[indice]['Numero Componenti Aggiuntivi'];
            //calcolo i secondi totali di visualizzazione prendendo da Ora inizo e Ora fine
            let oraInizio = programmazione[indice]['Ora Inizio'];
            let oraFine = programmazione[indice]['Ora Fine'];
            let oraInizioSplit = oraInizio.split(':');
            let oraFineSplit = oraFine.split(':');
            let oraInizioSecondi = oraInizioSplit[0] * 3600 + oraInizioSplit[1] * 60;
            let oraFineSecondi = oraFineSplit[0] * 3600 + oraFineSplit[1] * 60;
            let TempoTotaleSecondi = oraFineSecondi - oraInizioSecondi;
            let periodo = getPeriodoFestivo();
            loader(NumeroComunicazioni, NumeroEventiGiornalieri, NumeroComponentiAggiuntivi, TempoTotaleSecondi, oraInizio, oraFine, periodo);
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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loader(NumeroComunicazioni, NumeroEventiGiornalieri, NumeroComponentiAggiuntivi, TempoTotaleDisponibile, oraInizio, oraFine, periodo) {
    let programmazione = [];
    if(NumeroComponentiAggiuntivi==="0" && NumeroComunicazioni==="0" && NumeroEventiGiornalieri==="0"){
        // nascondo tutti i div e imposto uno sfondo nel body nero
        document.body.style.backgroundColor = "black";
        document.getElementById("main").style.display = "none";
        document.getElementById("footer").style.display = "none";
        document.getElementById("header").style.display = "none";
    }else {
        document.body.style.backgroundColor = "darkblue";
        document.getElementById("main").style.display = "block";
        document.getElementById("footer").style.display = "block";
        document.getElementById("header").style.display = "block";
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
    }

    // Mescola l'array per distribuire equamente i numeri
    programmazione = shuffleArray(programmazione);

    let TempoDisponibilePerOgniPagina = TempoTotaleDisponibile / programmazione.length;

    let currentIndex = 0;
    let TestoTitolo = document.getElementById("TestoTitolo");

    function processNext() {
        //faccio il calcolo del tempo rimanente in secondi con OraIni e OraFine
        let TempoRimanente = (oraFine.split(':')[0]*3600 + oraFine.split(':')[1]*60 - getOrario().split(':')[0]*3600 - getOrario().split(':')[1]*60) + 60;
        //controllo che non sia passato il tempo totale disponibile
        if (TempoRimanente > 0){
            if(NumeroComponentiAggiuntivi==="0" && NumeroComunicazioni==="0" && NumeroEventiGiornalieri==="0"){
                // Mostra una schermata nera
                $('#main').css('display', 'none');
                $('#footer').css('display', 'none');
                $('#header').css('display', 'none');
                $('body').css('background-color', 'black');

                setTimeout(() => {
                    location.reload();
                }, TempoRimanente * 1000);


            }else {
                let pagina = programmazione[currentIndex];
                if (pagina === 'C') {
                    TestoTitolo.innerHTML = 'Comunicazioni';
                    loadComunicazioni(periodo);
                } else if (pagina === 'E') {
                    TestoTitolo.innerHTML = 'Eventi Giornalieri';
                    loadEventiGiornalieri(periodo);
                } else if (pagina === 'A') {
                    TestoTitolo.innerHTML = 'Componenti Aggiuntivi';
                    loadComponentiAggiuntivi(periodo);
                }
                currentIndex++;
                setTimeout(processNext, TempoDisponibilePerOgniPagina * 1000);
            }
        } else {
            starter();
        }
    }
    processNext();
}