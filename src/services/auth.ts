import { EmailOtpType, Provider, User, Session, SupabaseClient } from '@supabase/supabase-js';

export default class AuthService {
    constructor(private supabase: SupabaseClient) { }

    async getUserId(): Promise<string | null> {
        const user = await this.getUser();
        return user?.id || null;
    }

    async getUser(accessToken?: string): Promise<User | null> {
        const { data } = await this.supabase.auth.getUser(accessToken);
        return data?.user || null;
    }

    async getUserById(id: string): Promise<User | null> {
        const { data } = await this.supabase.auth.admin.getUserById(id);
        return data?.user || null;
    }

    async getSession(): Promise<Session | null> {
        const { data } = await this.supabase.auth.getSession();
        return data?.session || null;
    }

    async signUp(email: string, password: string): Promise<User | null> {
        const { data, error } = await this.supabase.auth.signUp({ email, password });
        this.handleError(error);
        return data.user;
    }

    async signIn(email: string, password: string): Promise<User | null> {
        const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
        if (error) {
            await this.resendEmail(email);
            throw error;
        }
        return data.user;
    }

    async signInWithProvider(provider: Provider): Promise<void> {
        const { error } = await this.supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: `${process.env.NEXT_PUBLIC_PROJECT_URL}/confirm-signup?oauth=${provider}` }
        });
        this.handleError(error);
    }

    async signOut(): Promise<void> {
        const { error } = await this.supabase.auth.signOut();
        this.handleError(error);
    }

    async confirmEmail(token: string, type: EmailOtpType): Promise<User | null> {
        const { data, error } = await this.supabase.auth.verifyOtp({ token_hash: token, type });
        this.handleError(error);
        return data.user;
    }

    async forgotPassword(email: string): Promise<boolean> {
        const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_PROJECT_URL}/new-password`
        });
        this.handleError(error);
        return true;
    }

    async updatePassword(password: string): Promise<boolean> {
        const { error } = await this.supabase.auth.updateUser({ password });
        this.handleError(error);
        return true;
    }

    async resendEmail(email: string): Promise<void> {
        const { error } = await this.supabase.auth.resend({ email, type: 'signup' });
        this.handleError(error);
    }

    async validateCode(code: string): Promise<void> {
        const { error } = await this.supabase.auth.getUser(code);
        this.handleError(error);
    }

    private handleError(error: unknown): void {
        if (error) throw error;
    }
}
