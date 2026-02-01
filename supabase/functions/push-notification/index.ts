// Supabase Edge Function - Firebase Push Notification Sender
// Bu fonksiyon Firebase FCM v1 API'sini kullanarak bildirim gönderir.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { JWT } from "https://esm.sh/google-auth-library@9.0.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PushPayload {
    tokens: string[];
    title: string;
    body: string;
    data?: Record<string, string>;
    sound?: string;
}

serve(async (req: Request) => {
    // CORS kontrolü
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const payload: PushPayload = await req.json();
        const { tokens, title, body, data, sound } = payload;

        if (!tokens || tokens.length === 0) {
            throw new Error("Hedef token bulunamadı.");
        }

        // 1. Firebase Service Account Bilgilerini Al (Environment variables'dan)
        // @ts-ignore: Deno is available in Supabase environment
        const serviceAccount = JSON.parse(Deno.env.get("FIREBASE_SERVICE_ACCOUNT") || "{}");

        // 2. Google Auth Token Al (FCM v1 için gerekli)
        const jwt = new JWT({
            email: serviceAccount.client_email,
            key: serviceAccount.private_key,
            scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
        });

        const accessToken = await jwt.getAccessToken();
        const fcmUrl = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`;

        // 3. Bildirimleri Gönder (FCM v1 tek bir mesaj alır, çoklu gönderim için loop gereklidir)
        const results = await Promise.all(
            tokens.map(async (token) => {
                const message = {
                    message: {
                        token: token,
                        notification: {
                            title: title,
                            body: body,
                        },
                        data: data || {},
                        android: {
                            notification: {
                                sound: sound === "ezan" ? "ezan" : "default",
                                channel_id: sound === "ezan" ? "ezan_vakti" : "default",
                            }
                        },
                        apns: {
                            payload: {
                                aps: {
                                    sound: sound === "ezan" ? "ezan.mp3" : "default",
                                },
                            },
                        },
                    },
                };

                const response = await fetch(fcmUrl, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${accessToken.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(message),
                });

                return response.ok;
            })
        );

        const successCount = results.filter(Boolean).length;

        return new Response(
            JSON.stringify({ success: true, sent: successCount, total: tokens.length }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
