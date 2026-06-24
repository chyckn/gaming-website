const games = [
    {
        id: 'dark-room',
        title: 'Dark Room',
        emoji: '🌑',
        category: 'puzzle',
        description: 'Navigate through darkness and solve light-based puzzles',
        rating: 4.2
    },
    {
        id: 'sort-court',
        title: 'Sort The Court',
        emoji: '👑',
        category: 'strategy',
        description: 'Make decisions as a ruler and manage your kingdom',
        rating: 4.5
    },
    {
        id: 'incredibox',
        title: 'Incredibox',
        emoji: '🎵',
        category: 'puzzle',
        description: 'Create music by arranging animated beatboxers',
        rating: 4.7
    },
    {
        id: 'infinite-painter',
        title: 'Infinite Painter',
        emoji: '🎨',
        category: 'puzzle',
        description: 'Draw and paint with infinite creative possibilities',
        rating: 4.3
    },
    {
        id: 'dna-game',
        title: 'DNA Game',
        emoji: '🧬',
        category: 'puzzle',
        description: 'Match DNA pairs and learn genetic sequences',
        rating: 4.0
    },
    {
        id: 'wordle-style',
        title: 'Wordle Style',
        emoji: '📝',
        category: 'puzzle',
        description: 'Guess the word in 6 tries with helpful hints',
        rating: 4.6
    },
    {
        id: 'dice-wars',
        title: 'Dice Wars',
        emoji: '🎲',
        category: 'strategy',
        description: 'Conquer territories using dice and strategy',
        rating: 4.4
    },
    {
        id: 'simon-says',
        title: 'Simon Says',
        emoji: '🔴',
        category: 'classic',
        description: 'Repeat the color sequence and test your memory',
        rating: 4.1
    },
    {
        id: 'breakdance-party',
        title: 'Breakdance Party',
        emoji: '🕺',
        category: 'action',
        description: 'Dance to the beat and master breakdance moves',
        rating: 4.3
    },
    {
        id: 'gravity-puzzle',
        title: 'Gravity Puzzle',
        emoji: '⬇️',
        category: 'puzzle',
        description: 'Solve puzzles using gravity and physics',
        rating: 4.2
    },
    {
        id: 'choose-adventure',
        title: 'Choose Your Adventure',
        emoji: '🗺️',
        category: 'strategy',
        description: 'Make choices that shape your story outcome',
        rating: 4.5
    },
    {
        id: 'asteroid-dodger',
        title: 'Asteroid Dodger',
        emoji: '☄️',
        category: 'action',
        description: 'Dodge incoming asteroids and survive as long as possible',
        rating: 4.2
    },
    {
        id: 'tangram-puzzle',
        title: 'Tangram Puzzle',
        emoji: '◻️',
        category: 'puzzle',
        description: 'Arrange geometric shapes to complete patterns',
        rating: 4.1
    },
    {
        id: 'target-practice',
        title: 'Target Practice',
        emoji: '🎯',
        category: 'action',
        description: 'Aim and hit targets with precision and speed',
        rating: 4.0
    },
    {
        id: 'snake',
        title: 'Snake',
        emoji: '🐍',
        category: 'classic',
        description: 'The classic snake game - grow your snake and avoid collisions',
        rating: 4.5
    },
    {
        id: 'flappy-bird',
        title: 'Flappy Bird',
        emoji: '🐦',
        category: 'action',
        description: 'Navigate through pipes by tapping to flap',
        rating: 4.4
    },
    {
        id: 'memory',
        title: 'Memory',
        emoji: '🧠',
        category: 'classic',
        description: 'Match pairs of cards and test your memory',
        rating: 4.2
    },
    {
        id: 'tic-tac-toe',
        title: 'Tic Tac Toe',
        emoji: '❌',
        category: 'classic',
        description: 'The timeless strategy game - get three in a row',
        rating: 4.0
    },
    {
        id: 'hangman',
        title: 'Hangman',
        emoji: '🎩',
        category: 'puzzle',
        description: 'Guess the word letter by letter',
        rating: 4.1
    },
    {
        id: 'pong',
        title: 'Pong',
        emoji: '🏓',
        category: 'classic',
        description: 'The legendary arcade game - paddle and pong',
        rating: 4.3
    },
    {
        id: 'space-invaders',
        title: 'Space Invaders',
        emoji: '👾',
        category: 'action',
        description: 'Shoot down invading aliens from space',
        rating: 4.6
    },
    {
        id: '2048',
        title: '2048',
        emoji: '2️⃣',
        category: 'puzzle',
        description: 'Combine tiles to reach 2048 and go beyond',
        rating: 4.4
    }
];

const gameDescriptions = {
    'dark-room': 'Navigate through a pitch-black room, using subtle light sources to solve environmental puzzles.',
    'sort-court': 'As a ruler, make critical decisions that affect your kingdom. Each choice impacts your reign!',
    'incredibox': 'Mix and match beatboxers to create unique music compositions.',
    'infinite-painter': 'An infinite canvas where you can paint, draw, and create without limits.',
    'dna-game': 'Educational puzzle where you match DNA strands and learn about genetics.',
    'wordle-style': 'Guess a 5-letter word with color-coded feedback in 6 attempts.',
    'dice-wars': 'Turn-based strategy game where you use dice rolls to conquer territories.',
    'simon-says': 'Classic memory game where you repeat increasingly complex color sequences.',
    'breakdance-party': 'Dance game where you perform moves to match the rhythm.',
    'gravity-puzzle': 'Physics-based puzzle game using gravity mechanics.',
    'choose-adventure': 'Interactive story where your choices determine the outcome.',
    'asteroid-dodger': 'Fast-paced action game where you dodge asteroids.',
    'tangram-puzzle': 'Chinese puzzle using geometric shapes to create silhouettes.',
    'target-practice': 'Aim and shoot targets with various weapons and power-ups.',
    'snake': 'The classic snake game - eat food, grow longer, avoid hitting yourself.',
    'flappy-bird': 'Simple but challenging game - tap to flap and navigate through pipes.',
    'memory': 'Match identical pairs of cards to clear the board.',
    'tic-tac-toe': 'Classic 3x3 grid game against the computer or another player.',
    'hangman': 'Guess letters to reveal the hidden word before you run out of tries.',
    'pong': 'Two-player or single-player arcade game with paddles and a ball.',
    'space-invaders': 'Shoot down waves of invading aliens before they reach you.',
    '2048': 'Slide tiles to combine numbers and reach 2048.'
};