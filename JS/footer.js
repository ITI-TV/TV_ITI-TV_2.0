function max(NumeroNews, NumeroEmergenze) {
    return NumeroNews > NumeroEmergenze ? NumeroNews : NumeroEmergenze;
}

function startFooter() {
    console.log('startFooter');
    fetch('PHP/footer.php?action=getNews')
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(news => {
            fetch('PHP/footer.php?action=getEmergenze')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Errore HTTP: ' + response.status);
                    }
                    return response.json();
                })
                .then(emergenze => {
                    console.log(news);
                    console.log(emergenze);
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
                        console.log(contatoreNews);
                        console.log(contatoreEmergenze);
                    }
                    console.log(StringaFooter);
                    let box = document.getElementById('ScrollText');
                    box.innerHTML = StringaFooter;

                    // Calcolo dinamico della larghezza del testo in base alla lunghezza in caratteri
                    let numeroCaratteri = StringaFooter.length;
                    let larghezzaCarattere = 16; // Larghezza approssimativa di un carattere in pixel
                    let larghezzaTotale = numeroCaratteri * larghezzaCarattere;

                    // Imposto dinamicamente la larghezza del box
                    box.style.width = (larghezzaTotale + 20) + "px"; // Aggiungo 20px di margine aggiuntivo

                    // Avvio l'animazione di scorrimento
                    startScrollingText();
                })
                .catch(error => {
                    console.error('Errore nella richiesta:', error);
                });
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
        });
}

function startScrollingText() {
    let box = document.getElementById('ScrollText');
    let dimensione = box.offsetWidth;
    console.log("Dimensione:", dimensione);

    // Posiziono il box inizialmente fuori dallo schermo a destra
    box.style.position = "absolute";
    box.style.left = "1920px";

    // Aggiungo un padding per evitare che il testo venga tagliato
    box.style.width = (dimensione + 20) + "px";

    // Calcolo il numero di caratteri nel testo
    let numeroCaratteri = box.innerText.length;
    console.log("Numero di caratteri:", numeroCaratteri);

    // Calcolo il tempo di scorrimento in base alla velocità di 2 caratteri per secondo
    let tempo = numeroCaratteri / 20; // 2 caratteri al secondo
    console.log("Tempo:", tempo);

    // Imposto la transizione per l'animazione
    box.style.transition = "none";  // Rimuovo la transizione per reimpostare correttamente
    box.style.left = "1920px"; // Posiziono nuovamente l'elemento a destra

    // Forzo il reflow dell'elemento per assicurarmi che la transizione venga applicata
    box.getBoundingClientRect();

    // Reimposto la transizione
    box.style.transition = "left " + tempo + "s linear";

    // Evento che si attiva quando la transizione finisce
    box.addEventListener('transitionend', handleTransitionEnd, { once: true });

    // Posiziono il box fuori dallo schermo a sinistra
    box.style.left = "-" + (dimensione + 20) + "px";
}

function handleTransitionEnd() {
    let box = document.getElementById('ScrollText');
    box.style.transition = 'none';  // Rimuovo la transizione per resettare correttamente
    box.style.left = '1920px';  // Posiziono l'elemento di nuovo a destra
    box.getBoundingClientRect();  // Forzo il reflow

    // Chiamo startFooter per ottenere nuovi dati e iniziare nuovamente l'animazione
    startFooter();
}