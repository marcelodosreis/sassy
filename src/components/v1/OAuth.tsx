import { PROVIDERS_IMAGE_URL } from "@/constants/providers-image-url";
import { supabase } from "@/libs/supabase/client";
import AuthService from "@/services/auth";

export default function OAuth() {
    const AuthServiceInstance = new AuthService(supabase);

    const PROVIDERS_MAP = [
        {
            provider: 'Google',
            logo: PROVIDERS_IMAGE_URL.Google,
            onClick: () => AuthServiceInstance.signInWithProvider('google')
        },
        {
            provider: 'Facebook',
            logo: PROVIDERS_IMAGE_URL.Facebook,
            onClick: () => AuthServiceInstance.signInWithProvider('facebook')
        },
        {
            provider: 'Twitter',
            logo: PROVIDERS_IMAGE_URL.Twitter,
            onClick: () => AuthServiceInstance.signInWithProvider('twitter')
        }
    ]
    return (
        <>
            <div className="text-center text-sm text-gray-600">or</div>

            <div className="mt-4 flex justify-center space-x-4">
                {PROVIDERS_MAP.map(({ provider, logo, onClick }) => (
                    <ProviderButton
                        key={provider}
                        provider={provider}
                        logo={logo}
                        onClick={onClick}
                    />
                ))}
            </div>
        </>
    );
}

type ProviderButtonProps = {
    provider: string;
    logo: string;
    onClick: () => void;
}
function ProviderButton({ provider, logo, onClick }: ProviderButtonProps) {
    return (
        <button
            className="p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onClick}
        >
            <img
                src={logo}
                alt={provider}
                className="w-5 h-5"
            />
        </button>
    )
}