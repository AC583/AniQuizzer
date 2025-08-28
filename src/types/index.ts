export interface Anime {
  id: number;
  title: string;
  alternativeNames: string[];
  difficulty: "easy" | "medium" | "hard";
  category: string;
  trivia: string;
  images: {
    backgrounds: string[]; 
    characters: {
      name: string;
      image: string; 
    }[];
  };
}

export interface GameState {
  currentAnime: Anime | null;
  currentImage?: string; // The image shown for the current question
  mode: 'characters' | 'backgrounds' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  streak: number;
  currentQuestion: number;
  totalQuestions: number;
  timeLeft: number;
  gameActive: boolean;
  showResult: boolean;
  lastAnswer: string;
  isCorrect: boolean;
}

export interface UserStats {
  totalScore: number;
  gamesPlayed: number;
  correctAnswers: number;
  longestStreak: number;
  achievements: string[];
  level: number;
  experience: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  gamesPlayed: number;
  accuracy: number;
  level: number;
}