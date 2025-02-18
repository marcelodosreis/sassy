import { SupabaseClient } from '@supabase/supabase-js';


type SubscriptionData = {
    user_id: string;
    stripe_subscription_id: string;
    plan: string;
    status: string;
    current_period_start: Date;
    current_period_end: Date;
};

export default class SubscriptionService {
    constructor(private supabase: SupabaseClient) {}

    async getSubscriptionByUserId(userId: string): Promise<SubscriptionData | null> {
        const { data, error } = await this.supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1);
        
        this.handleError(error);
        return data?.[0] || null;
    }

    async upsertSubscription(subscriptionData: SubscriptionData): Promise<void> {
        const { error } = await this.supabase
            .from('subscriptions')
            .upsert(subscriptionData);
        
        this.handleError(error);
    }

    async updateSubscriptionStatus(stripeSubscriptionId: string, status: string): Promise<void> {
        const { error } = await this.supabase
            .from('subscriptions')
            .update({ status })
            .eq('stripe_subscription_id', stripeSubscriptionId);
        
        this.handleError(error);
    }

    async updateSubscriptionPeriod(stripeSubscriptionId: string, periodStart: Date, periodEnd: Date): Promise<void> {
        const { error } = await this.supabase
            .from('subscriptions')
            .update({ current_period_start: periodStart, current_period_end: periodEnd })
            .eq('stripe_subscription_id', stripeSubscriptionId);
        
        this.handleError(error);
    }

    async cancelSubscription(stripeSubscriptionId: string): Promise<void> {
        const { error } = await this.supabase
            .from('subscriptions')
            .update({ status: 'canceled' })
            .eq('stripe_subscription_id', stripeSubscriptionId);
        
        this.handleError(error);
    }

    private handleError(error: unknown): void {
        if (error) throw error;
    }
}