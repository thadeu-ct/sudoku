// script.js

// 1. Pegamos referências para os elementos do HTML com os quais vamos interagir
const tabuleiroElement = document.getElementById('tabuleiro-sudoku');
const novoJogoBtn = document.getElementById('novo-jogo-btn');
const dificuldadeSelect = document.getElementById('dificuldade');
const statusElement = document.getElementById('status-jogo');
const modoEscuroBtn = document.getElementById('modo-escuro-btn');
const timerElement = document.getElementById('timer');
const barraNumerosElement = document.getElementById('barra-numeros');
const modoLapisBtn = document.getElementById('modo-lapis-btn');



// 2. Declaramos variáveis com os NOMES CORRETOS das suas funções
let gerarTabuleiro, verificarJogada;
let idDoTimer = null;
let tempoInicio = 0;
let modoLapis = false;

// 3. O Emscripten nos avisa quando o Wasm está 100% carregado e pronto para ser usado
Module.onRuntimeInitialized = () => {
    console.log("Módulo Wasm carregado e pronto.");
    statusElement.textContent = "Pronto para jogar!";
    novoJogoBtn.disabled = false; // Habilita o botão "Novo Jogo"

    // 4. Usamos cwrap com os NOMES CORRETOS que você exportou
    gerarTabuleiro = Module.cwrap('gerarTabuleiro', 'number', ['number']);
    verificarJogada = Module.cwrap('verificarJogada', 'number', ['number', 'number', 'number']);
};

// 5. Adicionamos um "ouvinte" ao botão. Quando ele for clicado, a função será executada
novoJogoBtn.addEventListener('click', () => {
    clearInterval(idDoTimer);
    const nivel = parseInt(dificuldadeSelect.value);
    statusElement.textContent = "Gerando novo tabuleiro...";

    setTimeout(() => {
        // 6. Chamamos a função C com o NOME CORRETO
        const tabuleiroPtr = gerarTabuleiro(nivel);

        // Se a função C retornar um erro (NULL, que é 0), paramos aqui
        if (tabuleiroPtr === 0) {
            statusElement.textContent = "Erro ao gerar o tabuleiro. Tente novamente.";
            return;
        }

        // 7. Mapeamos a memória do Wasm para um array JavaScript
        const tabuleiroArray = new Int32Array(Module.HEAP32.buffer, tabuleiroPtr, 81);

        // 8. Renderizamos o tabuleiro na tela
        renderizarTabuleiro(tabuleiroArray);
        renderizarBarraNumeros();
        atualizarContadores();
        statusElement.textContent = "Bom jogo!";
        tempoInicio = Date.now(); // Grava o momento exato em que o jogo começou
        idDoTimer = setInterval(atualizarTimer, 1000); // Inicia o timer para rodar a cada 1 segundo
    }, 50);
});

modoEscuroBtn.addEventListener('click', () => {
    // A função toggle é mágica: se a classe existe, ela remove.
    // Se não existe, ela adiciona. Perfeito para um interruptor!
    document.body.classList.toggle('modo-escuro');
});

modoLapisBtn.addEventListener('click', () => {
    // Inverte o estado atual (se for true, vira false, e vice-versa)
    modoLapis = !modoLapis;

    // Adiciona/remove uma classe no botão para dar feedback visual
    modoLapisBtn.classList.toggle('ativo');
});

