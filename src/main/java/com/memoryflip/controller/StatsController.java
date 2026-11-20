package com.memoryflip.controller;

import com.memoryflip.dto.OverallStatsDto;
import com.memoryflip.dto.PlayerStatsDto;
import com.memoryflip.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping
    public ResponseEntity<OverallStatsDto> getOverallStats() {
        OverallStatsDto stats = statsService.getOverallStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/player/{playerId}")
    public ResponseEntity<PlayerStatsDto> getPlayerStats(@PathVariable String playerId) {
        PlayerStatsDto stats = statsService.getPlayerStats(playerId);
        return ResponseEntity.ok(stats);
    }
}
