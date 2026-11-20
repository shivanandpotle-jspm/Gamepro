package com.memoryflip.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_sessions", indexes = {
    @Index(name = "idx_session_difficulty", columnList = "difficulty"),
    @Index(name = "idx_session_score", columnList = "score"),
    @Index(name = "idx_session_completed_at", columnList = "completedAt")
})
public class GameSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "player_ref_id", nullable = false)
    private Player player;

    @Column(nullable = false, length = 30)
    private String difficulty;

    @Column(nullable = false)
    private int level;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private int moves;

    @Column(nullable = false)
    private int matches;

    @Column(nullable = false)
    private int completionTime; // In seconds

    @Column(nullable = false)
    private double accuracy; // In percentage (0.0 to 100.0)

    @Column(nullable = false)
    private int stars; // 1, 2, or 3

    @Column(nullable = false)
    private int hintsUsed;

    @Column(nullable = false)
    private int shufflesUsed;

    @Column(nullable = false)
    private LocalDateTime completedAt;

    public GameSession() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
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

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
