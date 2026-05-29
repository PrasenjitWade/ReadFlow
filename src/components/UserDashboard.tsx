import React, { useState } from 'react';
import { BookOpen, Download, Bookmark, User, Key, KeyRound, Sparkles, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { Ebook } from '../types';

interface UserDashboardProps {
  userEmail: string | null;
  purchasedBooks: Ebook[];
  wishlistedBooks: Ebook[];
  onSelectEbook: (ebook: Ebook) => void;
  onRemoveWishlist: (ebookId: string) => void;
  onDownload: (ebook: Ebook) => void;
  onUpdateEmail: (email: string) => void;
  onGoogleSignIn: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  userEmail,
  purchasedBooks,
  wishlistedBooks,
  onSelectEbook,
  onRemoveWishlist,
  onDownload,
  onUpdateEmail,
  onGoogleSignIn
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'bookmarks' | 'profile'>('library');
  const [editEmail, setEditEmail] = useState(userEmail || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editEmail) {
      onUpdateEmail(editEmail);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div id="user-dashboard-wrapper" className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Header Profile Summary Panel */}
      <div className="relative rounded-3xl bg-[#0c111d] border border-white/5 p-6 md:p-8 overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-xl">
              <User className="w-7 h-7" />
            </div>
            <div>
              <span className="font-mono text-[9px] tracking-widest text-[#f59e0b] bg-indigo-500/15 border border-[#f59e0b]/20 px-2.5 py-0.5 rounded-full uppercase font-bold">
                Reader Account
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 truncate max-w-[280px] sm:max-w-none">
                {userEmail || 'Developer Guest'}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5 leading-none">
                Subscribed Reader • Local Digital Locker
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col px-4 py-2 border border-white/5 rounded-xl bg-white/2 flex-grow sm:flex-grow-0">
              <span className="text-[9px] text-[#8A2387] uppercase font-mono tracking-wider font-semibold">eBooks owned</span>
              <span className="text-lg font-mono font-bold text-white">{purchasedBooks.length}</span>
            </div>
            <div className="flex flex-col px-4 py-2 border border-white/5 rounded-xl bg-white/2 flex-grow sm:flex-grow-0">
              <span className="text-[9px] text-gray-500 uppercase font-mono tracking-wider font-semibold">Bookmarks</span>
              <span className="text-lg font-mono font-bold text-indigo-400">{wishlistedBooks.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD SECTORS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side menu router rail */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 p-1.5 rounded-2xl bg-[#0c111d] border border-white/5 overflow-x-auto lg:overflow-x-visible">
          <button
            id="tab-btn-library"
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === 'library'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Download Library
          </button>
          
          <button
            id="tab-btn-bookmarks"
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === 'bookmarks'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bookmark className="w-4 h-4" /> Saved Bookmarks
          </button>

          <button
            id="tab-btn-profile"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" /> Account Settings
          </button>
        </div>

        {/* Right Side render block */}
        <div className="lg:col-span-9 rounded-3xl bg-[#0c111d] border border-white/5 p-6 md:p-8 min-h-[400px]">
          
          {/* TAB 1: DOWNLOAD LIBRARY */}
          {activeTab === 'library' && (
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-white tracking-tight">Your Digital Bookshelf</h3>
                  <p className="text-xs text-gray-400 mt-1">Get immediate download packages including PDF files, code modules, and updates.</p>
                </div>
              </div>

              {purchasedBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 mb-4">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No purchased eBooks detected</h4>
                  <p className="text-xs text-gray-500 max-w-xs mt-2">
                    Connect an account, select high-quality learning assets from our catalog, and purchase them to seed your local library.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {purchasedBooks.map((book) => (
                    <div 
                      key={book.id}
                      className="group flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/2 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all duration-300"
                    >
                      {/* Left cover thumbnail */}
                      <div className="relative aspect-[3/4] h-20 rounded-lg bg-black/40 overflow-hidden flex-shrink-0">
                        {book.cover_url.startsWith('linear-gradient') ? (
                          <div style={{ background: book.cover_url }} className="w-full h-full flex items-center justify-center p-2 text-center text-white text-[8px] font-bold line-clamp-2">
                            {book.title}
                          </div>
                        ) : (
                          <img src={book.cover_url} alt={book.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        )}
                      </div>
                      
                      {/* Details & Interactive Action Buttons */}
                      <div className="flex flex-col justify-between overflow-hidden flex-grow">
                        <div>
                          <h4 
                            onClick={() => onSelectEbook(book)}
                            className="font-display font-bold text-sm text-white hover:text-indigo-400 cursor-pointer transition-colors line-clamp-1"
                          >
                            {book.title}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-mono mt-0.5 inline-block">By {book.author}</span>
                        </div>
                        
                        <div className="flex gap-2 items-center mt-2 pt-2 border-t border-white/5">
                          <button
                            id={`library-dl-${book.id}`}
                            onClick={() => onDownload(book)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] tracking-wide transition-all duration-200"
                          >
                            <Download className="w-3.5 h-3.5" /> Download Package
                          </button>
                          
                          <button
                            id={`library-view-${book.id}`}
                            onClick={() => onSelectEbook(book)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-[10px] font-medium transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVED BOOKMARKS/WISHLIST */}
          {activeTab === 'bookmarks' && (
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-white tracking-tight font-semibold">Your Bookmark Collection</h3>
                  <p className="text-xs text-gray-400 mt-1">Easily find your liked guides, starter repositories, guidelines, or books.</p>
                </div>
              </div>

              {wishlistedBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 mb-4">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No bookmarked eBooks</h4>
                  <p className="text-xs text-gray-500 max-w-xs mt-2">
                    Bookmark items from our primary list or ebook cover panels to access descriptions or reviews instantly here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlistedBooks.map((book) => (
                    <div 
                      key={book.id}
                      className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/2 hover:border-white/10 transition-all duration-300"
                    >
                      <div className="relative aspect-[3/4] h-20 rounded-lg bg-black/40 overflow-hidden flex-shrink-0">
                        {book.cover_url.startsWith('linear-gradient') ? (
                          <div style={{ background: book.cover_url }} className="w-full h-full flex items-center justify-center p-2 text-center text-white text-[8px] font-bold line-clamp-2">
                            {book.title}
                          </div>
                        ) : (
                          <img src={book.cover_url} alt={book.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        )}
                      </div>
                      
                      <div className="flex flex-col justify-between overflow-hidden flex-grow">
                        <div>
                          <h4 
                            onClick={() => onSelectEbook(book)}
                            className="font-display font-semibold text-sm text-white hover:text-indigo-400 cursor-pointer transition-colors line-clamp-1"
                          >
                            {book.title}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-mono mt-0.5 inline-block">By {book.author}</span>
                        </div>
                        
                        <div className="flex gap-2 items-center mt-2 border-t border-white/5 pt-2">
                          <button
                            id={`wishlist-view-${book.id}`}
                            onClick={() => onSelectEbook(book)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-[10px] font-bold tracking-wide transition-all"
                          >
                            View Details
                          </button>
                          
                          <button
                            id={`wishlist-rm-${book.id}`}
                            onClick={() => onRemoveWishlist(book.id)}
                            className="px-2.5 py-1.5 rounded-lg text-gray-500 hover:text-red-400 text-[10px] transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACCOUNT PROFILE CONTROLS */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-white tracking-tight">Account Integration Setup</h3>
                  <p className="text-xs text-gray-400 mt-1">Update your local credentials to sync downloaded ebooks with your profile.</p>
                </div>
              </div>

              {/* Real vs Sim info message */}
              <div className="mb-6 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex gap-3 text-xs leading-relaxed text-gray-300">
                <AlertCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Digital Locker Active.</span> Standard credentials below write profile database records automatically. When running under "Demo Sandbox", values are saved to browsers local DB storage layout for fast zero-friction reviews.
                </div>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      id="profile-email-input"
                      type="email"
                      value={editEmail}
                      onChange={(e) => {
                        setEditEmail(e.target.value);
                        setIsSaved(false);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 font-mono text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="e.g. purchaser@yourdomain.com"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 gap-4">
                  <button
                    id="profile-save-btn"
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                  >
                    Update Account
                  </button>
                  
                  {isSaved && (
                    <span className="flex items-center gap-1 font-mono text-xs text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Account updated.
                    </span>
                  )}
                </div>
              </form>

              {/* Single Sign On Google Mock/Real section */}
              <div className="border-t border-white/5 pt-6 mt-8">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-500 mb-2 leading-none">
                  Google Secure Integration (OAuth2)
                </h4>
                <p className="text-xs text-gray-400 mb-4 max-w-lg">
                  Bind this Store backend to single-sign-on (SSO) systems. Click below to simulate Google identity handshake callbacks.
                </p>
                <button
                  id="profile-google-auth-btn"
                  onClick={onGoogleSignIn}
                  className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 active:scale-95 transition-all text-xs"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.6 5.6 0 0 1 8.35 13a5.6 5.6 0 0 1 5.64-5.6c1.55 0 2.96.615 4 1.62l3.14-3.14C19.145 3.99 16.745 3 13.992 3 8.411 3 3.9 7.512 3.9 13s4.511 10 10.092 10c5.842 0 9.71-4.106 9.71-9.9c0-.663-.06-1.3-.172-1.815z" />
                  </svg>
                  Connect with Google Auth
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