function renderizarTabuleiro(dadosTabuleiro) {
    tabuleiroElement.innerHTML = '';
    for (let i = 0; i < 81; i++) {
        const linha = Math.floor(i / 9);
        const coluna = i % 9;
        const valor = dadosTabuleiro[i];
        
        const celula = document.createElement('div');
        celula.classList.add('celula');
        celula.dataset.linha = linha;
        celula.dataset.coluna = coluna;

        if (valor !== 0) {
            // Células com números iniciais não mudam.
            celula.textContent = valor;
            celula.classList.add('celula-dada');
        } else {
            // --- INÍCIO DA GRANDE MUDANÇA para células vazias ---

            // 1. Criamos o "andar" das notas de lápis.
            const lapisContainer = document.createElement('div');
            lapisContainer.classList.add('lapis-container');

            // Dentro do container, criamos os 9 espaços para as notas (1 a 9).
            for (let n = 1; n <= 9; n++) {
                const lapisNumero = document.createElement('div');
                lapisNumero.classList.add('lapis-numero');
                lapisNumero.dataset.numero = n; // Identifica qual número a nota representa
                lapisNumero.textContent = n;
                lapisContainer.appendChild(lapisNumero);
            }

            // 2. Criamos o "andar" da resposta final, como antes.
            const input = document.createElement('input');
            input.type = 'number';
            input.maxLength = 1;
            input.classList.add('celula-entrada');
            input.addEventListener('input', (e) => handleInput(e)); // handleInput não precisa mais de linha/coluna

            // 3. Adicionamos os dois "andares" à célula.
            celula.appendChild(lapisContainer); // Notas ficam no fundo
            celula.appendChild(input);          // Resposta fica na frente
        }
        tabuleiroElement.appendChild(celula);
    }
    revalidarConflitosNoTabuleiro();
}

/**
 * VERSÃO FINAL: Gerencia a entrada do usuário, tratando modo lápis,
 * modo de resposta e a limpeza automática de notas conflitantes.
 */
function handleInput(event) {
    const input = event.target;
    const celula = input.parentElement;
    const linha = parseInt(celula.dataset.linha);
    const coluna = parseInt(celula.dataset.coluna);

    // Impede que o usuário digite mais de um número
    if (input.value.length > 1) {
        input.value = input.value.slice(0, 1);
    }
    const valor = parseInt(input.value);

    // --- DECISÃO PRINCIPAL: MODO LÁPIS OU MODO RESPOSTA? ---

    if (modoLapis) {
        // No modo lápis, a resposta final não é alterada. Limpamos o campo.
        input.value = '';

        if (valor >= 1 && valor <= 9) {
            // Encontra o container de notas
            const lapisContainer = celula.querySelector('.lapis-container');
            // Encontra a nota específica que o usuário digitou
            const nota = lapisContainer.querySelector(`[data-numero='${valor}']`);
            
            // Liga ou desliga a visibilidade da nota
            nota.classList.toggle('ativo');
        }
        return; // MODO LÁPIS TERMINA AQUI. Nenhuma validação ou contador é acionado.
    }

    // --- SE CHEGAMOS AQUI, NÃO ESTAMOS NO MODO LÁPIS ---

    // 1. Limpa todas as notas de lápis da CÉLULA ATUAL, pois uma resposta final foi inserida.
    const lapisContainer = celula.querySelector('.lapis-container');
    if (lapisContainer) { // Adiciona uma verificação para segurança
        lapisContainer.querySelectorAll('.lapis-numero').forEach(n => n.classList.remove('ativo'));
    }

    // 2. Se um número válido foi inserido, limpa as notas conflitantes no resto do tabuleiro.
    if (valor >= 1 && valor <= 9) {
        limparNotasConflitantes(linha, coluna, valor);
    }
    
    // 3. Revalida todos os conflitos no tabuleiro (lógica que já tínhamos).
    revalidarConflitosNoTabuleiro();
    
    // 4. Atualiza os contadores da barra de números.
    atualizarContadores();

    // 5. Verifica se o jogador venceu.
    verificarVitoriaSeAplicavel();
}

function atualizarTimer() {
    // Calcula quantos milissegundos se passaram desde o início do jogo
    const tempoDecorrido = Date.now() - tempoInicio;

    // Converte milissegundos para segundos
    const totalSegundos = Math.floor(tempoDecorrido / 1000);

    // Calcula os minutos e os segundos
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;

    // Formata os números para sempre terem dois dígitos (ex: 01, 02, ... 10, 11)
    const minutosFormatados = String(minutos).padStart(2, '0');
    const segundosFormatados = String(segundos).padStart(2, '0');

    // Exibe o tempo formatado na tela
    timerElement.textContent = `${minutosFormatados}:${segundosFormatados}`;
}

