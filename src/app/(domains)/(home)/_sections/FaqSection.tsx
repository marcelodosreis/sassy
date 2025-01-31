"use client";

import { useI18n } from '@/hooks/useI18n';

const FaqSection = () => {
  const { translate } = useI18n();

  const faqs = [
    {
      question: translate('home-section-faq-question-1'),
      answer: translate('home-section-faq-answer-1'),
    },
    {
      question: translate('home-section-faq-question-2'),
      answer: translate('home-section-faq-answer-2'),
    },
    {
      question: translate('home-section-faq-question-3'),
      answer: translate('home-section-faq-answer-3'),
    },
    {
      question: translate('home-section-faq-question-4'),
      answer: translate('home-section-faq-answer-4'),
    },
    {
      question: translate('home-section-faq-question-5'),
      answer: translate('home-section-faq-answer-5'),
    },
    {
      question: translate('home-section-faq-question-6'),
      answer: translate('home-section-faq-answer-6'),
    },
    {
      question: translate('home-section-faq-question-7'),
      answer: translate('home-section-faq-answer-7'),
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900">
          {translate('home-section-faq-title')}
        </h2>
        <p className="mt-4 text-center text-lg text-gray-600">
          {translate('home-section-faq-description')}
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
