import React from 'react';
import { Eye, User, Image, Shuffle, Star, Trophy, Target } from 'lucide-react';

interface GameModeSelectorProps {
  selectedMode: 'characters' | 'backgrounds' | 'mixed';
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  onModeChange: (mode: 'characters' | 'backgrounds' | 'mixed') => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onStartGame: () => void;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  selectedMode,
  selectedDifficulty,
  onModeChange,
  onDifficultyChange,
  onStartGame,
}) => {
  const modes = [
    // { id: 'eyes', name: 'Eyes Only', icon: Eye, description: 'Guess from character eyes', color: 'from-blue-500 to-cyan-500' },
    // { id: 'silhouettes', name: 'Silhouettes', icon: User, description: 'Identify character shapes', color: 'from-purple-500 to-pink-500' },
    { id: 'characters', name: 'Characters', icon: Image, description: 'Recognize iconic characters', color: 'from-blue-500 to-cyan-500' },
    { id: 'backgrounds', name: 'Backgrounds', icon: Image, description: 'Recognize iconic scenes', color: 'from-green-500 to-emerald-500' },
    { id: 'mixed', name: 'Mixed Mode', icon: Shuffle, description: 'Random challenge types', color: 'from-orange-500 to-red-500' },
  ] as const;

  const difficulties = [
    { id: 'easy', name: 'Easy', icon: Star, description: 'Popular anime', multiplier: '1x' },
    { id: 'medium', name: 'Medium', icon: Trophy, description: 'Moderate challenge', multiplier: '1.5x' },
    { id: 'hard', name: 'Hard', icon: Target, description: 'Expert level', multiplier: '2x' },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Choose Your Challenge</h2>
        <p className="text-blue-200">Select a game mode and difficulty to test your anime knowledge</p>
      </div>

      {/* Game Modes */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Game Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modes.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                className={`relative p-6 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                  selectedMode === mode.id
                    ? 'ring-4 ring-white shadow-2xl'
                    : 'hover:shadow-xl'
                }`}
                style={{
                  background: selectedMode === mode.id 
                    ? `linear-gradient(135deg, ${mode.color.split(' ')[1]} 0%, ${mode.color.split(' ')[3]} 100%)`
                    : 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="text-center space-y-3">
                  <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedMode === mode.id ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{mode.name}</h4>
                    <p className="text-sm text-white/80">{mode.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty Levels */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Difficulty Level</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {difficulties.map((difficulty) => {
            const IconComponent = difficulty.icon;
            return (
              <button
                key={difficulty.id}
                onClick={() => onDifficultyChange(difficulty.id)}
                className={`relative p-6 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                  selectedDifficulty === difficulty.id
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 ring-4 ring-white shadow-2xl'
                    : 'bg-white/10 hover:bg-white/20 hover:shadow-xl'
                }`}
                style={{ backdropFilter: 'blur(10px)' }}
              >
                <div className="text-center space-y-3">
                  <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedDifficulty === difficulty.id ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{difficulty.name}</h4>
                    <p className="text-sm text-white/80">{difficulty.description}</p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                        {difficulty.multiplier} Points
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start Game Button */}
      <div className="text-center">
        <button
          onClick={onStartGame}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold text-lg rounded-xl 
                   shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Start Quiz Challenge
        </button>
      </div>
    </div>
  );
};