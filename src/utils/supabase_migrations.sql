-- Supabase Migrations - Musluman Plus (Sukur365)
-- Bu kodları Supabase SQL Editor kısmına yapıştırıp run edin.

-- 1. Kullanıcı Cihazları Tablosu (FCM Kaydı için)
CREATE TABLE IF NOT EXISTS public.user_devices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fcm_token TEXT UNIQUE NOT NULL,
    city_id INTEGER,
    city_name TEXT,
    notification_settings JSONB DEFAULT '{}'::jsonb,
    platform TEXT, -- 'ios' or 'android'
    app_version TEXT,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Ayarları (Opsiyonel ama güvenlik için önerilir)
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous upsert" ON public.user_devices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON public.user_devices FOR UPDATE USING (true);

-- 2. Namaz Vakitleri Cache Tablosu (API limitlerini aşmamak için)
CREATE TABLE IF NOT EXISTS public.namaz_vakitleri_cache (
    id SERIAL PRIMARY KEY,
    city_name TEXT NOT NULL,
    date DATE NOT NULL,
    vakitler JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(city_name, date)
);

-- Hızlı arama için indexler
CREATE INDEX IF NOT EXISTS idx_user_devices_token ON public.user_devices(fcm_token);
CREATE INDEX IF NOT EXISTS idx_vakit_city_date ON public.namaz_vakitleri_cache(city_name, date);

-- 3. Bildirim Günlüğü (Opsiyonel - Hangi bildirim kime gitti takip için)
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fcm_token TEXT REFERENCES public.user_devices(fcm_token) ON DELETE CASCADE,
    title TEXT,
    body TEXT,
    status TEXT, -- 'success', 'failed'
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
