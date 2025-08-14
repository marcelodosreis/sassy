import { ROUTES } from "@/constants/routes-constants";
import { useI18n } from "@/contexts/i18nContext";

type FooterAuthScreenProps = {
    screen: 'signin' | 'signup';
}

export default function FooterAuthScreen({ screen }: FooterAuthScreenProps) {
    const { translate } = useI18n(); 

    return (
        <div className="mt-4 text-center text-sm text-gray-600">
            {screen === 'signin' ? (
                <>
                    {translate("components.footer-auth.dont-have-account")}{" "}
                    <a href={ROUTES.signup} className="text-indigo-600 hover:text-indigo-700 font-semibold">
                        {translate("components.footer-auth.create-account")}
                    </a>
                </>
            ) : (
                <>
                    {translate("components.footer-auth.already-have-account")}{" "}
                    <a href={ROUTES.signin} className="text-indigo-600 hover:text-indigo-700 font-semibold">
                        {translate("components.footer-auth.go-back-to-login")}
                    </a>
                </>
            )}
        </div>
    );
}
