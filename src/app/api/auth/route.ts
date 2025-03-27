// app/api/auth/route.ts
import { setCorsHeaders } from '@/lib/cors'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin')

    try {
        // Look for token in Authorization header
        const authHeader = request.headers.get('Authorization')
        const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

        if (!token) {
        // Fallback to cookies if header not present
        const cookieToken = request.cookies.get('access_token')?.value
        
        if (!cookieToken) {
            return setCorsHeaders(
            NextResponse.json({ error: 'Not authenticated' }, { status: 401 }),
            origin
            )
        }
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { user }, error } = await supabase.auth.getUser(token || undefined)

    if (error || !user) {
        return setCorsHeaders( NextResponse.json({ error: 'Not authenticated' }, { status: 401 }), origin)
    }

    return setCorsHeaders(
        NextResponse.json({
            user: {
            id: user.id,
            email: user.email,
            username: user.user_metadata?.username || null,
            created_at: user.created_at,
            role: user.role,
            email_confirmed_at: user.email_confirmed_at,
            last_sign_in_at: user.last_sign_in_at,
            },
        }, { status: 200 }),
        origin
    )
    } catch (err) {
        console.error('Auth error:', err)
        return setCorsHeaders(
            NextResponse.json({ 
                error: 'Internal server error',
                details: err instanceof Error ? err.message : String(err)
            }, { status: 500 }),
            origin
        )
    }
}