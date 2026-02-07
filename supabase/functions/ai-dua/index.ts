// Supabase Edge Function - AI Dua Üretici
// OpenAI API key sunucuda güvenli şekilde tutulur, istemciye açılmaz.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // @ts-ignore: Deno env
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      throw new Error("OPENAI_API_KEY ayarlanmamış.");
    }

    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      throw new Error("Geçerli bir konu girilmelidir.");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Sen samimi ve bilgili bir İslami asistansın. Kullanıcının verdiği bir konu üzerine (dert, şükür, istek vb.) ona özel, içten ve dille kolayca söylenebilecek bir dua hazırla. 
Çıktıyı JSON formatında ver: { "arabic": "Arapça metin (varsa)", "turkish": "Türkçe dua metni" }. 
Arapça metin mutlaka hareke içermeli ve Kur'an/Hadis kaynaklı dualara uygun olmalı. 
Türkçe metin ise kullanıcının girdiği konuya hitap etmeli, samimi ve edebi bir dille yazılmalı.`,
          },
          {
            role: "user",
            content: `Konu: ${prompt}`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error("OpenAI hata:", errData);
      throw new Error("AI servisi şu an yanıt veremiyor.");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("AI yanıt üretemedi.");
    }

    const result = JSON.parse(content);

    return new Response(
      JSON.stringify({
        arabic: result.arabic || null,
        turkish: result.turkish,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
