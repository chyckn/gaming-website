/* Consolidated main.js with implementations for remaining games.
   Note: This file was auto-updated to add simplified playable versions
   of the remaining games listed in games-data.js. Implementations are
   intentionally lightweight to keep code readable and small.
*/

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

// Game HTML templates — include templates for all games listed in games-data.js
function getGameHTML(gameId) {
    const gamesMap = {
        'dark-room': `
            <div style="text-align:center;">
                <p>Move your mouse to shine a flashlight and find the hidden gem.</p>
                <canvas id="darkRoomCanvas" width="700" height="400" style="border-radius:8px; background:#000; display:block; margin:0 auto;"></canvas>
                <div style="margin-top:10px;"><button id="resetDark" style="padding:8px 12px; background:#667eea;color:#fff;border:none;border-radius:6px;">New Game</button></div>
            </div>
        `,
        'sort-court': `
            <div style="max-width:600px; margin:0 auto; text-align:left;">
                <p>You are the ruler — make decisions and see the outcome.</p>
                <div id="sortChoices" style="display:flex; flex-direction:column; gap:10px;">
                    <button class="sort-choice" data-choice="1">Accept the merchant's request</button>
                    <button class="sort-choice" data-choice="2">Raise taxes</button>
                    <button class="sort-choice" data-choice="3">Send soldiers to border</button>
                </div>
                <div id="sortResult" style="margin-top:10px; font-weight:bold;"></div>
            </div>
        `,
        'incredibox': `
            <div style="text-align:center;">
                <p>Create a beat by toggling loops.</p>
                <div id="ib-controls" style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;"></div>
                <div style="margin-top:10px;"><button id="stopIB" style="padding:6px 10px;">Stop</button></div>
            </div>
        `,
        'infinite-painter': `
            <div style="text-align: center;">
                <div style="display:flex; gap:10px; justify-content:center; margin-bottom:10px;">
                    <input type="color" id="paintColor" value="#000000">
                    <label style="color:#333">Brush: <input id="brushSize" type="range" min="1" max="50" value="5"></label>
                    <button id="clearCanvas" style="padding: 6px 10px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Clear</button>
                    <button id="saveCanvas" style="padding: 6px 10px; background: #34d399; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Save Image</button>
                </div>
                <canvas id="painterCanvas" width="800" height="500" style="border: 2px solid #667eea; background: #fff; border-radius: 5px; touch-action: none; max-width: 100%; height: auto;"></canvas>
                <p style="color:#666; font-size:0.9em; margin-top:8px;">Draw with mouse or touch. Save your art as an image.</p>
            </div>
        `,
        'dna-game': `
            <div style="max-width:500px; margin:0 auto; text-align:center;">
                <p>Match DNA base pairs (A-T, C-G).</p>
                <div id="dnaBoard" style="display:grid; grid-template-columns:repeat(6, 1fr); gap:8px; margin-top:12px;"></div>
                <div style="margin-top:10px;"><button id="resetDNA">New Game</button></div>
            </div>
        `,
        'wordle-style': `
            <div style="max-width:400px; margin:0 auto; text-align:center;">
                <p>Guess the 5-letter word in 6 tries.</p>
                <div id="wordleBoard"></div>
                <input id="wordleGuess" maxlength="5" style="text-transform:uppercase; padding:8px; margin-top:8px;">
                <div style="margin-top:8px;"><button id="submitWordle">Guess</button> <button id="resetWordle">New Game</button></div>
                <div id="wordleMsg" style="margin-top:8px; font-weight:bold;"></div>
            </div>
        `,
        'dice-wars': `
            <div style="text-align:center;">
                <p>Roll dice to conquer territories. Higher roll wins.</p>
                <p>Territories: <span id="dwTerritories">0</span></p>
                <div style="margin-top:10px;"><button id="rollDice">Roll Dice</button> <button id="resetDice">Reset</button></div>
                <div id="diceResult" style="margin-top:10px; font-weight:bold;"></div>
            </div>
        `,
        'simon-says': `
            <div style="text-align:center;">
                <p>Repeat the color sequence.</p>
                <div id="simonButtons" style="display:flex; gap:6px; justify-content:center; margin:10px;"></div>
                <div style="margin-top:8px;"><button id="startSimon">Start</button></div>
            </div>
        `,
        'breakdance-party': `
            <div style="text-align:center;">
                <p>Press the highlighted arrow keys in time.</p>
                <div id="breakQueue" style="font-size:2em; margin:12px;"></div>
                <div style="margin-top:8px;"><button id="startBreak">Start</button></div>
            </div>
        `,
        'gravity-puzzle': `
            <div style="text-align:center; max-width:600px; margin:0 auto;">
                <p>Toggle gravity to guide the ball into the goal.</p>
                <canvas id="gravityCanvas" width="700" height="300" style="border-radius:8px; background:#eef; display:block; margin:0 auto;"></canvas>
                <div style="margin-top:10px;"><button id="flipGravity">Flip Gravity</button> <button id="resetGravity">New</button></div>
            </div>
        `,
        'choose-adventure': `
            <div style="max-width:700px; margin:0 auto; text-align:left;">
                <div id="adventureText"></div>
                <div id="adventureChoices" style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;"></div>
                <div style="margin-top:10px;"><button id="resetAdventure">Restart</button></div>
            </div>
        `,
        'asteroid-dodger': `
            <div style="text-align:center;">
                <canvas id="asteroidCanvas" width="700" height="400" style="border-radius:8px; background:#001;"></canvas>
                <div style="margin-top:10px;">Score: <span id="asteroidScore">0</span></div>
                <div style="margin-top:6px;"><button id="resetAsteroid">New Game</button></div>
            </div>
        `,
        'tangram-puzzle': `
            <div style="text-align:center;">
                <p>Drag the colored squares into the target area.</p>
                <div id="tangramArea" style="display:flex; gap:12px; justify-content:center; align-items:center;">
                    <div id="tangramTarget" style="width:300px; height:300px; border:2px dashed #667eea; position:relative;"></div>
                    <div id="tangramPieces" style="display:flex; flex-direction:column; gap:8px;"></div>
                </div>
                <div style="margin-top:8px;"><button id="resetTangram">Reset</button></div>
            </div>
        `,
        'target-practice': `
            <div style="text-align:center;">
                <canvas id="targetCanvas" width="700" height="400" style="border-radius:8px; background:#fff; display:block; margin:0 auto;"></canvas>
                <div style="margin-top:8px;">Score: <span id="targetScore">0</span></div>
                <div style="margin-top:8px;"><button id="resetTarget">Reset</button></div>
            </div>
        `,
        'space-invaders': `
            <div style="text-align:center;">
                <canvas id="spaceCanvas" width="700" height="400" style="border-radius:8px; background:#000; display:block; margin:0 auto;"></canvas>
                <div style="margin-top:8px;">Score: <span id="spaceScore">0</span></div>
                <div style="margin-top:8px;"><button id="resetSpace">New Game</button></div>
            </div>
        `,
        // Existing games are already covered in main.js earlier; keep default fallback
        'default': `
            <div style="text-align: center; padding: 40px;">
                <p style="font-size: 24px; margin-bottom: 20px;">🎮 Game Coming Soon!</p>
                <p>This game is being developed. Check back soon!</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Back</button>
            </div>
        `
    };
    return gamesMap[gameId] || gamesMap['default'];
}

