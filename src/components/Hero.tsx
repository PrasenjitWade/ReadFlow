import React from 'react';
import { Search, Sparkles, BookOpen, Star, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onBrowseClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onBrowseClick,
  searchQuery,
  onSearchChange
}) => {
  return (
    <div id="hero-section" className="relative pt-6 pb-16 md:py-24 overflow-hidden">
      
      {/* Background illumination gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute top-10 right-10 w-[250px] h-[250px] rounded-full bg-emerald-500/5 blur-[80px] -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center px-4">
        
        {/* Author Premium Store Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide mb-6 animate-fade-in animate-duration-500">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Written & Curated by Prasenjit Wade</span>
        </div>

        {/* Catchy display headline */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
          Premium E-Books & <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">Digital Blueprint Assets</span>
        </h1>

        <p className="text-gray-400 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10">
          Unlock cutting-edge engineering designs, design frameworks, and solopreneur roadmaps authored directly by Prasenjit Wade. High-resolution digital packages paired with clean, production-ready code assets.
        </p>

        {/* Dynamic Interactive Search Box */}
        <div className="relative max-w-md mx-auto mb-12">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="hero-search-input"
            type="text"
            placeholder="Search books"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#0c111d] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-xl"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-500 hover:text-white transition-colors"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Micro Visual Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-white/5 pt-8 mt-4">
          <div className="flex flex-col items-center">
            <span className="text-xl font-display font-bold text-white">Instant</span>
            <span className="text-xs text-gray-400 font-mono mt-1">Ebook Download</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-display font-bold text-indigo-400">PDF & EPUB</span>
            <span className="text-xs text-gray-400 font-mono mt-1">Formats Provided</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-display font-bold text-white">Verified</span>
            <span className="text-xs text-gray-400 font-mono mt-1">Written by Owner</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-display font-bold text-emerald-400">Code Assets</span>
            <span className="text-xs text-gray-400 font-mono mt-1">Included With Books</span>
          </div>
        </div>

      </div>
    </div>
  );
};
