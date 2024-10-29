// Costanti configurabili
const PERIODO_NATALE_INIZIO = 8; // Inizio periodo di Natale (8 dicembre)
const PERIODO_NATALE_FINE = 6; // Fine periodo di Natale (6 gennaio)

//Saluti e dichiarazione della versione della TV e crediti
console.log('Benvenuto nella TV del progetto ITI-TV dell`IIS "N.Copernico A.Carpeggiani"');
console.log('Crediti: ');
console.log('. Classe 5X Informatica 2024/25 (Project Manager: Gabriele Bovina e Samuele Marinelli)');
console.log('. Classe 4X Informatica 2023/24 (Project Manager: Gabriele Bovina e Samuele Marinelli)');
console.log('. Classe 3X Informatica 2022/23 (Project Manager: Gabriele Bovina e Samuele Marinelli)');
console.log('. Classe 5X Informatica 2020/21 (Project Manager: Luca Corticelli e Diego Bonati)');
console.log('Ringraziamenti per il supporto e la collaborazione per gli eventi giornalieri: ');

// Variabili per il controllo dello stato del server
//prendo il link dinamicamente in base all'url presnete sulla barra del browser
const serverUrl = window.location.origin + '/TVITITV/index.html';
let isOffline = false;

// Funzione che parte al caricamento del sito e controlla con la funzione lo stato del server ogni 2 secondi
function checkServer2Seconds() {
    checkServer();
    setTimeout(checkServer2Seconds, 1000);
}

//Funzione di controllo server
function checkServer() {
    //faccio un thread a parte per controllare se il server è online
    fetch(serverUrl, { method: 'HEAD' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Server non raggiungibile');
            }
            if (isOffline) {
                isOffline = false;
                document.getElementById('offline-message').style.display = 'none';
                location.reload();
            }
        })
        .catch(() => {
            if (!isOffline) {
                isOffline = true;
                document.getElementById('offline-message').style.display = 'block';
                document.getElementById('main').style.display = 'none';
                document.getElementById('footer').style.display = 'none';
                document.getElementById('header').style.display = 'none';
                const data = new Date();
                let giorno = data.getDate();
                let mese = data.getMonth() + 1;
                const anno = data.getFullYear();
                let ora = data.getHours();
                let minuti = data.getMinutes();

                if (giorno < 10) {
                    giorno = '0' + giorno;
                }

                if (mese < 10) {
                    mese = '0' + mese;
                }

                if (ora < 10) {
                    ora = '0' + ora;
                }

                if (minuti < 10) {
                    minuti = '0' + minuti;
                }

                document.getElementById('OraManutenzione').innerHTML = ora + ':' + minuti;
                document.getElementById('DataManutenzione').innerHTML = giorno + '/' + mese + '/' + anno;
            }
            setTimeout(checkServer, 100);
        });
}

function loadComunicazioni(periodo) {
    checkServer();
    $('#main').load(`HTML/${periodo}/Comunicazioni/main.html`);
}

function loadEventiGiornalieri(periodo) {
    checkServer();
    $('#main').load(`HTML/${periodo}/Eventi%20Giornalieri/main.html`);
}

function loadInformazioniGenerali(periodo) {
    checkServer();
    $('#main').load(`HTML/${periodo}/InformazioniGenerali/main.html`);
}

function loadComponentiAggiuntivi(periodo) {
    checkServer();
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
        (dataCorrente >= new Date(anno, 9, 20) && dataCorrente <= new Date(anno, 10, 2)) // Periodo di Halloween: dal 20 ottobre al 2 novembre
    ) {
        return 'Classico';
    } else {
        return 'Classico'; // Se non è un periodo festivo, carica il periodo Classico
    }
}

