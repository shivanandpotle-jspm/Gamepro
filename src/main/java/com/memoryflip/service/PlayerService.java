package com.memoryflip.service;

import com.memoryflip.entity.Player;
import com.memoryflip.repository.PlayerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @Transactional
    public Player getOrCreatePlayer(String playerId, String playerName) {
        Optional<Player> existing = playerRepository.findByPlayerId(playerId);
        if (existing.isPresent()) {
            Player player = existing.get();
            if (playerName != null && !playerName.trim().isEmpty() && !playerName.equals(player.getPlayerName())) {
                player.setPlayerName(playerName.trim());
            }
            player.setLastActiveAt(LocalDateTime.now());
            return playerRepository.save(player);
        } else {
            Player newPlayer = new Player(playerId, playerName != null ? playerName.trim() : "Player");
            return playerRepository.save(newPlayer);
        }
    }

    public Optional<Player> findByPlayerId(String playerId) {
        return playerRepository.findByPlayerId(playerId);
    }
}
