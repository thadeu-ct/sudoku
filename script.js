// script.js

// 1. Pegamos referências para os elementos do HTML com os quais vamos interagir
const tabuleiroElement = document.getElementById('tabuleiro-sudoku');
const novoJogoBtn = document.getElementById('novo-jogo-btn');
const dificuldadeSelect = document.getElementById('dificuldade');
const statusElement = document.getElementById('status-jogo');

// 2. Declaramos variáveis com os NOMES CORRETOS das suas funções
let gerarTabuleiro, verificarJogada;

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
        statusElement.textContent = "Bom jogo!";
    }, 50);
});

function renderizarTabuleiro(dadosTabuleiro) {
    tabuleiroElement.innerHTML = '';
    for (let i = 0; i < 81; i++) {
        const linha = Math.floor(i / 9);
        const coluna = i % 9;
        const valor = dadosTabuleiro[i];
        
        const celula = document.createElement('div');
        celula.classList.add('celula');

        if (valor !== 0) {
            celula.textContent = valor;
            celula.classList.add('celula-dada');
        } else {
            const input = document.createElement('input');
            input.type = 'number';
            input.maxLength = 1;
            input.classList.add('celula-entrada');
            
            input.addEventListener('input', (e) => handleInput(e, linha, coluna));
            celula.appendChild(input);
        }
        tabuleiroElement.appendChild(celula);
    }
}

function handleInput(event, linha, coluna) {
    const input = event.target;
    
    // Impede que o usuário digite mais de um número
    if (input.value.length > 1) {
        input.value = input.value.slice(0, 1);
    }
    const valor = parseInt(input.value);

    if (valor >= 1 && valor <= 9) {
        // 9. Chamamos a função C de verificação com o NOME CORRETO
        const ehCorreto = verificarJogada(linha, coluna, valor);
        
        input.classList.remove('correto', 'incorreto');
        if (ehCorreto) {
            input.classList.add('correto');
        } else {
            input.classList.add('incorreto');
        }
    } else {
        input.classList.remove('correto', 'incorreto');
    }
}