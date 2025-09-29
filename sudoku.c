#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include "sudoku.h"

int** inicializaSudoku(int tam){
    int** sudoku = (int**)malloc(tam * sizeof(int*)); /* alocar linhas */
    if(sudoku == NULL) return NULL; 

    /* popular o jogo */
    for(int i = 0; i < tam; i++){ /* linha */
        sudoku[i] = (int*)malloc(tam*sizeof(int)); /* alocar colunas */
        if (sudoku[i] == NULL){
            liberaSudoku(sudoku, i); /* libera memoria anteriormente alocada */
            return NULL;
        }
        for(int j = 0; j < tam; j++) sudoku[i][j] = 0; /* inicialização base */
    }
    return sudoku;
}

void liberaSudoku(int** sudoku, int tam){
    for(int i = 0; i < tam; i++) free(sudoku[i]); /* libera cada linha */
    free(sudoku); /* libera o vetor de linhas */
}

void gerarSudoku(int** sudoku, int** resposta, int tam, int nivel){
    srand(time(NULL)); /* inicializa o gerador de números aleatórios */
    preencherSudoku(sudoku, tam); /* preenche o sudoku completamente */
     
    for (int i = 0; i < tam; i++) {
        for (int j = 0; j < tam; j++) {
            resposta[i][j] = sudoku[i][j];
        }
    } /* copia o sudoku completo para a resposta */

    int celulas_remover;
    switch (nivel){
        case 1:
            printf("Nivel Facil selecionado.\n");
            celulas_remover = 40;
            break;
        case 2:
            printf("Nivel Medio selecionado.\n");
            celulas_remover = 50;
            break;
        case 3:
            printf("Nivel Dificil selecionado.\n");
            celulas_remover = 60;
            break;
        } /* define a quantidade de células a serem removidas com base no nível */
    
    remover_celulas(sudoku, tam, celulas_remover);
}

int preencherSudoku(int** sudoku, int tam) {
    int linha = -1, coluna = -1;

    for (int i = 0; i < tam; i++) {
        for (int j = 0; j < tam; j++) {
            if (sudoku[i][j] == 0) { /* busca por celula vazio, valor = 0 */
                linha = i;
                coluna = j;
                break;
            }
        }
        if (linha != -1) break; /* interrompe o loop linhas */
    }
    if (linha == -1) return 1; /* sudoku completo */

    int numeros[] = {1, 2, 3, 4, 5, 6, 7, 8, 9};
    embaralhar(numeros, 9);

    for (int i = 0; i < 9; i++) {
        int num = numeros[i]; /* escolhe um numero embaralhado */
        if (eh_valido(sudoku, tam, linha, coluna, num)) { /* verifica se é uma jogada válida */
            sudoku[linha][coluna] = num; /* faz a jogada */
            if (preencherSudoku(sudoku, tam)) return 1; /* se funcionar, continua recursivamente */
            sudoku[linha][coluna] = 0; /* reseta jogada */
        }
    }
    return 0; 
}

void remover_celulas(int** sudoku, int tam, int celulas_remover) {
    /* cria um vetor da matriz */
    Coord* posicoes = (Coord*)malloc(tam*tam*sizeof(Coord));
    if (posicoes == NULL) exit(1);
    for (int i = 0; i < tam; i++) {
        for (int j = 0; j < tam; j++) {
            int indice = i * tam + j; /* vetorização da matriz */
            posicoes[indice].linha = i;
            posicoes[indice].col = j;
        }
    }

    /* embaralha as coordenadas da matriz */
    embaralhar_coordenadas(posicoes, tam * tam);

    int removidas = 0;
    for (int i = 0; i < tam * tam && removidas < celulas_remover; i++) {
        int linha = posicoes[i].linha;
        int col = posicoes[i].col;

        int backup = sudoku[linha][col]; /* backup do valor que será removido */
        sudoku[linha][col] = 0; /* apaga temporariamente a celula */
        
        /* verifica se pode remover a célula sem dar mais de 1 solução */
        if (contarSolucoes(sudoku, tam) != 1) sudoku[linha][col] = backup; /* desfaz a remoção */
        else removidas++; /* apaga permanentemente a celula */
    }
}

void embaralhar(int *vetor, int n) {
    if (n > 1) { /* sistema para embaralhar os números de teste e fugir de um padrão */
        for (int i = 0; i < n - 1; i++) {
            int j = i + rand() / (RAND_MAX / (n - i) + 1);
            int temp = vetor[j];
            vetor[j] = vetor[i];
            vetor[i] = temp;
        }
    }
}

int eh_valido(int** sudoku, int tam, int linha, int coluna, int num) {
    for (int i = 0; i < tam; i++) {
        if (sudoku[linha][i] == num || sudoku[i][coluna] == num)  return 0;
    }  /* verifica na linha e coluna se tem o número */

    /* encontra o bloco 3x3 que o sudoku[i][j] se encontra*/
    int bloco_linha = linha - linha % 3; 
    int bloco_coluna = coluna - coluna % 3; 

    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (sudoku[i + bloco_linha][j + bloco_coluna] == num) return 0;
        } /* verifica no bloco 3x3 se tem o número */
    }
    return 1; /* caso contrário, é valido*/
}

void embaralhar_coordenadas(Coord* coord, int n) {
    if (n > 1) { /* sistema para embaralhar as coordenadas e fugir de um padrão */
        for (int i = 0; i < n - 1; i++) {
            int j = i + rand() / (RAND_MAX / (n - i) + 1);
            Coord temp = coord[j];
            coord[j] = coord[i];
            coord[i] = temp;
        }
    }
}

int contarSolucoes(int** sudoku, int tam) {
    int linha = -1, coluna = -1; 
    for (int i = 0; i < tam; i++) { /* busca por celula vazio, valor = 0 */
        for (int j = 0; j < tam; j++) {
            if (sudoku[i][j] == 0) {
                linha = i;
                coluna = j;
                break; /* interrompe o loop colunas */
            }
        }
        if (linha != -1) break; /* interrompe o loop linhas */
    }
    if (linha == -1) return 1; /* retorna 1 solução */

    int contador = 0;
    for (int num = 1; num <= 9; num++) {
        if (eh_valido(sudoku, tam, linha, coluna, num)) {
            sudoku[linha][coluna] = num;            
            contador += contarSolucoes(sudoku, tam);
            if (contador > 1) {
                sudoku[linha][coluna] = 0; /* reseta jogada */
                return 2; /* retorna 2+ soluções */
            }
        }
    }
    sudoku[linha][coluna] = 0;

    return contador;
}

void imprimeSudoku(int** sudoku, int tam){
    for (int i = 0; i < tam; i ++){
        printf("\t");
        for (int j = 0; j < tam; j ++){
            if (sudoku[i][j] == 0) printf("  "); 
            else printf(" %d", sudoku[i][j]);
        }
        printf("\n");
    }
}
