import React, { useState, useEffect } from 'react';
import { Play, Trophy, Settings, Home, Sparkles } from 'lucide-react';
import { GameModeSelector } from './components/GameModeSelector';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { GameComplete } from './components/GameComplete';
import { Leaderboard } from './components/Leaderboard';
import { GameState, UserStats } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { initializeGame, calculateScore, updateUserStats, generateLeaderboard } from './utils/gameLogic';
import { getRandomAnime } from './data/animeData';

type Screen = 'home' | 'modeSelect' | 'game' | 'leaderboard';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [userStats, setUserStats] = useLocalStorage<UserStats>('animeQuizStats', {
    totalScore: 0,
    gamesPlayed: 0,
    correctAnswers: 0,
    longestStreak: 0,
    achievements: [],
    level: 1,
    experience: 0,
  });
  // Add state for mode and difficulty selection
  const [selectedMode, setSelectedMode] = useState<'characters' | 'backgrounds' | 'mixed'>('characters');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  // Timer effect
  // Listen for updates from GameScreen to sync currentAnime/currentImage
  useEffect(() => {
    const handler = (e: any) => {
      setGameState(prev => prev ? { ...prev, currentAnime: e.detail.anime, currentImage: e.detail.image } : null);
    };
    window.addEventListener('updateGameStateAnime', handler);
    return () => window.removeEventListener('updateGameStateAnime', handler);
  }, []);

  useEffect(() => {
    if (gameState?.gameActive && gameState.timeLeft > 0 && !gameState.showResult) {
      const timer = setTimeout(() => {
        setGameState(prev => prev ? { ...prev, timeLeft: prev.timeLeft - 1 } : null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState?.timeLeft, gameState?.gameActive, gameState?.showResult]);

  const handleStartGame = (mode: 'characters' | 'backgrounds' | 'mixed', difficulty: 'easy' | 'medium' | 'hard') => {
    const newGame = initializeGame(mode, difficulty);
    setGameState(newGame);
    setCurrentScreen('game');
  };

  const handleAnswer = (answer: string, isCorrect: boolean, image: string) => {
    if (!gameState) return;

    const points = calculateScore(gameState.difficulty, gameState.streak, gameState.timeLeft, isCorrect);
    const newStreak = isCorrect ? gameState.streak + 1 : 0;

    setGameState(prev => prev ? {
      ...prev,
      score: prev.score + points,
      streak: newStreak,
      showResult: true,
      lastAnswer: answer,
      isCorrect,
      gameActive: false,
      currentImage: image,
    } : null);

    // Update user stats
    setUserStats(prevStats => updateUserStats(prevStats, gameState, isCorrect));
  };

  const handleSkip = () => {
    if (!gameState) return;
    
    setGameState(prev => prev ? {
      ...prev,
      score: Math.max(0, prev.score - 10),
      streak: 0,
      showResult: true,
      lastAnswer: 'Skipped',
      isCorrect: false,
      gameActive: false,
    } : null);
  };

  const handleTimeUp = () => {
    if (!gameState) return;
    
    setGameState(prev => prev ? {
      ...prev,
      timeLeft: 0,
      showResult: true,
      lastAnswer: 'Time\'s up!',
      isCorrect: false,
      gameActive: false,
    } : null);
  };

  const handleNextQuestion = () => {
    if (!gameState) return;

    if (gameState.currentQuestion >= gameState.totalQuestions) {
      setCurrentScreen('home');
      setGameState(null);
      return;
    }

    const nextAnime = getRandomAnime(gameState.difficulty);
    setGameState(prev => prev ? {
      ...prev,
      currentAnime: nextAnime,
      currentQuestion: prev.currentQuestion + 1,
      timeLeft: 30,
      gameActive: true,
      showResult: false,
      lastAnswer: '',
      isCorrect: false,
    } : null);
  };

  const handlePlayAgain = () => {
    setCurrentScreen('modeSelect');
    setGameState(null);
  };

  const renderHomeScreen = () => (
    <div className="max-w-4xl mx-auto text-center space-y-8 p-6">
      {/* Hero Section */}
      <div className="space-y-6">
        <div className="relative">
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text 
                       bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">
            AniQuiz
          </h1>
          <div className="absolute -top-4 right-1/4 animate-bounce">
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        <p className="text-xl md:text-2xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
          Test your anime knowledge through visual clues! Guess from eyes, silhouettes, and iconic backgrounds.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm text-white/70">
          <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur">🎯 Multiple Game Modes</span>
          <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur">⚡ Streak System</span>
          <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur">🏆 Achievements</span>
          <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur">📊 Leaderboards</span>
        </div>
      </div>

      {/* User Stats Card */}
      {userStats.gamesPlayed > 0 && (
        <div className="bg-white/10 rounded-3xl p-6 backdrop-blur-lg max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-white mb-4">Your Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userStats.totalScore.toLocaleString()}</div>
              <div className="text-sm text-white/60">Total Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userStats.gamesPlayed}</div>
              <div className="text-sm text-white/60">Games</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userStats.longestStreak}</div>
              <div className="text-sm text-white/60">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userStats.level}</div>
              <div className="text-sm text-white/60">Level</div>
            </div>
          </div>
          
          {/* Level Progress */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Level {userStats.level}</span>
              <span className="text-white/70 text-sm">{userStats.experience}/1000 XP</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${(userStats.experience / 1000) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => setCurrentScreen('modeSelect')}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg
                   rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200
                   flex items-center justify-center space-x-2"
        >
          <Play className="w-6 h-6" />
          <span>Start Playing</span>
        </button>
        
        <button
          onClick={() => setCurrentScreen('leaderboard')}
          className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-2xl
                   backdrop-blur-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105
                   flex items-center justify-center space-x-2"
        >
          <Trophy className="w-6 h-6" />
          <span>Leaderboard</span>
        </button>
      </div>

      {/* Recent Achievements */}
      {userStats.achievements.length > 0 && (
        <div className="bg-white/5 rounded-2xl p-6 backdrop-blur max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span>Recent Achievements</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userStats.achievements.slice(-4).map((achievement, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 
                         rounded-lg border border-yellow-500/20"
              >
                <span className="text-yellow-400">🏆</span>
                <span className="text-white text-sm">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply 
                       filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply 
                       filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply 
                       filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation Header */}
      {currentScreen !== 'home' && (
        <div className="relative z-10 p-6">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button
              onClick={() => setCurrentScreen('home')}
              className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors duration-200"
            >
              <Home className="w-6 h-6" />
              <span className="font-medium">Home</span>
            </button>
            
            <h1 className="text-2xl font-bold text-white">AniQuiz</h1>
            
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 pt-8">
        {currentScreen === 'home' && renderHomeScreen()}
        
        {currentScreen === 'modeSelect' && (
          <GameModeSelector
            selectedMode={selectedMode}
            selectedDifficulty={selectedDifficulty}
            onModeChange={setSelectedMode}
            onDifficultyChange={setSelectedDifficulty}
            onStartGame={() => {
              handleStartGame(selectedMode, selectedDifficulty);
            }}
          />
        )}
        
        {currentScreen === 'game' && gameState && !gameState.showResult && (
          <GameScreen
            gameState={gameState}
            onAnswer={handleAnswer}
            onSkip={handleSkip}
            onTimeUp={handleTimeUp}
          />
        )}
        
        {currentScreen === 'game' && gameState && gameState.showResult && gameState.currentQuestion < gameState.totalQuestions && (
          <ResultScreen
            gameState={gameState}
            onNextQuestion={handleNextQuestion}
          />
        )}
        
        {currentScreen === 'game' && gameState && gameState.showResult && gameState.currentQuestion >= gameState.totalQuestions && (
          <GameComplete
            gameState={gameState}
            userStats={userStats}
            onPlayAgain={handlePlayAgain}
            onBackToHome={() => setCurrentScreen('home')}
          />
        )}
        
        {currentScreen === 'leaderboard' && (
          <Leaderboard
            entries={generateLeaderboard(userStats)}
            currentUserId="current"
          />
        )}
      </div>
    </div>
  );
}

export default App;