// DOM Elements
const cells = document.querySelectorAll('.cell');
const statusMessage = document.getElementById('status-message');
const resetBtn = document.getElementById('reset-btn');
const aiToggleBtn = document.getElementById('ai-toggle-btn');
const difficultySelector = document.querySelector('.difficulty-selector');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const winModal = document.getElementById('win-modal');
const winnerText = document.getElementById('winner-text');
const winAnimation = document.getElementById('win-animation');
const playAgainBtn = document.getElementById('play-again-btn');

// Game variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let aiActive = false;
let aiDifficulty = 'medium';
let scores = { X: 0, O: 0, Tie: 0 };

// Winning combinations
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Check if all DOM elements are loaded correctly
function checkDOMElements() {
    const elements = [
        { name: 'cells', element: cells, nodeList: true },
        { name: 'statusMessage', element: statusMessage },
        { name: 'resetBtn', element: resetBtn },
        { name: 'aiToggleBtn', element: aiToggleBtn },
        { name: 'difficultySelector', element: difficultySelector },
        { name: 'difficultyBtns', element: difficultyBtns, nodeList: true },
        { name: 'scoreX', element: scoreX },
        { name: 'scoreO', element: scoreO },
        { name: 'winModal', element: winModal },
        { name: 'winnerText', element: winnerText },
        { name: 'winAnimation', element: winAnimation },
        { name: 'playAgainBtn', element: playAgainBtn }
    ];

    let allElementsLoaded = true;
    elements.forEach(item => {
        if (!item.element || (item.nodeList && item.element.length === 0)) {
            console.error(`Element ${item.name} not found!`);
            allElementsLoaded = false;
        }
    });

    return allElementsLoaded;
}

// Event listeners
function setupEventListeners() {
    cells.forEach(cell => cell.addEventListener('click', () => cellClicked(cell)));
    resetBtn.addEventListener('click', resetGame);
    aiToggleBtn.addEventListener('click', toggleAI);
    difficultyBtns.forEach(btn => btn.addEventListener('click', setDifficulty));
    playAgainBtn.addEventListener('click', closeModalAndReset);

    // Add hover effects
    setupHoverEffect();
}

// Initialize the game when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded");
    
    if (checkDOMElements()) {
        setupEventListeners();
        initGame();
        console.log('Game initialized successfully');
    } else {
        console.error('Game initialization failed due to missing DOM elements');
    }
});

// Game functions
function initGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    statusMessage.textContent = `Player ${currentPlayer}'s turn`;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'win-cell');
        cell.style.animation = '';
        cell.style.color = '';
    });
    
    // Add some initial animations
    cells.forEach((cell, index) => {
        setTimeout(() => {
            cell.style.animation = 'fade-in 0.3s ease forwards';
        }, index * 50);
    });
    
    // Debug output
    console.log('Board initialized:', cells.length, 'cells found');
}

function cellClicked(cell) {
    const index = parseInt(cell.getAttribute('data-index'));
    
    console.log(`Cell clicked: index ${index}`);
    
    // Check if cell is already filled or game is not active
    if (board[index] !== '' || !isGameActive) {
        console.log("Cell already filled or game not active");
        return;
    }
    
    // Update the cell
    updateCell(cell, index);
    
    // Check for win or draw
    checkResult();
    
    // AI turn if enabled and game is still active
    if (aiActive && currentPlayer === 'O' && isGameActive) {
        console.log("AI will make a move");
        setTimeout(() => makeAiMove(), 500);
    }
}

function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    
    // Add animation effect
    cell.style.animation = 'pop-in 0.3s ease';
    
    // Set appropriate color
    if (currentPlayer === 'X') {
        cell.style.color = 'var(--x-color)';
    } else {
        cell.style.color = 'var(--o-color)';
    }
    
    // Change player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusMessage.textContent = `Player ${currentPlayer}'s turn`;
    
    console.log(`Updated cell ${index} with ${board[index]}`);
    console.log(`Current board: ${board.join(', ')}`);
}

function checkResult() {
    let roundWon = false;
    let winningCells = [];
    
    // Check for win
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningCells = [a, b, c];
            break;
        }
    }
    
    if (roundWon) {
        const winner = board[winningCells[0]];
        isGameActive = false;
        
        console.log(`Player ${winner} wins!`);
        
        // Update score
        scores[winner]++;
        updateScoreDisplay();
        
        // Highlight winning cells
        winningCells.forEach(index => {
            cells[index].classList.add('win-cell');
        });
        
        // Show win modal
        showWinModal(winner, winningCells);
        
        return;
    }
    
    // Check for draw
    if (!board.includes('')) {
        isGameActive = false;
        scores.Tie++;
        showDrawModal();
        console.log("It's a draw!");
        return;
    }
}

function makeAiMove() {
    if (!isGameActive) return;
    
    let index;
    
    switch (aiDifficulty) {
        case 'easy':
            index = makeRandomMove();
            console.log("AI making easy move");
            break;
        case 'hard':
            index = makeUnbeatableMove();
            console.log("AI making hard move");
            break;
        case 'medium':
        default:
            // 70% chance for smart move, 30% for random
            if (Math.random() < 0.7) {
                index = makeSmartMove();
                console.log("AI making smart move");
            } else {
                index = makeRandomMove();
                console.log("AI making random move (medium difficulty)");
            }
            break;
    }
    
    const cell = cells[index];
    updateCell(cell, index);
    checkResult();
}

