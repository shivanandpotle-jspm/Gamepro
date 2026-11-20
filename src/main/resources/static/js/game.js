/**
 * Memory Flip - Master
 * Game Engine: State, Mechanics, Cards, Timer, Scoring
 */
const GameEngine = (() => {
    // Symbol Sets
    const SYMBOLS = [
        '🚀', '⭐', '🔥', '💎', '🪐', '⚡', '🌙', '🎯',
        '🍎', '🍇', '🍉', '🍓', '🍒', '🥑', '🍍', '🥝',
        '⚽', '🏀', '🎾', '🏆', '🎮', '🎲', '🎸', '🎨',
        '🦁', '🐬', '🦅', '🦄', '🐲', '🦋', '🦊', '🐼'
    ];

    // Difficulty presets
    const DIFFICULTIES = {
        EASY:   { name: 'EASY',   rows: 4, cols: 3, pairs: 6,  targetTime: 45,  mult: 1.0 },
        MEDIUM: { name: 'MEDIUM', rows: 4, cols: 4, pairs: 8,  targetTime: 60,  mult: 1.5 },
        HARD:   { name: 'HARD',   rows: 5, cols: 4, pairs: 10, targetTime: 90,  mult: 2.0 },
        EXPERT: { name: 'EXPERT', rows: 6, cols: 4, pairs: 12, targetTime: 120, mult: 2.5 }
    };

    // State
    let currentDifficulty = 'EASY';
    let currentLevel = 1;
    let isProgressive = false;

    let cards = [];
    let flippedIndices = [];
    let isEvaluating = false;
    let isPaused = false;
    let isGameOver = false;

    let score = 0;
    let moves = 0;
    let matches = 0;
    let totalPairs = 6;
    let streak = 0;
    let maxStreak = 0;
    let hintsUsed = 0;
    let shufflesUsed = 0;

    let timerInterval = null;
    let timerSeconds = 0;
    let timerStarted = false;

    // Callbacks for UI updates
    let onStateChange = () => {};
    let onGameComplete = () => {};

    function setListeners(stateCallback, completeCallback) {
        onStateChange = stateCallback;
        onGameComplete = completeCallback;
    }

    // Progressive Level Configurator (Level 1..20+)
    function getLevelConfig(lvl) {
        if (lvl <= 3) {
            return { difficulty: 'EASY', rows: 4, cols: 3, pairs: 6, targetTime: Math.max(30, 50 - lvl * 5), mult: 1.0 };
        } else if (lvl <= 8) {
            return { difficulty: 'MEDIUM', rows: 4, cols: 4, pairs: 8, targetTime: Math.max(45, 75 - lvl * 3), mult: 1.5 };
        } else if (lvl <= 14) {
            return { difficulty: 'HARD', rows: 5, cols: 4, pairs: 10, targetTime: Math.max(60, 110 - lvl * 3), mult: 2.0 };
        } else {
            // Level 15-20+ (Expert / Master)
            const extraDifficulty = Math.min(lvl - 15, 10);
            return {
                difficulty: 'EXPERT',
                rows: 6,
                cols: 4,
                pairs: 12,
                targetTime: Math.max(50, 130 - extraDifficulty * 4),
                mult: 2.5 + (lvl > 20 ? (lvl - 20) * 0.1 : 0)
            };
        }
    }

    // Fisher-Yates Shuffle
    function shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Initialize Game Session
    function startSession(difficultyKey, levelNum = 1, progressiveMode = false) {
        stopTimer();

        isProgressive = progressiveMode;
        currentLevel = levelNum;

        let config;
        if (isProgressive) {
            config = getLevelConfig(currentLevel);
            currentDifficulty = config.difficulty;
        } else {
            currentDifficulty = (difficultyKey || 'EASY').toUpperCase();
            config = DIFFICULTIES[currentDifficulty] || DIFFICULTIES.EASY;
        }

        totalPairs = config.pairs;
        score = 0;
        moves = 0;
        matches = 0;
        streak = 0;
        maxStreak = 0;
        hintsUsed = 0;
        shufflesUsed = 0;
        flippedIndices = [];
        isEvaluating = false;
        isPaused = false;
        isGameOver = false;
        timerSeconds = 0;
        timerStarted = false;

        // Pick distinct symbols
        const shuffledSymbols = shuffle(SYMBOLS).slice(0, totalPairs);
        // Duplicate to form pairs
        const deck = [];
        shuffledSymbols.forEach((sym, idx) => {
            deck.push({ id: `card-${idx}-a`, pairId: idx, symbol: sym, isFlipped: false, isMatched: false });
            deck.push({ id: `card-${idx}-b`, pairId: idx, symbol: sym, isFlipped: false, isMatched: false });
        });

        cards = shuffle(deck);

        notifyState();
        return {
            config,
            cards,
            currentDifficulty,
            currentLevel,
            isProgressive
        };
    }

    // Timer functions
    function startTimer() {
        if (timerInterval || isGameOver) return;
        timerStarted = true;
        timerInterval = setInterval(() => {
            if (!isPaused && !isGameOver) {
                timerSeconds++;
                notifyState();
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    // Flip Card Action
    function flipCard(index) {
        if (isPaused || isGameOver || isEvaluating) return false;
        if (index < 0 || index >= cards.length) return false;

        const card = cards[index];
        if (card.isFlipped || card.isMatched) return false;

        // Start timer on first user interaction
        if (!timerStarted) {
            startTimer();
        }

        // Flip the card
        card.isFlipped = true;
        flippedIndices.push(index);
        AudioManager.playFlip();

        if (flippedIndices.length === 2) {
            moves++;
            isEvaluating = true;
            notifyState();
            evaluateMatch();
        } else {
            notifyState();
        }

        return true;
    }

    // Evaluate the 2 flipped cards
    function evaluateMatch() {
        const [idx1, idx2] = flippedIndices;
        const card1 = cards[idx1];
        const card2 = cards[idx2];

        if (card1.pairId === card2.pairId) {
            // MATCH!
            card1.isMatched = true;
            card2.isMatched = true;
            matches++;
            streak++;
            if (streak > maxStreak) maxStreak = streak;

            // Calculate match points with streak multiplier
            const streakMult = 1 + (streak - 1) * 0.25; // 1.0x, 1.25x, 1.5x...
            const matchPoints = Math.round(100 * streakMult);
            score += matchPoints;

            AudioManager.playMatch();
            flippedIndices = [];
            isEvaluating = false;

            notifyState();

            // Check if all pairs are matched
            if (matches === totalPairs) {
                handleVictory();
            }
        } else {
            // MISMATCH!
            streak = 0;
            AudioManager.playMismatch();

            // Give a small penalty
            score = Math.max(0, score - 10);

            // Trigger shake animation via state then flip back after delay
            setTimeout(() => {
                if (!isGameOver) {
                    card1.isFlipped = false;
                    card2.isFlipped = false;
                    flippedIndices = [];
                    isEvaluating = false;
                    notifyState();
                }
            }, 850);
        }
    }

    // Scoring Breakdown Calculation
    function calculateBreakdown() {
        const config = isProgressive ? getLevelConfig(currentLevel) : (DIFFICULTIES[currentDifficulty] || DIFFICULTIES.EASY);
        
        // Base Match Score
        const baseScore = matches * 100;

        // Time Bonus: faster than target = high bonus
        let timeBonus = 0;
        if (timerSeconds < config.targetTime) {
            timeBonus = Math.round((config.targetTime - timerSeconds) * 15 * config.mult);
        }

        // Move Efficiency Bonus
        // Optimal moves = totalPairs
        const moveRatio = totalPairs / Math.max(moves, totalPairs);
        const moveBonus = Math.round(moveRatio * 200 * config.mult);

        // Streak Bonus
        const streakBonus = Math.round(maxStreak * 40 * config.mult);

        // Hint Penalty
        const hintPenalty = hintsUsed * 30;

        // Final Calculated Score
        const total = Math.max(100, Math.round((baseScore + timeBonus + moveBonus + streakBonus - hintPenalty) * config.mult));

        // Star Rating (1 to 3 stars)
        let stars = 1;
        const accuracy = Math.round((matches / Math.max(moves, 1)) * 100);
        if (accuracy >= 80 && timerSeconds <= config.targetTime) {
            stars = 3;
        } else if (accuracy >= 60 || timerSeconds <= config.targetTime * 1.3) {
            stars = 2;
        }

        return {
            baseScore,
            timeBonus,
            moveBonus,
            streakBonus,
            hintPenalty,
            total,
            stars,
            accuracy,
            completionTime: timerSeconds
        };
    }

    // Handle Victory
    function handleVictory() {
        stopTimer();
        isGameOver = true;
        AudioManager.playVictory();

        const breakdown = calculateBreakdown();
        score = breakdown.total;

        // If in progressive mode, unlock next level
        if (isProgressive) {
            Storage.setProgressLevel(currentLevel + 1);
        }

        // Record in local storage
        Storage.recordGameResult(score, timerSeconds, true);

        onGameComplete({
            difficulty: currentDifficulty,
            level: currentLevel,
            isProgressive,
            score,
            moves,
            matches,
            totalPairs,
            completionTime: timerSeconds,
            accuracy: breakdown.accuracy,
            stars: breakdown.stars,
            hintsUsed,
            shufflesUsed,
            breakdown
        });
    }

    // Power-up: Hint (peeks one unrevealed matching pair for 1.2s)
    function useHint() {
        if (isPaused || isGameOver || isEvaluating) return null;

        // Find unmatched pairs
        const unmatched = cards
            .map((c, idx) => ({ ...c, originalIndex: idx }))
            .filter(c => !c.isMatched && !c.isFlipped);

        if (unmatched.length < 2) return null;

        // Group by pairId
        const pairsMap = {};
        unmatched.forEach(c => {
            if (!pairsMap[c.pairId]) pairsMap[c.pairId] = [];
            pairsMap[c.pairId].push(c.originalIndex);
        });

        // Find a complete pair of 2
        for (const pairId in pairsMap) {
            if (pairsMap[pairId].length === 2) {
                const [idxA, idxB] = pairsMap[pairId];
                hintsUsed++;
                score = Math.max(0, score - 25);
                AudioManager.playHint();

                // Flash them
                cards[idxA].isHinted = true;
                cards[idxB].isHinted = true;
                notifyState();

                setTimeout(() => {
                    if (cards[idxA]) cards[idxA].isHinted = false;
                    if (cards[idxB]) cards[idxB].isHinted = false;
                    notifyState();
                }, 1200);

                return [idxA, idxB];
            }
        }
        return null;
    }

    // Power-up: Shuffle remaining unmatched cards
    function useShuffle() {
        if (isPaused || isGameOver || isEvaluating || shufflesUsed > 0) return false;

        const unmatchedIndices = [];
        const unmatchedCards = [];

        cards.forEach((c, idx) => {
            if (!c.isMatched && !c.isFlipped) {
                unmatchedIndices.push(idx);
                unmatchedCards.push(c);
            }
        });

        if (unmatchedCards.length <= 2) return false;

        const shuffledUnmatched = shuffle(unmatchedCards);
        unmatchedIndices.forEach((targetIdx, i) => {
            cards[targetIdx] = shuffledUnmatched[i];
        });

        shufflesUsed++;
        AudioManager.playClick();
        notifyState();
        return true;
    }

    function pause() {
        if (isGameOver) return;
        isPaused = true;
        notifyState();
    }

    function resume() {
        if (isGameOver) return;
        isPaused = false;
        notifyState();
    }

    function restart() {
        return startSession(currentDifficulty, currentLevel, isProgressive);
    }

    function notifyState() {
        const accuracy = moves > 0 ? Math.round((matches / moves) * 100) : 100;
        onStateChange({
            cards,
            currentDifficulty,
            currentLevel,
            isProgressive,
            score,
            moves,
            matches,
            totalPairs,
            streak,
            timerSeconds,
            isPaused,
            isGameOver,
            hintsUsed,
            shufflesUsed,
            accuracy
        });
    }

    function getState() {
        return {
            cards,
            currentDifficulty,
            currentLevel,
            isProgressive,
            score,
            moves,
            matches,
            totalPairs,
            streak,
            timerSeconds,
            isPaused,
            isGameOver,
            hintsUsed,
            shufflesUsed
        };
    }

    return {
        DIFFICULTIES,
        setListeners,
        startSession,
        flipCard,
        useHint,
        useShuffle,
        pause,
        resume,
        restart,
        getState,
        getLevelConfig
    };
})();
