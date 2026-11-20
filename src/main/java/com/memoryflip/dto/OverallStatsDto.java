package com.memoryflip.dto;

public class OverallStatsDto {

    private long totalSessions;
    private long totalPlayers;
    private int highestScore;
    private double averageScore;
    private double averageCompletionTime;
    private double averageMoves;
    private String popularDifficulty;

    public OverallStatsDto() {
    }

    public long getTotalSessions() {
        return totalSessions;
    }

    public void setTotalSessions(long totalSessions) {
        this.totalSessions = totalSessions;
    }

    public long getTotalPlayers() {
        return totalPlayers;
    }

    public void setTotalPlayers(long totalPlayers) {
        this.totalPlayers = totalPlayers;
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

    public String getPopularDifficulty() {
        return popularDifficulty;
    }

    public void setPopularDifficulty(String popularDifficulty) {
        this.popularDifficulty = popularDifficulty;
    }
}
