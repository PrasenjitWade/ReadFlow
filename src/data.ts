import { FAQItem } from './types';

export const POPULAR_CATEGORIES = [
  { name: 'All', count: 0, slug: 'all' },
  { name: 'Design & UI', count: 1, slug: 'design' },
  { name: 'Development', count: 2, slug: 'development' },
  { name: 'Marketing & Business', count: 1, slug: 'business' }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Who is the author behind these premium ebooks?',
    answer: 'All technical guides, software design architectures, and advanced code packages available on this storefront are written and maintained directly by Prasenjit Wade.'
  },
  {
    id: 'faq-2',
    question: 'How do I download my ebooks once I purchase them?',
    answer: 'Once a course or ebook is acquired, your resources are immediately unlocked. Go to the "My Library" tab at the top of the portal. Here, you can access your personal portfolio of books, view interactive highlights, and download PDFs in a single click.'
  },
  {
    id: 'faq-3',
    question: 'What file formats are provided with my purchase?',
    answer: 'Every workbook is delivered in both premium print-ready high-resolution PDF layouts and fully text-reflowable EPUB packages, making reading on tablets, desks, or mobile screens extremely comfortable.'
  },
  {
    id: 'faq-4',
    question: 'How do I ask questions or request technical help?',
    answer: 'Prasenjit is fully dedicated to reader success. You can reach out directly via prasenjitwade09@gmail.com, or check out the interactive socials linked in the footer.'
  }
];
