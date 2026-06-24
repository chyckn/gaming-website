class Leaderboard {
    constructor() {
        this.scores = this.loadScores();
    }

    loadScores() {
        const stored = localStorage.getItem('gameScores');
        return stored ? JSON.parse(stored) : {};
    }

    saveScores() {
        localStorage.setItem('gameScores', JSON.stringify(this.scores));
    }

    addScore(gameId, playerName, score, timestamp = new Date()) {
        if (!this.scores[gameId]) {
            this.scores[gameId] = [];
        }
        this.scores[gameId].push({ playerName, score, timestamp });
        this.scores[gameId].sort((a, b) => b.score - a.score);
        this.scores[gameId] = this.scores[gameId].slice(0, 10); // Keep top 10
        this.saveScores();
    }

    getTopScores(gameId, limit = 10) {
        if (!this.scores[gameId]) return [];
        return this.scores[gameId].slice(0, limit);
    }

    getPlayerStats(playerName) {
        const stats = { gamesPlayed: 0, totalScore: 0, topScores: [] };
        for (const gameId in this.scores) {
            const playerScore = this.scores[gameId].find(s => s.playerName === playerName);
            if (playerScore) {
                stats.gamesPlayed++;
                stats.totalScore += playerScore.score;
                stats.topScores.push({
                    game: gameId,
                    score: playerScore.score
                });
            }
        }
        return stats;
    }

    renderLeaderboard(gameId) {
        const scores = this.getTopScores(gameId);
        if (scores.length === 0) return '<p>No scores yet. Be the first to play!</p>';

        let html = '<table class="leaderboard-table"><thead><tr><th>Rank</th><th>Player</th><th>Score</th><th>Date</th></tr></thead><tbody>';
        scores.forEach((score, index) => {
            const date = new Date(score.timestamp).toLocaleDateString();
            html += `<tr><td>#${index + 1}</td><td>${score.playerName}</td><td><strong>${score.score}</strong></td><td>${date}</td></tr>`;
        });
        html += '</tbody></table>';
        return html;
    }
}

const leaderboard = new Leaderboard();