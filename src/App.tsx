import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EbookCard } from './components/EbookCard';
import { EbookDetailModal } from './components/EbookDetailModal';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { db } from './db';
import { Ebook } from './types';
import { CreditCard, CheckCircle2, ShieldAlert, Sparkles, BookOpen, Clock, Download, Bookmark, Layers, HardDrive, RefreshCw, MessageCircle, Instagram, Copy, Check, ArrowUpRight, QrCode, Mail, LogIn, LogOut, User, Shield } from 'lucide-react';

export default function App() {
  // Direct payment contact credentials
  const [whatsappNumber, setWhatsappNumber] = useState(() => {
    return localStorage.getItem('store_whatsapp_number') || '919323719266';
  });
  const [instagramUsername, setInstagramUsername] = useState(() => {
    return localStorage.getItem('store_instagram_username') || 'prasenjitwade004';
  });
  
  // Interactive copy state
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [showInstagramPopup, setShowInstagramPopup] = useState(false);

  const handleUpdateContactSettings = (wa: string, ig: string) => {
    setWhatsappNumber(wa);
    setInstagramUsername(ig);
    localStorage.setItem('store_whatsapp_number', wa);
    localStorage.setItem('store_instagram_username', ig);
    showToast('Direct payment contact credentials updated!', 'success');
  };

  // Page routing state: 'landing' | 'browse' | 'library' | 'admin'
  const [activeView, setActiveView] = useState<'landing' | 'browse' | 'library' | 'admin'>('landing');
  
  // Authentication Role simulation state: 'guest' | 'admin'
  const [currentRole, setCurrentRole] = useState<'guest' | 'admin'>(() => {
    return (localStorage.getItem('user_role') as 'guest' | 'admin') || 'guest';
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('user_email') || null;
  });

  // Database core state
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [categories, setCategories] = useState<string[]>(['All', 'Design & UI', 'Development', 'Marketing & Business']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive detail modals state
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Ebook | null>(null);
  
  // Checkout overlay triggers
  const [checkoutEbook, setCheckoutEbook] = useState<Ebook | null>(null);
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutName, setCheckoutName] = useState('');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  // User Library and Wishlist indices (tracked by Book IDs under the active simulated email)
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [purchasedBookIds, setPurchasedBookIds] = useState<string[]>([]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'info' | 'success' | 'warn'>('info');

  // Trigger custom interactive toasts
  const showToast = (message: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Synchronize dynamic role changes with local storage
  useEffect(() => {
    localStorage.setItem('user_role', currentRole);
    if (userEmail) {
      localStorage.setItem('user_email', userEmail);
    } else {
      localStorage.removeItem('user_email');
    }
  }, [currentRole, userEmail]);

  // Read data from DB on load and active role changes
  useEffect(() => {
    const loadEbooks = async () => {
      try {
        const list = await db.getEbooks();
        setEbooks(list);
        
        // Dynamically parse more categories if added from admin panel
        const parsed = ['All', ...new Set(list.map(b => b.category))];
        setCategories(parsed);
      } catch (e) {
        console.error('Failed to load ebooks', e);
      }
    };
    loadEbooks();
  }, []);

  // Sync purchases and wishes based on simulated userEmail
  useEffect(() => {
    const syncUserStore = async () => {
      if (!userEmail) {
        setWishlist([]);
        setPurchasedBookIds([]);
        return;
      }

      try {
        // Sync wishlist
        const wishes = await db.getWishlist(userEmail);
        setWishlist(wishes);

        // Sync purchased list
        const ordersList = await db.getOrders(userEmail);
        const purchasedIds = ordersList.map(o => o.ebook_id);
        
        // Admin gets absolute automatic credentials to all assets
        if (currentRole === 'admin') {
          setPurchasedBookIds(ebooks.map(b => b.id));
        } else {
          setPurchasedBookIds(purchasedIds);
        }
      } catch (err) {
        console.error(err);
      }
    };
    syncUserStore();
  }, [userEmail, ebooks, currentRole]);

  // --- ACTIONS ---

  const handleToggleWishlist = async (ebookId: string) => {
    let activeEmail = userEmail;
    if (!activeEmail) {
      activeEmail = 'guest@flow.local';
      setUserEmail(activeEmail);
      localStorage.setItem('user_email', activeEmail);
    }
    try {
      const updatedList = await db.toggleWishlist(activeEmail, ebookId);
      setWishlist(updatedList);
      
      const isNowSaved = updatedList.includes(ebookId);
      showToast(
        isNowSaved ? 'Ebook bookmarked in your digital locker' : 'Removed ebook bookmark',
        'success'
      );
    } catch (e) {
      showToast('Failed to change bookmark state', 'warn');
    }
  };

  const handleStartCheckout = (ebook: Ebook) => {
    if (purchasedBookIds.includes(ebook.id)) {
      showToast('You already own this digital product!', 'info');
      setSelectedEbook(ebook);
      return;
    }
    setCheckoutEbook(ebook);
    setCheckoutEmail(userEmail || '');
    setCheckoutName('Premium Developer');
  };

  const handleConfirmCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutEbook || !checkoutEmail) return;

    setIsProcessingCheckout(true);
    
    // Simulate payment merchant delay
    setTimeout(async () => {
      try {
        // Automatically save/register user email in local storage
        setUserEmail(checkoutEmail);
        localStorage.setItem('user_email', checkoutEmail);
        
        // Register order
        await db.createOrder(checkoutEmail, checkoutEbook.id);
        
        // Update local lists
        setPurchasedBookIds(prev => [...prev, checkoutEbook.id]);
        
        showToast(`Checkout verified! "${checkoutEbook.title}" added to library.`, 'success');
        setCheckoutEbook(null);
        setIsProcessingCheckout(false);

        // Auto move to library so the user can test the download instantly
        setActiveView('library');
      } catch (err) {
        showToast('Payment processing failed. Try again.', 'warn');
        setIsProcessingCheckout(false);
      }
    }, 1800);
  };

  const handleDownloadBook = async (ebook: Ebook) => {
    showToast(`Requesting signed URL download tokens for "${ebook.title}"...`, 'info');
    try {
      const downloadUrl = await db.getDownloadUrl(ebook.pdf_url);
      
      // Simulate real browser package download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${ebook.title.toLowerCase().replace(/\s+/g, '-')}-ebook.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Immediate digital package download triggered!', 'success');
    } catch (err) {
      showToast('Download request took too long. Operating in offline demo mode.', 'warn');
    }
  };

  // --- ADMIN ACTIONS ---

  const handleAddCategory = (newCategory: string) => {
    if (!categories.includes(newCategory)) {
      setCategories(prev => [...prev, newCategory]);
      showToast(`Category "${newCategory}" successfully added to filtering shelf!`, 'success');
    }
  };

  const handleAddEbook = async (newBookPayload: Omit<Ebook, 'id' | 'created_at'>) => {
    try {
      const addedBook = await db.addEbook(newBookPayload);
      setEbooks(prev => [addedBook, ...prev]);
      showToast(`E-Asset metadata "${addedBook.title}" successfully registered in store context.`, 'success');
    } catch (e) {
      showToast('Failed to insert new ebook', 'warn');
    }
  };

  const handleUpdateEbook = async (id: string, updates: Partial<Ebook>) => {
    try {
      const updated = await db.updateEbook(id, updates);
      setEbooks(prev => prev.map(b => b.id === id ? updated : b));
      showToast(`Specifications for "${updated.title}" successfully synchronized.`, 'success');
    } catch (e) {
      showToast('Ebook upgrade failed', 'warn');
    }
  };

  const handleDeleteEbook = (id: string) => {
    const book = ebooks.find(b => b.id === id);
    if (book) {
      setBookToDelete(book);
    }
  };

  const handleConfirmDeleteEbook = async () => {
    if (!bookToDelete) return;
    try {
      await db.deleteEbook(bookToDelete.id);
      setEbooks(prev => prev.filter(b => b.id !== bookToDelete.id));
      showToast(`Deleted "${bookToDelete.title}" from direct catalog.`, 'success');
      setBookToDelete(null);
    } catch (err) {
      showToast('Archive command failed', 'warn');
      setBookToDelete(null);
    }
  };

  // --- FILTERING GRAPH ---
  const filteredEbooks = ebooks.filter(book => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="lumina-applet-root" className="min-h-screen flex flex-col bg-[#030712] text-gray-100 font-sans selection:bg-indigo-500/30 selection:text-white radial-glow relative">
      
      {/* Absolute top glowing backgrounds */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none -z-10" />

      {/* Floating System Notification Card / Toasts */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4.5 rounded-2xl bg-dark-card border border-white/10 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 max-w-sm">
          <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
            toastType === 'success' 
              ? 'bg-emerald-500/10 text-emerald-400' 
              : toastType === 'warn' 
                ? 'bg-amber-500/10 text-amber-400' 
                : 'bg-indigo-500/10 text-indigo-400'
          }`}>
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <p className="text-xs text-gray-200 leading-snug font-medium pr-2">
            {toastMessage}
          </p>
        </div>
      )}

      {/* Header element */}
      <Navbar
        currentRole={currentRole}
        userEmail={userEmail}
        onSwitchRole={(role) => {
          setCurrentRole(role);
          if (role === 'admin') {
            setUserEmail('prasenjitwade09@gmail.com');
          } else {
            setUserEmail(localStorage.getItem('user_email') || null);
          }
        }}
        onNavigate={setActiveView}
        activeView={activeView}
      />

      {/* Primary view routers */}
      <main className="flex-grow pt-4">

        {/* VIEW 1: LANDING HOMEPAGE */}
        {activeView === 'landing' && (
          <div>
            <Hero
              onBrowseClick={() => setActiveView('browse')}
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                setActiveView('browse');
              }}
            />

            {/* Featured books previews section */}
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Featured Architectural Assets
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400 font-light mt-1.5">
                    Premium hand-crafted publications containing production designs, generic scripts, and code architectures.
                  </p>
                </div>
                
                <button
                  id="featured-explore-all"
                  onClick={() => setActiveView('browse')}
                  className="px-4.5 py-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold self-start tracking-wide flex items-center gap-1"
                >
                  Browse Entire Store
                </button>
              </div>

              {/* Grid books list */}
              {ebooks.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-2xl bg-dark-card border border-white/5 h-96 animate-pulse p-5 flex flex-col justify-between">
                      <div className="aspect-[3/4] rounded-xl bg-white/5" />
                      <div className="h-4 bg-white/5 rounded-md w-3/4 mt-4" />
                      <div className="h-4 bg-white/5 rounded-md w-1/2 mt-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {ebooks.slice(0, 4).map((book) => (
                    <EbookCard
                      key={book.id}
                      ebook={book}
                      onSelect={setSelectedEbook}
                      isWishlisted={wishlist.includes(book.id)}
                      onToggleWishlist={(e, bid) => {
                        e.stopPropagation();
                        handleToggleWishlist(bid);
                      }}
                      purchased={purchasedBookIds.includes(book.id)}
                      onBuyNow={(e, b) => {
                        e.stopPropagation();
                        handleStartCheckout(b);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* FAQ collapsible block */}
            <FAQ />
          </div>
        )}

        {/* VIEW 2: EXPLORE BROWSE GRID */}
        {activeView === 'browse' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-6 mb-8">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Premium Resource Directory
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 font-light mt-1">
                  Discover clean digital architectures, high-converting blueprints, templates, and ebooks.
                </p>
              </div>

              {/* Dynamic Categories Selection Carousel bar */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    id={`filter-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search filter banner block */}
            {searchQuery && (
              <div className="mb-6 flex items-center justify-between bg-indigo-500/5 border border-indigo-500/10 px-4 py-2 rounded-xl text-xs text-indigo-300 font-mono">
                <span>Filtering result matches for query: <span className="font-bold">"{searchQuery}"</span></span>
                <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-white">CLEAR</button>
              </div>
            )}

            {/* Main grid listing */}
            {filteredEbooks.length === 0 ? (
              <div className="text-center py-24 rounded-3xl bg-dark-card border border-white/5">
                <p className="text-sm font-bold text-gray-400">No items match current filter criteria</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }} 
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEbooks.map((book) => (
                  <EbookCard
                    key={book.id}
                    ebook={book}
                    onSelect={setSelectedEbook}
                    isWishlisted={wishlist.includes(book.id)}
                    onToggleWishlist={(e, bid) => {
                      e.stopPropagation();
                      handleToggleWishlist(bid);
                    }}
                    purchased={purchasedBookIds.includes(book.id)}
                    onBuyNow={(e, b) => {
                      e.stopPropagation();
                      handleStartCheckout(b);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: MEMBER READ LIBRARY */}
        {activeView === 'library' && (
          <UserDashboard
            userEmail={userEmail}
            purchasedBooks={ebooks.filter(b => purchasedBookIds.includes(b.id))}
            wishlistedBooks={ebooks.filter(b => wishlist.includes(b.id))}
            onSelectEbook={setSelectedEbook}
            onRemoveWishlist={handleToggleWishlist}
            onDownload={handleDownloadBook}
            onUpdateEmail={(email) => {
              setUserEmail(email);
              showToast('Subscribed membership credentials modified!', 'success');
            }}
            onGoogleSignIn={() => {
              setUserEmail('prasenjitwade09@gmail.com');
              showToast('Google OAuth Authentication successful via email prasenjitwade09@gmail.com', 'success');
            }}
          />
        )}

        {/* VIEW 4: ADMIN MANAGEMENT WORKSPACE */}
        {activeView === 'admin' && (
          <AdminDashboard
            ebooks={ebooks}
            categories={categories}
            onAddCategory={handleAddCategory}
            onAddEbook={handleAddEbook}
            onUpdateEbook={handleUpdateEbook}
            onDeleteEbook={handleDeleteEbook}
            onUploadFile={db.uploadFile}
          />
        )}

      </main>

      {/* DYNAMIC CHECKOUT POPUP OVERLAY */}
      {checkoutEbook && (() => {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutEmail.trim());
        const checkoutMessage = `Hi Prasenjit, I want to buy and download your eBook: "${checkoutEbook.title}"${checkoutEmail ? ` (My Delivery Email: ${checkoutEmail})` : ''}. Please share the QR code to proceed!`;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
            <div 
              id="checkout-modal"
              className="w-full max-w-md rounded-2xl bg-[#0c111d] border border-white/10 p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 my-8"
            >
              {/* Top design glare line */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500 via-indigo-500 to-pink-500" />
              
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="font-display text-base font-extrabold text-white flex items-center gap-2">
                    <QrCode className="w-4.5 h-4.5 text-indigo-400" /> Manual QR Purchase Flow
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Get your premium e-asset in 3 simple direct steps.</p>
                </div>
                <button 
                  onClick={() => {
                    setCheckoutEbook(null);
                    setCopiedMessage(false);
                  }}
                  className="p-1 px-2.5 text-xs rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                >
                  Close
                </button>
              </div>

              {/* Product summary card row inside checkout */}
              <div className="flex gap-4 p-3 rounded-xl bg-white/2 border border-white/5 mb-5 select-none">
                <div className="h-14 w-10 index-10 rounded bg-black/40 overflow-hidden flex-shrink-0 border border-white/5">
                  {checkoutEbook.cover_url.startsWith('linear-gradient') ? (
                    <div style={{ background: checkoutEbook.cover_url }} className="w-full h-full text-[6px] text-white flex items-center justify-center text-center p-1 font-bold">
                      {checkoutEbook.title.substring(0, 8)}
                    </div>
                  ) : (
                    <img src={checkoutEbook.cover_url} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-grow">
                  <h4 className="font-display font-semibold text-xs text-white truncate">{checkoutEbook.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">By {checkoutEbook.author}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-bold text-emerald-400">₹{checkoutEbook.price.toLocaleString('en-IN')}</span>
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-300 py-0.5 px-2 rounded-full font-mono uppercase">Direct QR Code Payment</span>
                  </div>
                </div>
              </div>

              {/* Direct Workflow Timeline Steps Layout */}
              <div className="mb-5 space-y-3 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-gray-300">
                <span className="font-mono text-[9px] text-indigo-400 font-bold uppercase tracking-wider block">Flow Walkthrough</span>
                
                <div className="flex gap-2.5 items-start">
                  <div className="h-5 w-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <p className="text-[11px] text-gray-400 leading-normal font-light">
                    Enter your delivery email, then choose <span className="text-white font-medium">WhatsApp</span> or <span className="text-white font-medium">Instagram</span> below to connect directly with Prasenjit.
                  </p>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="h-5 w-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <p className="text-[11px] text-gray-400 leading-normal font-light">
                    The pre-filled message will request the book. We will instantly send the <span className="text-white font-medium">UPI QR Code</span> in the chat.
                  </p>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="h-5 w-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <p className="text-[11px] text-gray-400 leading-normal font-light">
                    Make your secure transfer, share the payment screenshot, and receive your high-resolution eBook delivered instantly!
                  </p>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5 mb-5">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase">Your Delivery Email Address</label>
                  {!isEmailValid && checkoutEmail.trim().length > 0 && (
                    <span className="text-[9px] font-mono text-red-400">Invalid format</span>
                  )}
                  {isEmailValid && (
                    <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">✓ Verified Email</span>
                  )}
                </div>
                <input
                  id="checkout-email-input"
                  type="email"
                  required
                  placeholder="e.g. buyer@creativebuilders.com"
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${
                    isEmailValid
                      ? 'bg-emerald-500/5 border border-emerald-500/20 focus:ring-emerald-500'
                      : checkoutEmail.trim().length > 0
                        ? 'bg-red-500/5 border border-red-500/20 focus:ring-red-500'
                        : 'bg-white/5 border border-white/10 focus:ring-indigo-500'
                  }`}
                />
                {!isEmailValid && (
                  <p className="text-[9px] text-amber-400 font-mono flex items-center gap-1 leading-normal mt-1.5">
                    ⚠️ Enter your active email first to unlock order buttons/prefilled messages!
                  </p>
                )}
                {isEmailValid && (
                  <p className="text-[9px] text-gray-500 font-mono mt-1.5">Will be prefilled in message. Prasenjit will share the book to this email.</p>
                )}
              </div>

              {/* Chat script preview box */}
              <div className="mb-6 p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                <div className="flex justify-between items-center mb-1.5 font-mono text-[10px]">
                  <span className="font-semibold text-gray-500 uppercase tracking-widest">Pre-filled Chat Message</span>
                  <button
                    type="button"
                    disabled={!isEmailValid}
                    onClick={() => {
                      if (!isEmailValid) return;
                      navigator.clipboard.writeText(checkoutMessage);
                      setCopiedMessage(true);
                      setTimeout(() => setCopiedMessage(false), 2000);
                      showToast('Order message copied to clipboard!', 'success');
                    }}
                    className={`flex items-center gap-1.5 font-bold transition ${isEmailValid ? 'text-indigo-400 hover:text-indigo-300' : 'text-gray-600 cursor-not-allowed'}`}
                  >
                    {copiedMessage ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Msg</span>
                      </>
                    )}
                  </button>
                </div>
                <p className={`font-mono text-[11px] p-2.5 rounded-lg border break-words leading-relaxed select-none ${isEmailValid ? 'text-gray-300 bg-black/40 border-white/5' : 'text-gray-600 bg-black/10 border-white/2'}`}>
                  {isEmailValid ? checkoutMessage : '[Please enter your email to generate order message]'}
                </p>
              </div>

              {/* CTA Platform Selector */}
              <div className="space-y-2.5">
                <button
                  id="checkout-instagram-btn"
                  onClick={() => {
                    if (!isEmailValid) {
                      showToast('Please enter your delivery email address first!', 'warn');
                      const input = document.getElementById('checkout-email-input');
                      if (input) {
                        input.focus();
                        input.classList.add('ring-2', 'ring-red-500');
                        setTimeout(() => input.classList.remove('ring-2', 'ring-red-500'), 1500);
                      }
                      return;
                    }
                    navigator.clipboard.writeText(checkoutMessage);
                    setCopiedMessage(true);
                    setTimeout(() => setCopiedMessage(false), 2000);
                    showToast('Message copied! Setting up Instagram...', 'success');
                    setShowInstagramPopup(true);
                  }}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer ${
                    isEmailValid
                      ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500 hover:opacity-95 text-white shadow-pink-600/10 hover:shadow-pink-600/20'
                      : 'bg-[#121824] text-gray-500 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  <Instagram className="w-4 h-4" />
                  <span>Order via Instagram DM</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* INSTAGRAM DM PROTOCOL HELPER POPUP */}
      {showInstagramPopup && checkoutEbook && (() => {
        const checkoutMessage = `Hi Prasenjit, I want to buy and download your eBook: "${checkoutEbook.title}"${checkoutEmail ? ` (My Delivery Email: ${checkoutEmail})` : ''}. Please share the QR code to proceed!`;
        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto font-sans">
            <div className="w-full max-w-sm rounded-2xl bg-[#0c111d] border border-pink-500/30 p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 my-8">
              {/* Decorative gradient top light line */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-display text-base font-extrabold text-white flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-pink-400 animate-pulse" /> Instagram Direct Message Finder
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Prefilled purchase query with eBook name</p>
                </div>
                <button 
                  onClick={() => setShowInstagramPopup(false)}
                  className="p-1 px-2.5 text-xs rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                >
                  Close
                </button>
              </div>

              {/* Information message */}
              <div className="text-xs text-gray-300 leading-normal mb-4 font-light bg-pink-500/5 p-3.5 rounded-xl border border-pink-500/10">
                Instagram does not allow automatic pre-filling of messages via Web Links. Instead, we have <span className="text-pink-300 font-bold">copied</span> your order message below. Simply <span className="text-white font-bold">paste it</span> directly into the DM thread!
              </div>

              {/* Prefilled message visual card with eBook name */}
              <div className="mb-5 space-y-1.5">
                <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Active Clipboard Data:</span>
                <div className="bg-black/50 border border-white/5 p-3 rounded-xl font-mono text-[11px] text-pink-100 break-words leading-relaxed select-all">
                  {checkoutMessage}
                </div>
              </div>

              {/* Core interactive action */}
              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(checkoutMessage);
                    showToast('Copied to clipboard! Opening Instagram DM directly...', 'success');
                    setTimeout(() => {
                      window.open(`https://ig.me/m/${instagramUsername}`, '_blank');
                    }, 500);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20 active:scale-[0.98] transition-all duration-200"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Msg & Go Direct to DM</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setShowInstagramPopup(false)}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white font-semibold transition"
                >
                  Return to payment screen
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* SECURE DELETE CONFIRMATION OVERLAY */}
      {bookToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div 
            id="delete-confirm-modal"
            className="w-full max-w-sm rounded-2xl bg-[#0c111d] border border-red-500/20 p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 to-amber-500" />
            
            <div className="flex items-start gap-4 mb-5">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 flex-shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xs font-bold text-white uppercase tracking-wider">Unpublish E-Asset</h3>
                <p className="text-[11px] text-gray-400 mt-1">Is it your choice to permanently destroy this book from listings?</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 mb-6 space-y-1.5 text-xs">
              <p className="text-red-300 font-bold mb-1 font-mono text-[10px]">Selected Target:</p>
              <div className="text-gray-300 font-semibold">{bookToDelete.title}</div>
              <div className="text-gray-500 font-mono text-[9px]">ID Key: {bookToDelete.id}</div>
              <p className="text-[11px] text-gray-400 font-light pt-2 leading-relaxed">
                This deletion will immediately unpublish the item from the storefront. Active customers who purchased this ebook will retain offline access inside their digital lockers.
              </p>
            </div>

            <div className="flex justify-end gap-3 text-xs">
              <button
                id="cancel-delete-btn"
                onClick={() => setBookToDelete(null)}
                className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                Keep Book
              </button>
              <button
                id="confirm-delete-btn"
                onClick={handleConfirmDeleteEbook}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EBOOK SPEC DETAIL MODAL PREVIEW SCREEN */}
      {selectedEbook && (
        <EbookDetailModal
          ebook={selectedEbook}
          onClose={() => setSelectedEbook(null)}
          isWishlisted={wishlist.includes(selectedEbook.id)}
          onToggleWishlist={() => handleToggleWishlist(selectedEbook.id)}
          purchased={purchasedBookIds.includes(selectedEbook.id)}
          onBuyNow={(b) => {
            setSelectedEbook(null);
            handleStartCheckout(b);
          }}
          onDownload={(b) => {
            handleDownloadBook(b);
          }}
          onSelectEbook={setSelectedEbook}
          relatedEbooks={ebooks.filter(b => b.category === selectedEbook.category && b.id !== selectedEbook.id).slice(0, 3)}
        />
      )}

      {/* Main footer element */}
      <Footer onNavigate={setActiveView} />

    </div>
  );
}
