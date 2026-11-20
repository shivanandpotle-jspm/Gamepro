package com.memoryflip.controller;

import com.memoryflip.dto.LeaderboardEntryDto;
import com.memoryflip.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public ResponseEntity<List<LeaderboardEntryDto>> getLeaderboard(
            @RequestParam(defaultValue = "10") int limit) {
        List<LeaderboardEntryDto> leaderboard = leaderboardService.getGlobalLeaderboard(limit);
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/{difficulty}")
    public ResponseEntity<List<LeaderboardEntryDto>> getLeaderboardByDifficulty(
            @PathVariable String difficulty,
            @RequestParam(defaultValue = "10") int limit) {
        List<LeaderboardEntryDto> leaderboard = leaderboardService.getLeaderboardByDifficulty(difficulty, limit);
        return ResponseEntity.ok(leaderboard);
    }
}
