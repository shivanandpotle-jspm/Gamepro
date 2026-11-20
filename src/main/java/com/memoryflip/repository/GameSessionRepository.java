package com.memoryflip.repository;

import com.memoryflip.entity.GameSession;
import com.memoryflip.entity.Player;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameSessionRepository extends JpaRepository<GameSession, Long> {

    List<GameSession> findByPlayerOrderByCompletedAtDesc(Player player);

    List<GameSession> findByPlayer_PlayerIdOrderByCompletedAtDesc(String playerId, Pageable pageable);

    @Query("SELECT gs FROM GameSession gs ORDER BY gs.score DESC, gs.completionTime ASC, gs.moves ASC")
    List<GameSession> findTopLeaderboard(Pageable pageable);

    @Query("SELECT gs FROM GameSession gs WHERE LOWER(gs.difficulty) = LOWER(:difficulty) ORDER BY gs.score DESC, gs.completionTime ASC, gs.moves ASC")
    List<GameSession> findTopLeaderboardByDifficulty(@Param("difficulty") String difficulty, Pageable pageable);

    @Query("SELECT COUNT(gs) FROM GameSession gs WHERE gs.player.playerId = :playerId")
    long countByPlayerId(@Param("playerId") String playerId);

    @Query("SELECT MAX(gs.score) FROM GameSession gs WHERE gs.player.playerId = :playerId")
    Optional<Integer> findMaxScoreByPlayerId(@Param("playerId") String playerId);

    @Query("SELECT AVG(gs.score) FROM GameSession gs WHERE gs.player.playerId = :playerId")
    Optional<Double> findAvgScoreByPlayerId(@Param("playerId") String playerId);

    @Query("SELECT AVG(gs.completionTime) FROM GameSession gs WHERE gs.player.playerId = :playerId")
    Optional<Double> findAvgCompletionTimeByPlayerId(@Param("playerId") String playerId);

    @Query("SELECT AVG(gs.moves) FROM GameSession gs WHERE gs.player.playerId = :playerId")
    Optional<Double> findAvgMovesByPlayerId(@Param("playerId") String playerId);

    @Query("SELECT AVG(gs.accuracy) FROM GameSession gs WHERE gs.player.playerId = :playerId")
    Optional<Double> findAvgAccuracyByPlayerId(@Param("playerId") String playerId);

    @Query("SELECT MAX(gs.level) FROM GameSession gs WHERE gs.player.playerId = :playerId")
    Optional<Integer> findMaxLevelByPlayerId(@Param("playerId") String playerId);

    @Query("SELECT SUM(gs.stars) FROM GameSession gs WHERE gs.player.playerId = :playerId")
    Optional<Integer> findTotalStarsByPlayerId(@Param("playerId") String playerId);

    @Query("SELECT gs.difficulty, COUNT(gs) FROM GameSession gs WHERE gs.player.playerId = :playerId GROUP BY gs.difficulty ORDER BY COUNT(gs) DESC")
    List<Object[]> findFavoriteDifficultyByPlayerId(@Param("playerId") String playerId);

    @Query("SELECT MAX(gs.score) FROM GameSession gs")
    Optional<Integer> findOverallMaxScore();

    @Query("SELECT AVG(gs.score) FROM GameSession gs")
    Optional<Double> findOverallAvgScore();

    @Query("SELECT AVG(gs.completionTime) FROM GameSession gs")
    Optional<Double> findOverallAvgCompletionTime();

    @Query("SELECT AVG(gs.moves) FROM GameSession gs")
    Optional<Double> findOverallAvgMoves();

    @Query("SELECT gs.difficulty, COUNT(gs) FROM GameSession gs GROUP BY gs.difficulty ORDER BY COUNT(gs) DESC")
    List<Object[]> findOverallPopularDifficulty();
}
