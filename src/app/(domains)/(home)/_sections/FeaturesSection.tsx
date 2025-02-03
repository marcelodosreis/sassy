'use client';

import { CheckCircleIcon } from "@heroicons/react/24/outline";

import { useI18n } from '@/hooks/useI18n';

export default function FeaturesSection() {
  const { translate } = useI18n();

  const features = [
    {
      title: translate('home-section-feature-oauth-title'),
      description: translate('home-section-feature-oauth-description'),
    },
    {
      title: translate('home-section-feature-subscription-title'),
      description: translate('home-section-feature-subscription-description'),
    },
    {
      title: translate('home-section-feature-responsive-title'),
      description: translate('home-section-feature-responsive-description'),
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {translate('home-section-features-title')}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {translate('home-section-features-description')}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 bg-white shadow-lg rounded-2xl transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <CheckCircleIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="ml-4 text-2xl font-semibold text-gray-800">
                  {feature.title}
                </h3>
              </div>
              <p className="mt-6 text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
