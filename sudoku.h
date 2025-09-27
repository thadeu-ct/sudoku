#include <stdio.h>
#include <stdlib.h>
#define N 9

FILE* abrirArq(const char* nome);
void transformaMatriz(FILE* arq, int jogo[N][N]);
void imprimeMatriz(int jogo[N][N]);

bool eh_valido(int jogo[N][N], int linha, int coluna, int num);
bool resolver_sudoku(int jogo[N][N]);