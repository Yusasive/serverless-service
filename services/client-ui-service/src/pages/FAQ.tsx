import React, { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import NavigationHeader from "@/components/navigation/NavigationHeader";
import FooterSection from "@/components/layouts/FooterSection";
import { useUser } from "@/context/UserContext";
import {
  ContentRepository,
  FAQ as FAQType,
} from "@/repository/ContentRepository";

const FAQ: React.FC = () => {
  const { user } = useUser();
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "general", label: "General" },
    { value: "booth-booking", label: "Booth Booking" },
    { value: "payment", label: "Payment" },
    { value: "event-info", label: "Event Information" },
    { value: "registration", label: "Registration" },
    { value: "support", label: "Support" },
  ];

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const data = await ContentRepository.getFAQs();

      const activeFaqs = (data.faqs || []).filter((faq) => faq.is_active);
      setFaqs(activeFaqs);
    } catch (error) {
      console.error("Failed to load FAQs:", error);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFAQs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const getCategoryCount = (category: string) => {
    if (category === "all") return faqs.length;
    return faqs.filter((faq) => faq.category === category).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
        <NavigationHeader isAuthenticated={!!user} />
        <div className="pt-32 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
        <NavigationHeader isAuthenticated={!!user} />
        <div className="pt-32 text-center text-gray-600">
          <h2 className="text-2xl font-bold mb-4">No FAQs available</h2>
          <p>Please check back later or contact support.</p>
        </div>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <NavigationHeader isAuthenticated={!!user} />

      {/* Hero Section */}
      <div className="relative w-full h-80 flex items-center justify-center bg-gradient-to-r from-green-900/90 to-green-700/80">
        <div className="absolute inset-0 bg-[url('/images/background3.png')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-extrabold mb-2 drop-shadow-lg">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-2xl font-medium max-w-2xl mx-auto drop-shadow">
            Find answers to common questions about the Lagos International Trade
            Fair
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto -mt-16 bg-white rounded-3xl shadow-xl p-8 md:p-12 relative z-20">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category.value
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600"
                }`}
              >
                {category.label} ({getCategoryCount(category.value)})
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No FAQs found for the selected category.
              </p>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        {categories.find((c) => c.value === faq.category)
                          ?.label || faq.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="ml-4">
                    {openFAQ === faq.id ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </button>
                {openFAQ === faq.id && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-green-50 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-green-900 mb-2">
            Can't find what you're looking for?
          </h3>
          <p className="text-green-700 mb-4">
            Our support team is here to help you with any questions about the
            Lagos International Trade Fair.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Contact Support
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default FAQ;
