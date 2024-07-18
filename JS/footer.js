const LARGHEZZA_CARATTERE = 29;
const VELOCITA_SCORRIMENTO = 5;
const POSIZIONE_INIZIALE = 1920;
const PADDING_ADDITIVO = 0;
const DimensioneBoxRosso = 326;

function max(NumeroNews, NumeroEmergenze) {
    return NumeroNews > NumeroEmergenze ? NumeroNews : NumeroEmergenze;
}

function startFooter() {
    checkServer();
    fetch('PHP/getters.php?action=getNews')
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(news => {
            fetch('PHP/getters.php?action=getEmergenze')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Errore HTTP: ' + response.status);
                    }
                    return response.json();
                })
                .then(emergenze => {
                    let NumeroNews = news.length;
                    let NumeroEmergenze = emergenze.length;
                    let contatoreNews = NumeroNews === 1 ? 0 : 1;
                    let contatoreEmergenze = NumeroEmergenze === 1 ? 0 : 1;
                    let StringaFooter = '  --  ';
                    for (let i = 0; i < max(NumeroNews, NumeroEmergenze); i++) {
                        StringaFooter += news[contatoreNews]['Corpo'] + '  --  ' + emergenze[contatoreEmergenze]['Corpo'] + '  --  ';
                        if (NumeroNews === 1) {
                            contatoreNews = 0;
                        } else {
                            contatoreNews = (contatoreNews + 1) < NumeroNews ? (contatoreNews + 1) : 1;
                        }
                        if (NumeroEmergenze === 1) {
                            contatoreEmergenze = 0;
                        } else {
                            contatoreEmergenze = (contatoreEmergenze + 1) < NumeroEmergenze ? (contatoreEmergenze + 1) : 1;
                        }
                    }
                    let box = document.getElementById('ScrollText');
                    box.innerHTML = StringaFooter;

                    let numeroCaratteri = StringaFooter.length;
                    let larghezzaTotale = numeroCaratteri * LARGHEZZA_CARATTERE;
                    box.style.width = (larghezzaTotale + PADDING_ADDITIVO) + "px";

                    startScrollingText();
                    setOraData();
                })

        })
}

function startScrollingText() {
    let box = document.getElementById('ScrollText');
    let dimensione = box.offsetWidth;

    box.style.position = "absolute";
    box.style.left = POSIZIONE_INIZIALE + "px";

    box.style.width = (dimensione + PADDING_ADDITIVO) + "px";

    let numeroCaratteri = box.innerText.length;
    let tempo = numeroCaratteri / VELOCITA_SCORRIMENTO;

    box.style.transition = "none";
    box.style.left = POSIZIONE_INIZIALE + "px";

    box.getBoundingClientRect();

    box.style.transition = "left " + tempo + "s linear";

    box.addEventListener('transitionend', handleTransitionEnd, { once: true });

    let posizioneFinale = dimensione + PADDING_ADDITIVO - DimensioneBoxRosso
    box.style.left = "-" + (posizioneFinale) + "px";
}

function handleTransitionEnd() {
    let box = document.getElementById('ScrollText');
    box.style.transition = 'none';
    box.style.left = POSIZIONE_INIZIALE + 'px';
    box.getBoundingClientRect();

    startFooter();
}

function setOraData() {
    let data = new Date();
    let giorno = data.getDate();
    let mese = data.getMonth() + 1;
    let anno = data.getFullYear();
    let ore = data.getHours();
    let minuti = data.getMinutes();

    if (minuti < 10) {
        minuti = "0" + minuti;
    }

    if (ore < 10) {
        ore = "0" + ore;
    }

    if (mese < 10) {
        mese = "0" + mese;
    }

    if (giorno < 10) {
        giorno = "0" + giorno;
    }

    let dataFormattata = ore + ":" + minuti + "<br>" + giorno + "/" + mese + "/" + anno;
    let box = document.getElementById('OraData');
    box.innerHTML = dataFormattata;
    setTimeout(setOraData, 1000);
}

startFooter();
