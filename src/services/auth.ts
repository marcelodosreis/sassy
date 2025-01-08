import { User, VerifyEmailOtpParams } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';

export default class AuthService {
    private supabase: SupabaseClient;

    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }

    async getUserSessionId(): Promise<string | null> {
        const { data } = await this.supabase.auth.getUser();
        return data?.user?.id || null;
    }

    async signUp(email: string, password: string): Promise<User | null> {
        const { data, error } = await this.supabase.auth.signUp({ email, password });
        if (error) throw error;
        return data.user;
    }

    async signIn(email: string, password: string): Promise<User | null> {
        const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data.user;
    }

    async signOut(): Promise<void> {
        const { error } = await this.supabase.auth.signOut();
        if (error) throw error;
    }

    async confirmEmail({ token, type }: VerifyEmailOtpParams): Promise<User | null> {
        const { data, error } = await this.supabase.auth.verifyOtp({ token_hash: token, type });
        if (error) throw error;
        return data.user;
    }

    async forgotPassword(email: string): Promise<unknown> {
        const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, { redirectTo: 'http://localhost:3000/new-password' });
        if (error) throw error;
        return data;
    }

    async newPassword(password: string): Promise<boolean> {
        const { error } = await this.supabase.auth.updateUser({ password });
        if (error) throw error;
        return true;
    }
}