"use client"

import { useI18n } from '@/hooks/useI18n';

const TestimonialSection = () => {
  const { translate } = useI18n();

  const testimonials = [
    translate('home-section-testimonial-1'),
    translate('home-section-testimonial-2'),
    translate('home-section-testimonial-3'),
    translate('home-section-testimonial-4'),
    translate('home-section-testimonial-5'),
    translate('home-section-testimonial-6'),
    translate('home-section-testimonial-7'),
    translate('home-section-testimonial-8'),
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900">
          {translate('home-section-testimonials-title')}
        </h2>
        <p className="mt-4 text-center text-lg text-gray-600">
          {translate('home-section-testimonials-description')}
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <img
                  src={`https://i.pravatar.cc/150?img=${index + 1}`}
                  alt="User avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {["Alice Martin", "John White", "Liam Smith", "Michael Brown", "Sarah Clark", "Collin Davis", "James Wilson", "Josh Taylor"][index]}
                  </h3>
                  <div className="flex text-yellow-400 mt-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 .587l3.668 7.568L24 9.748l-6 5.884L19.335 24 12 20.205 4.665 24 6 15.632 0 9.748l8.332-1.593L12 .587z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-gray-600">{testimonial}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