function setHeaderNat() {
    document.getElementById('boxHeader').style.backgroundColor = '#F40000';
    //creo un div
    let LineaDivisoreHeaderMain = document.createElement('div');
    //gli do un id
    LineaDivisoreHeaderMain.id = 'LineaDivisoreHeaderMainHeaderNat';
    //gli do una posizione absolute e un top 191px
    LineaDivisoreHeaderMain.style.position = 'absolute';
    LineaDivisoreHeaderMain.style.top = '160px';
    //gli do un colore 8D53F7
    LineaDivisoreHeaderMain.style.backgroundColor = '#8D53F7';
    //gli do una larghezza 1920px e un'altezza 5px
    LineaDivisoreHeaderMain.style.width = '1920px';
    LineaDivisoreHeaderMain.style.height = '5px';
    //attacho il div a boxHeader
    document.getElementById('boxHeader').appendChild(LineaDivisoreHeaderMain);
    //rimuovo logoITI
    document.getElementById('logoITI').style.display = 'none';
    document.getElementById('logoITITV').style.display = 'block';
    //sostiusco l'img LogoITITV con una nuova immagine
    document.getElementById('logoITITV').src = '/IMG/Immagini Sito/Natale/LogoITITVNat.png';
    //sposto TestoTitolo a lefdt 44px
    document.getElementById('TestoTitolo').style.left = '44px';
    //imposto font famili 'Recursive', sans-serif
    document.getElementById('TestoTitolo').style.fontFamily = 'Recursive', 'sans-serif';
    //creo una img
    let IMGStellaCadente = document.createElement('img');
    //gli do l'src dell'immagine
    IMGStellaCadente.src = '/IMG/Immagini Sito/Natale/Stellacadente.png';
    //gli do un top di 70px e un left di 1386px position absolute
    IMGStellaCadente.style.position = 'absolute';
    IMGStellaCadente.style.top = '10px';
    IMGStellaCadente.style.left = '1386px';
    //attcaho l'img a boxHeader
    document.getElementById('boxHeader').appendChild(IMGStellaCadente);
}

function setFooterNat() {
    document.getElementById('footer').style.backgroundColor = '#F40000';
    //creo una immagine
    let IMGBabboNatale = document.createElement('img');
    //gli do l'src dell'immagine
    IMGBabboNatale.src = '/IMG/Immagini Sito/Natale/BabboNalate.png';
    //gli do un top di 0px e un left di 0px position absolute
    IMGBabboNatale.style.position = 'absolute';
    IMGBabboNatale.style.top = '0px';
    IMGBabboNatale.style.left = '0px';
    //lo attacco a boxOrarioData
    document.getElementById('boxOrarioData').appendChild(IMGBabboNatale);
    //imposto a boxOrariodata un background color #FFF
    document.getElementById('boxOrarioData').style.backgroundColor = '#FFF';
    //A OrarioData color F90E0E
    document.getElementById('OraData').style.color = '#F90E0E';
    //imposto font Inter, sans-serif
    document.getElementById('OraData').style.fontFamily = `Inter`, 'sans-serif';
    //gli do un z-index 1
    document.getElementById('OraData').style.zIndex = '1';
    //rimpicciolisco il font-size a 20px
    document.getElementById('OraData').style.fontSize = '40px';
    //saposto a sinistra di 20px
    document.getElementById('OraData').style.left = '20px';
    //creo un div di nome LineaDivisoreFooterMainFooterNat
    let LineaDivisoreFooterMainFooterNat = document.createElement('div');
    //gli do un altezza di 5xp, una lunghezza di 1920px, un background color #8D53F7 e un top di 0px
    LineaDivisoreFooterMainFooterNat.style.height = '5px';
    LineaDivisoreFooterMainFooterNat.style.width = '1920px';
    LineaDivisoreFooterMainFooterNat.style.backgroundColor = '#8D53F7';
    LineaDivisoreFooterMainFooterNat.style.top = '0px';
    //gli do una posizione absolute
    LineaDivisoreFooterMainFooterNat.style.position = 'absolute';
    //attacco il div a footer
    document.getElementById('footer').appendChild(LineaDivisoreFooterMainFooterNat);
    //creo un div di nome LineaDivisoreFooterOrarioFooterNat
    let LineaDivisoreFooterOrarioFooterNat = document.createElement('div');
    //gli do un altezza di 158px lunchezza 23px background color #C5A643 e un top di 0px e unm left di 357px, position absolute
    LineaDivisoreFooterOrarioFooterNat.style.height = '158px';
    LineaDivisoreFooterOrarioFooterNat.style.width = '23px';
    LineaDivisoreFooterOrarioFooterNat.style.backgroundColor = '#C5A643';
    LineaDivisoreFooterOrarioFooterNat.style.top = '0px';
    LineaDivisoreFooterOrarioFooterNat.style.left = '325px';
    LineaDivisoreFooterOrarioFooterNat.style.position = 'absolute';
    //attacco il div a footer
    document.getElementById('footer').appendChild(LineaDivisoreFooterOrarioFooterNat);
}

