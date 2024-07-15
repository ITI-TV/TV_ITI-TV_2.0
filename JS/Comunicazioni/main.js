function startComunicazioni(){
    fetch('PHP/getters.php?action=getComunicazioni')
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
    console.log (data.length);
    if(data.length<4){
        let i
        for( i=1; i<data.length; i++){
            document.getElementById('numeroComunicazione'+i).innerHTML = data[i].Numero;
            document.getElementById('titoloComunicazione'+i).innerHTML = data[i].Titolo;
            document.getElementById('testoComunicazione'+i).innerHTML = data[i].Corpo;
            document.getElementById('professoreComunicazione'+i).innerHTML = data[i].Prof;
        }
        for (i; i<4; i++){
            document.getElementById('numeroComunicazione'+i).innerHTML = data[0].Numero;
            document.getElementById('titoloComunicazione'+i).innerHTML = data[0].Titolo;
            document.getElementById('testoComunicazione'+i).innerHTML = data[0].Corpo;
            document.getElementById('professoreComunicazione'+i).innerHTML = data[0].Prof;
        }
    }else{
        //elimino il primo elemento dell'array
        data.shift();
        console.log(data);
        //generop 3 numeri casuali diversi da 1 fino all'ultimo indice dell'array
        let numeri = [];
        while(numeri.length<3){
            let numero = Math.floor(Math.random() * data.length);
            if(!numeri.includes(numero)){
                numeri.push(numero);
            }
        }
        for(let i = 1 ; i<=3; i++){
            document.getElementById('numeroComunicazione'+i).innerHTML = data[numeri[i-1]].Numero;
            document.getElementById('titoloComunicazione'+i).innerHTML = data[numeri[i-1]].Titolo;
            document.getElementById('testoComunicazione'+i).innerHTML = data[numeri[i-1]].Corpo;
            document.getElementById('professoreComunicazione'+i).innerHTML = data[numeri[i-1]].Prof;
        }
    }
}

startComunicazioni();