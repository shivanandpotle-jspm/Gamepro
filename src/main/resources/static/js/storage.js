/**
 * Memory Flip - Master
 * Storage Module: Manages player identity and local preferences
 */
const Storage = (() => {
    const KEYS = {
        PLAYER_ID: 'mf_player_id',
        PLAYER_NAME: 'mf_player_name',
        SOUND_MUTED: 'mf_sound_muted',
        CURRENT_LEVEL: 'mf_current_level',
        HIGH_SCORE: 'mf_high_score',
        GAMES_PLAYED: 'mf_games_played',
        GAMES_WON: 'mf_games_won',
        BEST_TIME: 'mf_best_time'
    };

    function generateUUID() {
        return 'p-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
    }

    function getPlayerId() {
        let id = localStorage.getItem(KEYS.PLAYER_ID);
        if (!id) {
            id = generateUUID();
            localStorage.setItem(KEYS.PLAYER_ID, id);
        }
        return id;
    }

    function getPlayerName() {
        return localStorage.getItem(KEYS.PLAYER_NAME) || 'MemoryMaster';
    }

    function setPlayerName(name) {
        const trimmed = (name || '').trim();
        if (trimmed) {
            localStorage.setItem(KEYS.PLAYER_NAME, trimmed);
        }
    }

    function isSoundMuted() {
        return localStorage.getItem(KEYS.SOUND_MUTED) === 'true';
    }

    function setSoundMuted(muted) {
        localStorage.setItem(KEYS.SOUND_MUTED, muted ? 'true' : 'false');
    }

    function getProgressLevel() {
        return parseInt(localStorage.getItem(KEYS.CURRENT_LEVEL) || '1', 10);
    }

    function setProgressLevel(level) {
        const current = getProgressLevel();
        if (level > current) {
            localStorage.setItem(KEYS.CURRENT_LEVEL, level.toString());
        }
    }

    function getLocalStats() {
        return {
            played: parseInt(localStorage.getItem(KEYS.GAMES_PLAYED) || '0', 10),
            won: parseInt(localStorage.getItem(KEYS.GAMES_WON) || '0', 10),
            highScore: parseInt(localStorage.getItem(KEYS.HIGH_SCORE) || '0', 10),
            bestTime: parseInt(localStorage.getItem(KEYS.BEST_TIME) || '0', 10)
        };
    }

    function recordGameResult(score, timeSeconds, won) {
        const stats = getLocalStats();
        stats.played += 1;
        if (won) {
            stats.won += 1;
            if (score > stats.highScore) {
                stats.highScore = score;
                localStorage.setItem(KEYS.HIGH_SCORE, score.toString());
            }
            if (stats.bestTime === 0 || timeSeconds < stats.bestTime) {
                stats.bestTime = timeSeconds;
                localStorage.setItem(KEYS.BEST_TIME, timeSeconds.toString());
            }
        }
        localStorage.setItem(KEYS.GAMES_PLAYED, stats.played.toString());
        localStorage.setItem(KEYS.GAMES_WON, stats.won.toString());
    }

    return {
        getPlayerId,
        getPlayerName,
        setPlayerName,
        isSoundMuted,
        setSoundMuted,
        getProgressLevel,
        setProgressLevel,
        getLocalStats,
        recordGameResult
    };
})();