function setHeaderPasqua() {
}

function setFooterPasqua() {
}

function setHeaderHalloween() {
    document.getElementById('boxHeader').style.backgroundColor = '#1A0556';
    //creo un div
    let LineaDivisoreHeaderMain = document.createElement('div');
    //gli do un id
    LineaDivisoreHeaderMain.id = 'LineaDivisoreHeaderMainHeaderNat';
    //gli do una posizione absolute e un top 191px
    LineaDivisoreHeaderMain.style.position = 'absolute';
    LineaDivisoreHeaderMain.style.top = '160px';
    //gli do un colore 8D53F7
    LineaDivisoreHeaderMain.style.backgroundColor = '#000';
    //gli do una larghezza 1920px e un'altezza 5px
    LineaDivisoreHeaderMain.style.width = '1920px';
    LineaDivisoreHeaderMain.style.height = '5px';
    //attacho il div a boxHeader
    document.getElementById('boxHeader').appendChild(LineaDivisoreHeaderMain);
    //rimuovo logoITI
    document.getElementById('logoITI').style.display = 'none';
    document.getElementById('logoITITV').style.display = 'block';
    //sposto TestoTitolo a lefdt 44px
    document.getElementById('TestoTitolo').style.left = '44px';
    //imposto font famili 'Recursive', sans-serif
    document.getElementById('TestoTitolo').style.fontFamily = 'Recursive', 'sans-serif';
    //creo una img
    let IMGStellaCadente = document.createElement('img');
    //gli do l'src dell'immagine
    IMGStellaCadente.src = '/IMG/Immagini Sito/Halloween/Luna.png';
    //gli do un top di 70px e un left di 1386px position absolute
    IMGStellaCadente.style.position = 'absolute';
    IMGStellaCadente.style.top = '3px';
    IMGStellaCadente.style.left = '1400px';
    //attcaho l'img a boxHeader
    document.getElementById('boxHeader').appendChild(IMGStellaCadente);

}

