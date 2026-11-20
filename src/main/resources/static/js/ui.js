/**
 * Memory Flip - Master
 * UI Module: Screen Management, DOM Rendering, Animations, Charts, Confetti
 */
const UI = (() => {
    // DOM Elements Cache
    const elements = {
        screens: document.querySelectorAll('.screen'),
        navBrand: document.getElementById('nav-brand'),
        playerChip: document.getElementById('header-player-chip'),
        playerNameDisplay: document.getElementById('header-player-name'),
        soundToggleBtn: document.getElementById('btn-sound-toggle'),

        // HUD Elements
        hudLevel: document.getElementById('hud-level'),
        hudDifficulty: document.getElementById('hud-difficulty'),
        hudScore: document.getElementById('hud-score'),
        hudMoves: document.getElementById('hud-moves'),
        hudMatches: document.getElementById('hud-matches'),
        hudTimer: document.getElementById('hud-timer'),
        hudAccuracy: document.getElementById('hud-accuracy'),
        hudStreak: document.getElementById('hud-streak'),
        cardsContainer: document.getElementById('cards-grid-board'),

        // Modals
        pauseModal: document.getElementById('modal-pause'),
        victoryModal: document.getElementById('modal-victory'),
        playerModal: document.getElementById('modal-player-edit'),
        playerNameInput: document.getElementById('input-player-name'),

        // Result Elements
        resultStars: document.getElementById('result-stars-wrap'),
        resultScore: document.getElementById('result-score-val'),
        resultTime: document.getElementById('result-time-val'),
        resultMoves: document.getElementById('result-moves-val'),
        resultAccuracy: document.getElementById('result-accuracy-val'),
        breakdownBase: document.getElementById('breakdown-base'),
        breakdownTime: document.getElementById('breakdown-time'),
        breakdownMoves: document.getElementById('breakdown-moves'),
        breakdownStreak: document.getElementById('breakdown-streak'),
        breakdownHint: document.getElementById('breakdown-hint'),
        breakdownTotal: document.getElementById('breakdown-total'),
        btnNextLevel: document.getElementById('btn-next-level'),

        // Leaderboard
        leaderboardTableBody: document.getElementById('leaderboard-tbody'),
        leaderboardFilterTabs: document.querySelectorAll('.leaderboard-filter-tab'),

        // Stats Dashboard
        statsPlayed: document.getElementById('stat-total-played'),
        statsWon: document.getElementById('stat-total-won'),
        statsWinRate: document.getElementById('stat-win-rate'),
        statsHighScore: document.getElementById('stat-high-score'),
        statsAvgTime: document.getElementById('stat-avg-time'),
        statsAvgMoves: document.getElementById('stat-avg-moves'),
        statsBestDiff: document.getElementById('stat-best-diff'),
        statsHistoryBody: document.getElementById('stats-history-tbody'),

        // Quick Stats on Home
        quickPlayed: document.getElementById('quick-played'),
        quickWon: document.getElementById('quick-won'),
        quickHighScore: document.getElementById('quick-high-score'),
        quickBestTime: document.getElementById('quick-best-time'),

        // Toast Container
        toastContainer: document.getElementById('toast-container'),
        confettiCanvas: document.getElementById('confetti-canvas')
    };

    let statsChartInstance = null;
    let confettiAnimationId = null;

    // Switch between screens
    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(scr => scr.classList.remove('active'));
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        AudioManager.playClick();
    }

    // Format Seconds into MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Update Header
    function updateHeader() {
        if (elements.playerNameDisplay) {
            elements.playerNameDisplay.textContent = Storage.getPlayerName();
        }
        if (elements.soundToggleBtn) {
            const isMuted = AudioManager.isMuted();
            elements.soundToggleBtn.innerHTML = isMuted 
                ? '<i class="fas fa-volume-mute"></i>' 
                : '<i class="fas fa-volume-up"></i>';
            elements.soundToggleBtn.setAttribute('title', isMuted ? 'Unmute Sound' : 'Mute Sound');
        }
    }

    // Update Quick Stats on Landing Screen
    function updateHomeQuickStats() {
        const stats = Storage.getLocalStats();
        if (elements.quickPlayed) elements.quickPlayed.textContent = stats.played;
        if (elements.quickWon) elements.quickWon.textContent = stats.won;
        if (elements.quickHighScore) elements.quickHighScore.textContent = stats.highScore.toLocaleString();
        if (elements.quickBestTime) elements.quickBestTime.textContent = stats.bestTime > 0 ? formatTime(stats.bestTime) : '--:--';
    }

    // Render Cards Grid
    function renderBoard(cards, cols, onCardClick) {
        if (!elements.cardsContainer) return;
        elements.cardsContainer.innerHTML = '';
        elements.cardsContainer.setAttribute('data-cols', cols);

        cards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'memory-card';
            cardEl.setAttribute('role', 'button');
            cardEl.setAttribute('tabindex', '0');
            cardEl.setAttribute('aria-label', `Card ${index + 1}`);

            if (card.isFlipped) cardEl.classList.add('flipped');
            if (card.isMatched) cardEl.classList.add('matched');
            if (card.isHinted) cardEl.classList.add('hinted');

            cardEl.innerHTML = `
                <div class="card-face card-back">
                    <span class="card-back-icon"><i class="fas fa-question"></i></span>
                </div>
                <div class="card-face card-front">
                    <span>${card.symbol}</span>
                </div>
            `;

            // Click listener
            cardEl.addEventListener('click', () => onCardClick(index));

            // Keyboard navigation (Enter / Space)
            cardEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onCardClick(index);
                }
            });

            elements.cardsContainer.appendChild(cardEl);
        });
    }

    // Update HUD display
    function updateHUD(state) {
        if (elements.hudLevel) {
            elements.hudLevel.textContent = state.isProgressive ? `Level ${state.currentLevel}` : 'Standard';
        }
        if (elements.hudDifficulty) {
            elements.hudDifficulty.textContent = state.currentDifficulty;
        }
        if (elements.hudScore) {
            elements.hudScore.textContent = state.score.toLocaleString();
        }
        if (elements.hudMoves) {
            elements.hudMoves.textContent = state.moves;
        }
        if (elements.hudMatches) {
            elements.hudMatches.textContent = `${state.matches} / ${state.totalPairs}`;
        }
        if (elements.hudTimer) {
            elements.hudTimer.textContent = formatTime(state.timerSeconds);
        }
        if (elements.hudAccuracy) {
            elements.hudAccuracy.textContent = `${state.accuracy}%`;
        }
        if (elements.hudStreak) {
            if (state.streak >= 2) {
                elements.hudStreak.style.display = 'inline-flex';
                elements.hudStreak.innerHTML = `<i class="fas fa-fire"></i> x${(1 + (state.streak - 1) * 0.25).toFixed(1)} Streak`;
            } else {
                elements.hudStreak.style.display = 'none';
            }
        }

        // Sync card classes if cards already rendered
        if (elements.cardsContainer && elements.cardsContainer.children.length === state.cards.length) {
            const cardElements = elements.cardsContainer.children;
            state.cards.forEach((card, idx) => {
                const el = cardElements[idx];
                if (card.isFlipped) el.classList.add('flipped');
                else el.classList.remove('flipped');

                if (card.isMatched) el.classList.add('matched');
                else el.classList.remove('matched');

                if (card.isHinted) el.classList.add('hinted');
                else el.classList.remove('hinted');
            });
        }
    }

    // Render Victory Screen & Modal
    function showVictoryModal(resultData, onNextLevel, onPlayAgain, onLeaderboard) {
        if (!elements.victoryModal) return;

        // Render Star Rating
        if (elements.resultStars) {
            elements.resultStars.innerHTML = '';
            for (let i = 1; i <= 3; i++) {
                const star = document.createElement('span');
                star.className = `star ${i <= resultData.stars ? 'active' : ''}`;
                star.innerHTML = '<i class="fas fa-star"></i>';
                elements.resultStars.appendChild(star);
            }
        }

        // Summary values
        if (elements.resultScore) elements.resultScore.textContent = resultData.score.toLocaleString();
        if (elements.resultTime) elements.resultTime.textContent = formatTime(resultData.completionTime);
        if (elements.resultMoves) elements.resultMoves.textContent = resultData.moves;
        if (elements.resultAccuracy) elements.resultAccuracy.textContent = `${resultData.accuracy}%`;

        // Breakdown values
        const b = resultData.breakdown;
        if (elements.breakdownBase) elements.breakdownBase.textContent = `+${b.baseScore}`;
        if (elements.breakdownTime) elements.breakdownTime.textContent = `+${b.timeBonus}`;
        if (elements.breakdownMoves) elements.breakdownMoves.textContent = `+${b.moveBonus}`;
        if (elements.breakdownStreak) elements.breakdownStreak.textContent = `+${b.streakBonus}`;
        if (elements.breakdownHint) elements.breakdownHint.textContent = `-${b.hintPenalty}`;
        if (elements.breakdownTotal) elements.breakdownTotal.textContent = b.total.toLocaleString();

        // Show/hide next level button
        if (elements.btnNextLevel) {
            if (resultData.isProgressive) {
                elements.btnNextLevel.style.display = 'inline-flex';
                elements.btnNextLevel.onclick = () => {
                    hideVictoryModal();
                    onNextLevel();
                };
            } else {
                elements.btnNextLevel.style.display = 'none';
            }
        }

        elements.victoryModal.classList.add('active');
        triggerConfetti();
    }

    function hideVictoryModal() {
        if (elements.victoryModal) {
            elements.victoryModal.classList.remove('active');
        }
        stopConfetti();
    }

    // Pause Modal
    function showPauseModal() {
        if (elements.pauseModal) elements.pauseModal.classList.add('active');
    }

    function hidePauseModal() {
        if (elements.pauseModal) elements.pauseModal.classList.remove('active');
    }

    // Player Edit Modal
    function showPlayerModal() {
        if (elements.playerModal) {
            elements.playerNameInput.value = Storage.getPlayerName();
            elements.playerModal.classList.add('active');
            elements.playerNameInput.focus();
        }
    }

    function hidePlayerModal() {
        if (elements.playerModal) elements.playerModal.classList.remove('active');
    }

    // Render Leaderboard
    function renderLeaderboard(data, currentFilter) {
        if (!elements.leaderboardTableBody) return;
        elements.leaderboardTableBody.innerHTML = '';

        if (!data || data.length === 0) {
            elements.leaderboardTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center; padding: 30px; color: var(--text-secondary);">
                        <i class="fas fa-trophy" style="font-size: 24px; margin-bottom: 8px; display:block;"></i>
                        No games recorded for this category yet. Be the first to claim the top spot!
                    </td>
                </tr>
            `;
            return;
        }

        const myPlayerId = Storage.getPlayerId();

        data.forEach((entry, idx) => {
            const row = document.createElement('tr');
            if (entry.playerId === myPlayerId) {
                row.classList.add('current-user');
            }

            let rankContent = entry.rank;
            if (entry.rank === 1) rankContent = '<span class="rank-badge rank-1">🥇</span>';
            else if (entry.rank === 2) rankContent = '<span class="rank-badge rank-2">🥈</span>';
            else if (entry.rank === 3) rankContent = '<span class="rank-badge rank-3">🥉</span>';
            else rankContent = `<span class="rank-badge">${entry.rank}</span>`;

            const dateStr = entry.completedAt ? new Date(entry.completedAt).toLocaleDateString() : 'Recent';

            row.innerHTML = `
                <td>${rankContent}</td>
                <td><strong>${escapeHtml(entry.playerName)}</strong> ${entry.playerId === myPlayerId ? '<span style="color:var(--accent-orange); font-size:0.75rem;">(YOU)</span>' : ''}</td>
                <td style="color:var(--accent-orange); font-weight:800;">${entry.score.toLocaleString()}</td>
                <td><span class="diff-badge" style="font-size:0.75rem;">${entry.difficulty}</span></td>
                <td>${formatTime(entry.completionTime)}</td>
                <td>${entry.moves}</td>
                <td>Lvl ${entry.level}</td>
            `;
            elements.leaderboardTableBody.appendChild(row);
        });
    }

    // Render Statistics Dashboard
    function renderStatisticsDashboard(stats, historyList) {
        if (elements.statsPlayed) elements.statsPlayed.textContent = stats.totalGamesPlayed || 0;
        if (elements.statsWon) elements.statsWon.textContent = stats.totalGamesCompleted || 0;
        if (elements.statsWinRate) elements.statsWinRate.textContent = `${stats.winRate || 100}%`;
        if (elements.statsHighScore) elements.statsHighScore.textContent = (stats.highestScore || 0).toLocaleString();
        if (elements.statsAvgTime) elements.statsAvgTime.textContent = formatTime(Math.round(stats.averageCompletionTime || 0));
        if (elements.statsAvgMoves) elements.statsAvgMoves.textContent = Math.round(stats.averageMoves || 0);
        if (elements.statsBestDiff) elements.statsBestDiff.textContent = stats.bestDifficulty || 'EASY';

        // History Table
        if (elements.statsHistoryBody) {
            elements.statsHistoryBody.innerHTML = '';
            if (!historyList || historyList.length === 0) {
                elements.statsHistoryBody.innerHTML = `
                    <tr><td colspan="6" style="text-align:center; padding: 20px; color:var(--text-secondary);">No completed game sessions yet.</td></tr>
                `;
            } else {
                historyList.forEach(session => {
                    const row = document.createElement('tr');
                    const starsHtml = '⭐'.repeat(session.stars || 1);
                    const dateStr = session.completedAt ? new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                    row.innerHTML = `
                        <td>${session.difficulty} (Lvl ${session.level})</td>
                        <td style="font-weight:700; color:var(--accent-orange);">${session.score.toLocaleString()}</td>
                        <td>${formatTime(session.completionTime)}</td>
                        <td>${session.moves}</td>
                        <td>${session.accuracy}%</td>
                        <td>${starsHtml}</td>
                    `;
                    elements.statsHistoryBody.appendChild(row);
                });
            }
        }

        // Render Chart.js Performance Graph
        renderPerformanceChart(historyList);
    }

    // Chart.js Graph
    function renderPerformanceChart(historyList) {
        const ctx = document.getElementById('statsChart');
        if (!ctx || typeof Chart === 'undefined') return;

        if (statsChartInstance) {
            statsChartInstance.destroy();
        }

        const reversed = [...(historyList || [])].reverse();
        const labels = reversed.map((_, i) => `Game ${i + 1}`);
        const scores = reversed.map(item => item.score);
        const accuracy = reversed.map(item => item.accuracy);

        statsChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.length ? labels : ['No Data'],
                datasets: [
                    {
                        label: 'Score Progression',
                        data: scores.length ? scores : [0],
                        borderColor: '#ff6b35',
                        backgroundColor: 'rgba(255, 107, 53, 0.15)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.35,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Accuracy (%)',
                        data: accuracy.length ? accuracy : [0],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.2,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8', font: { family: 'Outfit' } } }
                },
                scales: {
                    x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: { color: '#ff6b35' },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        min: 0,
                        max: 100,
                        ticks: { color: '#8b5cf6' },
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        });
    }

    // Render 20+ Progressive Level Grid
    function renderProgressiveLevels(maxLevel, onSelectLevel) {
        const container = document.getElementById('progressive-levels-grid');
        if (!container) return;
        container.innerHTML = '';

        for (let lvl = 1; lvl <= 24; lvl++) {
            const chip = document.createElement('div');
            const isCompleted = lvl < maxLevel;
            const isCurrent = lvl === maxLevel;
            const isLocked = lvl > maxLevel;

            chip.className = `level-chip ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''} ${isCurrent ? 'current' : ''}`;
            chip.innerHTML = `
                <span>${lvl}</span>
                ${isCompleted ? '<span class="level-stars">★★★</span>' : (isLocked ? '<i class="fas fa-lock" style="font-size:10px;"></i>' : '<span style="color:var(--accent-orange); font-size:10px;">PLAY</span>')}
            `;

            if (!isLocked) {
                chip.onclick = () => onSelectLevel(lvl);
            }
            container.appendChild(chip);
        }
    }

    // Toast Notification System
    function showToast(message, type = 'info', duration = 3000) {
        if (!elements.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-triangle';

        toast.innerHTML = `<i class="fas fa-${icon}"></i> <span>${escapeHtml(message)}</span>`;
        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = '0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // Canvas Confetti Generator
    function triggerConfetti() {
        const canvas = elements.confettiCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#ff6b35', '#8b5cf6', '#fbbf24', '#10b981', '#06b6d4', '#f43f5e'];

        for (let i = 0; i < 120; i++) {
            pieces.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                w: Math.random() * 10 + 6,
                h: Math.random() * 6 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 18,
                vy: (Math.random() - 0.5) * 18 - 6,
                rot: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10,
                opacity: 1
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;

            pieces.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.35; // gravity
                p.rot += p.rotSpeed;
                p.opacity -= 0.007;

                if (p.opacity > 0) {
                    active = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rot * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = Math.max(0, p.opacity);
                    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                    ctx.restore();
                }
            });

            if (active) {
                confettiAnimationId = requestAnimationFrame(draw);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
        draw();
    }

    function stopConfetti() {
        if (confettiAnimationId) {
            cancelAnimationFrame(confettiAnimationId);
            confettiAnimationId = null;
        }
        if (elements.confettiCanvas) {
            const ctx = elements.confettiCanvas.getContext('2d');
            ctx.clearRect(0, 0, elements.confettiCanvas.width, elements.confettiCanvas.height);
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    return {
        elements,
        showScreen,
        updateHeader,
        updateHomeQuickStats,
        renderBoard,
        updateHUD,
        showVictoryModal,
        hideVictoryModal,
        showPauseModal,
        hidePauseModal,
        showPlayerModal,
        hidePlayerModal,
        renderLeaderboard,
        renderStatisticsDashboard,
        renderProgressiveLevels,
        showToast
    };
})();
