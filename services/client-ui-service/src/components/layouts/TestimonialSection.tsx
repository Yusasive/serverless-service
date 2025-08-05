import React, { useState, useEffect, useCallback } from "react";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  ContentRepository,
  Testimonial,
} from "../../repository/ContentRepository";

const TestimonialSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const itemsPerPage = 3;

  const maxPage = Math.max(
    0,
    Math.ceil(testimonials.length / itemsPerPage) - 1
  );

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % (maxPage + 1));
  }, [maxPage]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + maxPage + 1) % (maxPage + 1));
  }, [maxPage]);

  useEffect(() => {
    async function loadTestimonials() {
      const res = await ContentRepository.getTestimonials();

      const activeTestimonials = (res.testimonials || []).filter(
        (testimonial: Testimonial) => testimonial.is_active
      );

      setTestimonials(activeTestimonials);
    }

    loadTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0 || maxPage === 0) return;

    const interval = setInterval(() => {
      next();
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length, maxPage, next]);

  const getCurrentTestimonials = () => {
    if (testimonials.length === 0) return [];

    const start = current * itemsPerPage;
    const end = Math.min(start + itemsPerPage, testimonials.length);
    let currentTestimonials = testimonials.slice(start, end);

    if (currentTestimonials.length < itemsPerPage) {
      const remaining = itemsPerPage - currentTestimonials.length;
      const fallback = testimonials.slice(0, remaining);
      currentTestimonials = [...currentTestimonials, ...fallback];
    }

    return currentTestimonials;
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonial-section"
      className="py-16 bg-gradient-to-br from-primary-50 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-green-800 mb-8">
          Testimonials
        </h2>

        <div className="relative">
          {maxPage > 0 && (
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-3 text-green-700 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Previous testimonials"
            >
              <FaChevronLeft className="text-xl" />
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-12 transition-all duration-500 ease-in-out">
            {getCurrentTestimonials().map((testimonial, idx) => (
              <div
                key={`${current}-${idx}`}
                className="bg-white rounded-xl shadow-md p-6 border-t-4 border-red-500 transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-lg"
              >
                <FaQuoteLeft className="text-red-400 text-2xl mb-3" />

                {testimonial.image_url && (
                  <img
                    src={testimonial.image_base64}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover border border-gray-300"
                  />
                )}

                <p className="text-sm text-gray-700 italic line-clamp-4 mb-4">
                  {testimonial.content.length > 150
                    ? `${testimonial.content.substring(0, 150)}...`
                    : testimonial.content}
                </p>

                <div>
                  <span className="block font-bold text-green-800 text-sm">
                    {testimonial.name}
                  </span>
                  <span className="block text-xs text-gray-500 font-medium">
                    {testimonial.title}
                    {testimonial.date ? ` • ${testimonial.date}` : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {maxPage > 0 && (
            <button
              onClick={next}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-3 text-green-700 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Next testimonials"
            >
              <FaChevronRight className="text-xl" />
            </button>
          )}
        </div>

        {maxPage > 0 && (
          <div className="flex justify-center gap-3 mt-8">
            {Array.from({ length: maxPage + 1 }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  current === idx
                    ? "bg-red-500 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialSection;
