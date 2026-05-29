import { Ebook, Order } from './types';
import aiToolkitCover from './assets/images/ai_toolkit_1780038710481.png';

// The store uses 100% native client-side storage (localStorage).
// NO external server or database accounts are required!
export const databaseEngine = 'localStorage';

// Initial high-fidelity eBook seed data for a professional presentation
const DEFAULT_PREMIUM_EBOOKS: Ebook[] = [
  {
    id: 'book-ai-toolkit',
    title: 'The AI Toolkit',
    author: 'Prasenjit',
    description: '25+ Powerful Ai Tools Every Students & Creator Should know',
    price: 10,
    category: 'AI & Productivity',
    cover_url: aiToolkitCover,
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    rating: 4.0,
    created_at: '2026-05-29T00:00:00.000Z',
    highlights: [],
    format: 'Pdf',
    file_size: '724kb'
  }
];

// Seed initial LocalStorage data if missing
const initializeLocalStorage = () => {
  // Run a one-time reset to load newly added ebook as requested by the user
  if (!localStorage.getItem('premium_store_ebooks_reset_v7')) {
    localStorage.setItem('premium_store_ebooks', JSON.stringify(DEFAULT_PREMIUM_EBOOKS));
    localStorage.setItem('premium_store_ebooks_reset_v7', 'true');
  }

  const existingBooksJson = localStorage.getItem('premium_store_ebooks');
  let existingBooks: Ebook[] = existingBooksJson ? JSON.parse(existingBooksJson) : [];
  
  if (existingBooks.length === 0) {
    existingBooks = DEFAULT_PREMIUM_EBOOKS;
    localStorage.setItem('premium_store_ebooks', JSON.stringify(existingBooks));
  }

  if (!localStorage.getItem('premium_store_orders')) {
    localStorage.setItem('premium_store_orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('premium_store_wishlist')) {
    localStorage.setItem('premium_store_wishlist', JSON.stringify([]));
  }
  if (!localStorage.getItem('premium_store_admin_configured')) {
    localStorage.setItem('premium_store_admin_configured', 'true');
  }
};

initializeLocalStorage();

/**
 * Unified DB Operations Interface using client-side localStorage.
 * Guarantee the store compiles, executes, and persists values seamlessly.
 */
export const db = {
  // --- EBOOKS ---
  async getEbooks(): Promise<Ebook[]> {
    const local = localStorage.getItem('premium_store_ebooks');
    return local ? JSON.parse(local) : DEFAULT_PREMIUM_EBOOKS;
  },

  async addEbook(ebook: Omit<Ebook, 'id' | 'created_at'>): Promise<Ebook> {
    const newBook: Ebook = {
      ...ebook,
      id: 'book-' + Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString(),
      highlights: ebook.highlights || [
        'Premium content included',
        'Direct download instantly',
        'Expert-level code samples',
        'Lifetime free updates and tips'
      ]
    };

    const books = await this.getEbooks();
    const updated = [newBook, ...books];
    localStorage.setItem('premium_store_ebooks', JSON.stringify(updated));
    return newBook;
  },

  async updateEbook(id: string, updates: Partial<Ebook>): Promise<Ebook> {
    const books = await this.getEbooks();
    const bookIndex = books.findIndex(b => b.id === id);
    if (bookIndex === -1) throw new Error('Ebook not found');

    const updatedBook = { ...books[bookIndex], ...updates };
    books[bookIndex] = updatedBook;
    localStorage.setItem('premium_store_ebooks', JSON.stringify(books));
    return updatedBook;
  },

  async deleteEbook(id: string): Promise<boolean> {
    const books = await this.getEbooks();
    const filtered = books.filter(b => b.id !== id);
    localStorage.setItem('premium_store_ebooks', JSON.stringify(filtered));
    return true;
  },

  // --- ORDERS / PURCHASES ---
  async getOrders(userId: string): Promise<Order[]> {
    const ordersJson = localStorage.getItem('premium_store_orders');
    const allOrders: Order[] = ordersJson ? JSON.parse(ordersJson) : [];
    return allOrders.filter(o => o.user_id === userId);
  },

  async getAllOrders(): Promise<Order[]> {
    const ordersJson = localStorage.getItem('premium_store_orders');
    return ordersJson ? JSON.parse(ordersJson) : [];
  },

  async createOrder(userId: string, ebookId: string): Promise<Order> {
    const newOrder: Order = {
      id: 'ord-' + Math.random().toString(36).substring(2, 11),
      user_id: userId,
      ebook_id: ebookId,
      payment_status: 'completed',
      created_at: new Date().toISOString()
    };

    const ordersJson = localStorage.getItem('premium_store_orders');
    const orders: Order[] = ordersJson ? JSON.parse(ordersJson) : [];
    const updated = [newOrder, ...orders];
    localStorage.setItem('premium_store_orders', JSON.stringify(updated));
    return newOrder;
  },

  // --- WISHLIST / BOOKMARKS ---
  async getWishlist(userId: string): Promise<string[]> {
    const wishlistJson = localStorage.getItem(`wishlist_${userId}`);
    return wishlistJson ? JSON.parse(wishlistJson) : [];
  },

  async toggleWishlist(userId: string, ebookId: string): Promise<string[]> {
    const list = await this.getWishlist(userId);
    const index = list.indexOf(ebookId);
    let updatedList: string[];
    if (index === -1) {
      updatedList = [...list, ebookId];
    } else {
      updatedList = list.filter(id => id !== ebookId);
    }
    localStorage.setItem(`wishlist_${userId}`, JSON.stringify(updatedList));
    return updatedList;
  },

  // --- STORAGE UPLOADS MOCKING ---
  async uploadFile(bucket: 'ebook-covers' | 'ebook-pdfs', file: File): Promise<string> {
    console.log(`[Mock Storage] Virtual file registry simulator for: "${file.name}"`);
    
    // For images, read as a Base64 Data URL to render real customer uploads immediately in HTML
    if (bucket === 'ebook-covers' || file.type.startsWith('image/')) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            resolve(reader.result as string);
          } else {
            resolve('linear-gradient(135deg, #6366f1 0%, #ec4899 100%)');
          }
        };
        reader.onerror = () => {
          reject(new Error('Failed to read visual cover file.'));
        };
        reader.readAsDataURL(file);
      });
    }

    // For PDFs and resources, return standard preview placeholder if too big, or read as data URL if small
    if (file.size < 2 * 1024 * 1024) { // Under 2MB
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
    
    return 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  },

  async getDownloadUrl(pdfPath: string): Promise<string> {
    if (pdfPath.startsWith('http://') || pdfPath.startsWith('https://')) {
      return pdfPath;
    }
    return pdfPath || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  }
};
