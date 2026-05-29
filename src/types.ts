export interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  cover_url: string;
  pdf_url: string;
  rating: number;
  created_at: string;
  highlights?: string[]; // key highlights for the detail screen
}

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  is_admin?: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  ebook_id: string;
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  content: string;
  verified: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
