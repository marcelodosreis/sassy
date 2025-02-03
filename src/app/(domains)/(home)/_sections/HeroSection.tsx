import Image from 'next/image';

import { loadTranslationsSSR } from '@/utils/loadTranslationsSSR';

export default async function HeroSection() {
    const { translate } = await loadTranslationsSSR();

    return (
        <div className="py-12 md:py-28 max-w-7xl mx-auto px-2 sm:px-16 lg:px-28">
            <div className="flex flex-col md:flex-row items-center md:items-center">
                <div className="text-center lg:text-left lg:w-2/3">
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900">
                        {translate("home-section-hero-title")}
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-600">
                        {translate("home-section-hero-description")}
                    </p>
                    <a href="/dashboard">
                        <button className="mt-6 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 w-64">
                            {translate("home-section-hero-button")}
                        </button>
                    </a>
                </div>

                <div className="lg:ml-auto lg:w-1/3 mt-12 md:mt-0">
                    <Image
                        src="/svgs/home.svg"
                        alt="Micro-SaaS Illustration"
                        className="rounded-lg"
                        layout="intrinsic"
                        width={400}
                        height={0}
                    />
                </div>
            </div>
        </div>
    );
}
