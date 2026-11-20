package com.memoryflip.dto;

import java.time.LocalDateTime;

public class LeaderboardEntryDto {

    private int rank;
    private Long sessionId;
    private String playerId;
    private String playerName;
    private String difficulty;
    private int score;
    private int completionTime; // seconds
    private int moves;
    private int level;
    private int stars;
    private double accuracy;
    private LocalDateTime completedAt;

    public LeaderboardEntryDto() {
    }

    public LeaderboardEntryDto(int rank, Long sessionId, String playerId, String playerName, String difficulty,
                               int score, int completionTime, int moves, int level, int stars,
                               double accuracy, LocalDateTime completedAt) {
        this.rank = rank;
        this.sessionId = sessionId;
        this.playerId = playerId;
        this.playerName = playerName;
        this.difficulty = difficulty;
        this.score = score;
        this.completionTime = completionTime;
        this.moves = moves;
        this.level = level;
        this.stars = stars;
        this.accuracy = accuracy;
        this.completedAt = completedAt;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
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

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getCompletionTime() {
        return completionTime;
    }

    public void setCompletionTime(int completionTime) {
        this.completionTime = completionTime;
    }

    public int getMoves() {
        return moves;
    }

    public void setMoves(int moves) {
        this.moves = moves;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getStars() {
        return stars;
    }

    public void setStars(int stars) {
        this.stars = stars;
    }

    public double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(double accuracy) {
        this.accuracy = accuracy;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
