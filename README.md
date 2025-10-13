# Sudoku em C
Um projeto focado em algoritmos e estruturas de dados para resolver programaticamente qualquer tabuleiro de Sudoku válido. A principal técnica utilizada foi o backtracking, um algoritmo recursivo ideal para problemas de busca e restrição.

[**🔗 Acesse a plataforma**](https://thadeu-ct.github.io/sudoku)

<img width="1715" height="876" alt="image" src="https://github.com/user-attachments/assets/5a108d82-c9e9-409d-afa1-b4e69bf835b3" />


## ✨ Tecnologias Utilizadas
Este site é do jogo Sudoku, feito com a lógica em C e com auxílio do compilador WASM, frontend padrão se comunica com a lógica para poder jogar.</br></br>
<p align="left">
  <a href="#"><img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"></a>
  <a href="#"><img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"></a>
  <a href="#"><img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/c-%2300599C.svg?style=for-the-badge&logo=c&logoColor=white" alt="C"></a>
  <a href="#"><img src="https://img.shields.io/badge/WebAssembly-654FF0?style=for-the-badge&logo=webassembly&logoColor=white" alt="WebAssembly"></a>
  <a href="#"><img src="https://img.shields.io/badge/Emscripten-143?style=for-the-badge&logo=c&logoColor=white" alt="Emscripten"></a>
</p>

## 🧠 O Desafio: Backtracking
O coração do projeto é o algoritmo de backtracking. A lógica funciona da seguinte forma:
1. Encontra a primeira célula vazia no tabuleiro.
2. Tenta preencher com um número de 1 a 9.
3. Para cada número, verifica se a jogada é válida (não viola as regras do Sudoku na linha, coluna e bloco 3x3).
4. Se for válida, avança recursivamente para a próxima célula vazia.
5. Se a chamada recursiva não encontrar uma solução, "volta atrás" (backtrack), apaga o número inserido e tenta o próximo.
6. O processo se repete até que o tabuleiro esteja completo.

## 🚀 Como Funciona
A aplicação web oferece uma experiência de jogo completa e moderna:
1.  O usuário acessa a página e pode escolher o nível de dificuldade.
2.  Ao clicar em "Novo Jogo", o JavaScript chama a função `gerarTabuleiro` exportada do C/Wasm.
3.  O código C gera um tabuleiro de solução única e o entrega para o JavaScript, que renderiza a interface.
4.  O jogador pode interagir com o tabuleiro, com funcionalidades como:
    * **Modo Escuro:** Para conforto visual.
    * **Timer:** Para acompanhar o tempo de jogo.
    * **Modo Lápis:** Para fazer anotações nas células.
    * **Validação de Conflitos:** O jogo avisa se uma jogada viola as regras do Sudoku, sem entregar a resposta final.
    * **Limpeza Automática de Notas:** Ao inserir uma resposta, as notas conflitantes são removidas.
  
## 📁 Estrutura do projeto
A estrutura do projeto é simples e direta, separando o ponto de entrada (main.c) da lógica principal do jogo (sudoku.c e sudoku.h).
```
├── README.md
├── index.html
├── main.c
├── script.js
├── style.css
├── sudoku.c
├── sudoku.exe
├── sudoku.h
├── sudoku.js
├── sudoku.wasm
└── wasm_interface.c
```

## 🛠️ Como Compilar e Rodar
Caso queira rodar os arquivos em C, junto a main.c, basta:
1. Clone o repositório:
  git clone https://github.com/thadeu-ct/sudoku.git</br>
  cd sudoku

2. Compile o código:
  Use um compilador C (como o GCC) para compilar os arquivos-fonte.</br>
  gcc -o sudoku main.c sudoku.c

3. Execute o programa:
  ./sudoku
Sua saída será, após a inserção dos dados requeridos, o jogo pronto para jogar e logo após, seu gabarito.

## 🔮 Próximos Passos: WebAssembly
O objetivo do WebAssembly foi alcançado com sucesso! Agora, o projeto pode evoluir com novas funcionalidades de jogo e melhorias de interface.

* **Novos Tipos de Sudoku:**
    * Implementar a lógica para gerar e validar diferentes variações do Sudoku, como X-Sudoku (com diagonais), Killer Sudoku (com somas) ou outras variantes.
* **Melhorias de Qualidade de Vida (QoL):**
    * Tornar a barra de números clicável para preencher as células.
    * Adicionar um botão de "Desfazer" (Undo).
    * Implementar uma função de "Dica".
* **Refinamento da Interface:**
    * Melhorar o design e a responsividade para uma melhor experiência em dispositivos móveis.

