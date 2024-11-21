const state={
    view: {
        squares: document.querySelectorAll('.square'), //seleciona todos os quadrados
        enemy: document.querySelector('.enemy'), //seleciona o inimigo
        timeLeft: document.querySelector('#time-left'), //seleciona o elemento do tempo 
        score: document.querySelector('#score'), //seleciona o elemento do score
        life: document.querySelector('.life'), //seleciona o elemento da vida
        best: document.querySelector('#best'),//seleciona o elemento do best score
        last: document.querySelector('#last'),//seleciona o elemento do last score
        starter: document.querySelector('#starter'), //seleciona o elemento do starter, texto de inicialização do jogo
        contador: document.querySelector('#cont'),//seleciona o elemento do contador de inicialização do jogo
        playStop: document.querySelector('#stop'),//seleciona o elemento do botão play/stop
        stopBtn: document.querySelector('#stopBtn'),//seleciona o elemento do botão stop
        level: document.querySelector("#selectedLevel"),//seleciona o elemento do level


    },
    values: {
        stop: false,//indica se o jogo esta parado
        gameVelocity: 1000,//indica a velocidade do jogo
        hitPosition: 0,//indica a posição do inimigo
        result:0,//indica o score
        curretTime: 60,//indica o tempo restante
        bestScore:0,//indica o best score
        lastScore:0,//indica o last score
        life: 5,//indica a vida
        cont: 5,//indica o contador de inicialização
        gameStarted: false,//indica se o jogo foi iniciado
        multplicador: 0,  //indica o multiplicador da pontuação
    },
    actions:{
        timerId: null, //Armazena o id do intervalo do movimento do inimigo
        countDownTimerId: null,//Armazena o id do intervalo do contador
        count: null,//Armazena o id do intervalo do contador de inicialização
    }
};

//Retira o elemento starter do panel
state.view.starter.style.display = "none";

// Função responsável por reproduzir o som
function playSound(sound) {
let audio = new Audio(`./src/audios/${sound}` );
    audio.volume = 0.2;
    audio.pause();
    audio.currentTime = 0;
    audio.play();
    
}
//Função responsável por resetar o jogo, recebe um valor de entrada, se foi clickado pelo botão ou chamadointernamente.
function resetGame(clickReset){
    //resetando o valor do stop
    state.values.stop = false;

    //Resetando contador de inicialização
    state.values.cont = 5;

    //inicializando o timer
    state.values.curretTime = 60;
    state.view.timeLeft.textContent = state.values.curretTime;

    //inicializando o score
    state.values.result = 0;
    state.view.score.textContent = state.values.result;

    //inicializando o life
    state.values.life = 5;
    state.view.life.textContent = state.values.life;

    //inicializabdo o hitPosition
    state.values.hitPosition = null;


    //limpando o intervals
    clearInterval(state.actions.count);
    state.actions.count = null;
    clearInterval(state.actions.timerId);
    state.actions.timerId = null;
    clearInterval(state.actions.countDownTimerId);
    state.actions.countDownTimerId = null;


    //Verficando se o botão reset foi clicado
    if(clickReset == true){
        state.view.level.selectedIndex = 0;
        state.values.gameStarted = false;
    }
    
    //limpando o panel e retirando os inimigos da tela
    state.view.squares.forEach((square) => {square.classList.remove("enemy");});

}

//Função responsável por iniciar o jogo
function startGame(){
    //inicializando o jogo, ativando o gameStarted
    state.values.gameStarted = true;

    //Verificando se foi escolhido um level do jogo 
    if(state.view.level.value == 0 ){
        alert("Escolha um level!");
    }else{
        
        //Adicionando level ao velocity
        state.values.gameVelocity = parseInt(state.view.level.value);

        //selecioando o multiplicador de pontuação referente ao level
        switch (state.values.gameVelocity) {
            case 1300://caso o level seja easy(1300) valor do multipilicador = 1
                state.values.multplicador = 1;
                break;
            case 1000://caso o level seja normal(1000) valor do multipilicador = 2
                state.values.multplicador = 2;
                break;
            case 900://caso o level seja hard(900) valor do multipilicador = 3
                state.values.multplicador = 3;
                break;
            case 500://caso o level seja god(500) valor do multipilicador = 5
                state.values.multplicador = 5;
                break;
        }
        //resetando o jogo para ter certeza que os valores iniciais estao corretos
        resetGame(false);

        //Iniciando acontagem regressiva para começar o jogo   
        state.actions.count = setInterval(contagemInicial, 1000);
    }
}
//Função responsável por parar o jogo
function stopGame(){
    //Cria uma váriavel auxiliar para receber o valor do tempo restante
    var auxTime = state.values.curretTime;
    //se botão stop foi clicado, inverte se valor
    state.values.stop = !state.values.stop;
    
    //Verificando se o botão stop foi clicado
    if(state.values.stop == true){
        //Alterando o estilo do botão quando clicado
        state.view.stopBtn.style.backgroundColor = "gray";//mudando a cor de fundo do botão
        state.view.playStop.textContent = "Play";//mudando o texto do botão
        
        state.view.timeLeft.textContent = auxTime;//Mostrando valor do tempo restante, para que não seja alterado
        state.values.hitPosition = null;//limpando o hitPosition
        clearInterval(state.actions.timerId);//limpando o intervalo do movimento do inimigo
        clearInterval(state.actions.countDownTimerId);//limpando o intervalo do contador

    }else{
        //Alterando o estilo do botão quando clicado
        state.view.stopBtn.style.backgroundColor = "#008000";//mudando a cor de fundo do botão
        state.view.playStop.textContent = "Stop";//mudando o texto do botão

        state.values.curretTime = auxTime;//reinicializando o valor do tempo restante
        auxtime = 0;//zerando auxliar para evitar bug
        state.values.cont = 5;//reinicializando o valor do contador
        state.actions.count = setInterval(contagemInicial, 1000);//chamando a contagem regressiva

    }
    
}

