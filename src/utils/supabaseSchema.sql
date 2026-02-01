-- Kullanıcı cihazlarını ve tokenlarını tutan tablo
CREATE TABLE user_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fcm_token TEXT UNIQUE NOT NULL,
  city_id INTEGER,
  city_name TEXT,
  notification_settings JSONB DEFAULT '{}',
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Namaz vakitlerini tutan tablo (Caching için)
CREATE TABLE prayer_times (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_id INTEGER NOT NULL,
  city_name TEXT NOT NULL,
  date DATE NOT NULL,
  imsak TIME,
  gunes TIME,
  ogle TIME,
  ikindi TIME,
  aksam TIME,
  yatsi TIME,
  UNIQUE(city_id, date)
);

-- Indexler
CREATE INDEX idx_user_devices_city ON user_devices(city_id);
CREATE INDEX idx_prayer_times_city_date ON prayer_times(city_id, date);