function getEstadoAtualDoTabuleiro() {
    const tabuleiro = [];
    const celulas = document.querySelectorAll('#tabuleiro-sudoku .celula');
    let linhaAtual = [];

    celulas.forEach((celula, index) => {
        const input = celula.querySelector('input');
        let valor = 0;
        if (input) {
            // Se for um campo de input, pegamos seu valor
            valor = parseInt(input.value) || 0;
        } else {
            // Se for uma célula dada, pegamos seu texto
            valor = parseInt(celula.textContent) || 0;
        }
        linhaAtual.push(valor);

        // A cada 9 células, completamos uma linha e começamos uma nova
        if ((index + 1) % 9 === 0) {
            tabuleiro.push(linhaAtual);
            linhaAtual = [];
        }
    });
    return tabuleiro;
}


function jogadaCausaConflito(tabuleiro, linha, coluna, numero) {
    // Verifica a linha
    for (let c = 0; c < 9; c++) {
        if (tabuleiro[linha][c] === numero && c !== coluna) {
            return true; // Conflito encontrado
        }
    }

    // Verifica a coluna
    for (let l = 0; l < 9; l++) {
        if (tabuleiro[l][coluna] === numero && l !== linha) {
            return true; // Conflito encontrado
        }
    }

    // Verifica o bloco 3x3
    const inicioLinhaBloco = linha - (linha % 3);
    const inicioColunaBloco = coluna - (coluna % 3);
    for (let l = 0; l < 3; l++) {
        for (let c = 0; c < 3; c++) {
            const linhaAtual = inicioLinhaBloco + l;
            const colunaAtual = inicioColunaBloco + c;
            if (tabuleiro[linhaAtual][colunaAtual] === numero && (linhaAtual !== linha || colunaAtual !== coluna)) {
                return true; // Conflito encontrado
            }
        }
    }

    return false; // Nenhum conflito
}

function renderizarBarraNumeros() {
    barraNumerosElement.innerHTML = ''; // Limpa a barra antiga
    for (let i = 1; i <= 9; i++) {
        const numeroBtn = document.createElement('div');
        numeroBtn.classList.add('numero-btn');
        numeroBtn.dataset.numero = i; // Guarda o número no próprio elemento

        const numeroTexto = document.createElement('span');
        numeroTexto.classList.add('numero-texto');
        numeroTexto.textContent = i;
        
        const contador = document.createElement('span');
        contador.classList.add('contador-numero');
        contador.id = `contador-${i}`; // ID único para cada contador
        
        numeroBtn.appendChild(numeroTexto);
        numeroBtn.appendChild(contador);
        barraNumerosElement.appendChild(numeroBtn);
    }
}

/**
 * Conta os números no tabuleiro e atualiza os contadores na barra.
 */
function atualizarContadores() {
    const tabuleiro = getEstadoAtualDoTabuleiro();
    const contagem = {}; // Usaremos um objeto para contar: {1: 0, 2: 0, ...}

    // Inicializa a contagem
    for (let i = 1; i <= 9; i++) {
        contagem[i] = 0;
    }

    // Percorre o tabuleiro para contar os números
    for (let l = 0; l < 9; l++) {
        for (let c = 0; c < 9; c++) {
            const numero = tabuleiro[l][c];
            if (numero !== 0) {
                contagem[numero]++;
            }
        }
    }

    // Atualiza o texto de cada contador na tela
    for (let i = 1; i <= 9; i++) {
        const contadorElement = document.getElementById(`contador-${i}`);
        const restante = 9 - contagem[i];
        contadorElement.textContent = restante;

        // Se o número já foi todo preenchido, adicionamos uma classe para "escondê-lo"
        const numeroBtn = contadorElement.parentElement;
        if (restante === 0) {
            numeroBtn.classList.add('numero-completo');
        } else {
            numeroBtn.classList.remove('numero-completo');
        }
    }
}

