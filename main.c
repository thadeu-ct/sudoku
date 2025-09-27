#include "sudoku.h"

int main(){
    int jogo[N][N];
    FILE* arq = abrirArq("sudoku.txt");
    if(arq == NULL) return 1;

    transformaMatriz(arq, jogo);
    fclose(arq);

    if(resolver_sudoku(jogo)){
        printf("Sudoku resolvido:\n");
        imprimeMatriz(jogo);
    } else {
        printf("Nao foi possivel resolver o Sudoku.\n");
    }
    
    return 0;
}