function setFooterHalloween() {
    document.getElementById('footer').style.backgroundColor = '#1A0556';
    //creo una immagine
    let IMGBabboNatale = document.createElement('img');
    //gli do l'src dell'immagine
    IMGBabboNatale.src = '/IMG/Immagini Sito/Halloween/Nighmare.png';
    //gli do un top di 0px e un left di 0px position absolute
    IMGBabboNatale.style.position = 'absolute';
    IMGBabboNatale.style.top = '0px';
    IMGBabboNatale.style.left = '0px';
    //lo attacco a boxOrarioData
    document.getElementById('boxOrarioData').appendChild(IMGBabboNatale);
    //imposto a boxOrariodata un background color #FFF
    document.getElementById('boxOrarioData').style.backgroundColor = '#1C1C1C';
    //A OrarioData color F90E0E
    document.getElementById('OraData').style.color = '#fff';
    //imposto il text align a destra
    document.getElementById('OraData').style.textAlign = 'right';
    //rimpicciolisco il box di lunghezza
    document.getElementById('OraData').style.width = '295px';
    //imposto font Inter, sans-serif
    document.getElementById('OraData').style.fontFamily = `Inter`, 'sans-serif';
    //gli do un z-index 1
    document.getElementById('OraData').style.zIndex = '1';
    //rimpicciolisco il font-size a 20px
    document.getElementById('OraData').style.fontSize = '40px';
    //saposto a sinistra di 20px
    document.getElementById('OraData').style.left = '20px';
    //creo un div di nome LineaDivisoreFooterMainFooterNat
    let LineaDivisoreFooterMainFooterNat = document.createElement('div');
    //gli do un altezza di 5xp, una lunghezza di 1920px, un background color #8D53F7 e un top di 0px
    LineaDivisoreFooterMainFooterNat.style.height = '5px';
    LineaDivisoreFooterMainFooterNat.style.width = '1920px';
    LineaDivisoreFooterMainFooterNat.style.backgroundColor = '#BD6311';
    LineaDivisoreFooterMainFooterNat.style.top = '0px';
    //gli do una posizione absolute
    LineaDivisoreFooterMainFooterNat.style.position = 'absolute';
    //attacco il div a footer
    document.getElementById('footer').appendChild(LineaDivisoreFooterMainFooterNat);
    //creo un div di nome LineaDivisoreFooterOrarioFooterNat
    let LineaDivisoreFooterOrarioFooterNat = document.createElement('div');
    //gli do un altezza di 158px lunchezza 23px background color #C5A643 e un top di 0px e unm left di 357px, position absolute
    LineaDivisoreFooterOrarioFooterNat.style.height = '158px';
    LineaDivisoreFooterOrarioFooterNat.style.width = '23px';
    LineaDivisoreFooterOrarioFooterNat.style.backgroundColor = '#BD6311';
    LineaDivisoreFooterOrarioFooterNat.style.top = '0px';
    LineaDivisoreFooterOrarioFooterNat.style.left = '325px';
    LineaDivisoreFooterOrarioFooterNat.style.position = 'absolute';
    //attacco il div a footer
    document.getElementById('footer').appendChild(LineaDivisoreFooterOrarioFooterNat);

}

