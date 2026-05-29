import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield, FolderPlus, DollarSign, BookOpen, Users, BarChart3, Upload, RefreshCw, Layers, CheckCircle2, AlertTriangle, KeyRound, QrCode, Mail, ExternalLink, Send, Check, Clock } from 'lucide-react';
import { Ebook, Order } from '../types';
import { db } from '../db';

interface AdminDashboardProps {
  ebooks: Ebook[];
  categories: string[];
  onAddCategory: (category: string) => void;
  onAddEbook: (book: Omit<Ebook, 'id' | 'created_at'>) => void;
  onUpdateEbook: (id: string, book: Partial<Ebook>) => void;
  onDeleteEbook: (id: string) => void;
  onUploadFile: (bucket: 'ebook-covers' | 'ebook-pdfs', file: File) => Promise<string>;
  whatsappNumber: string;
  instagramUsername: string;
  onUpdateContactSettings: (wa: string, ig: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  ebooks,
  categories,
  onAddCategory,
  onAddEbook,
  onUpdateEbook,
  onDeleteEbook,
  onUploadFile,
  whatsappNumber,
  instagramUsername,
  onUpdateContactSettings
}) => {
  // Store Config settings
  const [waNumber, setWaNumber] = useState(whatsappNumber);
  const [igUsername, setIgUsername] = useState(instagramUsername);

  useEffect(() => {
    setWaNumber(whatsappNumber);
  }, [whatsappNumber]);

  useEffect(() => {
    setIgUsername(instagramUsername);
  }, [instagramUsername]);

  // Passcode verification for "Secure admin login"
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false); // Default to locked so regular users cannot access it
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState('');

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Prasenjit Wade');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(19.99);
  const [category, setCategory] = useState(categories[1] || 'Design & UI');
  const [rating, setRating] = useState(5.0);
  const [coverUrl, setCoverUrl] = useState('linear-gradient(135deg, #FF3366 0%, #FF6633 100%)');
  const [pdfUrl, setPdfUrl] = useState('#demo-pdf');

  // File Upload states
  const [coverFileName, setCoverFileName] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'completed'>('idle');

  // Categories lists states
  const [newCat, setNewCat] = useState('');

  // Delivery tracking status state for Gmail orders
  const [deliveryStatuses, setDeliveryStatuses] = useState<Record<string, 'sent' | 'pending'>>(() => {
    try {
      const saved = localStorage.getItem('gmail_delivery_statuses');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleDeliveryStatus = (orderId: string) => {
    setDeliveryStatuses(prev => {
      const nextStatus = prev[orderId] === 'sent' ? 'pending' : 'sent';
      const updated = { ...prev, [orderId]: nextStatus };
      localStorage.setItem('gmail_delivery_statuses', JSON.stringify(updated));
      return updated;
    });
  };

  const handleShareViaGmail = (order: Order) => {
    const targetBook = ebooks.find(b => b.id === order.ebook_id);
    const bookTitle = targetBook ? targetBook.title : 'Purchased eBook';
    const bookLink = targetBook ? targetBook.pdf_url : '';
    const emailSubject = encodeURIComponent(`Your Purchased eBook: ${bookTitle}`);
    
    const emailBody = `Hi!

Thank you so much for your purchase of "${bookTitle}"!

Here is the link/access to download your digital package:
${bookLink.startsWith('http') ? bookLink : '[Google Drive or File Access Link Here]'}

Enjoy reading and let me know if you have any questions!

Best regards,
Prasenjit Wade`;

    const encodedBody = encodeURIComponent(emailBody);
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(order.user_id)}&su=${emailSubject}&body=${encodedBody}`;
    window.open(gmailWebUrl, '_blank');
  };
  
  const verifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'Prasenpw123') {
      setIsAdminUnlocked(true);
      setPassError('');
    } else {
      setPassError('Invalid author credentials. Access denied.');
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !description || !price) return;

    const bookPayload = {
      title,
      author,
      description,
      price: Number(price),
      category,
      cover_url: coverUrl,
      pdf_url: pdfUrl,
      rating: Number(rating)
    };

    if (editingBookId) {
      onUpdateEbook(editingBookId, bookPayload);
      setEditingBookId(null);
    } else {
      onAddEbook(bookPayload);
    }

    // Reset Form
    setTitle('');
    setAuthor('Prasenjit Wade');
    setDescription('');
    setPrice(19.99);
    setRating(5.0);
    setCoverUrl('linear-gradient(135deg, #FF3366 0%, #FF6633 100%)');
    setPdfUrl('#demo-pdf');
    setCoverFileName('');
    setPdfFileName('');
    setIsFormOpen(false);
  };

  const startEdit = (book: Ebook) => {
    setEditingBookId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setDescription(book.description);
    setPrice(book.price);
    setCategory(book.category);
    setRating(book.rating);
    setCoverUrl(book.cover_url);
    setPdfUrl(book.pdf_url);
    setIsFormOpen(true);

    // Smoothly scroll the window back up to the top of the screen so that the form is completely visible
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Move input focus to the title field instantly
    setTimeout(() => {
      document.getElementById('admin-form-title')?.focus();
    }, 100);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, bucket: 'ebook-covers' | 'ebook-pdfs') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (bucket === 'ebook-covers') {
      setCoverFileName(file.name);
    } else {
      setPdfFileName(file.name);
    }

    try {
      setUploadProgress('uploading');
      const uploadedPathOrUrl = await onUploadFile(bucket, file);
      
      if (bucket === 'ebook-covers') {
        setCoverUrl(uploadedPathOrUrl);
      } else {
        setPdfUrl(uploadedPathOrUrl);
      }
      setUploadProgress('completed');
      setTimeout(() => setUploadProgress('idle'), 2500);
    } catch (err) {
      console.error(err);
      setUploadProgress('idle');
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat && !categories.includes(newCat)) {
      onAddCategory(newCat);
      setNewCat('');
    }
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const list = await db.getAllOrders();
        setOrders(list);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [ebooks]);

  // Actual Stats Calculations based strictly on genuine database entries
  const totalBooks = ebooks.length;
  const actualSalesCount = orders.length;
  
  // Calculate unique digital student/builder emails
  const uniqueEmails = Array.from(new Set(orders.map(o => o.user_id)));
  const uniqueMembersCount = uniqueEmails.length;

  // Calculate real revenue strictly from actual purchase entries
  const actualRevenue = orders.reduce((acc, order) => {
    const targetBook = ebooks.find(b => b.id === order.ebook_id);
    return acc + (targetBook ? targetBook.price : 0);
  }, 0);

  if (!isAdminUnlocked) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 flex flex-col items-center">
        <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
          <KeyRound className="w-7 h-7" />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-extrabold text-white">Author Secure Gate</h2>
          <p className="text-xs text-gray-400 mt-1">Unlock console to manage your e-assets. Restricted strictly to authorized owner.</p>
        </div>

        <form onSubmit={verifyPasscode} className="w-full space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-1.5">Enter Creator Key</label>
            <input
              id="admin-passcode-input"
              type="password"
              placeholder="••••••••"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 font-mono text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {passError && (
            <span className="text-xs text-red-400 font-medium block text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{passError}</span>
          )}

          <button
            id="admin-submit-passcode"
            type="submit"
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
          >
            Access Dashboard Account
          </button>
        </form>
      </div>
    );
  }

  return (
    <div id="author-dashboard" className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Title dashboard section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-[9px] tracking-widest text-indigo-400 font-bold bg-indigo-500/15 px-2.5 py-0.5 rounded-full uppercase">
            Exclusive System
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5 flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-400" /> Admin Workspace
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Publish ebooks, upload visual covers or private book files, and review ecosystem metrics.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            id="admin-lock-btn"
            onClick={() => setIsAdminUnlocked(false)}
            className="px-4 py-2 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl text-xs text-gray-400 transition"
          >
            Lock Dashboard
          </button>
          
          <button
            id="admin-toggle-add-form"
            onClick={() => {
              setEditingBookId(null);
              setIsFormOpen(!isFormOpen);
            }}
            className="flex items-center gap-2 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs"
          >
            <Plus className="w-4 h-4" /> Publish New Ebook
          </button>
        </div>
      </div>

      {/* STRATEGIC BENTO METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-white/5 bg-[#0c111d] p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-semibold text-gray-500 uppercase tracking-wide">Total Catalog Books</span>
            <h4 className="text-2xl font-bold text-white mt-1.5">{totalBooks}</h4>
          </div>
          <div className="h-10 w-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center"><BookOpen className="w-5 h-5" /></div>
        </div>
        
        <div className="rounded-2xl border border-white/5 bg-[#0c111d] p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-semibold text-gray-500 uppercase tracking-wide">Real Sales Count</span>
            <h4 className="text-2xl font-bold text-white mt-1.5">
              {loadingOrders ? '...' : actualSalesCount}
            </h4>
          </div>
          <div className="h-10 w-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center"><BarChart3 className="w-5 h-5" /></div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0c111d] p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-semibold text-gray-500 uppercase tracking-wide">Real Store Buyers</span>
            <h4 className="text-2xl font-bold text-white mt-1.5">
              {loadingOrders ? '...' : uniqueMembersCount}
            </h4>
          </div>
          <div className="h-10 w-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center"><Users className="w-5 h-5" /></div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0c111d] p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-semibold text-gray-500 uppercase tracking-wide">Actual Revenue Generated</span>
            <h4 className="font-mono text-2xl font-bold text-emerald-400 mt-1.5">
              {loadingOrders ? '...' : `₹${actualRevenue.toLocaleString('en-IN')}`}
            </h4>
          </div>
          <div className="h-10 w-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center"><DollarSign className="w-5 h-5" /></div>
        </div>
      </div>

      {/* DYNAMIC FORMS SECTION */}
      {isFormOpen && (
        <div className="rounded-3xl border border-white/10 bg-[#0c111d] p-6 md:p-8 mb-8 relative overflow-hidden animate-in fade-in duration-300">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-500" />
          
          <h3 className="font-display text-lg font-bold text-white tracking-tight mb-5">
            {editingBookId ? 'Update Premium E-Asset Specifications' : 'Publish New Luxury Digital Asset'}
          </h3>

          <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1.5">Book Title</label>
                <input
                  id="admin-form-title"
                  type="text"
                  required
                  placeholder="e.g. Visual Masterclass with Tailwind"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1.5">Author Designation</label>
                <input
                  id="admin-form-author"
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1.5">Ebook Description</label>
                <textarea
                  id="admin-form-desc"
                  required
                  rows={4}
                  placeholder="Introduce the core curriculum, target demographics, scope, and technical takeaways..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1.5">Retail Price (₹)</label>
                  <input
                    id="admin-form-price"
                    type="number"
                    step="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1.5">Category</label>
                  <select
                    id="admin-form-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c111d] border border-white/5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {categories.filter(c => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1.5">Rating Score</label>
                  <input
                    id="admin-form-rating"
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    required
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              
              {/* Cover configurations selector */}
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1.5">Cover Image configuration</label>
                <div className="flex gap-2 flex-wrap mb-2">
                  <button
                    id="cover-preset-1"
                    type="button"
                    onClick={() => setCoverUrl('linear-gradient(135deg, #FF3366 0%, #FF6633 100%)')}
                    className="h-8 w-8 rounded bg-gradient-to-tr from-rose-500 to-orange-500 border border-white/10 active:scale-95"
                    title="Preset Coral Glow"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverUrl('linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)')}
                    className="h-8 w-8 rounded bg-gradient-to-tr from-cyan-400 to-blue-600 border border-white/10 active:scale-95"
                    title="Preset Cyan Depth"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverUrl('linear-gradient(135deg, #11998e 0%, #38ef7d 100%)')}
                    className="h-8 w-8 rounded bg-gradient-to-tr from-teal-500 to-emerald-500 border border-white/10 active:scale-95"
                    title="Preset Forest Breeze"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverUrl('linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)')}
                    className="h-8 w-8 rounded bg-gradient-to-tr from-[#8A2387] via-[#E94057] to-[#F27121] border border-white/10 active:scale-95"
                    title="Preset Cosmic Amber"
                  />
                </div>
                
                <input
                  id="admin-form-coverurl"
                  type="text"
                  placeholder="URL of cover (preset cover is selected above)"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              {/* Cover File Upload Buckets Selector */}
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1.5">Or Upload custom Cover File (Bucket: ebook-covers)</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-xs text-gray-300 font-semibold cursor-pointer transition">
                    <Upload className="w-4 h-4 text-gray-400" /> Choose Cover
                    <input
                      id="cover-file-uploader"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'ebook-covers')}
                      className="hidden"
                    />
                  </label>
                  {coverFileName && <span className="text-[10px] font-mono text-indigo-400 truncate max-w-xs">{coverFileName}</span>}
                </div>
              </div>

              {/* Private PDF Connection Block */}
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1.5">Book Link / PDF Resource Pointer (No Upload Needed)</label>
                <input
                  id="admin-form-pdfurl"
                  type="text"
                  required
                  placeholder="e.g. Google Drive Link, Dropbox Link, or external URL"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white font-mono focus:outline-none"
                />
                <p className="text-[9px] text-gray-500 mt-2 leading-normal">
                  💡 Bypasses direct uploads. Enter any third-party link (Google Drive, OneDrive, Dropbox, etc.). You can easily share books with buyers via Gmail with one click below!
                </p>
              </div>

              {uploadProgress !== 'idle' && (
                <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between text-xs text-indigo-300">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                    {uploadProgress === 'uploading' ? 'Publishing asset variables to Storage Buckets...' : 'Upload verified! Synchronized.'}
                  </span>
                </div>
              )}
            </div>

            <div className="md:col-span-2 border-t border-white/5 pt-5 flex justify-end gap-3">
              <button
                id="admin-form-cancel"
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white"
              >
                Dismiss Form
              </button>
              
              <button
                id="admin-form-submit"
                type="submit"
                className="px-7 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                {editingBookId ? 'Save Changes' : 'Confirm & Publish'}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* CATEGORY MANAGER SECTION AND LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="flex flex-col gap-6">
          {/* Categories administration */}
          <div className="rounded-3xl border border-white/5 bg-[#0c111d] p-6">
            <div className="flex items-center gap-1.5 mb-4 text-[#f59e0b]">
              <Layers className="w-4 h-4" />
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Categories Drawer</h3>
            </div>

            <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
              <input
                id="admin-category-input"
                type="text"
                placeholder="Add category name"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="flex-grow px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/5 text-white"
              />
              <button
                id="admin-add-category-btn"
                type="submit"
                className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-xs border border-indigo-500/20 flex items-center justify-center"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
              {categories.map((c) => (
                <div key={c} className="flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-white/2 hover:bg-white/5 text-xs text-gray-300 font-mono">
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Contact Settings */}
          <div className="rounded-3xl border border-white/5 bg-[#0c111d] p-6 shadow-xl border-emerald-500/5">
            <div className="flex items-center gap-1.5 mb-4 text-emerald-400">
              <QrCode className="w-4 h-4" />
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Payment / Chat Settings</h3>
            </div>
            
            <p className="text-[11px] text-gray-400 leading-normal mb-4 font-light">
              Customize payment-associated WhatsApp & Instagram destination redirection targets. Changes synchronize live.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); onUpdateContactSettings(waNumber, igUsername); }} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">WhatsApp Phone Number</label>
                <input
                  id="admin-settings-whatsapp"
                  type="text"
                  required
                  placeholder="e.g. 919323719266"
                  value={waNumber}
                  onChange={(e) => setWaNumber(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-white/5 border border-white/5 text-white font-mono placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <p className="text-[9px] text-gray-500 mt-1">Digits with country code, no spaces or <span className="font-mono">+</span>, e.g. <span className="font-mono">919323719266</span></p>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Instagram Username</label>
                <input
                  id="admin-settings-instagram"
                  type="text"
                  required
                  placeholder="e.g. prasenjitwade004"
                  value={igUsername}
                  onChange={(e) => setIgUsername(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-white/5 border border-white/5 text-white font-mono placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <p className="text-[9px] text-gray-500 mt-1">Exact account handle without <span className="font-mono">@</span>, e.g. <span className="font-mono">prasenjitwade004</span></p>
              </div>

              <button
                id="admin-save-settings-btn"
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs"
              >
                Save Contact Credentials
              </button>
            </form>
          </div>
        </div>

        {/* Ebook inventory catalogs Table List */}
        <div className="lg:col-span-2 rounded-3xl border border-white/5 bg-[#0c111d] p-6 overflow-hidden">
          <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-3">
            Published Catalog Listing
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-400">
              <thead className="bg-[#050914] text-gray-500 uppercase font-mono tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Book Name</th>
                  <th className="p-3.5">Author</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5 rounded-r-xl text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ebooks.map((b) => (
                  <tr key={b.id} className="hover:bg-white/2 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-6 rounded bg-black/40 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {b.cover_url.startsWith('linear-gradient') ? (
                            <div style={{ background: b.cover_url }} className="w-full h-full text-[6px] text-white flex items-center justify-center text-center p-0.5">
                              {b.title.substring(0, 5)}
                            </div>
                          ) : (
                            <img src={b.cover_url} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="font-semibold text-white truncate max-w-[150px] sm:max-w-xs">{b.title}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-xs text-gray-300">{b.author}</td>
                    <td className="p-3.5 font-mono text-[10px] text-indigo-400">{b.category}</td>
                    <td className="p-3.5 font-mono text-gray-300">
                      ₹{b.price.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          id={`cat-edit-${b.id}`}
                          onClick={() => startEdit(b)}
                          className="p-1 px-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 hover:bg-indigo-500/20 hover:text-indigo-300 flex items-center gap-1 leading-none text-[10px]"
                        >
                          <Edit2 className="w-2.5 h-2.5" /> Edit
                        </button>
                        <button
                          id={`cat-del-${b.id}`}
                          onClick={() => onDeleteEbook(b.id)}
                          className="p-1 px-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/10 hover:bg-red-500/20 hover:text-red-300 flex items-center gap-1 leading-none text-[10px]"
                        >
                          <Trash2 className="w-2.5 h-2.5" /> Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Ecosystem Orders & Gmail Delivery Desk */}
      <div className="mt-8 rounded-3xl border border-white/5 bg-[#0c111d] p-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
          <div>
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4.5 h-4.5 text-rose-400" /> Ecosystem Orders & Gmail Delivery Desk
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Send your eBook PDFs to buyers' emails with a customized, prefilled Gmail template in 1 click.
            </p>
          </div>
          <div className="text-[10px] font-mono bg-rose-500/10 text-rose-400 py-1 px-2.5 rounded-full border border-rose-500/20">
            {orders.length} Registered Orders
          </div>
        </div>

        {loadingOrders ? (
          <div className="py-8 text-center text-xs text-gray-500">Loading order records...</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-black/20 border border-white/5">
            <p className="text-xs text-gray-500 font-mono">No purchase orders recorded yet in this instance.</p>
            <p className="text-[10px] text-gray-600 mt-1">Once a user completes checkout, their tracking key appears here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-400">
              <thead className="bg-[#050914] text-gray-500 uppercase font-mono tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Buyer Email Address</th>
                  <th className="p-3.5">eBook Asset Target</th>
                  <th className="p-3.5">Price & Date</th>
                  <th className="p-3.5">Gmail Share Progress</th>
                  <th className="p-3.5 rounded-r-xl text-center">Instant Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-light">
                {orders.map((o) => {
                  const targetBook = ebooks.find(b => b.id === o.ebook_id);
                  const isSent = deliveryStatuses[o.id] === 'sent';
                  return (
                    <tr key={o.id} className="hover:bg-white/2 transition">
                      <td className="p-3.5 font-mono text-xs text-white bg-white/1 select-all font-semibold">
                        {o.user_id}
                      </td>
                      <td className="p-3.5 truncate max-w-xs text-gray-300">
                        {targetBook ? targetBook.title : `Unknown eBook (ID: ${o.ebook_id})`}
                      </td>
                      <td className="p-3.5 text-xs">
                        <span className="font-mono text-emerald-400">₹{targetBook ? targetBook.price : '0'}</span>
                        <span className="text-[10px] text-gray-500 font-mono ml-2">({o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Today'})</span>
                      </td>
                      <td className="p-3.5 text-xs">
                        <button
                          onClick={() => toggleDeliveryStatus(o.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1 border transition-all ${
                            isSent
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                              : 'bg-amber-500/5 text-amber-500 border-amber-500/20 hover:bg-amber-500/10'
                          }`}
                        >
                          {isSent ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Delivered (Sent)</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
                              <span>Pending Delivery</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleShareViaGmail(o)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/25 flex items-center gap-1.5 text-[10px] font-semibold transition"
                            title="Compose download delivery mail via Gmail"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Share PDF on Gmail</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
