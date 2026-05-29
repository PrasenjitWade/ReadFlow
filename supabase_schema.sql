-- SUPABASE DATABASE INITIALIZATION SCHEMA
-- Run these queries within your Supabase console's SQL Editor to bootstrap the database tables and storage.

-- 1. Create the eBooks Table
CREATE TABLE IF NOT EXISTS public.ebooks (
    id text PRIMARY KEY DEFAULT ('book-' || lower(hex(random_bytes(4)))),
    title text NOT NULL,
    author text NOT NULL,
    description text NOT NULL,
    price numeric(10, 2) NOT NULL DEFAULT 0.00,
    category text NOT NULL,
    cover_url text NOT NULL,
    pdf_url text NOT NULL,
    rating numeric(3, 2) DEFAULT 4.5,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    highlights text[] DEFAULT '{}'::text[] NOT NULL
);

-- 2. Create the Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id text PRIMARY KEY DEFAULT ('ord-' || lower(hex(random_bytes(4)))),
    user_id text NOT NULL, -- Currently tracks buyer email address / ID
    ebook_id text REFERENCES public.ebooks(id) ON DELETE CASCADE NOT NULL,
    payment_status text NOT NULL DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on both tables (Optional but recommended)
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3. Public Read Access Polices
CREATE POLICY "Allow public read access to ebooks" 
    ON public.ebooks FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to ebooks" 
    ON public.ebooks FOR ALL USING (true); -- Set customized admin rules as needed

CREATE POLICY "Allow user select/insert on their own orders" 
    ON public.orders FOR SELECT USING (true);

CREATE POLICY "Allow user insert orders" 
    ON public.orders FOR INSERT WITH CHECK (true);

-- 4. Create Custom Buckets for Storage uploads
-- Note: You should navigate to Supabase Storage -> "New Bucket" and prompt/create two custom buckets:
-- Bucket name 1: "ebook-covers" (set public access to TRUE)
-- Bucket name 2: "ebook-pdfs" (keep private for secure tokenized downloads)
