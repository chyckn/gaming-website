document.addEventListener('DOMContentLoaded', () => {
    const gamesGrid = document.getElementById('gamesGrid');
    const searchBar = document.getElementById('searchGame');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('gameModal');
    const closeBtn = document.querySelector('.close');

    let currentFilter = 'all';
    let filteredGames = games;

    // Render all games initially
    renderGames(games);

    // Search functionality
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filteredGames = games.filter(game => {
            const matchesSearch = game.title.toLowerCase().includes(searchTerm) || 
                                  game.description.toLowerCase().includes(searchTerm);
            const matchesFilter = currentFilter === 'all' || game.category === currentFilter;
            return matchesSearch && matchesFilter;
        });
        renderGames(filteredGames);
    });

    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            
            const searchTerm = searchBar.value.toLowerCase();
            filteredGames = games.filter(game => {
                const matchesSearch = game.title.toLowerCase().includes(searchTerm) || 
                                      game.description.toLowerCase().includes(searchTerm);
                const matchesFilter = currentFilter === 'all' || game.category === currentFilter;
                return matchesSearch && matchesFilter;
            });
            renderGames(filteredGames);
        });
    });

    function renderGames(gamesToRender) {
        gamesGrid.innerHTML = '';
        gamesToRender.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            gameCard.innerHTML = `
                <div class="game-thumbnail">${game.emoji}</div>
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <span class="game-category">${game.category.toUpperCase()}</span>
                    <p class="game-description">${game.description}</p>
                    <div class="game-rating">⭐ ${game.rating}</div>
                    <button class="play-btn" data-game-id="${game.id}">Play Now</button>
                </div>
            `;
            
            gameCard.querySelector('.play-btn').addEventListener('click', () => {
                openGame(game);
            });
            
            gamesGrid.appendChild(gameCard);
        });
    }

    function openGame(game) {
        const gameContainer = document.getElementById('gameContainer');
        const playerName = localStorage.getItem('playerName') || prompt('Enter your name:') || 'Player';
        if (playerName !== 'Player') {
            localStorage.setItem('playerName', playerName);
        }

        gameContainer.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h2>${game.emoji} ${game.title}</h2>
                <p>${gameDescriptions[game.id]}</p>
                <div id="gameFrame" style="background: #f0f0f0; border-radius: 10px; padding: 20px; margin: 20px 0; min-height: 400px;">
                    <p style="color: #666;">Game loading...</p>
                </div>
                <div class="leaderboard">
                    <h3>🏆 Top Scores</h3>
                    ${leaderboard.renderLeaderboard(game.id)}
                </div>
            </div>
        `;

        modal.style.display = 'block';
        loadGame(game.id);
    }

    function loadGame(gameId) {
        const gameFrame = document.getElementById('gameFrame');
        
        // Load game-specific HTML
        const gameHTML = getGameHTML(gameId);
        gameFrame.innerHTML = gameHTML;
        
        // Initialize game
        initializeGame(gameId);
    }

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Game HTML templates
function getGameHTML(gameId) {
    const games = {
        'tic-tac-toe': `
            <div style="max-width: 300px; margin: 0 auto;">
                <div id="tictactoeBoard" style="display: grid; grid-template-columns: repeat(3, 100px); gap: 5px; margin: 20px 0;">
                    ${Array(9).fill(0).map((_, i) => `<button class="ttt-cell" data-index="${i}" style="width: 100px; height: 100px; font-size: 24px; cursor: pointer; border: 2px solid #667eea; background: white; border-radius: 5px;"></button>`).join('')}
                </div>
                <div id="tictactoeStatus" style="text-align: center; margin: 20px 0; font-size: 18px; font-weight: bold;">You are X</div>
                <button id="resetTTT" style="width: 100%; padding: 10px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">New Game</button>
            </div>
        `,
        'snake': `
            <div style="text-align: center;">
                <canvas id="snakeCanvas" width="400" height="400" style="border: 2px solid #667eea; background: #222; border-radius: 5px;"></canvas>
                <div style="margin-top: 15px;">
                    <p>Score: <span id="snakeScore">0</span></p>
                    <button id="resetSnake" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">New Game</button>
                </div>
            </div>
        `,
        'memory': `
            <div style="max-width: 400px; margin: 0 auto;">
                <div id="memoryBoard" style="display: grid; grid-template-columns: repeat(4, 80px); gap: 10px; margin: 20px 0;">
                    ${Array(16).fill(0).map((_, i) => `<button class="memory-card" data-index="${i}" style="width: 80px; height: 80px; font-size: 30px; cursor: pointer; border: 2px solid #667eea; background: #667eea; color: white; border-radius: 5px; transition: all 0.3s;">?</button>`).join('')}
                </div>
                <div style="text-align: center; margin: 20px 0;">
                    <p>Matches: <span id="memoryMatches">0</span> / 8</p>
                    <button id="resetMemory" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">New Game</button>
                </div>
            </div>
        `,
        'flappy-bird': `
            <div style="text-align: center;">
                <canvas id="flappyCanvas" width="400" height="500" style="border: 2px solid #667eea; background: #87ceeb; border-radius: 5px; display: block; margin: 0 auto;"></canvas>
                <div style="margin-top: 15px;">
                    <p>Score: <span id="flappyScore">0</span></p>
                    <p style="color: #666; font-size: 0.9em;">Click or press SPACE to flap</p>
                    <button id="resetFlappy" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">New Game</button>
                </div>
            </div>
        `,
        '2048': `
            <div style="max-width: 350px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <p style="color: #666; font-size: 0.9em;">Score</p>
                        <p style="font-size: 24px; font-weight: bold;" id="score2048">0</p>
                    </div>
                    <button id="reset2048" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">New Game</button>
                </div>
                <div id="game2048" style="background: #bbada0; border-radius: 5px; padding: 10px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                    ${Array(16).fill(0).map((_, i) => `<div class="tile-2048" data-index="${i}" style="background: #cdc1b4; border-radius: 5px; width: 100%; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; color: #776e65; transition: all 0.1s;"></div>`).join('')}
                </div>
            </div>
        `,
        'hangman': `
            <div style="max-width: 400px; margin: 0 auto;">
                <div style="text-align: center; margin: 20px 0;">
                    <p style="font-size: 24px; letter-spacing: 5px; font-family: monospace;" id="hangmanWord">_ _ _ _ _</p>
                    <p>Wrong guesses: <span id="hangmanWrong">0</span> / 6</p>
                </div>
                <div id="hangmanLetters" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(40px, 1fr)); gap: 5px; margin: 20px 0;">
                    ${Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(letter => `<button class="hangman-letter" data-letter="${letter}" style="padding: 8px; background: #667eea; color: white; border: none; border-radius: 3px; cursor: pointer;">${letter}</button>`).join('')}
                </div>
                <div style="text-align: center;">
                    <button id="resetHangman" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">New Game</button>
                </div>
            </div>
        `,
        'default': `
            <div style="text-align: center; padding: 40px;">
                <p style="font-size: 24px; margin-bottom: 20px;">🎮 Game Coming Soon!</p>
                <p>This game is being developed. Check back soon!</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Go Back</button>
            </div>
        `
    };
    return games[gameId] || games['default'];
}

function initializeGame(gameId) {
    switch(gameId) {
        case 'tic-tac-toe':
            initTicTacToe();
            break;
        case 'snake':
            initSnake();
            break;
        case 'memory':
            initMemory();
            break;
        case 'flappy-bird':
            initFlappyBird();
            break;
        case '2048':
            init2048();
            break;
        case 'hangman':
            initHangman();
            break;
        default:
            console.log(`Game ${gameId} not yet implemented`);
    }
}

// Tic Tac Toe Game
function initTicTacToe() {
    const cells = document.querySelectorAll('.ttt-cell');
    const statusDiv = document.getElementById('tictactoeStatus');
    const resetBtn = document.getElementById('resetTTT');
    let board = Array(9).fill(null);
    let isXNext = true;
    let gameOver = false;

    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const updateBoard = () => {
        cells.forEach((cell, index) => {
            cell.textContent = board[index] || '';
        });
        const winner = calculateWinner(board);
        if (winner) {
            statusDiv.textContent = `${winner} Wins!`;
            gameOver = true;
        } else if (board.every(cell => cell !== null)) {
            statusDiv.textContent = "It's a Draw!";
            gameOver = true;
        } else {
            statusDiv.textContent = `${isXNext ? 'X' : 'O'}'s Turn`;
        }
    };

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            if (board[index] === null && !gameOver) {
                board[index] = isXNext ? 'X' : 'O';
                isXNext = !isXNext;
                updateBoard();
            }
        });
    });

    resetBtn.addEventListener('click', () => {
        board = Array(9).fill(null);
        isXNext = true;
        gameOver = false;
        updateBoard();
    });

    updateBoard();
}

