import React, { useState, useEffect, useRef } from 'react';
import { Clock, Zap, SkipBack as Skip, ChevronRight } from 'lucide-react';
import { GameState, Anime } from '../types';
import { checkAnswer, animeDatabase } from '../data/animeData';

interface GameScreenProps {
  gameState: GameState;
  onAnswer: (answer: string, isCorrect: boolean, image: string) => void;
  onSkip: () => void;
  onTimeUp: () => void;
  onOutOfQuestions?: () => void; // optional callback when no animes left
}

export const GameScreen: React.FC<GameScreenProps> = ({
  gameState,
  onAnswer,
  onSkip,
  onTimeUp,
  onOutOfQuestions,
}) => {
  const [userInput, setUserInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [currentAnime, setCurrentAnime] = useState<Anime | null>(null);
  const [usedAnimeIds, setUsedAnimeIds] = useState<Set<number>>(new Set());

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timer logic
  useEffect(() => {
    if (gameState.gameActive && gameState.timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        if (gameState.timeLeft <= 1) {
          onTimeUp();
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState.timeLeft, gameState.gameActive, onTimeUp]);

  // Focus input when new question starts
  useEffect(() => {
    if (gameState.gameActive && !gameState.showResult && inputRef.current) {
      inputRef.current.focus();
      setUserInput('');
    }
  }, [gameState.currentQuestion, gameState.gameActive, gameState.showResult]);

  // Generate suggestions
  useEffect(() => {
    if (userInput.length > 0) {
      const filteredSuggestions = animeDatabase
        .map(anime => anime.title)
        .filter(title =>
          title.toLowerCase().includes(userInput.toLowerCase()) &&
          title.toLowerCase() !== userInput.toLowerCase()
        )
        .slice(0, 5);

      animeDatabase.forEach(anime => {
        anime.alternativeNames.forEach(altName => {
          if (
            altName.toLowerCase().includes(userInput.toLowerCase()) &&
            altName.toLowerCase() !== userInput.toLowerCase() &&
            !filteredSuggestions.includes(altName) &&
            filteredSuggestions.length < 5
          ) {
            filteredSuggestions.push(altName);
          }
        });
      });

      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [userInput]);

  // Pick next anime without repeats
  useEffect(() => {
    if (!gameState.gameActive) return;

    const available = animeDatabase.filter(anime => !usedAnimeIds.has(anime.id));

    if (available.length === 0) {
      // all animes used up
      if (onOutOfQuestions) onOutOfQuestions();
      return;
    }

    const next = available[Math.floor(Math.random() * available.length)];
    setCurrentAnime(next);
    setUsedAnimeIds(prev => new Set(prev).add(next.id));

    // Pick one image for this anime
    const { images } = next;
    const pickRandom = (arr: any[]) => {
      if (!arr || arr.length === 0) return '';
      const item = arr[Math.floor(Math.random() * arr.length)];
      return typeof item === 'string' ? item : item.image;
    };

    let selectedImage = '';
    switch (gameState.mode) {
      case 'characters':
        selectedImage = pickRandom(images.characters);
        break;
      case 'backgrounds':
        selectedImage = pickRandom(images.backgrounds);
        break;
      case 'mixed':
        const modes = ['characters', 'backgrounds'];
        const randomMode = modes[Math.floor(Math.random() * modes.length)];
        selectedImage =
          randomMode === 'characters'
            ? pickRandom(images.characters)
            : pickRandom(images.backgrounds);
        break;
      default:
        selectedImage = pickRandom(images.characters);
        break;
    }

    setCurrentImage(selectedImage);

    // Also update the main gameState with the currentAnime and currentImage
    if (gameState.currentAnime?.id !== next.id || gameState.currentImage !== selectedImage) {
      // Use a callback to avoid stale closure
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('updateGameStateAnime', { detail: { anime: next, image: selectedImage } }));
      }
    }
  }, [gameState.currentQuestion, gameState.mode, gameState.gameActive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !currentAnime || gameState.showResult) return;

    const isCorrect = checkAnswer(userInput, currentAnime);
    onAnswer(userInput, isCorrect, currentImage);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setUserInput(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const getTimerColor = () => {
    if (gameState.timeLeft > 20) return 'text-green-400';
    if (gameState.timeLeft > 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!currentAnime) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Game Header */}
      <div className="flex justify-between items-center bg-white/10 rounded-2xl p-6 backdrop-blur-lg">
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{gameState.score}</div>
            <div className="text-sm text-blue-200">Score</div>
          </div>
          <div className="text-center">
            <div className="flex items-center space-x-1 text-orange-400">
              <Zap className="w-5 h-5" />
              <span className="text-2xl font-bold">{gameState.streak}</span>
            </div>
            <div className="text-sm text-blue-200">Streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">
              {gameState.currentQuestion}/{gameState.totalQuestions}
            </div>
            <div className="text-sm text-blue-200">Question</div>
          </div>
        </div>
        <div className="text-center">
          <div className={`text-3xl font-bold ${getTimerColor()}`}>
            <Clock className="w-6 h-6 inline mr-2" />
            {gameState.timeLeft}s
          </div>
        </div>
      </div>

      {/* Game Image & Title */}
      <div className="relative">
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl p-8 backdrop-blur-lg">
          <div className="aspect-video bg-gray-900/50 rounded-2xl overflow-hidden relative">
            <img
              src={currentImage}
              alt={currentAnime.title}
              className="w-full h-full object-contain"
            />
            <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full">
              <span className="text-white text-sm font-medium capitalize">
                {gameState.mode === 'mixed' ? 'Mystery Mode' : gameState.mode}
              </span>
            </div>
            <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full">
              <span className="text-white text-sm font-medium capitalize">
                {gameState.difficulty}
              </span>
            </div>
          </div>
          {/* Always show the anime title below the image for debugging/consistency */}
          <div className="mt-4 text-center">
            <span className="text-xl font-bold text-white bg-black/40 px-4 py-2 rounded-lg inline-block">
              {currentAnime.title}
            </span>
          </div>
        </div>
      </div>

      {/* Answer Input */}
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter anime title..."
              className="w-full p-4 text-lg bg-white/10 border border-white/20 rounded-2xl text-white 
                       placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-purple-500/50 
                       focus:border-purple-500/50 transition-all duration-200 backdrop-blur-lg"
              disabled={gameState.showResult || !gameState.gameActive}
            />
            <button
              type="submit"
              disabled={!userInput.trim() || gameState.showResult || !gameState.gameActive}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 
                       p-3 rounded-xl text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-lg rounded-xl shadow-xl z-10 overflow-hidden">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-purple-100 transition-colors duration-150 
                           text-gray-800 border-b border-gray-200 last:border-b-0"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Skip Button */}
        <div className="text-center">
          <button
            onClick={onSkip}
            disabled={gameState.showResult || !gameState.gameActive}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-lg 
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     hover:shadow-lg transform hover:scale-105"
          >
            <Skip className="w-4 h-4 inline mr-2" />
            Skip Question (-10 points)
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white text-sm font-medium">Progress</span>
          <span className="text-white text-sm font-medium">
            {Math.round((gameState.currentQuestion / gameState.totalQuestions) * 100)}%
          </span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${(gameState.currentQuestion / gameState.totalQuestions) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
