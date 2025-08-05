import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ContentRepository,
  ContentSection,
  ContentItem,
} from "../../repository/ContentRepository";

const AboutSection: React.FC = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<ContentSection | null>(null);
  const [partners, setPartners] = useState<ContentItem[]>([]);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const res = await ContentRepository.getAboutContent();
        if (res) {
          setSection(res.section);
          setPartners(res.items);
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
      }
    };

    fetchAboutContent();
  }, []);

  if (!section) return null;

  return (
    <section className="py-20 bg-primary-50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="md:col-span-1">
          <img
            src={section.metadata?.image_url ?? ""}
            alt="About Event"
            className="w-full h-96 object-cover rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500 border-4 border-primary-100"
          />
        </div>
        <div>
          <h2 className="text-4xl font-extrabold text-primary-900 mb-6 leading-snug">
            {section.title}
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
            {section.content}
          </p>
          <button
            onClick={() => navigate("/about")}
            className="mt-8 bg-primary-600 hover:bg-primary-700 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300"
          >
            {section.metadata.button_text}
          </button>
        </div>
      </div>

      {/* Partners Slider */}
      {partners.length > 0 && (
        <div className="mt-20">
          <h3 className="text-2xl font-semibold text-center text-primary-900 mb-8">
            Our Partners
          </h3>
          <div className="overflow-hidden relative">
            <div className="flex space-x-12 px-6 overflow-x-auto scrollbar-hide md:justify-center">
              {partners.map((partner) => (
                <img
                  key={partner.id}
                  src={partner.image_url}
                  alt={partner.title || "Partner"}
                  className="h-20 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutSection;
