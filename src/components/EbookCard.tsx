import React from 'react';
import { Bookmark, Star, Download, ExternalLink, ArrowRight } from 'lucide-react';
import { Ebook } from '../types';

interface EbookCardProps {
  ebook: Ebook;
  onSelect: (ebook: Ebook) => void;
  isWishlisted: boolean;
  onToggleWishlist: (e: React.MouseEvent, ebookId: string) => void;
  purchased: boolean;
  onBuyNow: (e: React.MouseEvent, ebook: Ebook) => void;
}

export const EbookCard: React.FC<EbookCardProps> = ({
  ebook,
  onSelect,
  isWishlisted,
  onToggleWishlist,
  purchased,
  onBuyNow
}) => {
  // Check if cover is a CSS gradient
  const isGradientCover = ebook.cover_url.startsWith('linear-gradient') || ebook.cover_url.startsWith('radial-gradient');

  return (
    <div 
      id={`ebook-card-${ebook.id}`}
      className="group relative flex flex-col h-full rounded-2xl bg-dark-card border border-white/5 overflow-hidden hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)] hover:-translate-y-1.5 cursor-pointer"
      onClick={() => onSelect(ebook)}
    >
      {/* Visual Book Cover Container */}
      <div className="relative pt-[135%] w-full overflow-hidden bg-black/60 flex items-center justify-center select-none group-hover:brightness-105 transition-all duration-300">
        
        {/* Realistic spine overlay and volumetric drop shadow */}
        <div className="absolute inset-y-0 left-0 w-[4%] bg-gradient-to-r from-black/40 via-white/10 to-transparent z-10" />
        
        {/* Soft plastic glare glaze layout */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none z-10 mix-blend-overlay" />
        
        <div className="absolute inset-5 flex items-center justify-center">
          {isGradientCover ? (
            /* Styled dynamic 3D hardcover graphic */
            <div 
              style={{ background: ebook.cover_url }}
              className="relative w-full h-full rounded-md shadow-2xl flex flex-col justify-between p-5 text-white overflow-hidden transform group-hover:scale-[1.03] duration-500 border border-white/10"
            >
              {/* Luxury background geometric overlay */}
              <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
              
              {/* Premium Book Spine line */}
              <div className="absolute inset-y-0 left-0 w-1.5 bg-black/20" />
              
              <div className="z-10 flex flex-col items-start gap-1">
                <span className="font-mono text-[9px] tracking-widest text-white/70 uppercase">
                  {ebook.category}
                </span>
                <span className="w-8 h-[2px] bg-white/40 mt-1" />
              </div>
              
              <div className="z-10 flex-grow flex items-center justify-center my-4 font-display">
                <h4 className="text-base sm:text-lg font-bold tracking-tight text-center text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] leading-tight line-clamp-3">
                  {ebook.title}
                </h4>
              </div>
              
              <div className="z-10 flex justify-between items-end border-t border-white/20 pt-3">
                <span className="font-mono text-[10px] tracking-wide text-white/80 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                  BY {ebook.author.toUpperCase()}
                </span>
                <div className="flex items-center gap-0.5 bg-black/30 backdrop-blur-md rounded px-1.5 py-0.5 border border-white/10">
                  <span className="text-[9px] font-mono text-premium-gold">★</span>
                  <span className="text-[9px] font-mono font-bold text-white">{ebook.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Render image cover file */
            <div className="relative w-full h-full rounded-md shadow-2xl overflow-hidden border border-white/10 transform group-hover:scale-[1.03] duration-500">
              <img 
                src={ebook.cover_url} 
                alt={ebook.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                <span className="font-mono text-[8px] tracking-widest text-indigo-400 uppercase">
                  {ebook.category}
                </span>
                <h4 className="font-display font-bold text-sm tracking-tight text-white line-clamp-2 mt-1">
                  {ebook.title}
                </h4>
              </div>
            </div>
          )}
        </div>

        {/* Action utility overlay buttons */}
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <button
            id={`wishlist-btn-${ebook.id}`}
            onClick={(e) => onToggleWishlist(e, ebook.id)}
            className={`p-2 rounded-full border backdrop-blur-md transition-all duration-300 ${
              isWishlisted
                ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                : 'bg-black/40 border-white/10 text-white/70 hover:text-white hover:border-white/30'
            }`}
            title={isWishlisted ? 'Remove Bookmark' : 'Bookmark Ebook'}
          >
            <Bookmark className="w-4 h-4 fill-current" style={{ fillOpacity: isWishlisted ? 1 : 0 }} />
          </button>
        </div>
      </div>

      {/* Book description panel */}
      <div className="flex flex-col flex-grow p-5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-xs text-gray-400 font-medium">
            {ebook.category}
          </span>
          <span className="text-gray-600 font-bold text-xs">•</span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-premium-gold fill-current" />
            <span className="text-xs font-mono font-semibold text-gray-300">{ebook.rating.toFixed(1)}</span>
          </div>
        </div>

        <h3 className="font-display text-base font-bold text-white tracking-tight line-clamp-1 mb-1 group-hover:text-indigo-400 transition-colors duration-200">
          {ebook.title}
        </h3>

        <p className="text-xs font-mono text-gray-500 mb-4">
          By {ebook.author}
        </p>

        <p className="text-xs text-gray-400 line-clamp-2 mb-5 flex-grow font-light leading-relaxed">
          {ebook.description}
        </p>

        {/* Pricing context & purchase buttons */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-mono tracking-wider">Price</span>
            <span className="text-lg font-mono font-bold text-white">
              ₹{ebook.price.toLocaleString('en-IN')}
            </span>
          </div>

          {purchased ? (
            <button
              id={`read-now-btn-${ebook.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(ebook);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20 active:scale-95 transition-all duration-200"
            >
              <Download className="w-3.5 h-3.5" /> Read library
            </button>
          ) : (
            <button
              id={`buy-now-btn-${ebook.id}`}
              onClick={(e) => onBuyNow(e, ebook)}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all duration-200"
            >
              Get eBook <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
