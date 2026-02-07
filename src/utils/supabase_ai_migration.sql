-- ============================================================
-- AI Dua Migration - Supabase SQL Editor'a yapıştırıp çalıştır
-- ============================================================

-- 1. HTTP Extension'ı etkinleştir (OpenAI API çağrısı için gerekli)
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- 2. API key'leri güvenli saklamak için config tablosu
CREATE TABLE IF NOT EXISTS private.app_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS kapat - sadece SECURITY DEFINER fonksiyonlar erişebilecek
ALTER TABLE private.app_config ENABLE ROW LEVEL SECURITY;
-- Hiçbir policy yok = kimse doğrudan okuyamaz/yazamaz (sadece SECURITY DEFINER fonksiyonlar)

-- 3. OpenAI API Key'i kaydet
-- ÖNEMLİ: Aşağıdaki 'BURAYA_OPENAI_API_KEY_YAZIN' kısmını kendi key'inle değiştir!
-- Bu SQL'i Supabase SQL Editor'da çalıştırmadan önce key'i yapıştır.
INSERT INTO private.app_config (key, value)
VALUES ('openai_api_key', 'BURAYA_OPENAI_API_KEY_YAZIN')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 4. AI Dua üretme fonksiyonu
CREATE OR REPLACE FUNCTION public.generate_ai_dua(user_prompt TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  api_key TEXT;
  request_body JSONB;
  response extensions.http_response;
  result JSONB;
  content TEXT;
BEGIN
  -- Config tablosundan API key al
  SELECT value INTO api_key
  FROM private.app_config
  WHERE key = 'openai_api_key'
  LIMIT 1;

  IF api_key IS NULL THEN
    RETURN jsonb_build_object('error', 'OpenAI API key bulunamadı.');
  END IF;

  -- OpenAI isteği oluştur
  request_body := jsonb_build_object(
    'model', 'gpt-4o-mini',
    'messages', jsonb_build_array(
      jsonb_build_object(
        'role', 'system',
        'content', 'Sen samimi ve bilgili bir İslami asistansın. Kullanıcının verdiği bir konu üzerine (dert, şükür, istek vb.) ona özel, içten ve dille kolayca söylenebilecek bir dua hazırla. Çıktıyı JSON formatında ver: { "arabic": "Arapça metin (varsa)", "turkish": "Türkçe dua metni" }. Arapça metin mutlaka hareke içermeli ve Kuran/Hadis kaynaklı dualara uygun olmalı. Türkçe metin ise kullanıcının girdiği konuya hitap etmeli, samimi ve edebi bir dille yazılmalı.'
      ),
      jsonb_build_object(
        'role', 'user',
        'content', 'Konu: ' || user_prompt
      )
    ),
    'response_format', jsonb_build_object('type', 'json_object')
  );

  -- OpenAI API çağrısı
  SELECT * INTO response
  FROM extensions.http((
    'POST',
    'https://api.openai.com/v1/chat/completions',
    ARRAY[
      extensions.http_header('Authorization', 'Bearer ' || api_key),
      extensions.http_header('Content-Type', 'application/json')
    ],
    'application/json',
    request_body::TEXT
  )::extensions.http_request);

  -- Yanıtı parse et
  IF response.status != 200 THEN
    RETURN jsonb_build_object('error', 'AI servisi şu an yanıt veremiyor. (HTTP ' || response.status || ')');
  END IF;

  result := response.content::JSONB;
  content := result->'choices'->0->'message'->>'content';

  IF content IS NULL THEN
    RETURN jsonb_build_object('error', 'AI yanıt üretemedi.');
  END IF;

  RETURN content::JSONB;

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', 'Dua üretilirken bir sorun oluştu: ' || SQLERRM);
END;
$$;

-- 5. Anonim kullanıcıların fonksiyonu çağırabilmesi için yetki ver
GRANT EXECUTE ON FUNCTION public.generate_ai_dua(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.generate_ai_dua(TEXT) TO authenticated;