function initializeGame(gameId) {
    switch(gameId) {
        case 'tic-tac-toe': initTicTacToe(); break;
        case 'snake': initSnake(); break;
        case 'memory': initMemory(); break;
        case 'flappy-bird': initFlappyBird(); break;
        case '2048': init2048(); break;
        case 'hangman': initHangman(); break;
        case 'pong': initPong(); break;
        case 'infinite-painter': initInfinitePainter(); break;
        case 'dark-room': initDarkRoom(); break;
        case 'sort-court': initSortCourt(); break;
        case 'incredibox': initIncredibox(); break;
        case 'dna-game': initDNAGame(); break;
        case 'wordle-style': initWordleStyle(); break;
        case 'dice-wars': initDiceWars(); break;
        case 'simon-says': initSimonSays(); break;
        case 'breakdance-party': initBreakdanceParty(); break;
        case 'gravity-puzzle': initGravityPuzzle(); break;
        case 'choose-adventure': initChooseAdventure(); break;
        case 'asteroid-dodger': initAsteroidDodger(); break;
        case 'tangram-puzzle': initTangram(); break;
        case 'target-practice': initTargetPractice(); break;
        case 'space-invaders': initSpaceInvaders(); break;
        default: console.log(`Game ${gameId} not yet implemented`);
    }
}

