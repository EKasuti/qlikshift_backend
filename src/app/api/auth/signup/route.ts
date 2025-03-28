import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hashPassword, createSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { username, email, password } = await request.json();

        // Validation
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: 'Username, email and password are required' },
                { status: 400 }
            );
        }

        // Check for existing user
        const { data: existingUser } = await supabase
            .from('users')
            .select('username, email')
            .or(`username.eq.${username},email.eq.${email}`)
            .maybeSingle();

        if (existingUser) {
            const conflict = existingUser.username === username ? 'Username' : 'Email';
            return NextResponse.json(
                { error: `${conflict} already exists` },
                { status: 409 }
            );
        }

        // Create user
        const passwordHash = await hashPassword(password);
        const { data: user, error } = await supabase
            .from('users')
            .insert({
                username,
                email,
                password_hash: passwordHash
            })
            .select()
            .single();

        if (error) throw error;

        // Create session
        const { token, expires_at } = await createSession(user.id);

        return NextResponse.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token,
            expires_at
            }, { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: 'Registration failed', details: (error as Error).message },
            { status: 500 }
        );
    }
}