// Snake Game
function initSnake() {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('snakeScore');
    const resetBtn = document.getElementById('resetSnake');

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let direction = { x: 1, y: 0 };
    let nextDirection = { x: 1, y: 0 };
    let score = 0;
    let gameRunning = true;

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && direction.y === 0) nextDirection = { x: 0, y: -1 };
        if (e.key === 'ArrowDown' && direction.y === 0) nextDirection = { x: 0, y: 1 };
        if (e.key === 'ArrowLeft' && direction.x === 0) nextDirection = { x: -1, y: 0 };
        if (e.key === 'ArrowRight' && direction.x === 0) nextDirection = { x: 1, y: 0 };
    });

    const update = () => {
        direction = nextDirection;
        const head = snake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        if (newHead.x < 0 || newHead.x >= tileCount || newHead.y < 0 || newHead.y >= tileCount) {
            gameRunning = false;
            alert(`Game Over! Final Score: ${score}`);
            return;
        }

        for (let i = 0; i < snake.length; i++) {
            if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
                gameRunning = false;
                alert(`Game Over! Final Score: ${score}`);
                return;
            }
        }

        snake.unshift(newHead);

        if (newHead.x === food.x && newHead.y === food.y) {
            score += 10;
            scoreDisplay.textContent = score;
            food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
        } else {
            snake.pop();
        }
    };

    const draw = () => {
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff00';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
        });

        ctx.fillStyle = '#ff0000';
        ctx.fillRect(food.x * gridSize + 1, food.y * gridSize + 1, gridSize - 2, gridSize - 2);
    };

    const gameLoop = () => {
        update();
        draw();
        if (gameRunning) setTimeout(gameLoop, 100);
    };

    resetBtn.addEventListener('click', () => {
        snake = [{ x: 10, y: 10 }];
        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };
        score = 0;
        scoreDisplay.textContent = score;
        gameRunning = true;
        gameLoop();
    });

    gameLoop();
}