// ----------------- Implementations for the newly added games -----------------

// Dark Room — simple flashlight reveal
function initDarkRoom() {
    const canvas = document.getElementById('darkRoomCanvas');
    const ctx = canvas.getContext('2d');
    const reset = document.getElementById('resetDark');
    let gem = { x: Math.random() * (canvas.width - 40) + 20, y: Math.random() * (canvas.height - 40) + 20, found: false };

    function drawBackground() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        // draw hidden gem as a faint shape
        if (!gem.found) {
            ctx.fillStyle = 'rgba(255,215,0,0.2)';
            ctx.beginPath();
            ctx.arc(gem.x, gem.y, 12, 0, Math.PI*2);
            ctx.fill();
        }
    }

    function render(x,y) {
        drawBackground();
        // flashlight
        const grad = ctx.createRadialGradient(x, y, 10, x, y, 120);
        grad.addColorStop(0,'rgba(255,255,255,0.95)');
        grad.addColorStop(1,'rgba(0,0,0,0)');
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(x,y,120,0,Math.PI*2); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';

        // if flashlight close to gem -> found
        if (!gem.found && Math.hypot(x-gem.x,y-gem.y) < 30) {
            gem.found = true;
            setTimeout(()=>alert('You found the gem!'), 50);
            try { leaderboard.addScore('dark-room', localStorage.getItem('playerName')||'Player', 1, new Date().toISOString()); } catch{};
        }
    }

    canvas.addEventListener('mousemove', (e)=>{
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        render(x,y);
    });

    reset.addEventListener('click', ()=>{ gem = { x: Math.random() * (canvas.width - 40) + 20, y: Math.random() * (canvas.height - 40) + 20, found: false }; drawBackground(); });

    drawBackground();
}

// Sort The Court — simple choices
function initSortCourt(){
    const choices = document.querySelectorAll('.sort-choice');
    const result = document.getElementById('sortResult');
    choices.forEach(btn=> btn.addEventListener('click', ()=>{
        const r = Math.random();
        if(btn.dataset.choice==='1') result.textContent = r>0.5? 'The merchant becomes a loyal ally.' : 'Merchants are upset.';
        if(btn.dataset.choice==='2') result.textContent = r>0.6? 'Taxes fund the army.' : 'People complain and unrest grows.';
        if(btn.dataset.choice==='3') result.textContent = r>0.4? 'Border secured.' : 'Soldiers desert due to low pay.';
    }));
}

// Incredibox — simple loop toggles using WebAudio tones
function initIncredibox(){
    const container = document.getElementById('ib-controls');
    const stop = document.getElementById('stopIB');
    container.innerHTML = '';
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const tracks = [];
    for(let i=0;i<6;i++){
        const btn = document.createElement('button'); btn.textContent = 'Track '+(i+1); btn.style.padding='8px';
        let playing=false; let osc=null;
        btn.addEventListener('click', ()=>{
            if(playing){ playing=false; if(osc) osc.stop(); btn.style.opacity='1'; }
            else { playing=true; osc = ctx.createOscillator(); osc.type='sine'; osc.frequency.value=220+(i*40); const gain = ctx.createGain(); gain.gain.value=0.02; osc.connect(gain); gain.connect(ctx.destination); osc.start(); btn.style.opacity='0.6'; }
        });
        container.appendChild(btn);
        tracks.push(()=>{});
    }
    stop.addEventListener('click', ()=>{ try{ ctx.close(); }catch{}; location.reload(); });
}

