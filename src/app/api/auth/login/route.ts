import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { setCorsHeaders } from '@/lib/cors';

export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin')
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return setCorsHeaders(NextResponse.json( { error: 'Email and password are required' }, { status: 400 } ), origin);
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            return setCorsHeaders(NextResponse.json( { error: error.message }, { status: error.status || 400 } ), origin);
        }

        const response = setCorsHeaders(NextResponse.json(
            {
                user: {
                    id: data.user?.id,
                    email: data.user?.email,
                    role: data.user?.role
                },
                session: {
                    access_token: data.session?.access_token,
                    refresh_token: data.session?.refresh_token,
                    expires_at: data.session?.expires_at
                },
                success: true,
            }, { status: 200 }),origin);

        return response;
    } catch (err) {
        return setCorsHeaders(NextResponse.json(
            { error: 'Internal server error', details: err instanceof Error ? err.message : String(err) }, { status: 500 }
        ), origin);
    }
}
