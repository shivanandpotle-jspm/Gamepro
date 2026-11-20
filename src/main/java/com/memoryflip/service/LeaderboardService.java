package com.memoryflip.service;

import com.memoryflip.dto.LeaderboardEntryDto;
import com.memoryflip.entity.GameSession;
import com.memoryflip.repository.GameSessionRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LeaderboardService {

    private final GameSessionRepository gameSessionRepository;

    public LeaderboardService(GameSessionRepository gameSessionRepository) {
        this.gameSessionRepository = gameSessionRepository;
    }

    public List<LeaderboardEntryDto> getGlobalLeaderboard(int limit) {
        int safeLimit = Math.min(Math.max(limit, 1), 50);
        List<GameSession> sessions = gameSessionRepository.findTopLeaderboard(PageRequest.of(0, safeLimit));
        return buildRankedList(sessions);
    }

    public List<LeaderboardEntryDto> getLeaderboardByDifficulty(String difficulty, int limit) {
        int safeLimit = Math.min(Math.max(limit, 1), 50);
        List<GameSession> sessions = gameSessionRepository.findTopLeaderboardByDifficulty(
                difficulty.toUpperCase().trim(), PageRequest.of(0, safeLimit));
        return buildRankedList(sessions);
    }

    private List<LeaderboardEntryDto> buildRankedList(List<GameSession> sessions) {
        List<LeaderboardEntryDto> result = new ArrayList<>();
        int rank = 1;
        for (GameSession session : sessions) {
            LeaderboardEntryDto dto = new LeaderboardEntryDto(
                    rank++,
                    session.getId(),
                    session.getPlayer().getPlayerId(),
                    session.getPlayer().getPlayerName(),
                    session.getDifficulty(),
                    session.getScore(),
                    session.getCompletionTime(),
                    session.getMoves(),
                    session.getLevel(),
                    session.getStars(),
                    session.getAccuracy(),
                    session.getCompletedAt()
            );
            result.add(dto);
        }
        return result;
    }
}
