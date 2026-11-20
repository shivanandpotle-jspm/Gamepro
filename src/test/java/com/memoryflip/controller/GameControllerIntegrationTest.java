package com.memoryflip.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.memoryflip.dto.GameCompleteRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class GameControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/health should return UP status and 200 OK")
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")))
                .andExpect(jsonPath("$.application", containsString("Memory Flip")))
                .andExpect(jsonPath("$.database", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/games/complete should save session and return 201 CREATED")
    void testCompleteGameSuccess() throws Exception {
        GameCompleteRequest request = new GameCompleteRequest();
        request.setPlayerId("test-player-1");
        request.setPlayerName("AlexR");
        request.setDifficulty("EASY");
        request.setLevel(1);
        request.setScore(950);
        request.setMoves(8);
        request.setMatches(6);
        request.setCompletionTime(25);
        request.setAccuracy(92.0);
        request.setStars(3);
        request.setHintsUsed(0);
        request.setShufflesUsed(0);

        mockMvc.perform(post("/api/games/complete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.playerName", is("AlexR")))
                .andExpect(jsonPath("$.score", is(950)))
                .andExpect(jsonPath("$.stars", is(3)));
    }

    @Test
    @DisplayName("POST /api/games/complete with invalid data should return 400 Bad Request with field errors")
    void testCompleteGameValidationFailure() throws Exception {
        GameCompleteRequest invalidRequest = new GameCompleteRequest();
        // Missing required fields like playerId, playerName, negative score, etc.
        invalidRequest.setScore(-50);
        invalidRequest.setMoves(0);

        mockMvc.perform(post("/api/games/complete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Validation Failed")))
                .andExpect(jsonPath("$.fieldErrors", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/leaderboard should return 200 OK and an array")
    void testGetLeaderboard() throws Exception {
        mockMvc.perform(get("/api/leaderboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(Iterable.class)));
    }

    @Test
    @DisplayName("GET /api/stats should return overall statistics")
    void testGetOverallStats() throws Exception {
        mockMvc.perform(get("/api/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSessions", notNullValue()))
                .andExpect(jsonPath("$.totalPlayers", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/leaderboard/EASY should return filtered leaderboard")
    void testGetLeaderboardByDifficulty() throws Exception {
        mockMvc.perform(get("/api/leaderboard/EASY"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(Iterable.class)));
    }

    @Test
    @DisplayName("GET /api/games/history/{playerId} should return history list")
    void testGetPlayerHistory() throws Exception {
        mockMvc.perform(get("/api/games/history/test-player-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(Iterable.class)));
    }

    @Test
    @DisplayName("GET /api/stats/player/{playerId} should return player stats")
    void testGetPlayerStats() throws Exception {
        mockMvc.perform(get("/api/stats/player/test-player-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.playerId", is("test-player-1")))
                .andExpect(jsonPath("$.totalGamesCompleted", greaterThanOrEqualTo(1)));
    }
}
