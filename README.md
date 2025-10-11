# Sudoku em C
Um projeto focado em algoritmos e estruturas de dados para resolver programaticamente qualquer tabuleiro de Sudoku válido. A principal técnica utilizada foi o backtracking, um algoritmo recursivo ideal para problemas de busca e restrição.

[**🔗 Acesse a plataforma**](https://thadeu-ct.github.io/sudoku)

## ✨ O Desafio: Backtracking
O coração do projeto é o algoritmo de backtracking. A lógica funciona da seguinte forma:
1. Encontra a primeira célula vazia no tabuleiro.
2. Tenta preencher com um número de 1 a 9.
3. Para cada número, verifica se a jogada é válida (não viola as regras do Sudoku na linha, coluna e bloco 3x3).
4. Se for válida, avança recursivamente para a próxima célula vazia.
5. Se a chamada recursiva não encontrar uma solução, "volta atrás" (backtrack), apaga o número inserido e tenta o próximo.
6. O processo se repete até que o tabuleiro esteja completo.

## 🚀 Como Funciona
  Inicia-se com um contato com o usuário perguntando se gostaria de jogar um sudoku;</br>
  Após uma confirmação, pergunta-se qual dificuldade o usuário deseja jogar;</br>
  Por fim, é gerado um jogo de solução única e seu gabarito para o usuário e encerra o programa

## 📁 Estrutura do projeto
A estrutura do projeto é simples e direta, separando o ponto de entrada (main.c) da lógica principal do jogo (sudoku.c e sudoku.h).
```
├── main.c
├── sudoku.c
├── sudoku.exe
└── sudoku.h
```

## 🛠️ Como Compilar e Rodar
1. Clone o repositório:
  git clone https://github.com/thadeu-ct/sudoku.git</br>
  cd sudoku

2. Compile o código:
  Use um compilador C (como o GCC) para compilar os arquivos-fonte.</br>
  gcc -o sudoku main.c sudoku.c

3. Execute o programa:
  ./sudoku

## 🔮 Próximos Passos: WebAssembly
O grande objetivo futuro para este projeto é transformar o "motor" lógico feito em C em um módulo WebAssembly. Isso permitirá que a performance do C seja executada diretamente no navegador, criando uma experiência de jogo de Sudoku interativa e de alto desempenho na web.