//Função responsável por escolher um quadrado aleatorio e apresentar o enemy
function randomSquare(){
    //Verificando se o jogo nao esta parado
    if(state.values.stop == false){
        //limpando os quadrados
        state.view.squares.forEach((square) => {
            square.classList.remove("enemy");
            square.isCliked = false;
        });

        let randomNumber = Math.floor(Math.random() * 9); //gerando um numero aleatorio
        let randomSquare = state.view.squares[randomNumber]; //escolhendo o quadrado de acordo com o numero gerado
        randomSquare.classList.add("enemy");//adicionando a classe enemy ao quadrado
        state.values.hitPosition = randomSquare.id;//Adicionando o id no hitPosition
    }
}


//Função responsável por escutar o clique do mouse
function addListenertHitBox(){
    //Escutando o clique do mouse
    state.view.squares.forEach((square) => {
        square.isCliked = false;
        square.addEventListener("mousedown", () => {
            //Verificando se o jogo nao esta parado
            if(state.values.gameStarted == false || square.isCliked || state.values.stop == true){
                return;
            }
            //Verificando se o quadrado clicado foi o inimigo
            if(square.id === state.values.hitPosition){
                playSound("hit.m4a");//reproduzindo o som de hit

                state.values.result += state.values.multplicador;//adicionando o valor do multipilicador ao score
                state.view.score.textContent = state.values.result;//mostrando o score
                
                state.values.hitPosition = null;//limpando o hitPosition
                square.isCliked = true;//marcando o quadrado como clicado
            }else{//caso o quadrado clicado nao seja o inimigo

                playSound("error.mp3");//reproduzindo o som de error
                state.values.life--;//diminuindo a vida
                state.view.life.textContent = state.values.life;//mostrando a vida
                
                square.isCliked = true;//marcando o quadrado como clicado

                //Verificando se a vida chegou a zero
                if(state.values.life <= 0){
                    EndGame();//chamando a funcao de fim de jogo
                }
            }
        })
    });
}

//Função responsável por contagem regressiva
function countDown(){
    //Verificando se o jogo nao esta parado
    if(state.values.stop == false){
        //mostrando o contador
        state.view.timeLeft.textContent = state.values.curretTime;

        //Verificando se o tempo chegou a zero
        if(state.values.curretTime <= 0){
            EndGame();//chamando a funcao de fim de jogo
        }
        state.values.curretTime--;//diminuindo o tempo
    }
}
//Função responsável por contagem de inicialização
function contagemInicial(){
    //mostrando contador
    state.view.starter.style.display = "block";
    state.view.contador.textContent = state.values.cont;
    
    //Verificando se o contador chegou a zero
    if(state.values.cont <= 0){
        //Retirando o elemento starter da tela
        state.view.starter.style.display = "none";

        initial();//chamando a funcao de inicializacao
        clearInterval(state.actions.count);//limpando o intervalo
    }
    state.values.cont--;//diminuindo o contador
}

//Função responsável por fim de jogo
function EndGame(){
    //Finalizando o jogo 
    state.values.gameStarted = false;

    //Verificando se o result e maior que o bestScore
    if(state.values.result > state.values.bestScore){
        //Atualizando o bestScore
        state.values.bestScore = state.values.result;
        state.view.best.textContent = state.values.bestScore;//mostrando o bestScore
    }
    //Atualizando o lastScore
    state.values.lastScore = state.values.result;
    state.view.last.textContent = state.values.lastScore;//mostrando o lastScore
    alert("Fim de jogo! Sua pontuação foi: " + state.values.result);//mostrando o score na tela
    clearInterval(state.actions.timerId);//limpando o intervalo
    clearInterval(state.actions.countDownTimerId);//limpando o intervalo
}
//Função responsável por inicializar o jogo
function initial(){
    //inicializa o contador
    state.actions.countDownTimerId = setInterval(countDown, 1000);
    //inicializa o movimento do enemy
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);

    
}
//abre a escuta do clique
addListenertHitBox();