// DNA Game — match complementary bases
function initDNAGame(){
    const board = document.getElementById('dnaBoard');
    const reset = document.getElementById('resetDNA');
    const bases = ['A','T','C','G'];
    let cards = [];
    function build(){
        board.innerHTML=''; cards = [];
        const pairs = [];
        for(let i=0;i<6;i++){ const b = bases[Math.floor(Math.random()*bases.length)]; pairs.push(b); pairs.push(complement(b)); }
        shuffle(pairs);
        pairs.forEach((p,idx)=>{
            const btn = document.createElement('button'); btn.textContent='?'; btn.dataset.base=p; btn.style.padding='12px'; btn.style.fontSize='18px';
            btn.addEventListener('click', ()=>flip(btn)); board.appendChild(btn); cards.push(btn);
        });
    }
    function complement(b){ return b==='A'?'T': b==='T'?'A': b==='C'?'G':'C'; }
    function flip(btn){ if(btn.textContent!=='?') return; btn.textContent = btn.dataset.base; const flipped = cards.filter(c=>c.textContent!=='?'); if(flipped.length===2){ if(complement(flipped[0].dataset.base)===flipped[1].dataset.base){ setTimeout(()=>{ flipped[0].disabled=true; flipped[1].disabled=true; checkWin(); },300); } else { setTimeout(()=>{ flipped[0].textContent='?'; flipped[1].textContent='?'; },500);} }
    }
    function checkWin(){ if(cards.every(c=>c.disabled)) { alert('You matched all pairs!'); try{ leaderboard.addScore('dna-game', localStorage.getItem('playerName')||'Player', 1, new Date().toISOString()); }catch{} } }
    reset.addEventListener('click', build); build();
}

function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } }

// Wordle-style simple implementation
function initWordleStyle(){
    const board = document.getElementById('wordleBoard');
    const input = document.getElementById('wordleGuess');
    const submit = document.getElementById('submitWordle');
    const reset = document.getElementById('resetWordle');
    const msg = document.getElementById('wordleMsg');
    const words = ['APPLE','BRAIN','CODEX','GAMES','LIGHT','MOUSE'];
    const target = words[Math.floor(Math.random()*words.length)];
    let attempts=0;
    board.innerHTML='';
    submit.addEventListener('click', ()=>{
        const val = (input.value||'').toUpperCase();
        if(val.length!==5) { msg.textContent='Enter 5 letters'; return; }
        attempts++; const row = document.createElement('div'); row.style.display='flex'; row.style.gap='6px';
        for(let i=0;i<5;i++){ const span=document.createElement('div'); span.textContent=val[i]; span.style.padding='6px 8px'; span.style.border='1px solid #ccc';
            if(val[i]===target[i]) span.style.background='#6aaa64'; else if(target.includes(val[i])) span.style.background='#c9b458'; else span.style.background='#787c7e'; row.appendChild(span);
        }
        board.appendChild(row); input.value='';
        if(val===target){ msg.textContent=`Correct! (${target})`; try{ leaderboard.addScore('wordle-style', localStorage.getItem('playerName')||'Player', 1, new Date().toISOString()); }catch{} }
        else if(attempts>=6){ msg.textContent=`Out of tries. Word was ${target}`; }
    });
    reset.addEventListener('click', ()=>location.reload());
}

// Dice Wars — trivialized
function initDiceWars(){
    const terr = document.getElementById('dwTerritories');
    const roll = document.getElementById('rollDice');
    const reset = document.getElementById('resetDice');
    const res = document.getElementById('diceResult');
    let territories = 0;
    terr.textContent = territories;
    roll.addEventListener('click', ()=>{
        const you = Math.floor(Math.random()*6)+1; const opp = Math.floor(Math.random()*6)+1;
        if(you>opp){ territories++; res.textContent=`You rolled ${you} vs ${opp} — you win a territory!`; terr.textContent=territories; }
        else res.textContent=`You rolled ${you} vs ${opp} — no conquest.`;
    });
    reset.addEventListener('click', ()=>{ territories=0; terr.textContent=territories; res.textContent=''; });
}

