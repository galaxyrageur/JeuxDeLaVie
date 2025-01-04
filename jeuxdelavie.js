const GRID_WIDTH = 71;
const GRID_HEIGHT = 71;
const CELL_SIZE = 10;
const DELAY = 100;  // Délai en millisecondes entre chaque calcul

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let grid = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
let running = false;
let color = document.getElementById('color');

let isMouseDown = false;
let toggleToState = null; // État à appliquer pendant le clic-glissé

// Dessine la grille sur le canvas
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            ctx.fillStyle = grid[y][x] === 1 ? 'black' : sessionStorage.getItem("color") ?? color.value;
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            ctx.strokeStyle = 'gray';
            ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }
}
color.addEventListener('click', (event) => {
    console.log(color.value)
    sessionStorage.setItem("color", color.value);
    drawGrid();
});
// Change l'état d'une cellule
function setCellState(x, y, state) {
    if (x >= 0 && y >= 0 && x < GRID_WIDTH && y < GRID_HEIGHT) {
        grid[y][x] = state;
        drawGrid();
    }
}

// Gestion des événements de souris
canvas.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    const x = Math.floor(event.offsetX / CELL_SIZE);
    const y = Math.floor(event.offsetY / CELL_SIZE);
    toggleToState = grid[y][x] === 1 ? 0 : 1; // Déterminer l'état à appliquer
    setCellState(x, y, toggleToState);
});

canvas.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
        const x = Math.floor(event.offsetX / CELL_SIZE);
        const y = Math.floor(event.offsetY / CELL_SIZE);
        setCellState(x, y, toggleToState);
    }
});

canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});

canvas.addEventListener('mouseleave', () => {
    isMouseDown = false;
});

// Démarre ou arrête le jeu
document.getElementById('startButton').addEventListener('click', () => {
    running = !running;
    document.getElementById('startButton').textContent = running ? 'Arrêter' : 'Démarrer';
    if (running) {
        runGame();
    }
});

// Réinitialise la grille
document.getElementById('resetButton').addEventListener('click', () => {
    grid = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
    drawGrid();
});

// Exécute une itération du jeu de la vie
function runGame() {
    if (!running) return;
    updateGrid();
    drawGrid();
    setTimeout(runGame, DELAY);
}

// Met à jour la grille en appliquant les règles du jeu de la vie
function updateGrid() {
    const newGrid = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));

    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            const neighbors = countNeighbors(x, y);
            if (grid[y][x] === 1) {
                if (neighbors < 2 || neighbors > 3) {
                    newGrid[y][x] = 0;
                } else {
                    newGrid[y][x] = 1;
                }
            } else {
                if (neighbors === 3) {
                    newGrid[y][x] = 1;
                }
            }
        }
    }
    grid = newGrid;
}

// Compte les voisins vivants autour d'une cellule
function countNeighbors(x, y) {
    let neighbors = 0;
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < GRID_WIDTH && ny < GRID_HEIGHT) {
                neighbors += grid[ny][nx];
            }
        }
    }
    return neighbors;
}

// Initialisation du jeu
drawGrid();

