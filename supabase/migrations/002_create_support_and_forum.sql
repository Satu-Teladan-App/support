-- Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create forum_posts table
CREATE TABLE IF NOT EXISTS public.forum_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create forum_comments table
CREATE TABLE IF NOT EXISTS public.forum_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for support_tickets
-- Users can see their own tickets
CREATE POLICY "Users can view their own tickets" ON public.support_tickets
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own tickets
CREATE POLICY "Users can create their own tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for forum_posts
-- Everyone (authenticated) can see all posts
CREATE POLICY "Anyone can view forum posts" ON public.forum_posts
    FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can create posts
CREATE POLICY "Users can create forum posts" ON public.forum_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for forum_comments
-- Everyone (authenticated) can see all comments
CREATE POLICY "Anyone can view forum comments" ON public.forum_comments
    FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can create comments
CREATE POLICY "Users can create forum comments" ON public.forum_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);
