/**
 * Memory Flip - Master
 * API Module: REST Client for Spring Boot Backend
 */
const Api = (() => {
    const BASE_URL = window.location.origin;

    async function request(endpoint, options = {}) {
        const url = `${BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(options.headers || {})
        };

        try {
            const response = await fetch(url, { ...options, headers });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const message = errorData.message || `Request failed with status ${response.status}`;
                throw new Error(message);
            }
            return await response.json();
        } catch (err) {
            console.warn(`[API] Call to ${endpoint} failed:`, err.message);
            throw err;
        }
    }

    async function checkHealth() {
        return request('/api/health');
    }

    async function submitGameCompletion(payload) {
        return request('/api/games/complete', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    async function getLeaderboard(difficulty = null, limit = 10) {
        let endpoint = `/api/leaderboard?limit=${limit}`;
        if (difficulty && difficulty !== 'ALL') {
            endpoint = `/api/leaderboard/${encodeURIComponent(difficulty)}?limit=${limit}`;
        }
        return request(endpoint);
    }

    async function getOverallStats() {
        return request('/api/stats');
    }

    async function getPlayerStats(playerId) {
        return request(`/api/stats/player/${encodeURIComponent(playerId)}`);
    }

    async function getPlayerHistory(playerId, limit = 10) {
        return request(`/api/games/history/${encodeURIComponent(playerId)}?limit=${limit}`);
    }

    return {
        checkHealth,
        submitGameCompletion,
        getLeaderboard,
        getOverallStats,
        getPlayerStats,
        getPlayerHistory
    };
})();