function verificarVitoriaSeAplicavel() {
    // Condição 1: Todos os contadores chegaram a zero?
    // A maneira mais fácil de verificar isso é ver se ainda há células vazias.
    const tabuleiro = getEstadoAtualDoTabuleiro();
    const estaCompleto = !tabuleiro.flat().includes(0); // .flat() transforma a matriz em um array simples

    if (!estaCompleto) {
        return; // Jogo ainda não terminou, então paramos aqui.
    }

    // Condição 2: Existe alguma célula com conflito (vermelha)?
    const temConflito = document.querySelector('.celula-entrada.incorreto');

    if (temConflito) {
        return; // O tabuleiro está cheio, mas com erros, então não há vitória.
    }

    // Se o tabuleiro está completo E não tem conflitos, o jogador venceu!
    executarSequenciaDeVitoria();
}

/**
 * Para o timer, mostra a mensagem de parabéns e pinta o tabuleiro de verde.
 * Esta função pode ser exatamente a mesma da sugestão anterior.
 */
function executarSequenciaDeVitoria() {
    clearInterval(idDoTimer); // Para o timer
    statusElement.textContent = `Parabéns! Você resolveu em ${timerElement.textContent}!`;
    
    // Deixa todos os números digitados verdes e desabilita os inputs
    const inputs = document.querySelectorAll('.celula-entrada');
    inputs.forEach(input => {
        input.classList.remove('incorreto');
        input.classList.add('correto');
        input.disabled = true; // Impede que o usuário mude os números após vencer
    });
}

function revalidarConflitosNoTabuleiro() {
    const tabuleiroAtual = getEstadoAtualDoTabuleiro();
    const celulasInputs = document.querySelectorAll('#tabuleiro-sudoku .celula-entrada');

    celulasInputs.forEach(input => {
        const linha = parseInt(input.parentElement.dataset.linha); // Precisamos adicionar data-linha/coluna no renderTabuleiro
        const coluna = parseInt(input.parentElement.dataset.coluna); // Precisamos adicionar data-linha/coluna no renderTabuleiro
        const valor = parseInt(input.value) || 0;

        if (valor >= 1 && valor <= 9) {
            const temConflito = jogadaCausaConflito(tabuleiroAtual, linha, coluna, valor);
            if (temConflito) {
                input.classList.add('incorreto');
            } else {
                input.classList.remove('incorreto');
            }
        } else {
            // Se a célula está vazia ou com valor inválido, remove o vermelho
            input.classList.remove('incorreto');
        }
    });
}

function limparNotasConflitantes(linha, coluna, numero) {
    const numeroStr = String(numero);

    // 1. Varre a linha
    for (let c = 0; c < 9; c++) {
        const celula = document.querySelector(`.celula[data-linha='${linha}'][data-coluna='${c}']`);
        const nota = celula.querySelector(`.lapis-numero[data-numero='${numeroStr}']`);
        if (nota) {
            nota.classList.remove('ativo');
        }
    }

    // 2. Varre a coluna
    for (let l = 0; l < 9; l++) {
        const celula = document.querySelector(`.celula[data-linha='${l}'][data-coluna='${coluna}']`);
        const nota = celula.querySelector(`.lapis-numero[data-numero='${numeroStr}']`);
        if (nota) {
            nota.classList.remove('ativo');
        }
    }

    // 3. Varre o bloco 3x3
    const inicioLinhaBloco = linha - (linha % 3);
    const inicioColunaBloco = coluna - (coluna % 3);
    for (let l = 0; l < 3; l++) {
        for (let c = 0; c < 3; c++) {
            const linhaAtual = inicioLinhaBloco + l;
            const colunaAtual = inicioColunaBloco + c;
            const celula = document.querySelector(`.celula[data-linha='${linhaAtual}'][data-coluna='${colunaAtual}']`);
            const nota = celula.querySelector(`.lapis-numero[data-numero='${numeroStr}']`);
            if (nota) {
                nota.classList.remove('ativo');
            }
        }
    }
}