// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { setCorsHeaders } from '@/lib/cors';

export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin');
  
    try {
        const { refresh_token } = await request.json();

        if (!refresh_token) {
            return setCorsHeaders(
                NextResponse.json({ error: 'Refresh token is required' }, { status: 400 }),
                origin
            );
        }

        const { data, error } = await supabase.auth.refreshSession({ refresh_token });

        if (error) {
            return setCorsHeaders(
                NextResponse.json({ error: error.message }, { status: error.status || 401 }),
                origin
            );
        }

        return setCorsHeaders(
            NextResponse.json({
                session: {
                access_token: data.session?.access_token,
                refresh_token: data.session?.refresh_token,
                expires_at: data.session?.expires_at
                },
                success: true,
            }, { status: 200 }),
            origin
        );
    } catch (err) {
        return setCorsHeaders(
            NextResponse.json(
                { error: 'Internal server error', details: err instanceof Error ? err.message : String(err) },
                { status: 500 }
            ),
            origin
        );
    }
}