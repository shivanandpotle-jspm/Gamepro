package com.memoryflip.controller;

import com.memoryflip.dto.GameCompleteRequest;
import com.memoryflip.dto.GameSessionResponse;
import com.memoryflip.service.GameService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/complete")
    public ResponseEntity<GameSessionResponse> completeGame(@Valid @RequestBody GameCompleteRequest request) {
        GameSessionResponse response = gameService.saveGameSession(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/history/{playerId}")
    public ResponseEntity<List<GameSessionResponse>> getPlayerHistory(
            @PathVariable String playerId,
            @RequestParam(defaultValue = "10") int limit) {
        List<GameSessionResponse> history = gameService.getPlayerGameHistory(playerId, limit);
        return ResponseEntity.ok(history);
    }
}