function starter() {
    checkServer();
    fetch('PHP/getters.php?action=getProgrammazione')
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(programmazione => {
            (programmazione);
            let orario = getOrario();
            //creo una scaletta con tutti gli orari presenti in programazione
            let scalettaInizi = [];
            for (let i = 0; i < programmazione.length; i++) {
                scalettaInizi.push(programmazione[i]['Ora_Inizio']);
            }
            let scalettaFine = [];
            for (let i = 0; i < programmazione.length; i++) {
                scalettaFine.push(programmazione[i]['Ora_Fine']);
            }
            //cerco l'indice dell'orario attuale
            let indice = 0;
            let trovato = false;
            console.log('Orario: ' + orario);
            console.log('Scaletta inizi: ' + scalettaInizi);
            console.log('Scaletta fine: ' + scalettaFine);
            for (let i = 0; i < scalettaInizi.length && !trovato; i++) {
                //controllo se l'orario attuale è compreso tra due orari della scaletta, anche i minuti
                if (orario >= scalettaInizi[i] && orario <= scalettaFine[i]) {
                    indice = i;
                    trovato = true;
                }
            }
            console.log('Indice: ' + indice);
            console.log('Programmazione: ' + programmazione[indice]['Numero_Comunicazioni']);
            console.log('Programmazione: ' + programmazione[indice]['Numero_Eventi_Giornalieri']);
            console.log('Programmazione: ' + programmazione[indice]['Numero_Componenti_Aggiuntivi']);
            try {
                //in base all'indice trovato mi salvo, numero comunicazioni, numero eventi giornalieri, numero componenti aggiuntivi e tempo totale in secondi
                let NumeroComunicazioni = programmazione[indice]['Numero_Comunicazioni'];
                let NumeroEventiGiornalieri = programmazione[indice]['Numero_Eventi_Giornalieri'];
                let NumeroComponentiAggiuntivi = programmazione[indice]['Numero_Componenti_Aggiuntivi'];
                let NumeroInformazioniGenerali = programmazione[indice]['Numero_Informazioni_Generali'];
                //calcolo i secondi totali di visualizzazione prendendo da Ora inizo e Ora fine
                let oraInizio = programmazione[indice]['Ora_Inizio'];
                let oraFine = programmazione[indice]['Ora_Fine'];
                let oraInizioSplit = oraInizio.split(':');
                let oraFineSplit = oraFine.split(':');
                let oraInizioSecondi = oraInizioSplit[0] * 3600 + oraInizioSplit[1] * 60;
                let oraFineSecondi = oraFineSplit[0] * 3600 + oraFineSplit[1] * 60;
                if (oraFineSecondi < oraInizioSecondi) {
                    oraFineSecondi += 86400;
                }
                let TempoTotaleSecondi = oraFineSecondi - oraInizioSecondi;
                let periodo = getPeriodoFestivo();
                loader(NumeroComunicazioni, NumeroEventiGiornalieri, NumeroComponentiAggiuntivi, NumeroInformazioniGenerali, TempoTotaleSecondi, oraInizio, oraFine, periodo);
            } catch (e) {
                console.error('Errore nella richiesta:', e);
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
            window.location.reload();
        });
}


function getOrario() {
    let data = new Date();
    let ora = data.getHours();
    let minuti = data.getMinutes();
    if (ora < 10) {
        ora = '0' + ora;
    }
    if (minuti < 10) {
        minuti = '0' + minuti;
    }
    return ora + ':' + minuti;
}

function loader(NumeroComunicazioni, NumeroEventiGiornalieri, NumeroComponentiAggiuntivi, NumeroInformazioniGenerali, TempoTotaleDisponibile, oraInizio, oraFine, periodo) {
    let programmazione = Array(NumeroComunicazioni + NumeroEventiGiornalieri + NumeroComponentiAggiuntivi + NumeroInformazioniGenerali).fill(null);
    document.getElementById("main").style.display = "block";
    document.getElementById("footer").style.display = "block";
    document.getElementById("header").style.display = "block";

    let elementi = [
        { tipo: 'C', count: NumeroComunicazioni },
        { tipo: 'E', count: NumeroEventiGiornalieri },
        { tipo: 'A', count: NumeroComponentiAggiuntivi },
        { tipo: 'I', count: NumeroInformazioniGenerali }  // Aggiunta della nuova categoria
    ];

    // Ordina in ordine decrescente di conteggio
    elementi.sort((a, b) => b.count - a.count);
    console.log("Elementi ordinati per conteggio:", elementi);

    let dimensioneMax = programmazione.length;

    // Inserisce ogni tipo di elemento nell'array
    for (let e of elementi) {
        console.log(`Inserimento per elemento tipo '${e.tipo}' con conteggio ${e.count}`);
        for (let i = 0; i < e.count; i++) {
            let posizione = Math.floor((dimensioneMax / e.count) * i) % dimensioneMax;
            console.log(`Tentativo di inserimento per '${e.tipo}' alla posizione calcolata ${posizione}`);

            while (programmazione[posizione] !== null) {
                console.log(`Posizione ${posizione} occupata, avanzamento alla successiva`);
                posizione = (posizione + 1) % dimensioneMax;
            }
            programmazione[posizione] = e.tipo;
            console.log(`Inserito '${e.tipo}' in posizione ${posizione}`);
        }
    }
    console.log("Programmazione finale:", programmazione);

    let TempoDisponibilePerOgniPagina = (NumeroComponentiAggiuntivi + NumeroComunicazioni + NumeroEventiGiornalieri + NumeroInformazioniGenerali) / programmazione.length * 60;
    console.log("Tempo disponibile per ogni pagina:", TempoDisponibilePerOgniPagina);

    let currentIndex = 0;
    //riparto da dove sarei dovuto essere
    currentIndex = Math.floor((getOrario().split(':')[0] * 3600 + getOrario().split(':')[1] * 60 - oraInizio.split(':')[0] * 3600 - oraInizio.split(':')[1] * 60) / TempoDisponibilePerOgniPagina) - 1;

    let TestoTitolo = document.getElementById("TestoTitolo");

    function processNext() {
        let TempoRimanente = (oraFine.split(':')[0] * 3600 + oraFine.split(':')[1] * 60 - getOrario().split(':')[0] * 3600 - getOrario().split(':')[1] * 60) + 60;
        oraCorrente = getOrario().split(':')[0] * 3600 + getOrario().split(':')[1] * 60;

        console.log(`Tempo rimanente: ${TempoRimanente}, pagina corrente: ${currentIndex}, elemento corrente: ${programmazione[currentIndex]}`);

        if (TempoRimanente > 0 && TempoRimanente != 86400) {
            if (NumeroComponentiAggiuntivi === 0 && NumeroComunicazioni === 0 && NumeroEventiGiornalieri === 0 && NumeroInformazioniGenerali === 0) {
                $('#main').css('display', 'none');
                $('#footer').css('display', 'none');
                $('#header').css('display', 'none');
                $('body').css('background-color', 'black');

                setTimeout(() => {
                    console.log("Tempo rimanente esaurito: ricarica pagina.");
                    checkServer();
                    location.reload();
                }, TempoRimanente * 1000);
            } else {
                if (periodo === 'Natalizia') {
                    console.log("Periodo Natalizio: impostazione header e footer.");
                    setHeaderNat();
                    setFooterNat();
                } else if (periodo === 'Pasqua') {
                    console.log("Periodo Pasqua: impostazione header e footer.");
                    setHeaderPasqua();
                    setFooterPasqua();
                } else if (periodo === 'Halloween') {
                    console.log("Periodo Halloween: impostazione header e footer.");
                    setHeaderHalloween();
                    setFooterHalloween();
                }

                let pagina = programmazione[currentIndex];
                if (pagina === 'C') {
                    console.log("Caricamento comunicazioni giornaliere");
                    checkServer();
                    TestoTitolo.innerHTML = 'COMUNICAZIONI GIORNALIERE';
                    loadComunicazioni(periodo);
                } else if (pagina === 'E') {
                    console.log("Caricamento ricorrenza del giorno");
                    checkServer();
                    TestoTitolo.innerHTML = 'RICORRENZA DEL GIORNO';
                    loadEventiGiornalieri(periodo);
                } else if (pagina === 'A') {
                    console.log("Caricamento componenti aggiuntivi");
                    checkServer();
                    TestoTitolo.innerHTML = 'COMPONENTI AGGIUNTIVI';
                    loadComponentiAggiuntivi(periodo);
                } else if (pagina === 'I') {
                    console.log("Caricamento informazioni generali");
                    checkServer();
                    TestoTitolo.innerHTML = 'INFORMAZIONI GENERALI';
                    loadInformazioniGenerali(periodo);  // Funzione per caricare la pagina delle informazioni generali
                }

                currentIndex = (currentIndex + 1) % dimensioneMax;
                setTimeout(processNext, TempoDisponibilePerOgniPagina * 1000);
            }
        } else {
            console.log("Tempo rimanente insufficiente, riavvio.");
            starter();
        }
    }
    processNext();
}



//quando la pagina è  carica eseguo la funzione starter
document.addEventListener('DOMContentLoaded', starter);
document.addEventListener('DOMContentLoaded', checkServer2Seconds);