// Memory Game
function initMemory() {
    const symbols = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍋', '🍉', '🍒'];
    const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    const buttons = document.querySelectorAll('.memory-card');
    const matchesDisplay = document.getElementById('memoryMatches');
    const resetBtn = document.getElementById('resetMemory');

    let flipped = [];
    let matched = 0;
    let lockBoard = false;

    buttons.forEach((button, index) => {
        button.dataset.card = cards[index];
        button.addEventListener('click', () => flipCard(button, index));
    });

    function flipCard(button, index) {
        if (lockBoard || flipped.includes(index) || button.textContent !== '?') return;
        button.textContent = button.dataset.card;
        button.style.background = 'white';
        button.style.color = 'black';
        flipped.push(index);

        if (flipped.length === 2) {
            lockBoard = true;
            const [first, second] = flipped;
            if (cards[first] === cards[second]) {
                matched++;
                matchesDisplay.textContent = matched;
                flipped = [];
                lockBoard = false;
                if (matched === 8) {
                    alert(`Congratulations! You won!`);
                }
            } else {
                setTimeout(() => {
                    buttons[first].textContent = '?';
                    buttons[first].style.background = '#667eea';
                    buttons[first].style.color = 'white';
                    buttons[second].textContent = '?';
                    buttons[second].style.background = '#667eea';
                    buttons[second].style.color = 'white';
                    flipped = [];
                    lockBoard = false;
                }, 600);
            }
        }
    }

    resetBtn.addEventListener('click', () => {
        location.reload();
    });
}

// Flappy Bird Game
function initFlappyBird() {
    const canvas = document.getElementById('flappyCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('flappyScore');
    const resetBtn = document.getElementById('resetFlappy');

    let bird = { x: 50, y: 250, width: 30, height: 30, dy: 0 };
    let pipes = [];
    let score = 0;
    let gameOver = false;
    const gravity = 0.6;
    const pipeGap = 120;
    const pipeWidth = 60;

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            bird.dy = -12;
        }
    });
    canvas.addEventListener('click', () => {
        bird.dy = -12;
    });

    const generatePipe = () => {
        const pipeY = Math.random() * (canvas.height - pipeGap - 100) + 50;
        pipes.push({ x: canvas.width, y: pipeY });
    };

    const update = () => {
        bird.dy += gravity;
        bird.y += bird.dy;

        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            gameOver = true;
        }

        pipes.forEach(pipe => {
            pipe.x -= 5;
            if (pipe.x + pipeWidth < bird.x && !pipe.scored) {
                pipe.scored = true;
                score++;
                scoreDisplay.textContent = score;
            }

            if (bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x) {
                if (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap) {
                    gameOver = true;
                }
            }
        });

        pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

        if (pipes.length === 0 || pipes[pipes.length - 1].x < 150) {
            generatePipe();
        }
    };

    const draw = () => {
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(bird.x, bird.y, bird.width / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#228B22';
        pipes.forEach(pipe => {
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
            ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - (pipe.y + pipeGap));
        });

        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 30);
    };

    const gameLoop = () => {
        update();
        draw();
        if (!gameOver) {
            requestAnimationFrame(gameLoop);
        } else {
            alert(`Game Over! Final Score: ${score}`);
        }
    };

    resetBtn.addEventListener('click', () => {
        bird = { x: 50, y: 250, width: 30, height: 30, dy: 0 };
        pipes = [];
        score = 0;
        scoreDisplay.textContent = score;
        gameOver = false;
        gameLoop();
    });

    gameLoop();
}

