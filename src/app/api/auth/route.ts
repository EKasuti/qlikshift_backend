import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin')

    try {
        // Look for token in Authorization header
        const authHeader = request.headers.get('Authorization')
        const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

        // Validate the token against our database
        const userId = token ? await validateToken((token) as string) : null

        if (!userId) {
            return  NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
        }

        // Get user data from our custom users table
        const { data: user, error: userError } = await supabase
            .from('users')
            .select(`
                id,
                username,
                email,
                is_super_user,
                is_email_verified,
                created_at
            `)
            .eq('id', userId)
            .single()

        if (userError || !user) {
            return  NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Get active session info
        const { data: session } = await supabase
            .from('user_sessions')
            .select('expires_at')
            .eq('token', token)
            .single()

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                is_super_admin: user.is_super_user || false,
                is_email_verified: user.is_email_verified,
                created_at: user.created_at,
                role: user.is_super_user ? 'admin' : 'user'
            },
            session: {
                expires_at: session?.expires_at
            }
        }, { status: 200 })

    } catch (err) {
        console.error('Auth error:', err)
        return NextResponse.json({ 
            error: 'Internal server error',
            details: err instanceof Error ? err.message : String(err)
        }, { status: 500 })
    }
}