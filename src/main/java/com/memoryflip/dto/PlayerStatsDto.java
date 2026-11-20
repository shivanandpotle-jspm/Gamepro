package com.memoryflip.dto;

public class PlayerStatsDto {

    private String playerId;
    private String playerName;
    private long totalGamesPlayed;
    private long totalGamesCompleted;
    private double winRate; // percentage
    private int highestScore;
    private double averageScore;
    private double averageCompletionTime; // seconds
    private double averageMoves;
    private String bestDifficulty;
    private int highestLevelReached;
    private int totalStars;
    private double averageAccuracy;

    public PlayerStatsDto() {
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

    public long getTotalGamesPlayed() {
        return totalGamesPlayed;
    }

    public void setTotalGamesPlayed(long totalGamesPlayed) {
        this.totalGamesPlayed = totalGamesPlayed;
    }

    public long getTotalGamesCompleted() {
        return totalGamesCompleted;
    }

    public void setTotalGamesCompleted(long totalGamesCompleted) {
        this.totalGamesCompleted = totalGamesCompleted;
    }

    public double getWinRate() {
        return winRate;
    }

    public void setWinRate(double winRate) {
        this.winRate = winRate;
    }

    public int getHighestScore() {
        return highestScore;
    }

    public void setHighestScore(int highestScore) {
        this.highestScore = highestScore;
    }

    public double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(double averageScore) {
        this.averageScore = averageScore;
    }

    public double getAverageCompletionTime() {
        return averageCompletionTime;
    }

    public void setAverageCompletionTime(double averageCompletionTime) {
        this.averageCompletionTime = averageCompletionTime;
    }

    public double getAverageMoves() {
        return averageMoves;
    }

    public void setAverageMoves(double averageMoves) {
        this.averageMoves = averageMoves;
    }

    public String getBestDifficulty() {
        return bestDifficulty;
    }

    public void setBestDifficulty(String bestDifficulty) {
        this.bestDifficulty = bestDifficulty;
    }

    public int getHighestLevelReached() {
        return highestLevelReached;
    }

    public void setHighestLevelReached(int highestLevelReached) {
        this.highestLevelReached = highestLevelReached;
    }

    public int getTotalStars() {
        return totalStars;
    }

    public void setTotalStars(int totalStars) {
        this.totalStars = totalStars;
    }

    public double getAverageAccuracy() {
        return averageAccuracy;
    }

    public void setAverageAccuracy(double averageAccuracy) {
        this.averageAccuracy = averageAccuracy;
    }
}
