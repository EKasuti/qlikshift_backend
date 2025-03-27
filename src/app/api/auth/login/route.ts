import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Get user
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (userError || !user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const passwordValid = await verifyPassword(password, user.password_hash);
        if (!passwordValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create session
        const { token, expires_at } = await createSession(user.id);

        return NextResponse.json({
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            is_super_user: user.is_super_user
        },
            token,
            expires_at
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Login failed', details: (error instanceof Error ? error.message : 'Unknown error') },
            { status: 500 }
        );
    }
}