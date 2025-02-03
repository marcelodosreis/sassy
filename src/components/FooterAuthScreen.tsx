import { ROUTES } from "@/constants/ROUTES";
import { useI18n } from '@/hooks/useI18n'; 

type FooterAuthScreenProps = {
    screen: 'signin' | 'signup';
}

export default function FooterAuthScreen({ screen }: FooterAuthScreenProps) {
    const { translate } = useI18n(); 

    return (
        <div className="mt-4 text-center text-sm text-gray-600">
            {screen === 'signin' ? (
                <>
                    {translate("component-footer-auth-dont-have-account")}{" "}
                    <a href={ROUTES.signup} className="text-indigo-600 hover:text-indigo-700 font-semibold">
                        {translate("component-footer-auth-create-account")}
                    </a>
                </>
            ) : (
                <>
                    {translate("component-footer-auth-already-have-account")}{" "}
                    <a href={ROUTES.signin} className="text-indigo-600 hover:text-indigo-700 font-semibold">
                        {translate("component-footer-auth-go-back-to-login")}
                    </a>
                </>
            )}
        </div>
    );
}
