package com.memoryflip.service;

import com.memoryflip.dto.OverallStatsDto;
import com.memoryflip.dto.PlayerStatsDto;
import com.memoryflip.entity.Player;
import com.memoryflip.exception.ResourceNotFoundException;
import com.memoryflip.repository.GameSessionRepository;
import com.memoryflip.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class StatsService {

    private final GameSessionRepository gameSessionRepository;
    private final PlayerRepository playerRepository;

    public StatsService(GameSessionRepository gameSessionRepository, PlayerRepository playerRepository) {
        this.gameSessionRepository = gameSessionRepository;
        this.playerRepository = playerRepository;
    }

    public OverallStatsDto getOverallStats() {
        OverallStatsDto dto = new OverallStatsDto();
        long totalSessions = gameSessionRepository.count();
        long totalPlayers = playerRepository.count();

        dto.setTotalSessions(totalSessions);
        dto.setTotalPlayers(totalPlayers);
        dto.setHighestScore(gameSessionRepository.findOverallMaxScore().orElse(0));
        dto.setAverageScore(round(gameSessionRepository.findOverallAvgScore().orElse(0.0)));
        dto.setAverageCompletionTime(round(gameSessionRepository.findOverallAvgCompletionTime().orElse(0.0)));
        dto.setAverageMoves(round(gameSessionRepository.findOverallAvgMoves().orElse(0.0)));

        List<Object[]> popularDiff = gameSessionRepository.findOverallPopularDifficulty();
        if (!popularDiff.isEmpty() && popularDiff.get(0).length > 0) {
            dto.setPopularDifficulty((String) popularDiff.get(0)[0]);
        } else {
            dto.setPopularDifficulty("EASY");
        }

        return dto;
    }

    public PlayerStatsDto getPlayerStats(String playerId) {
        Player player = playerRepository.findByPlayerId(playerId)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + playerId));

        long count = gameSessionRepository.countByPlayerId(playerId);

        PlayerStatsDto dto = new PlayerStatsDto();
        dto.setPlayerId(player.getPlayerId());
        dto.setPlayerName(player.getPlayerName());
        dto.setTotalGamesPlayed(count);
        dto.setTotalGamesCompleted(count);
        dto.setWinRate(count > 0 ? 100.0 : 0.0); // All submitted sessions are completed wins
        dto.setHighestScore(gameSessionRepository.findMaxScoreByPlayerId(playerId).orElse(0));
        dto.setAverageScore(round(gameSessionRepository.findAvgScoreByPlayerId(playerId).orElse(0.0)));
        dto.setAverageCompletionTime(round(gameSessionRepository.findAvgCompletionTimeByPlayerId(playerId).orElse(0.0)));
        dto.setAverageMoves(round(gameSessionRepository.findAvgMovesByPlayerId(playerId).orElse(0.0)));
        dto.setAverageAccuracy(round(gameSessionRepository.findAvgAccuracyByPlayerId(playerId).orElse(0.0)));
        dto.setHighestLevelReached(gameSessionRepository.findMaxLevelByPlayerId(playerId).orElse(1));
        dto.setTotalStars(gameSessionRepository.findTotalStarsByPlayerId(playerId).orElse(0));

        List<Object[]> favDiff = gameSessionRepository.findFavoriteDifficultyByPlayerId(playerId);
        if (!favDiff.isEmpty() && favDiff.get(0).length > 0) {
            dto.setBestDifficulty((String) favDiff.get(0)[0]);
        } else {
            dto.setBestDifficulty("EASY");
        }

        return dto;
    }

    private double round(Double value) {
        if (value == null) return 0.0;
        return BigDecimal.valueOf(value)
                .setScale(1, RoundingMode.HALF_UP)
                .doubleValue();
    }
}
