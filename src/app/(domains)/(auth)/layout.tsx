import { redirect } from 'next/navigation';

import { createClient } from '@/libs/supabase/server';
import SupabaseService from '@/services/supabaseService';

type Props = {
    children: React.ReactNode;
}

export default async function AuthLayout({ children }: Props) {
    const supabase = await createClient();
    const SupabaseServiceInstance = new SupabaseService(supabase);

    const userId = await SupabaseServiceInstance.getUserId();
    if (userId) {
        redirect('/dashboard');
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                {children}
            </div>
        </div>
    );
}
