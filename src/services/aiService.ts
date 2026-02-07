import { supabase } from '../utils/supabaseClient';

export interface GeneratedDua {
    arabic?: string;
    turkish: string;
}

/**
 * Supabase PostgreSQL fonksiyonu üzerinden AI dua üretir.
 * OpenAI API key Supabase Vault'ta güvenli şekilde saklanır.
 */
export async function generateAIDua(prompt: string): Promise<GeneratedDua> {
    try {
        const { data, error } = await supabase.rpc('generate_ai_dua', {
            user_prompt: prompt,
        });

        if (error) {
            console.error('Supabase RPC hatası:', error);
            throw new Error('Dua üretilirken bir sorun oluştu. Lütfen tekrar deneyin.');
        }

        if (data?.error) {
            throw new Error(data.error);
        }

        return {
            arabic: data.arabic || undefined,
            turkish: data.turkish,
        };
    } catch (error: any) {
        console.error('AI Dua Hatası:', error);
        throw new Error(
            error.message || 'Dua üretilirken bir sorun oluştu. Lütfen tekrar deneyin.'
        );
    }
}