function makeRandomMove() {
    // Find all empty cells
    const emptyCells = board.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);
    
    // Pick a random empty cell
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function makeSmartMove() {
    // Try to win or block opponent from winning
    for (let player of ['O', 'X']) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            // Check if two cells are filled by the same player and the third is empty
            if (board[a] === player && board[b] === player && board[c] === '') {
                return c;
            }
            if (board[a] === player && board[c] === player && board[b] === '') {
                return b;
            }
            if (board[b] === player && board[c] === player && board[a] === '') {
                return a;
            }
        }
    }
    
    // Try to take the center if it's empty
    if (board[4] === '') {
        return 4;
    }
    
    // Try to take a corner
    const corners = [0, 2, 6, 8];
    const emptyCorners = corners.filter(index => board[index] === '');
    if (emptyCorners.length > 0) {
        return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    }
    
    // Otherwise make a random move
    return makeRandomMove();
}

function makeUnbeatableMove() {
    // Minimax AI implementation for unbeatable moves
    // First move optimization
    if (board.every(cell => cell === '')) {
        const corners = [0, 2, 6, 8];
        return corners[Math.floor(Math.random() * corners.length)];
    }
    
    return minimax(board, 'O').index;
}

function minimax(newBoard, player) {
    // Get available moves
    const availableMoves = newBoard.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);
    
    // Check for terminal states
    if (checkWinner(newBoard, 'X')) {
        return { score: -10 };
    } else if (checkWinner(newBoard, 'O')) {
        return { score: 10 };
    } else if (availableMoves.length === 0) {
        return { score: 0 };
    }
    
    // Store moves and their evaluation scores
    const moves = [];
    
    // Loop through available moves
    for (let i = 0; i < availableMoves.length; i++) {
        const move = {};
        move.index = availableMoves[i];
        
        // Try the move
        newBoard[availableMoves[i]] = player;
        
        // Get score from the move
        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }
        
        // Reset the move
        newBoard[availableMoves[i]] = '';
        
        // Add move to the array
        moves.push(move);
    }
    
    // Find best move
    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    
    return moves[bestMove];
}

function checkWinner(board, player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    // Add reset animation
    addResetAnimation();
    
    // Reset the game state
    setTimeout(() => {
        initGame();
    }, 300);
}

function toggleAI() {
    aiActive = !aiActive;
    console.log(`AI mode ${aiActive ? 'enabled' : 'disabled'}`);
    
    if (aiActive) {
        aiToggleBtn.classList.add('ai-active');
        aiToggleBtn.innerHTML = '<i class="fas fa-robot"></i> <span>Playing vs AI</span>';
        difficultySelector.style.display = 'block';
        
        // If it's O's turn and AI is active, make AI move
        if (currentPlayer === 'O' && isGameActive) {
            setTimeout(() => makeAiMove(), 500);
        }
    } else {
        aiToggleBtn.classList.remove('ai-active');
        aiToggleBtn.innerHTML = '<i class="fas fa-robot"></i> <span>Play vs AI</span>';
        difficultySelector.style.display = 'none';
    }
}

function setDifficulty(e) {
    const difficulty = e.target.getAttribute('data-difficulty');
    aiDifficulty = difficulty;
    console.log(`AI difficulty set to ${difficulty}`);
    
    // Update active state on buttons
    difficultyBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
}

function updateScoreDisplay() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

function showWinModal(winner, winningCells) {
    winnerText.textContent = `Player ${winner} Wins!`;
    
    // Add the winning symbol to the animation
    winAnimation.textContent = winner;
    winAnimation.className = winner.toLowerCase();
    
    // Create confetti
    createConfetti();
    
    // Show the modal
    winModal.style.display = 'flex';
}

function showDrawModal() {
    winnerText.textContent = 'It\'s a Tie!';
    winAnimation.textContent = '🤝';
    winAnimation.className = '';
    
    // Show the modal
    winModal.style.display = 'flex';
}

function closeModalAndReset() {
    winModal.style.display = 'none';
    resetGame();
}

function createConfetti() {
    const confetti = document.querySelector('.confetti');
    confetti.innerHTML = '';
    
    // Create confetti pieces
    const colors = [
        'var(--primary-color)',
        'var(--accent-color)',
        '#4CAF50',
        '#FFC107',
        '#9C27B0'
    ];
    
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.classList.add('confetti-piece');
        
        // Random position, size, color and animation
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = Math.random() * 3 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        piece.style.width = `${size}px`;
        piece.style.height = `${size}px`;
        piece.style.left = `${left}%`;
        piece.style.backgroundColor = color;
        piece.style.animation = `confetti ${duration}s ease ${delay}s forwards`;
        
        confetti.appendChild(piece);
    }
    
    // Add the confetti animation style
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confetti {
                0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function addResetAnimation() {
    cells.forEach(cell => {
        cell.style.animation = 'fade-in 0.3s ease reverse forwards';
    });
}

// Ensure hover effect is properly set up
function setupHoverEffect() {
    cells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            if (cell.textContent === '' && isGameActive) {
                cell.textContent = currentPlayer;
                cell.style.color = 'rgba(106, 152, 255, 0.3)';
                
                if (currentPlayer === 'O') {
                    cell.style.color = 'rgba(255, 126, 179, 0.3)';
                }
            }
        });
        
        cell.addEventListener('mouseleave', () => {
            if (cell.classList.contains('x') || cell.classList.contains('o')) {
                return;
            }
            cell.textContent = '';
            cell.style.color = '';
        });
    });
    
    console.log('Hover effects initialized');
} 