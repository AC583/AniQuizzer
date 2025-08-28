import React from 'react';
import { CheckCircle, XCircle, Star, Info, ArrowRight } from 'lucide-react';
import { GameState } from '../types';

interface ResultScreenProps {
  gameState: GameState;
  onNextQuestion: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  gameState,
  onNextQuestion,
}) => {
  if (!gameState.currentAnime) return null;

  const pointsEarned = gameState.isCorrect 
    ? Math.round(100 * (gameState.difficulty === 'easy' ? 1 : gameState.difficulty === 'medium' ? 1.5 : 2) * (1 + gameState.streak * 0.1))
    : 0;

  // Use the image that was shown on the game screen
  const resultImage = gameState.currentImage || '';

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Result Header */}
      <div className="text-center space-y-4">
        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${
          gameState.isCorrect 
            ? 'bg-gradient-to-br from-green-400 to-green-600' 
            : 'bg-gradient-to-br from-red-400 to-red-600'
        } shadow-lg`}>
          {gameState.isCorrect ? (
            <CheckCircle className="w-10 h-10 text-white" />
          ) : (
            <XCircle className="w-10 h-10 text-white" />
          )}
        </div>
        
        <h2 className={`text-3xl font-bold ${
          gameState.isCorrect ? 'text-green-400' : 'text-red-400'
        }`}>
          {gameState.isCorrect ? 'Correct!' : 'Incorrect!'}
        </h2>
        
        <p className="text-white/80 text-lg">
          {gameState.isCorrect 
            ? `Great job! You earned ${pointsEarned} points!`
            : 'Better luck next time!'
          }
        </p>
      </div>

      {/* Anime Details */}
      <div className="bg-white/10 rounded-3xl p-6 backdrop-blur-lg space-y-6">
        <div className="text-center">
          <img
            src={resultImage}
            alt={gameState.currentAnime.title}
            className="w-32 h-32 object-cover rounded-2xl mx-auto mb-4 shadow-lg"
          />
          <h3 className="text-2xl font-bold text-white mb-2">
            {gameState.currentAnime.title}
          </h3>
          <div className="flex justify-center space-x-2 mb-4">
            <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm">
              {gameState.currentAnime.category}
            </span>
            <span className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-sm capitalize">
              {gameState.currentAnime.difficulty}
            </span>
          </div>
        </div>

        {/* Alternative Names */}
        {gameState.currentAnime.alternativeNames.length > 0 && (
          <div className="text-center">
            <h4 className="text-white font-semibold mb-2">Also Known As:</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {gameState.currentAnime.alternativeNames.map((name, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Trivia */}
        {gameState.currentAnime.trivia && (
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-cyan-400 font-semibold mb-1">Fun Fact:</h4>
                <p className="text-white/80 text-sm leading-relaxed">
                  {gameState.currentAnime.trivia}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Your Answer */}
        <div className="text-center">
          <h4 className="text-white font-semibold mb-2">Your Answer:</h4>
          <p className={`text-lg font-medium ${
            gameState.isCorrect ? 'text-green-400' : 'text-red-400'
          }`}>
            "{gameState.lastAnswer}"
          </p>
        </div>
      </div>

      {/* Score Summary */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 backdrop-blur-lg">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{gameState.score}</div>
            <div className="text-white/60">Total Score</div>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-1 text-orange-400">
              <Star className="w-5 h-5" />
              <span className="text-2xl font-bold">{gameState.streak}</span>
            </div>
            <div className="text-white/60">Streak</div>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="text-center">
        <button
          onClick={onNextQuestion}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold 
                   rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200
                   flex items-center space-x-2 mx-auto"
        >
          <span>
            {gameState.currentQuestion >= gameState.totalQuestions ? 'View Results' : 'Next Question'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};