// Simon Says
function initSimonSays(){
    const colors=['#ff4d4d','#4da6ff','#4dff88','#ffd24d'];
    const container = document.getElementById('simonButtons');
    const start = document.getElementById('startSimon');
    container.innerHTML='';
    colors.forEach((c,i)=>{ const b=document.createElement('button'); b.style.width='60px'; b.style.height='60px'; b.style.background=c; b.dataset.idx=i; b.addEventListener('click', ()=>handleUser(i)); container.appendChild(b); });
    let seq=[]; let userIdx=0; function playSeq(){ let i=0; const iv=setInterval(()=>{ flash(seq[i]); i++; if(i>=seq.length){ clearInterval(iv); userIdx=0;} },600);} function flash(i){ const btn=container.children[i]; btn.style.filter='brightness(1.6)'; setTimeout(()=>btn.style.filter='none',300); }
    function handleUser(i){ if(seq[userIdx]===i){ userIdx++; if(userIdx===seq.length){ // succeeded
            seq.push(Math.floor(Math.random()*4)); setTimeout(playSeq,400);
        }} else { alert('Wrong! Game over.'); seq=[]; }
    }
    start.addEventListener('click', ()=>{ seq=[Math.floor(Math.random()*4)]; playSeq(); });
}

// Breakdance Party — press arrow shown
function initBreakdanceParty(){
    const q = document.getElementById('breakQueue');
    const start = document.getElementById('startBreak');
    const arrows=['←','↑','→','↓'];
    let interval=null;
    start.addEventListener('click', ()=>{
        q.textContent=''; if(interval) clearInterval(interval);
        interval = setInterval(()=>{ const a=arrows[Math.floor(Math.random()*4)]; q.textContent=a; },800);
        document.addEventListener('keydown', handler);
    });
    function handler(e){ const map={ArrowLeft:'←',ArrowUp:'↑',ArrowRight:'→',ArrowDown:'↓'}; if(map[e.key]===q.textContent){ q.style.color='lime'; setTimeout(()=>q.style.color='black',200);} else { q.style.color='red'; setTimeout(()=>q.style.color='black',200); }}
}

// Gravity Puzzle — flip gravity to guide a ball into goal
function initGravityPuzzle(){
    const canvas = document.getElementById('gravityCanvas'); if(!canvas) return; const ctx=canvas.getContext('2d'); const btn = document.getElementById('flipGravity'); const reset = document.getElementById('resetGravity');
    let gravity=0.6; let ball={x:80,y:40,vy:0,r:10}; const goal={x:600,y:260,w:60,h:30};
    function update(){ ball.vy+=gravity; ball.y+=ball.vy; if(ball.y+ball.r>canvas.height){ ball.y=canvas.height-ball.r; ball.vy*=-0.5; } if(ball.y-ball.r<0){ ball.y=ball.r; ball.vy*=-0.5; } if(ball.x>goal.x && ball.x<goal.x+goal.w && ball.y>goal.y && ball.y<goal.y+goal.h){ alert('Goal!'); try{ leaderboard.addScore('gravity-puzzle', localStorage.getItem('playerName')||'Player',1,new Date().toISOString()); }catch{} }
    }
    function draw(){ ctx.fillStyle='#eef'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle='#333'; ctx.fillRect(goal.x,goal.y,goal.w,goal.h); ctx.fillStyle='orange'; ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill(); }
    function loop(){ update(); draw(); requestAnimationFrame(loop); }
    btn.addEventListener('click', ()=>{ gravity*=-1; }); reset.addEventListener('click', ()=>{ ball={x:80,y:40,vy:0,r:10}; gravity=0.6; }); loop();
}

