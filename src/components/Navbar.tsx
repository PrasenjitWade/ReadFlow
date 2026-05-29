import React, { useState } from 'react';
import { BookOpen, Shield, Library, LogOut, LogIn, Database, ChevronDown, User, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentRole: 'guest' | 'admin';
  userEmail: string | null;
  onSwitchRole: (role: 'guest' | 'admin') => void;
  onNavigate: (view: 'landing' | 'browse' | 'library' | 'admin') => void;
  activeView: 'landing' | 'browse' | 'library' | 'admin';
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  userEmail,
  onSwitchRole,
  onNavigate,
  activeView
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="glass-navbar sticky top-0 left-0 right-0 z-50 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-300">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold tracking-tight text-white leading-none">
              Read<span className="text-indigo-400">Flow</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase">
              Premium Store
            </span>
          </div>
        </div>

        {/* Dynamic Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            id="nav-link-home"
            onClick={() => onNavigate('landing')} 
            className={`text-sm font-medium transition-colors duration-200 hover:text-white ${
              activeView === 'landing' ? 'text-indigo-400' : 'text-gray-400'
            }`}
          >
            Home
          </button>
          
          <button 
            id="nav-link-browse"
            onClick={() => onNavigate('browse')}
            className={`text-sm font-medium transition-colors duration-200 hover:text-white ${
              activeView === 'browse' ? 'text-indigo-400' : 'text-gray-400'
            }`}
          >
            Explore Books
          </button>

          <button 
            id="nav-link-library"
            onClick={() => onNavigate('library')}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-white ${
              activeView === 'library' ? 'text-indigo-400' : 'text-gray-400'
            }`}
          >
            <Library className="w-4 h-4" /> My Library
          </button>

          {currentRole === 'admin' && (
            <button 
              id="nav-link-admin"
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1.5 text-sm font-semibold tracking-wide border border-indigo-500/20 px-3.5 py-1.5 rounded-xl bg-indigo-500/10 transition-all duration-200 hover:bg-indigo-500/20 ${
                activeView === 'admin' ? 'text-indigo-400 border-indigo-400/50' : 'text-gray-300 hover:text-indigo-300'
              }`}
            >
              <Shield className="w-4 h-4" /> Admin Console
            </button>
          )}
        </div>

        {/* Profile Actions */}
        <div className="flex items-center gap-4">
          
          {/* Interactive Profile Dropdown / Role Switcher */}
          <div className="relative">
            <button
              id="profile-dropdown-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 hover:border-white/10 active:scale-95 transition-all duration-200"
            >
              <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                currentRole === 'admin' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}>
                {currentRole === 'admin' ? <Shield className="w-3 h-3 text-indigo-200" /> : <User className="w-3 h-3 text-gray-300" />}
              </div>
              <span className="font-mono max-w-[100px] truncate">
                {currentRole === 'admin' 
                  ? 'Author (Admin)' 
                  : 'Guest Browser'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
 
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0c111d] border border-white/10 p-2.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 border-b border-white/5 mb-2">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Active Account</p>
                  <p className="text-xs font-semibold text-white truncate mt-0.5">
                    {userEmail || 'Unauthenticated'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${currentRole === 'admin' ? 'bg-indigo-400' : 'bg-zinc-500'}`} />
                    <span className="text-[9px] font-mono text-gray-400 capitalize">{currentRole === 'admin' ? 'admin' : 'guest'} role level</span>
                  </div>
                </div>
 
                <p className="px-3 text-[9px] text-gray-500 font-mono uppercase tracking-wider mb-1.5 mt-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" /> Quick Role Simulator
                </p>
 
                <div className="flex flex-col gap-1">
                  <button
                    id="role-switch-guest"
                    onClick={() => {
                      onSwitchRole('guest');
                      setDropdownOpen(false);
                      onNavigate('landing');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors font-medium ${
                      currentRole === 'guest' ? 'bg-white/5 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>Guest Browser</span>
                    {currentRole === 'guest' && <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />}
                  </button>
 
                  <button
                    id="role-switch-admin"
                    onClick={() => {
                      onSwitchRole('admin');
                      setDropdownOpen(false);
                      onNavigate('admin');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors font-medium ${
                      currentRole === 'admin' ? 'bg-indigo-600/20 text-indigo-300' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-indigo-400" /> Author Admin</span>
                    {currentRole === 'admin' && <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />}
                  </button>
                </div>
 
                <div className="border-t border-white/5 mt-2.5 pt-2 flex flex-col gap-1">
                  {currentRole === 'admin' ? (
                    <button
                      id="role-logout-btn"
                      onClick={() => {
                        onSwitchRole('guest');
                        setDropdownOpen(false);
                        onNavigate('landing');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Exit Admin
                    </button>
                  ) : (
                    <button
                      id="role-login-btn"
                      onClick={() => {
                        setDropdownOpen(false);
                        onNavigate('admin');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5" /> Admin Portal Login
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};
