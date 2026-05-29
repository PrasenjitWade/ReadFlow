import React from 'react';
import { X, Check, Star, Download, Bookmark, Sparkles, BookOpen } from 'lucide-react';
import { Ebook } from '../types';

interface EbookDetailModalProps {
  ebook: Ebook;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  purchased: boolean;
  onBuyNow: (ebook: Ebook) => void;
  onDownload: (ebook: Ebook) => void;
  relatedEbooks: Ebook[];
  onSelectEbook: (ebook: Ebook) => void;
}

export const EbookDetailModal: React.FC<EbookDetailModalProps> = ({
  ebook,
  onClose,
  isWishlisted,
  onToggleWishlist,
  purchased,
  onBuyNow,
  onDownload,
  relatedEbooks,
  onSelectEbook
}) => {
  const isGradientCover = ebook.cover_url.startsWith('linear-gradient') || ebook.cover_url.startsWith('radial-gradient');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        id={`detail-modal-${ebook.id}`}
        className="relative w-full max-w-4xl rounded-3xl bg-[#0c111d] border border-white/10 overflow-hidden shadow-2xl animate-in scale-in fade-in-50 duration-200 max-h-[90vh] flex flex-col"
      >
        
        {/* Header Action Menu */}
        <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
          <button
            id="detail-wishlist-toggle"
            onClick={onToggleWishlist}
            className={`p-2 rounded-xl backdrop-blur-md transition-all duration-300 ${
              isWishlisted
                ? 'bg-rose-500/20 border border-rose-500 text-rose-400'
                : 'bg-black/50 border border-white/10 text-white hover:border-white/30'
            }`}
            title="Toggle Bookmark"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          
          <button
            id="detail-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-black/50 border border-white/10 text-white hover:bg-black/70 hover:border-white/30 transition-all duration-300"
            title="Close Details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-grow p-6 md:p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: EBook 3D hard-cover layout */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-full aspect-[3/4] max-w-[280px] rounded-xl overflow-hidden shadow-2xl flex items-center justify-center select-none bg-black/40">
                
                {/* 3D realistic details */}
                <div className="absolute inset-y-0 left-0 w-[4%] bg-gradient-to-r from-black/40 via-white/10 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none z-10 mix-blend-overlay" />
                
                <div className="absolute inset-4">
                  {isGradientCover ? (
                    <div 
                      style={{ background: ebook.cover_url }}
                      className="w-full h-full rounded-md shadow-2xl flex flex-col justify-between p-6 text-white overflow-hidden border border-white/10"
                    >
                      <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute inset-y-0 left-0 w-1 bg-black/20" />
                      
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-mono text-[9px] tracking-widest text-white/70 uppercase">
                          {ebook.category}
                        </span>
                        <span className="w-8 h-[2px] bg-white/40 mt-1" />
                      </div>
                      
                      <div className="flex-grow flex items-center justify-center my-4 font-display">
                        <h4 className="text-base sm:text-lg font-bold tracking-tight text-center text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] leading-tight line-clamp-3">
                          {ebook.title}
                        </h4>
                      </div>
                      
                      <div className="flex justify-between items-end border-t border-white/20 pt-3">
                        <span className="font-mono text-[9px] tracking-wider text-white/80 font-medium">
                          BY {ebook.author.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-0.5 bg-black/30 backdrop-blur-md rounded px-1.5 py-0.5 border border-white/10">
                          <span className="text-[9px] font-mono text-premium-gold">★</span>
                          <span className="text-[9px] font-mono font-bold text-white">{ebook.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-md shadow-2xl overflow-hidden border border-white/10">
                      <img 
                        src={ebook.cover_url} 
                        alt={ebook.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery specifications */}
              <div className="w-full max-w-[280px] mt-6 p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2 font-mono text-xs text-gray-400">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>FORMATS:</span>
                  <span className="text-white font-medium">PDF, EPUB, MOBI</span>
                </div>
                <div className="flex justify-between">
                  <span>FILE SIZE:</span>
                  <span className="text-white font-medium">18.4 MB (Digital Download)</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Ebook copy descriptions and specs */}
            <div className="md:col-span-7 flex flex-col">
              
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[10px] uppercase font-bold tracking-wider">
                  {ebook.category}
                </span>
                
                <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 text-premium-gold fill-current" />
                  <span className="text-xs font-mono font-bold text-gray-200">{ebook.rating.toFixed(1)} Editor Rating</span>
                </div>
              </div>

              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
                {ebook.title}
              </h2>

              <p className="font-mono text-xs text-indigo-400 font-medium mb-6">
                Authored by {ebook.author}
              </p>

              <div className="border-t border-white/5 pt-5 mb-5">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Synopsis
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                  {ebook.description}
                </p>
              </div>

              {/* Key Bullet Highlights */}
              <div className="mb-6">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> What you will learn inside
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(ebook.highlights || [
                    'Comprehensive advanced methodologies',
                    'Direct file download immediately upon payment',
                    'Premium quality production boilerplate code',
                    'Free lifetime updates and notification sync'
                  ]).map((hl, k) => (
                    <div key={k} className="flex gap-2.5 items-start">
                      <div className="h-4.5 w-4.5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-xs text-gray-300 font-light leading-snug">
                        {hl}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & instant checkout CTA */}
              <div className="mt-auto border-t border-white/5 pt-5 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-mono text-gray-400">
                    Price: <span className="text-2xl font-bold font-sans text-white">₹{ebook.price.toLocaleString('en-IN')}</span>
                  </span>
                </div>

                {purchased ? (
                  <button
                    id="modal-download-btn"
                    onClick={() => onDownload(ebook)}
                    className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all duration-200"
                  >
                    <Download className="w-4 h-4" /> Download Book Package
                  </button>
                ) : (
                  <button
                    id="modal-buy-btn"
                    onClick={() => onBuyNow(ebook)}
                    className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/15 active:scale-[0.98] transition-all duration-200"
                  >
                    <Download className="w-4 h-4" /> Download Book
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* RELATED PRODUCTS */}
          {relatedEbooks.length > 0 && (
            <div className="border-t border-white/5 pt-8 mt-12">
              <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-4 font-bold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Hand-picked suggestions based on category
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {relatedEbooks.map((related) => (
                  <div
                    key={related.id}
                    onClick={() => onSelectEbook(related)}
                    className="group bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col h-full"
                  >
                    <div className="relative aspect-[3/4] rounded-lg bg-black/40 overflow-hidden mb-3">
                      <div className="absolute inset-y-0 left-0 w-[4%] bg-gradient-to-r from-black/40 via-white/10 to-transparent z-10" />
                      
                      {related.cover_url.startsWith('linear-gradient') ? (
                        <div style={{ background: related.cover_url }} className="w-full h-full flex items-center justify-center p-3 text-center">
                          <span className="font-display font-bold text-[9px] text-white line-clamp-3 leading-tight drop-shadow-md">
                            {related.title}
                          </span>
                        </div>
                      ) : (
                        <img src={related.cover_url} alt={related.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      )}
                    </div>
                    
                    <h5 className="font-display font-semibold text-xs text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {related.title}
                    </h5>
                    <span className="text-[10px] font-mono text-gray-500 mt-0.5">₹{related.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
