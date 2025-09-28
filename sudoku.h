typedef struct coordenada Coord;
struct coordenada {
    int linha;
    int col;
};

int** inicializaSudoku(int tam);
void liberaSudoku(int** sudoku, int tam);
void gerarSudoku(int** sudoku, int** resposta, int tam, int nivel);
int preencherSudoku(int** sudoku, int tam);
void remover_celulas(int** sudoku, int tam, int celulas_remover);
void embaralhar(int *vetor, int n);
int eh_valido(int** sudoku, int tam, int linha, int coluna, int num);
void embaralhar_coordenadas(Coord* coord, int n);
int contarSolucoes(int** sudoku, int tam);
void imprimeSudoku(int** sudoku, int tam);