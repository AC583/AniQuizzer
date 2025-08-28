import React from 'react';
import { Trophy, Star, Target, RotateCcw, Home } from 'lucide-react';
import { GameState, UserStats } from '../types';

interface GameCompleteProps {
  gameState: GameState;
  userStats: UserStats;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export const GameComplete: React.FC<GameCompleteProps> = ({
  gameState,
  userStats,
  onPlayAgain,
  onBackToHome,
}) => {
  const accuracy = gameState.totalQuestions > 0 
    ? Math.round(((gameState.totalQuestions - (gameState.currentQuestion - gameState.score / 100)) / gameState.totalQuestions) * 100)
    : 0;

  const getRank = () => {
    if (accuracy >= 90) return { rank: 'Anime Expert', color: 'from-yellow-400 to-orange-500', icon: Trophy };
    if (accuracy >= 70) return { rank: 'Otaku', color: 'from-purple-400 to-purple-600', icon: Star };
    if (accuracy >= 50) return { rank: 'Anime Fan', color: 'from-blue-400 to-blue-600', icon: Target };
    return { rank: 'Newbie', color: 'from-gray-400 to-gray-600', icon: Star };
  };

  const rankInfo = getRank();
  const RankIcon = rankInfo.icon;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className={`mx-auto w-24 h-24 rounded-full bg-gradient-to-br ${rankInfo.color} 
                       flex items-center justify-center shadow-2xl`}>
          <RankIcon className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold text-white">Quiz Complete!</h1>
        <p className="text-xl text-blue-200">
          You've earned the rank of <span className="text-yellow-400 font-semibold">{rankInfo.rank}</span>
        </p>
      </div>

      {/* Game Stats */}
      <div className="bg-white/10 rounded-3xl p-8 backdrop-blur-lg space-y-6">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Game Summary</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl">
            <div className="text-3xl font-bold text-white">{gameState.score}</div>
            <div className="text-purple-200">Final Score</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl">
            <div className="text-3xl font-bold text-white">{gameState.streak}</div>
            <div className="text-orange-200">Best Streak</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl">
            <div className="text-3xl font-bold text-white">{accuracy}%</div>
            <div className="text-green-200">Accuracy</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl">
            <div className="text-3xl font-bold text-white">{gameState.totalQuestions}</div>
            <div className="text-blue-200">Questions</div>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="bg-white/10 rounded-3xl p-8 backdrop-blur-lg space-y-4">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Overall Progress</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-white">{userStats.totalScore.toLocaleString()}</div>
            <div className="text-white/70">Total Score</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-white">{userStats.gamesPlayed}</div>
            <div className="text-white/70">Games Played</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-white">{userStats.longestStreak}</div>
            <div className="text-white/70">Best Streak Ever</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold">Level {userStats.level}</span>
            <span className="text-white/70">{userStats.experience}/1000 XP</span>
          </div>
          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${(userStats.experience / 1000) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Achievements */}
      {userStats.achievements.length > 0 && (
        <div className="bg-white/10 rounded-3xl p-8 backdrop-blur-lg">
          <h2 className="text-2xl font-bold text-center text-white mb-6">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userStats.achievements.slice(-4).map((achievement, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl"
              >
                <Star className="w-6 h-6 text-yellow-400" />
                <span className="text-white font-medium">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onPlayAgain}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold 
                   rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200
                   flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Play Again</span>
        </button>
        
        <button
          onClick={onBackToHome}
          className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl 
                   backdrop-blur-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105
                   flex items-center justify-center space-x-2"
        >
          <Home className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};