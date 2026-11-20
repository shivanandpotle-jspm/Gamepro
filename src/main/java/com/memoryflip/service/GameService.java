package com.memoryflip.service;

import com.memoryflip.dto.GameCompleteRequest;
import com.memoryflip.dto.GameSessionResponse;
import com.memoryflip.entity.GameSession;
import com.memoryflip.entity.Player;
import com.memoryflip.repository.GameSessionRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GameService {

    private final GameSessionRepository gameSessionRepository;
    private final PlayerService playerService;

    public GameService(GameSessionRepository gameSessionRepository, PlayerService playerService) {
        this.gameSessionRepository = gameSessionRepository;
        this.playerService = playerService;
    }

    @Transactional
    public GameSessionResponse saveGameSession(GameCompleteRequest request) {
        Player player = playerService.getOrCreatePlayer(request.getPlayerId(), request.getPlayerName());

        GameSession session = new GameSession();
        session.setPlayer(player);
        session.setDifficulty(request.getDifficulty().toUpperCase().trim());
        session.setLevel(request.getLevel());
        session.setScore(request.getScore());
        session.setMoves(request.getMoves());
        session.setMatches(request.getMatches());
        session.setCompletionTime(request.getCompletionTime());
        session.setAccuracy(request.getAccuracy());
        session.setStars(request.getStars());
        session.setHintsUsed(request.getHintsUsed());
        session.setShufflesUsed(request.getShufflesUsed());
        session.setCompletedAt(LocalDateTime.now());

        GameSession saved = gameSessionRepository.save(session);
        return mapToResponse(saved);
    }

    public List<GameSessionResponse> getPlayerGameHistory(String playerId, int limit) {
        int safeLimit = Math.min(Math.max(limit, 1), 50);
        List<GameSession> sessions = gameSessionRepository.findByPlayer_PlayerIdOrderByCompletedAtDesc(
                playerId, PageRequest.of(0, safeLimit));
        return sessions.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public GameSessionResponse mapToResponse(GameSession session) {
        GameSessionResponse dto = new GameSessionResponse();
        dto.setId(session.getId());
        dto.setPlayerId(session.getPlayer().getPlayerId());
        dto.setPlayerName(session.getPlayer().getPlayerName());
        dto.setDifficulty(session.getDifficulty());
        dto.setLevel(session.getLevel());
        dto.setScore(session.getScore());
        dto.setMoves(session.getMoves());
        dto.setMatches(session.getMatches());
        dto.setCompletionTime(session.getCompletionTime());
        dto.setAccuracy(session.getAccuracy());
        dto.setStars(session.getStars());
        dto.setHintsUsed(session.getHintsUsed());
        dto.setShufflesUsed(session.getShufflesUsed());
        dto.setCompletedAt(session.getCompletedAt());
        return dto;
    }
}