// 2048 Game
function init2048() {
    const tiles = document.querySelectorAll('.tile-2048');
    const scoreDisplay = document.getElementById('score2048');
    const resetBtn = document.getElementById('reset2048');
    let board = Array(16).fill(0);
    let score = 0;

    const addNewTile = () => {
        let empty = board.map((val, idx) => val === 0 ? idx : null).filter(val => val !== null);
        if (empty.length > 0) {
            const randomIndex = empty[Math.floor(Math.random() * empty.length)];
            board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
        }
    };

    const renderBoard = () => {
        tiles.forEach((tile, idx) => {
            const value = board[idx];
            tile.textContent = value || '';
            tile.style.background = value ? `hsl(${Math.log2(value) * 30}, 70%, 60%)` : '#cdc1b4';
        });
    };

    const move = (direction) => {
        let moved = false;
        const newBoard = Array(16).fill(0);
        const rows = [0, 4, 8, 12];
        const cols = [0, 1, 2, 3];

        if (direction === 'left' || direction === 'right') {
            rows.forEach(row => {
                let line = [board[row], board[row + 1], board[row + 2], board[row + 3]].filter(v => v !== 0);
                if (direction === 'right') line.reverse();
                for (let i = 0; i < line.length - 1; i++) {
                    if (line[i] === line[i + 1]) {
                        line[i] *= 2;
                        score += line[i];
                        line.splice(i + 1, 1);
                    }
                }
                while (line.length < 4) direction === 'right' ? line.unshift(0) : line.push(0);
                if (direction === 'right') line.reverse();
                line.forEach((val, idx) => newBoard[row + idx] = val);
            });
            moved = JSON.stringify(board) !== JSON.stringify(newBoard);
        }
        board = newBoard;
        if (moved) addNewTile();
        scoreDisplay.textContent = score;
        renderBoard();
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') move('left');
        if (e.key === 'ArrowRight') move('right');
    });

    resetBtn.addEventListener('click', () => {
        board = Array(16).fill(0);
        score = 0;
        addNewTile();
        addNewTile();
        scoreDisplay.textContent = score;
        renderBoard();
    });

    addNewTile();
    addNewTile();
    renderBoard();
}

// Hangman Game
function initHangman() {
    const wordDisplay = document.getElementById('hangmanWord');
    const wrongDisplay = document.getElementById('hangmanWrong');
    const letterButtons = document.querySelectorAll('.hangman-letter');
    const resetBtn = document.getElementById('resetHangman');
    const words = ['JAVASCRIPT', 'PROGRAMMING', 'DEVELOPER', 'WEBSITE', 'COMPUTER', 'ALGORITHM'];
    let word = words[Math.floor(Math.random() * words.length)];
    let guessed = [];
    let wrong = 0;
    let gameOver = false;

    const updateDisplay = () => {
        const display = word.split('').map(letter => guessed.includes(letter) ? letter : '_').join(' ');
        wordDisplay.textContent = display;
        wrongDisplay.textContent = wrong;
    };

    letterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const letter = button.dataset.letter;
            if (guessed.includes(letter) || gameOver) return;
            guessed.push(letter);
            button.disabled = true;
            button.style.opacity = '0.5';

            if (!word.includes(letter)) {
                wrong++;
            }

            if (wrong >= 6) {
                alert(`Game Over! The word was: ${word}`);
                gameOver = true;
            } else if (word.split('').every(l => guessed.includes(l))) {
                alert(`You Won! The word was: ${word}`);
                gameOver = true;
            }

            updateDisplay();
        });
    });

    resetBtn.addEventListener('click', () => {
        location.reload();
    });

    updateDisplay();
}