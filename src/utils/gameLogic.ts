import { GameState, UserStats, Anime } from '../types';
import { getRandomAnime } from '../data/animeData';

export const initializeGame = (
  mode:  'characters' | 'backgrounds' | 'mixed',
  difficulty: 'easy' | 'medium' | 'hard'
): GameState => {
  return {
    currentAnime: getRandomAnime(difficulty),
    mode,
    difficulty,
    score: 0,
    streak: 0,
    currentQuestion: 1,
    totalQuestions: 10,
    timeLeft: 30,
    gameActive: true,
    showResult: false,
    lastAnswer: '',
    isCorrect: false,
  };
};

export const calculateScore = (
  difficulty: 'easy' | 'medium' | 'hard',
  streak: number,
  timeLeft: number,
  isCorrect: boolean
): number => {
  if (!isCorrect) return 0;
  
  const basePoints = 100;
  const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
  const streakBonus = 1 + (streak * 0.1);
  const timeBonus = 1 + ((timeLeft / 30) * 0.5); // Up to 50% bonus for speed
  
  return Math.round(basePoints * difficultyMultiplier * streakBonus * timeBonus);
};

export const updateUserStats = (
  currentStats: UserStats,
  gameState: GameState,
  isCorrect: boolean
): UserStats => {
  const newStats = { ...currentStats };
  
  // Update basic stats
  newStats.totalScore += gameState.score;
  newStats.gamesPlayed += 1;
  
  if (isCorrect) {
    newStats.correctAnswers += 1;
  }
  
  // Update longest streak
  if (gameState.streak > newStats.longestStreak) {
    newStats.longestStreak = gameState.streak;
  }
  
  // Add experience and level up
  const experienceGained = Math.round(gameState.score / 10);
  newStats.experience += experienceGained;
  
  // Level up system
  while (newStats.experience >= 1000) {
    newStats.level += 1;
    newStats.experience -= 1000;
    
    // Add achievement for leveling up
    if (!newStats.achievements.includes(`Reached Level ${newStats.level}`)) {
      newStats.achievements.push(`Reached Level ${newStats.level}`);
    }
  }
  
  // Check for achievements
  const newAchievements: string[] = [];
  
  // Score-based achievements
  if (newStats.totalScore >= 10000 && !newStats.achievements.includes('Score Master')) {
    newAchievements.push('Score Master');
  }
  
  // Streak-based achievements
  if (newStats.longestStreak >= 10 && !newStats.achievements.includes('Streak Legend')) {
    newAchievements.push('Streak Legend');
  }
  
  // Games played achievements
  if (newStats.gamesPlayed >= 50 && !newStats.achievements.includes('Dedicated Fan')) {
    newAchievements.push('Dedicated Fan');
  }
  
  if (newStats.gamesPlayed >= 100 && !newStats.achievements.includes('Anime Expert')) {
    newAchievements.push('Anime Expert');
  }
  
  // Accuracy achievements
  const accuracy = newStats.gamesPlayed > 0 ? (newStats.correctAnswers / (newStats.gamesPlayed * 10)) * 100 : 0;
  if (accuracy >= 80 && newStats.gamesPlayed >= 10 && !newStats.achievements.includes('Sharp Eye')) {
    newAchievements.push('Sharp Eye');
  }
  
  newStats.achievements = [...newStats.achievements, ...newAchievements];
  
  return newStats;
};

export const generateLeaderboard = (userStats: UserStats) => {
  // Generate some sample leaderboard data
  const sampleEntries = [
    { id: '1', name: 'AnimeNinja', score: 15420, gamesPlayed: 67, accuracy: 87, level: 8 },
    { id: '2', name: 'OtakuMaster', score: 13890, gamesPlayed: 54, accuracy: 91, level: 7 },
    { id: '3', name: 'SenpaiKnows', score: 12350, gamesPlayed: 48, accuracy: 82, level: 6 },
    { id: '4', name: 'WaifuExpert', score: 11200, gamesPlayed: 43, accuracy: 79, level: 5 },
    { id: '5', name: 'NarutoFan99', score: 10100, gamesPlayed: 41, accuracy: 75, level: 5 },
    { id: '6', name: 'DragonSlayer', score: 9800, gamesPlayed: 39, accuracy: 73, level: 4 },
    { id: '7', name: 'KawaiiDesu', score: 8950, gamesPlayed: 35, accuracy: 78, level: 4 },
    { id: '8', name: 'AnimeAddict', score: 8200, gamesPlayed: 32, accuracy: 71, level: 4 },
    { id: '9', name: 'MangaReader', score: 7850, gamesPlayed: 30, accuracy: 69, level: 3 },
    { id: '10', name: 'TokyoGhoul', score: 7400, gamesPlayed: 28, accuracy: 67, level: 3 },
  ];
  
  // Add current user to leaderboard
  const currentUser = {
    id: 'current',
    name: 'You',
    score: userStats.totalScore,
    gamesPlayed: userStats.gamesPlayed,
    accuracy: userStats.gamesPlayed > 0 ? Math.round((userStats.correctAnswers / (userStats.gamesPlayed * 10)) * 100) : 0,
    level: userStats.level,
  };
  
  const allEntries = [...sampleEntries, currentUser];
  
  // Sort by score descending
  return allEntries.sort((a, b) => b.score - a.score);
};