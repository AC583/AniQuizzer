import React from 'react';
import { Trophy, Medal, Award, Star, User } from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  currentUserId,
}) => {
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return { icon: Trophy, color: 'text-yellow-400' };
      case 2: return { icon: Medal, color: 'text-gray-300' };
      case 3: return { icon: Award, color: 'text-orange-400' };
      default: return { icon: Star, color: 'text-blue-400' };
    }
  };

  const getRankBackground = (position: number) => {
    switch (position) {
      case 1: return 'from-yellow-500/20 to-orange-500/20';
      case 2: return 'from-gray-400/20 to-gray-500/20';
      case 3: return 'from-orange-500/20 to-red-500/20';
      default: return 'from-blue-500/10 to-purple-500/10';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Leaderboard</h2>
        <p className="text-blue-200">Compete with anime fans worldwide</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {entries.slice(0, 3).map((entry, index) => {
          const rankInfo = getRankIcon(index + 1);
          const RankIcon = rankInfo.icon;
          
          return (
            <div
              key={entry.id}
              className={`relative p-6 rounded-3xl bg-gradient-to-br ${getRankBackground(index + 1)} 
                        backdrop-blur-lg border border-white/10 transform hover:scale-105 transition-all duration-200
                        ${entry.id === currentUserId ? 'ring-4 ring-purple-500/50' : ''}`}
            >
              <div className="text-center space-y-4">
                <div className={`mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center
                                ring-4 ring-white/20`}>
                  <RankIcon className={`w-8 h-8 ${rankInfo.color}`} />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white">{entry.name}</h3>
                  <p className="text-white/60">#{index + 1}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-sm text-white/60">points</div>
                  
                  <div className="flex justify-center space-x-4 text-xs">
                    <span className="text-white/70">
                      {entry.gamesPlayed} games
                    </span>
                    <span className="text-green-400">
                      {entry.accuracy}% accuracy
                    </span>
                  </div>
                  
                  <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-white/80">
                    Level {entry.level}
                  </div>
                </div>
              </div>
              
              {entry.id === currentUserId && (
                <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold 
                               px-2 py-1 rounded-full">
                  YOU
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rest of Leaderboard */}
      {entries.length > 3 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-white mb-4">All Rankings</h3>
          
          {entries.slice(3).map((entry, index) => {
            const position = index + 4;
            
            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-4 rounded-2xl bg-white/5 backdrop-blur-lg
                          border border-white/10 hover:bg-white/10 transition-all duration-200
                          ${entry.id === currentUserId ? 'ring-2 ring-purple-500/50 bg-purple-500/10' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">#{position}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <User className="w-6 h-6 text-blue-400" />
                    <div>
                      <h4 className="font-semibold text-white">{entry.name}</h4>
                      <p className="text-sm text-white/60">
                        {entry.gamesPlayed} games • {entry.accuracy}% accuracy
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="text-xl font-bold text-white">
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-sm text-white/60">
                    Level {entry.level}
                  </div>
                </div>
                
                {entry.id === currentUserId && (
                  <div className="ml-4 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    YOU
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {entries.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white/60">No rankings yet</h3>
          <p className="text-white/40">Be the first to play and claim the top spot!</p>
        </div>
      )}
    </div>
  );
};