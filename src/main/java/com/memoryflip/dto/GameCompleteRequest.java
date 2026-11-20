package com.memoryflip.dto;

import jakarta.validation.constraints.*;

public class GameCompleteRequest {

    @NotBlank(message = "Player ID is required")
    @Size(max = 100, message = "Player ID must not exceed 100 characters")
    private String playerId;

    @NotBlank(message = "Player name is required")
    @Size(min = 1, max = 50, message = "Player name must be between 1 and 50 characters")
    private String playerName;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;

    @Min(value = 1, message = "Level must be at least 1")
    private int level = 1;

    @Min(value = 0, message = "Score cannot be negative")
    @Max(value = 1000000, message = "Score exceeds maximum allowed value")
    private int score;

    @Min(value = 1, message = "Moves must be at least 1")
    @Max(value = 10000, message = "Moves exceeds maximum realistic limit")
    private int moves;

    @Min(value = 1, message = "Matches must be at least 1")
    @Max(value = 100, message = "Matches exceeds maximum realistic limit")
    private int matches;

    @Min(value = 1, message = "Completion time must be at least 1 second")
    @Max(value = 86400, message = "Completion time exceeds maximum allowed")
    private int completionTime;

    @DecimalMin(value = "0.0", message = "Accuracy cannot be negative")
    @DecimalMax(value = "100.0", message = "Accuracy cannot exceed 100%")
    private double accuracy;

    @Min(value = 0, message = "Stars cannot be negative")
    @Max(value = 3, message = "Stars cannot exceed 3")
    private int stars;

    @Min(value = 0, message = "Hints used cannot be negative")
    private int hintsUsed;

    @Min(value = 0, message = "Shuffles used cannot be negative")
    private int shufflesUsed;

    public GameCompleteRequest() {
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getMoves() {
        return moves;
    }

    public void setMoves(int moves) {
        this.moves = moves;
    }

    public int getMatches() {
        return matches;
    }

    public void setMatches(int matches) {
        this.matches = matches;
    }

    public int getCompletionTime() {
        return completionTime;
    }

    public void setCompletionTime(int completionTime) {
        this.completionTime = completionTime;
    }

    public double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(double accuracy) {
        this.accuracy = accuracy;
    }

    public int getStars() {
        return stars;
    }

    public void setStars(int stars) {
        this.stars = stars;
    }

    public int getHintsUsed() {
        return hintsUsed;
    }

    public void setHintsUsed(int hintsUsed) {
        this.hintsUsed = hintsUsed;
    }

    public int getShufflesUsed() {
        return shufflesUsed;
    }

    public void setShufflesUsed(int shufflesUsed) {
        this.shufflesUsed = shufflesUsed;
    }
}
