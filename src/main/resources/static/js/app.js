/**
 * Memory Flip - Master
 * Main Application Bootstrapper & Coordinator
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Header & Storage
    UI.updateHeader();
    UI.updateHomeQuickStats();

    // Setup GameEngine Callbacks
    GameEngine.setListeners(
        (state) => {
            UI.updateHUD(state);
        },
        async (resultData) => {
            // Save to backend API asynchronously
            try {
                const payload = {
                    playerId: Storage.getPlayerId(),
                    playerName: Storage.getPlayerName(),
                    difficulty: resultData.difficulty,
                    level: resultData.level,
                    score: resultData.score,
                    moves: resultData.moves,
                    matches: resultData.matches,
                    completionTime: resultData.completionTime,
                    accuracy: resultData.accuracy,
                    stars: resultData.stars,
                    hintsUsed: resultData.hintsUsed,
                    shufflesUsed: resultData.shufflesUsed
                };
                await Api.submitGameCompletion(payload);
                UI.showToast('Score saved to leaderboard!', 'success');
            } catch (err) {
                console.warn('Could not sync with backend, score kept locally:', err);
                UI.showToast('Game completed! (Stored locally)', 'info');
            }

            UI.updateHomeQuickStats();

            // Display Victory Celebration Modal
            UI.showVictoryModal(
                resultData,
                // On Next Level
                () => {
                    startNewGame(resultData.difficulty, resultData.level + 1, true);
                },
                // On Play Again
                () => {
                    UI.hideVictoryModal();
                    GameEngine.restart();
                },
                // On View Leaderboard
                () => {
                    UI.hideVictoryModal();
                    loadLeaderboardScreen();
                }
            );
        }
    );

    // =========================================================================
    // NAVIGATION & BUTTON HANDLERS
    // =========================================================================

    // Brand Logo -> Return Home
    const navBrand = document.getElementById('nav-brand');
    if (navBrand) {
        navBrand.addEventListener('click', (e) => {
            e.preventDefault();
            confirmExitToHome();
        });
    }

    // Sound Toggle Button
    const btnSound = document.getElementById('btn-sound-toggle');
    if (btnSound) {
        btnSound.addEventListener('click', () => {
            const isMuted = AudioManager.toggleMute();
            UI.updateHeader();
            UI.showToast(isMuted ? 'Sound muted' : 'Sound enabled', 'info');
        });
    }

    // Player Name Chip -> Open Edit Modal
    const playerChip = document.getElementById('header-player-chip');
    if (playerChip) {
        playerChip.addEventListener('click', () => {
            UI.showPlayerModal();
        });
    }

    // Player Edit Modal Actions
    const btnSavePlayer = document.getElementById('btn-save-player');
    if (btnSavePlayer) {
        btnSavePlayer.addEventListener('click', () => {
            const input = document.getElementById('input-player-name');
            if (input && input.value.trim()) {
                Storage.setPlayerName(input.value.trim());
                UI.updateHeader();
                UI.hidePlayerModal();
                UI.showToast('Player name updated!', 'success');
            }
        });
    }

    const btnClosePlayer = document.getElementById('btn-close-player');
    if (btnClosePlayer) {
        btnClosePlayer.addEventListener('click', () => {
            UI.hidePlayerModal();
        });
    }

    // -------------------------------------------------------------------------
    // HOME SCREEN BUTTONS
    // -------------------------------------------------------------------------
    const btnPlayNow = document.getElementById('btn-home-play');
    if (btnPlayNow) {
        btnPlayNow.addEventListener('click', () => {
            UI.showScreen('screen-difficulty');
            renderDifficultyScreen();
        });
    }

    const btnHomeLeaderboard = document.getElementById('btn-home-leaderboard');
    if (btnHomeLeaderboard) {
        btnHomeLeaderboard.addEventListener('click', () => {
            loadLeaderboardScreen();
        });
    }

    const btnHomeStats = document.getElementById('btn-home-stats');
    if (btnHomeStats) {
        btnHomeStats.addEventListener('click', () => {
            loadStatisticsScreen();
        });
    }

    const btnHomeHowTo = document.getElementById('btn-home-howto');
    if (btnHomeHowTo) {
        btnHomeHowTo.addEventListener('click', () => {
            UI.showScreen('screen-howto');
        });
    }

    // -------------------------------------------------------------------------
    // DIFFICULTY SCREEN
    // -------------------------------------------------------------------------
    function renderDifficultyScreen() {
        const maxLevel = Storage.getProgressLevel();
        UI.renderProgressiveLevels(maxLevel, (lvl) => {
            startNewGame('EASY', lvl, true);
        });
    }

    // Mode tab toggle (Classic vs Progressive)
    const tabClassic = document.getElementById('tab-classic');
    const tabProgressive = document.getElementById('tab-progressive');
    const classicSection = document.getElementById('difficulty-classic-section');
    const progressiveSection = document.getElementById('difficulty-progressive-section');

    if (tabClassic && tabProgressive) {
        tabClassic.addEventListener('click', () => {
            tabClassic.classList.add('active');
            tabProgressive.classList.remove('active');
            classicSection.style.display = 'grid';
            progressiveSection.style.display = 'none';
            AudioManager.playClick();
        });

        tabProgressive.addEventListener('click', () => {
            tabProgressive.classList.add('active');
            tabClassic.classList.remove('active');
            classicSection.style.display = 'none';
            progressiveSection.style.display = 'block';
            renderDifficultyScreen();
            AudioManager.playClick();
        });
    }

    // Difficulty Cards Selection
    document.querySelectorAll('.diff-card').forEach(card => {
        card.addEventListener('click', () => {
            const diff = card.getAttribute('data-diff');
            if (diff) {
                startNewGame(diff, 1, false);
            }
        });
    });

    const btnBackFromDiff = document.getElementById('btn-back-from-diff');
    if (btnBackFromDiff) {
        btnBackFromDiff.addEventListener('click', () => {
            UI.showScreen('screen-home');
        });
    }

    // -------------------------------------------------------------------------
    // GAMEPLAY CONTROLS
    // -------------------------------------------------------------------------
    function startNewGame(difficulty, level = 1, isProgressive = false) {
        const session = GameEngine.startSession(difficulty, level, isProgressive);
        UI.showScreen('screen-game');
        UI.renderBoard(session.cards, session.config.cols, (cardIndex) => {
            GameEngine.flipCard(cardIndex);
        });
    }

    // Power-up Hint
    const btnHint = document.getElementById('btn-game-hint');
    if (btnHint) {
        btnHint.addEventListener('click', () => {
            const hintResult = GameEngine.useHint();
            if (hintResult) {
                UI.showToast('Hint revealed! (-25 pts)', 'info');
            } else {
                UI.showToast('No hints available right now', 'info');
            }
        });
    }

    // Power-up Shuffle
    const btnShuffle = document.getElementById('btn-game-shuffle');
    if (btnShuffle) {
        btnShuffle.addEventListener('click', () => {
            const ok = GameEngine.useShuffle();
            if (ok) {
                const state = GameEngine.getState();
                const config = state.isProgressive 
                    ? GameEngine.getLevelConfig(state.currentLevel) 
                    : GameEngine.DIFFICULTIES[state.currentDifficulty];
                UI.renderBoard(state.cards, config.cols, (idx) => GameEngine.flipCard(idx));
                btnShuffle.setAttribute('disabled', 'true');
                UI.showToast('Remaining cards shuffled!', 'info');
            } else {
                UI.showToast('Shuffle power-up already used!', 'info');
            }
        });
    }

    // Pause Button
    const btnPause = document.getElementById('btn-game-pause');
    if (btnPause) {
        btnPause.addEventListener('click', () => {
            GameEngine.pause();
            UI.showPauseModal();
        });
    }

    // Resume Button
    const btnResume = document.getElementById('btn-resume-game');
    if (btnResume) {
        btnResume.addEventListener('click', () => {
            UI.hidePauseModal();
            GameEngine.resume();
        });
    }

    // Restart Level Button
    const btnRestart = document.getElementById('btn-restart-game');
    const btnModalRestart = document.getElementById('btn-modal-restart');
    [btnRestart, btnModalRestart].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                UI.hidePauseModal();
                UI.hideVictoryModal();
                const session = GameEngine.restart();
                UI.renderBoard(session.cards, session.config.cols, (idx) => GameEngine.flipCard(idx));
                const shuffleBtn = document.getElementById('btn-game-shuffle');
                if (shuffleBtn) shuffleBtn.removeAttribute('disabled');
                UI.showToast('Level restarted', 'info');
            });
        }
    });

    // Exit Game Buttons
    const btnExit = document.getElementById('btn-game-exit');
    const btnModalQuit = document.getElementById('btn-modal-quit');
    [btnExit, btnModalQuit].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                confirmExitToHome();
            });
        }
    });

    function confirmExitToHome() {
        const state = GameEngine.getState();
        if (document.getElementById('screen-game').classList.contains('active') && !state.isGameOver) {
            if (confirm('Are you sure you want to quit the current game?')) {
                UI.hidePauseModal();
                UI.hideVictoryModal();
                UI.showScreen('screen-home');
                UI.updateHomeQuickStats();
            }
        } else {
            UI.hidePauseModal();
            UI.hideVictoryModal();
            UI.showScreen('screen-home');
            UI.updateHomeQuickStats();
        }
    }

    // Victory Screen Buttons
    const btnPlayAgain = document.getElementById('btn-play-again');
    if (btnPlayAgain) {
        btnPlayAgain.addEventListener('click', () => {
            UI.hideVictoryModal();
            const session = GameEngine.restart();
            UI.renderBoard(session.cards, session.config.cols, (idx) => GameEngine.flipCard(idx));
        });
    }

    const btnVictoryHome = document.getElementById('btn-victory-home');
    if (btnVictoryHome) {
        btnVictoryHome.addEventListener('click', () => {
            UI.hideVictoryModal();
            UI.showScreen('screen-home');
            UI.updateHomeQuickStats();
        });
    }

    const btnVictoryLeaderboard = document.getElementById('btn-victory-leaderboard');
    if (btnVictoryLeaderboard) {
        btnVictoryLeaderboard.addEventListener('click', () => {
            UI.hideVictoryModal();
            loadLeaderboardScreen();
        });
    }

    // -------------------------------------------------------------------------
    // LEADERBOARD SCREEN
    // -------------------------------------------------------------------------
    let currentLeaderboardFilter = 'ALL';

    async function loadLeaderboardScreen() {
        UI.showScreen('screen-leaderboard');
        await fetchAndDisplayLeaderboard(currentLeaderboardFilter);
    }

    async function fetchAndDisplayLeaderboard(difficulty) {
        currentLeaderboardFilter = difficulty;
        try {
            const data = await Api.getLeaderboard(difficulty, 10);
            UI.renderLeaderboard(data, difficulty);
        } catch (err) {
            console.warn('Leaderboard API fetch failed:', err);
            UI.renderLeaderboard([], difficulty);
        }
    }

    document.querySelectorAll('.leaderboard-filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.leaderboard-filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const diff = tab.getAttribute('data-filter');
            fetchAndDisplayLeaderboard(diff);
            AudioManager.playClick();
        });
    });

    const btnRefreshLeaderboard = document.getElementById('btn-refresh-leaderboard');
    if (btnRefreshLeaderboard) {
        btnRefreshLeaderboard.addEventListener('click', () => {
            fetchAndDisplayLeaderboard(currentLeaderboardFilter);
            UI.showToast('Leaderboard refreshed', 'info');
        });
    }

    const btnBackFromLeaderboard = document.getElementById('btn-back-from-leaderboard');
    if (btnBackFromLeaderboard) {
        btnBackFromLeaderboard.addEventListener('click', () => {
            UI.showScreen('screen-home');
        });
    }

    // -------------------------------------------------------------------------
    // STATISTICS SCREEN
    // -------------------------------------------------------------------------
    async function loadStatisticsScreen() {
        UI.showScreen('screen-stats');
        const playerId = Storage.getPlayerId();

        try {
            const [playerStats, historyList] = await Promise.all([
                Api.getPlayerStats(playerId).catch(() => ({})),
                Api.getPlayerHistory(playerId, 15).catch(() => ([]))
            ]);

            const mergedStats = {
                totalGamesPlayed: playerStats.totalGamesPlayed || Storage.getLocalStats().played,
                totalGamesCompleted: playerStats.totalGamesCompleted || Storage.getLocalStats().won,
                winRate: playerStats.winRate || 100,
                highestScore: playerStats.highestScore || Storage.getLocalStats().highScore,
                averageCompletionTime: playerStats.averageCompletionTime || Storage.getLocalStats().bestTime,
                averageMoves: playerStats.averageMoves || 0,
                bestDifficulty: playerStats.bestDifficulty || 'EASY'
            };

            UI.renderStatisticsDashboard(mergedStats, historyList);
        } catch (err) {
            console.warn('Stats fetch error:', err);
            const local = Storage.getLocalStats();
            UI.renderStatisticsDashboard({
                totalGamesPlayed: local.played,
                totalGamesCompleted: local.won,
                winRate: 100,
                highestScore: local.highScore,
                averageCompletionTime: local.bestTime,
                averageMoves: 0,
                bestDifficulty: 'EASY'
            }, []);
        }
    }

    const btnBackFromStats = document.getElementById('btn-back-from-stats');
    if (btnBackFromStats) {
        btnBackFromStats.addEventListener('click', () => {
            UI.showScreen('screen-home');
        });
    }

    // -------------------------------------------------------------------------
    // HOW TO PLAY SCREEN
    // -------------------------------------------------------------------------
    const btnBackFromHowTo = document.getElementById('btn-back-from-howto');
    if (btnBackFromHowTo) {
        btnBackFromHowTo.addEventListener('click', () => {
            UI.showScreen('screen-home');
        });
    }

    // Keyboard Shortcuts (Esc to pause/resume)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const isGameActive = document.getElementById('screen-game').classList.contains('active');
            if (isGameActive) {
                const state = GameEngine.getState();
                if (state.isPaused) {
                    UI.hidePauseModal();
                    GameEngine.resume();
                } else if (!state.isGameOver) {
                    GameEngine.pause();
                    UI.showPauseModal();
                }
            }
        }
    });

    // Check Backend Connectivity silently on startup
    Api.checkHealth().then(res => {
        console.log('[System] Connected to Spring Boot Backend:', res);
    }).catch(err => {
        console.log('[System] Running with local browser persistence (Backend connecting...)');
    });
});
