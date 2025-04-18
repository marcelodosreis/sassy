"use client";

import { useI18n } from '@/hooks/useI18n';

const FaqSection = () => {
  const { translate } = useI18n();

  const faqs = [
    {
      question: translate('pages.home.sections.faq.items.1.question'),
      answer: translate('pages.home.sections.faq.items.1.answer'),
    },
    {
      question: translate('pages.home.sections.faq.items.2.question'),
      answer: translate('pages.home.sections.faq.items.2.answer'),
    },
    {
      question: translate('pages.home.sections.faq.items.3.question'),
      answer: translate('pages.home.sections.faq.items.3.answer'),
    },
    {
      question: translate('pages.home.sections.faq.items.4.question'),
      answer: translate('pages.home.sections.faq.items.4.answer'),
    },
    {
      question: translate('pages.home.sections.faq.items.5.question'),
      answer: translate('pages.home.sections.faq.items.5.answer'),
    },
    {
      question: translate('pages.home.sections.faq.items.6.question'),
      answer: translate('pages.home.sections.faq.items.6.answer'),
    },
    {
      question: translate('pages.home.sections.faq.items.7.question'),
      answer: translate('pages.home.sections.faq.items.7.answer'),
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900">
          {translate('pages.home.sections.faq.title')}
        </h2>
        <p className="mt-4 text-center text-lg text-gray-600">
          {translate('pages.home.sections.faq.description')}
        </p>

        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="border border-gray-300 rounded-lg shadow-md p-4 group">
              <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                {faq.question}
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
