#include <stdio.h>
#include <stdlib.h>
#include "sudoku.h"
#include <emscripten.h>

#define N 9

int tabuleiro_gerado[N * N];
int solucao_gerada[N * N];

int main(void){
    printf("Iniciando o sistema WASM...\n");
    return 0;
}

EMSCRIPTEN_KEEPALIVE
int* gerarTabuleiro(int nivel) {
    int** sudoku = inicializaSudoku(N);
    int** resposta = inicializaSudoku(N);

    if (sudoku == NULL || resposta == NULL){
        printf("Falha ao inicializar o Sudoku.\n");
        return NULL; /* erro na alocação */
    }

    gerarSudoku(sudoku, resposta, N, nivel); /* gerando o jogo */

    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            tabuleiro_gerado[i * N + j] = sudoku[i][j];
            solucao_gerada[i * N + j] = resposta[i][j];
        }
    } /* copia o sudoku completo para a resposta */

    liberaSudoku(sudoku, N); /* liberando a memoria usada do jogo*/
    liberaSudoku(resposta, N); /* liberando a memoria usada do gabarito */

    return tabuleiro_gerado;
}

EMSCRIPTEN_KEEPALIVE
int verificarJogada(int linha, int coluna, int numero) {
    if (*(solucao_gerada + (linha * N + coluna)) == numero) {
        return 1; /* Jogada correta */
    } else {
        return 0; /* Jogada incorreta */
    }
}