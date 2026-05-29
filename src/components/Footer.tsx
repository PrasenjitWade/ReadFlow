import React from 'react';
import { BookOpen, Instagram } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'landing' | 'browse' | 'library') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-dark-bg border-t border-white/5 py-12 px-4 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-xs sm:text-sm">
        
        {/* Author Bio/About */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display font-bold text-white tracking-tight">
              ReadFlow
            </span>
          </div>
          <p className="text-gray-400 font-light leading-relaxed">
            Premium engineering designs, styling frameworks, and developer learning assets authored directly by Prasenjit Wade.
          </p>
        </div>

        {/* Quick Navigate Maps */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-white font-semibold font-display tracking-wider uppercase text-[10px] text-gray-500">
            Navigation
          </h4>
          <button onClick={() => onNavigate('landing')} className="text-gray-400 hover:text-indigo-400 text-left transition-colors font-light">
            Home Dashboard
          </button>
          <button onClick={() => onNavigate('browse')} className="text-gray-400 hover:text-indigo-400 text-left transition-colors font-light">
            Ebook Store
          </button>
          <button onClick={() => onNavigate('library')} className="text-gray-400 hover:text-indigo-400 text-left transition-colors font-light">
            User Reads Library
          </button>
        </div>

        {/* Social interactions */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-white font-semibold font-display tracking-wider uppercase text-[10px] text-gray-500">
            Author Socials
          </h4>
          <div className="flex gap-3 mt-1">
            <a href="https://instagram.com/read_flow_.4" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white transition-colors" title="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
          <p className="text-[10px] text-gray-500 font-mono mt-2 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Secure digital storefront is active
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-gray-500 gap-4">
        <span>
          © {new Date().getFullYear()} ReadFlow. All Rights Reserved. Not a public marketplace model.
        </span>
        <div className="flex gap-4">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
};