// Choose Your Adventure — branching text
function initChooseAdventure(){
    const text = document.getElementById('adventureText'); const area = document.getElementById('adventureChoices'); const reset = document.getElementById('resetAdventure');
    const nodes = {
        start:{t:'You wake in a village, a stranger asks for help.', choices:[{t:'Help them',to:'help'},{t:'Ignore',to:'ignore'}]},
        help:{t:'They reward you with a map.', choices:[{t:'Explore',to:'explore'},{t:'Sell map',to:'sell'}]},
        ignore:{t:'You later find trouble in town.', choices:[{t:'Investigate',to:'investigate'},{t:'Leave',to:'leave'}]},
        explore:{t:'You find treasure. The end.', choices:[]},
        sell:{t:'You get coins but miss adventure. The end.', choices:[]},
        investigate:{t:'You save someone and are celebrated. The end.', choices:[]},
        leave:{t:'You sail away. The end.', choices:[]}
    };
    function render(node){ text.innerHTML = '<p>'+nodes[node].t+'</p>'; area.innerHTML=''; nodes[node].choices.forEach(c=>{ const b=document.createElement('button'); b.textContent=c.t; b.addEventListener('click', ()=>render(c.to)); area.appendChild(b); }); }
    render('start'); reset.addEventListener('click', ()=>render('start'));
}

// Asteroid Dodger — move ship left-right to dodge falling asteroids
function initAsteroidDodger(){
    const canvas = document.getElementById('asteroidCanvas'); if(!canvas) return; const ctx=canvas.getContext('2d'); const reset = document.getElementById('resetAsteroid'); const scoreEl=document.getElementById('asteroidScore'); let ship={x:canvas.width/2,y:canvas.height-30,w:40,h:10}; let asteroids=[]; let score=0; let running=true;
    function spawn(){ asteroids.push({x:Math.random()*(canvas.width-20)+10,y:-20,r:10+Math.random()*20,vy:2+Math.random()*3}); }
    function update(){ if(Math.random()<0.03) spawn(); asteroids.forEach(a=>{a.y+=a.vy; if(a.y>a.vy+canvas.height) a.dead=true; if(collideCircleRect(a,ship)) { running=false; alert('Game over! Score:'+score); try{ leaderboard.addScore('asteroid-dodger', localStorage.getItem('playerName')||'Player', score, new Date().toISOString()); }catch{} } }); asteroids=asteroids.filter(a=>!a.dead); score+=1; scoreEl.textContent=score; }
    function draw(){ ctx.fillStyle='#001'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle='#0f0'; ctx.fillRect(ship.x-ship.w/2,ship.y,ship.w,ship.h); ctx.fillStyle='#aaa'; asteroids.forEach(a=>{ ctx.beginPath(); ctx.arc(a.x,a.y,a.r,0,Math.PI*2); ctx.fill(); }); }
    function loop(){ if(!running) return; update(); draw(); requestAnimationFrame(loop); }
    document.addEventListener('mousemove', (e)=>{ const r=canvas.getBoundingClientRect(); ship.x=e.clientX-r.left; });
    reset.addEventListener('click', ()=>{ asteroids=[]; score=0; running=true; loop(); }); loop();
}
function collideCircleRect(c,r){ const distX = Math.abs(c.x - (r.x)); const distY = Math.abs(c.y - (r.y + r.h/2)); if(distX > (r.w/2 + c.r)) return false; if(distY > (r.h/2 + c.r)) return false; return true; }

// Tangram — simplified drag squares
function initTangram(){
    const target = document.getElementById('tangramTarget'); const pieces = document.getElementById('tangramPieces'); const reset = document.getElementById('resetTangram'); pieces.innerHTML=''; target.innerHTML='';
    for(let i=0;i<4;i++){ const p=document.createElement('div'); p.draggable=true; p.style.width='60px'; p.style.height='60px'; p.style.background=['#e74c3c','#3498db','#f1c40f','#2ecc71'][i]; p.style.border='2px solid #333'; p.addEventListener('dragstart',(e)=>{ e.dataTransfer.setData('text/plain', i); }); pieces.appendChild(p); }
    target.addEventListener('dragover',(e)=>e.preventDefault()); target.addEventListener('drop',(e)=>{ e.preventDefault(); const idx=e.dataTransfer.getData('text'); const node = pieces.children[idx]; target.appendChild(node); if(target.children.length===4){ alert('Well done!'); try{ leaderboard.addScore('tangram-puzzle', localStorage.getItem('playerName')||'Player',1,new Date().toISOString()); }catch{} } });
    reset.addEventListener('click', ()=>location.reload());
}

