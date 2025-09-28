#include <stdio.h>
#include <stdlib.h>
#include "sudoku.h"
#define N 9

int main(void){
    char jogar; 
    printf("Gostaria de iniciar um novo jogo? (s/n) ");
    scanf(" %c", &jogar);

    if(jogar == 's' || jogar == 'S'){ /* Iniciando um jogo */
        printf("Iniciando novo jogo...\n");
        int** sudoku = inicializaSudoku(N);
        int** resposta = inicializaSudoku(N);

        if (sudoku == NULL || resposta == NULL){
            printf("Falha ao inicializar o Sudoku. Encerrando o programa.\n");
            exit(1); /* erro na alocação */
        }

        int nivel; /* escolha de um nível */
        printf("Escolha o nivel de dificuldade (1 - Facil, 2 - Medio, 3 - Dificil): ");
        scanf(" %d", &nivel);

        gerarSudoku(sudoku, resposta, N, nivel); /* gerando o jogo */

        printf("Aqui esta o Sudoku gerado:\n");
        imprimeSudoku(sudoku, N); /* imprimindo gabarito */

        printf("\nAqui esta o gabarito do Sudoku gerado:\n");
        imprimeSudoku(resposta, N); /* imprimindo gabarito */

        printf("Encerrando o jogo...\n");
        liberaSudoku(sudoku, N); /* liberando a memoria usada do jogo*/
        liberaSudoku(resposta, N); /* liberando a memoria usada do gabarito */
    }

    /* encerramento do programa, por entrada inválida ou "não" recebido */
    else if (jogar == 'n' || jogar == 'N') printf("Encerrando o programa.\n"); 
    else printf("Entrada invalida. Encerrando o programa.\n");

    return 0;
}