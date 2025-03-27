import { supabase } from '@/lib/supabase';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const { data: session, error } = await supabase
    .from('user_sessions')
    .insert({
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  
  return {
    token,
    expires_at: expiresAt.getTime(),
    session_id: session.id
  };
}

export async function validateToken(token: string) {
  const { data: session, error } = await supabase
    .from('user_sessions')
    .select('user_id, expires_at')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !session) return null;
  return session.user_id;
}