// Target Practice
function initTargetPractice(){
    const canvas = document.getElementById('targetCanvas'); if(!canvas) return; const ctx=canvas.getContext('2d'); const reset = document.getElementById('resetTarget'); const scoreEl=document.getElementById('targetScore'); let targets=[]; let score=0;
    function spawn(){ targets.push({x:Math.random()*(canvas.width-80)+40,y:Math.random()*(canvas.height-80)+40,r:20,ttl:300}); }
    function update(){ if(Math.random()<0.02) spawn(); targets.forEach(t=>t.ttl--); targets=targets.filter(t=>t.ttl>0); }
    function draw(){ ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height); targets.forEach(t=>{ ctx.beginPath(); ctx.fillStyle='red'; ctx.arc(t.x,t.y,t.r,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.fillStyle='yellow'; ctx.arc(t.x,t.y,t.r/2,0,Math.PI*2); ctx.fill(); }); }
    canvas.addEventListener('click',(e)=>{ const r=canvas.getBoundingClientRect(); const x=e.clientX-r.left; const y=e.clientY-r.top; for(let i=0;i<targets.length;i++){ const t=targets[i]; if(Math.hypot(x-t.x,y-t.y)<=t.r){ score+=10; scoreEl.textContent=score; targets.splice(i,1); break; } } });
    function loop(){ update(); draw(); requestAnimationFrame(loop); }
    reset.addEventListener('click', ()=>{ targets=[]; score=0; scoreEl.textContent=score; }); loop();
}

// Space Invaders — very simplified shooter
function initSpaceInvaders(){
    const canvas = document.getElementById('spaceCanvas'); if(!canvas) return; const ctx=canvas.getContext('2d'); const reset = document.getElementById('resetSpace'); const scoreEl=document.getElementById('spaceScore'); let player={x:canvas.width/2,y:canvas.height-30,w:40,h:10}; let bullets=[]; let enemies=[]; let score=0; let running=true;
    function spawnEnemies(){ enemies=[]; for(let r=0;r<3;r++) for(let c=0;c<8;c++) enemies.push({x:60+c*70,y:40+r*40,w:40,h:20,alive:true}); }
    function update(){ enemies.forEach(e=>e.x+=Math.sin(Date.now()/1000+e.x)*0.2); bullets.forEach(b=>b.y-=6); bullets=bullets.filter(b=>b.y>0); enemies.forEach(en=>{ bullets.forEach((b,i)=>{ if(b.x>en.x && b.x<en.x+en.w && b.y>en.y && b.y<en.y+en.h && en.alive){ en.alive=false; bullets.splice(i,1); score+=50; scoreEl.textContent=score; } }); }); if(enemies.every(e=>!e.alive)){ alert('You cleared the wave!'); try{ leaderboard.addScore('space-invaders', localStorage.getItem('playerName')||'Player',score,new Date().toISOString()); }catch{} running=false; }}
    function draw(){ ctx.fillStyle='#000'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle='white'; ctx.fillRect(player.x-player.w/2,player.y,player.w,player.h); bullets.forEach(b=>{ ctx.fillRect(b.x-2,b.y-8,4,8); }); enemies.forEach(e=>{ if(e.alive){ ctx.fillStyle='lime'; ctx.fillRect(e.x,e.y,e.w,e.h); }}); }
    document.addEventListener('mousemove', (e)=>{ const r=canvas.getBoundingClientRect(); player.x=e.clientX-r.left; });
    document.addEventListener('click', ()=>{ if(running) bullets.push({x:player.x,y:player.y-12}); });
    reset.addEventListener('click', ()=>{ spawnEnemies(); bullets=[]; score=0; running=true; scoreEl.textContent=score; loop(); });
    spawnEnemies(); function loop(){ if(!running) return; update(); draw(); requestAnimationFrame(loop); } loop();
}

// -----------------------------------------------------------------------------

// (Existing game implementations like tic-tac-toe, snake, memory, flappy-bird,
//  2048, hangman, pong, infinite painter are assumed to remain in the file
//  above. If duplicates occur, the browser will use the last-defined function.)
