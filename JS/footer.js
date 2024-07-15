const LARGHEZZA_CARATTERE = 17;
const VELOCITA_SCORRIMENTO = 20;
const POSIZIONE_INIZIALE = 1920;
const PADDING_ADDITIVO = 20;

function max(NumeroNews, NumeroEmergenze) {
    return NumeroNews > NumeroEmergenze ? NumeroNews : NumeroEmergenze;
}

function startFooter() {
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

    box.style.left = "-" + (dimensione + PADDING_ADDITIVO) + "px";
}

function handleTransitionEnd() {
    let box = document.getElementById('ScrollText');
    box.style.transition = 'none';
    box.style.left = POSIZIONE_INIZIALE + 'px';
    box.getBoundingClientRect();

    startFooter();
}

startFooter();
