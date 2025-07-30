#include "sudoku_solver.hpp"

FILE* abrirArq(const char* nome) { /* função para abrir um arquivo com a matriz do jogo */
    FILE* arq = fopen(nome, "r"); 
    if (arq == NULL) {
        printf("Erro ao abrir o arquivo %s\n", nome);
        return NULL;
    }
    return arq;
}

void transformaMatriz(FILE* arq, int jogo[N][N]) { /* leitura do arquivo e transformação em uma matriz de inteiros */
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            fscanf(arq, "%d", &jogo[i][j]);
        }
    }
}

void imprimeMatriz(int jogo[N][N]) { /* printar a matriz do jogo */
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            printf("%d ", jogo[i][j]);
        }
        printf("\n");
    }
}

bool resolver_sudoku(int jogo[N][N]) {
    for (int linha = 0; linha < N; linha++) {
        for (int coluna = 0; coluna < N; coluna++) {
            if (jogo[linha][coluna] == 0) { /* para cada linha/coluna que esteja vazia */
                for (int num = 1; num <= N; num++) { /* tenta colocar números de 1 a 9 */
                    if (eh_valido(jogo, linha, coluna, num)) { /* verifica se o número é válido */
                        jogo[linha][coluna] = num; /* coloca o número na posição */

                        if (resolver_sudoku(jogo)) { /* chama recursivamente para resolver o resto do Sudoku */
                            return true;
                        }

                        jogo[linha][coluna] = 0; /* se não for possível resolver, volta e tenta outro número */
                    }
                }
                return false; /* se nenhum número for válido, retorna falso */
            }
        }
    }
    return true; /* se todas as posições foram preenchidas, o Sudoku está resolvido */
}

bool eh_valido(int jogo[N][N], int linha, int coluna, int num){
    for (int i = 0; i < N; i++) {
        if (jogo[linha][i] == num || jogo[i][coluna] == num) { /* verifica se o número já está na linha ou coluna */
            return false;
        }
    }

    /* encontra qual quadrante pertence a linha/coluna */
    int startRow = linha - linha % 3;
    int startCol = coluna - coluna % 3;

    for (int i = 0; i < 3; i++) { /* verifica se o número já está no quadrante 3x3 */
        for (int j = 0; j < 3; j++) {
            if (jogo[i + startRow][j + startCol] == num) {
                return false;
            }
        }
    }

    return true; /* se não encontrou o número em nenhuma linha, coluna ou quadrante, é válido */
}
