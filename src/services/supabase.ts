import { EmailOtpType, Provider, User, Session } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';

type SubscriptionData = {
    user_id: string;
    stripe_subscription_id: string;
    plan: string;
    status: string;
    current_period_start: Date;
    current_period_end: Date;
};


export default class SupabaseService {
    private supabase: SupabaseClient;

    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }

    async getUserId(): Promise<string | null> {
        const data = await this.getUser();
        return data?.id || null;
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
        if (error) throw error;
        return data.user;
    }

    async signIn(email: string, password: string): Promise<User | null> {
        const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
        if (error) {
            this.resendEmail(email);
            throw error
        };
        return data.user;
    }

    async signInProvider(provider: Provider): Promise<boolean> {
        const { error } = await this.supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${process.env.NEXT_PUBLIC_PROJECT_URL}/confirm-signup?oauth=${provider}` } });
        if (error) throw error
        return true;
    }

    async signOut(): Promise<void> {
        const { error } = await this.supabase.auth.signOut();
        if (error) throw error;
    }

    async confirmEmail(token: string, type: EmailOtpType): Promise<User | null> {
        const { data, error } = await this.supabase.auth.verifyOtp({ token_hash: token, type });
        if (error) throw error;
        return data.user;
    }

    async forgotPassword(email: string): Promise<boolean> {
        const { error } = await this.supabase.auth.resetPasswordForEmail(email, { redirectTo: `${process.env.NEXT_PUBLIC_PROJECT_URL}/new-password` });
        if (error) throw error;
        return true;
    }

    async newPassword(password: string): Promise<boolean> {
        const { error } = await this.supabase.auth.updateUser({ password });
        if (error) throw error;
        return true;
    }

    async resendEmail(email: string): Promise<boolean> {
        const { error } = await this.supabase.auth.resend({
            email,
            type: 'signup'
        });
        if (error) throw error;
        return true;
    }

    async validateCode(code: string): Promise<boolean> {
        const { error } = await this.supabase.auth.getUser(
            code
        )
        if (error) throw error;
        return true;
    }

    async getSubscriptionByUserId(userId: string) {
        const { data, error } = await this.supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1);
            
        if (error) throw error;
        return data[0];
    }

    async upsertSubscription(subscriptionData: SubscriptionData) {
        const { error } = await this.supabase
            .from('subscriptions')
            .upsert(subscriptionData);

        if (error) throw error;
        return true;
    }

    async updateSubscriptionStatus(
        stripeSubscriptionId: string,
        status: string
    ) {
        const { error } = await this.supabase
            .from('subscriptions')
            .update({ status })
            .eq('stripe_subscription_id', stripeSubscriptionId);

        if (error) throw error;
        return true;
    }

    async updateSubscriptionPeriod(
        stripeSubscriptionId: string,
        periodStart: Date,
        periodEnd: Date
    ) {
        const { error } = await this.supabase
            .from('subscriptions')
            .update({
                current_period_start: periodStart,
                current_period_end: periodEnd,
            })
            .eq('stripe_subscription_id', stripeSubscriptionId);

        if (error) throw error;
        return true;
    }

    async cancelSubscription(stripeSubscriptionId: string) {
        const { error } = await this.supabase
            .from('subscriptions')
            .update({ status: 'canceled' })
            .eq('stripe_subscription_id', stripeSubscriptionId);

        if (error) throw error;
        return true;
    }
}
