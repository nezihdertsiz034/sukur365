const OPENAI_API_KEY = 'GÜVENLİK_NEDENİYLE_TEMİZLENDİ_LÜTFEN_ENV_KULLANIN';

export interface GeneratedDua {
    arabic?: string;
    turkish: string;
}

/**
 * OpenAI kullanarak dua üretir
 */
export async function generateAIDua(prompt: string): Promise<GeneratedDua> {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `Sen samimi ve bilgili bir İslami asistansın. Kullanıcının verdiği bir konu üzerine (dert, şükür, istek vb.) ona özel, içten ve dille kolayca söylenebilecek bir dua hazırla. 
            Çıktıyı JSON formatında ver: { "arabic": "Arapça metin (varsa)", "turkish": "Türkçe dua metni" }. 
            Arapça metin mutlaka hareke içermeli ve Kur'an/Hadis kaynaklı dualara uygun olmalı. 
            Türkçe metin ise kullanıcının girdiği konuya hitap etmeli, samimi ve edebi bir dille yazılmalı.`
                    },
                    {
                        role: 'user',
                        content: `Konu: ${prompt}`
                    }
                ],
                response_format: { type: "json_object" }
            }),
        });

        const data = await response.json();
        const result = JSON.parse(data.choices[0].message.content);

        return {
            arabic: result.arabic || undefined,
            turkish: result.turkish
        };
    } catch (error) {
        console.error('OpenAI Hatası:', error);
        throw new Error('Dua üretilirken bir sorun oluştu. Lütfen tekrar deneyin.');
    }
}
