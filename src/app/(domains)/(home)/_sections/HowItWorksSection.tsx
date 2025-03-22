import { loadTranslationsSSR } from "@/utils/loadTranslationsSSR";

export default async function HowItWorksSection() {
    const { translate } = await loadTranslationsSSR();

    return (
        <section id="how-it-works" className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center text-gray-900">{translate("pages.home.sections.how.title")}</h2>
                <p className="mt-4 text-center text-lg text-gray-600">{translate("pages.home.sections.how.description")}</p>

                <div className="mt-10 flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto flex items-center justify-center bg-indigo-600 text-white rounded-full text-2xl font-bold">1</div>
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">{translate("pages.home.sections.how.first.title")}</h3>
                        <p className="mt-2 text-gray-600">{translate("pages.home.sections.how.first.description")}</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto flex items-center justify-center bg-indigo-600 text-white rounded-full text-2xl font-bold">2</div>
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">{translate("pages.home.sections.how.second.title")}</h3>
                        <p className="mt-2 text-gray-600">{translate("pages.home.sections.how.second.description")} </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto flex items-center justify-center bg-indigo-600 text-white rounded-full text-2xl font-bold">3</div>
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">{translate("pages.home.sections.how.third.title")}</h3>
                        <p className="mt-2 text-gray-600">{translate("pages.home.sections.how.third.description")}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
