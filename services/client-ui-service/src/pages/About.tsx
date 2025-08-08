import React, { useState, useEffect } from "react";
import NavigationHeader from "@/components/navigation/NavigationHeader";
import { useUser } from "@/context/UserContext";
import {
  FaGlobeAfrica,
  FaHandshake,
  FaUsers,
  FaBullhorn,
} from "react-icons/fa";
import FooterSection from "@/components/layouts/FooterSection";
import { ContentRepository } from "@/repository/ContentRepository";
import LoadingOverlay from "@/components/common/LoadingOverlay";

interface AboutContent {
  section: {
    id: string;
    title: string;
    content: string;
    metadata?: {
      mission?: string;
      vision?: string;
      established?: string;
      incorporated?: string;
      about_fair_content?: string;
      hero_image_url: string;
    };
  } | null;
  items: any[];
}

const About: React.FC = () => {
  const { user } = useUser();
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    section: null,
    items: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAboutContent();
  }, []);

  const loadAboutContent = async () => {
    try {
      setLoading(true);
      const data = await ContentRepository.getContentBySection("about-page");
      setAboutContent(data);
    } catch (error) {
      console.error("Failed to load about content:", error);
      setAboutContent({ section: null, items: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <NavigationHeader isAuthenticated={!!user} />

      <LoadingOverlay
        isLoading={loading}
        message="Loading about information..."
      />

      {/* Hero Section */}
      {aboutContent.section && (
        <div className="relative w-full h-96 flex items-center justify-center bg-gradient-to-r from-green-900/90 to-green-700/80">
          <div className="absolute inset-0 bg-[url('/images/background3.png')] bg-cover bg-center opacity-20" />
          <div className="relative z-10 text-center text-white px-8 md:px-12">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
              {aboutContent.section.title}
            </h1>
            <p className="text-lg md:text-2xl font-medium max-w-2xl mx-auto drop-shadow">
              {aboutContent.section.content}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {aboutContent.section && (
        <section className="max-w-6xl mx-auto -mt-16 bg-white rounded-3xl shadow-xl p-4 md:p-12 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="order-2 lg:order-1">
              <img
                src={aboutContent.section.metadata?.hero_image_url}
                alt="Lagos Chamber of Commerce and Industry"
                className="w-full h-80 object-cover rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500 border-4 border-primary-100"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-green-800 mb-6">
                Lagos Chamber of Commerce and Industry
              </h2>

              {aboutContent.section.metadata?.mission && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    Our Mission
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {aboutContent.section.metadata.mission}
                  </p>
                </div>
              )}

              {aboutContent.section.metadata?.vision && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    Our Vision
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {aboutContent.section.metadata.vision}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {aboutContent.section.metadata?.established && (
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {aboutContent.section.metadata.established}
                    </div>
                    <div className="text-sm text-gray-600">Founded</div>
                  </div>
                )}
                {aboutContent.section.metadata?.incorporated && (
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {aboutContent.section.metadata.incorporated}
                    </div>
                    <div className="text-sm text-gray-600">Incorporated</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Feature Boxes - CMS Managed */}
          {aboutContent.items.length > 0 && (
            <div className="space-y-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                {aboutContent.items.slice(0, 2).map((item, index) => {
                  const IconComponent =
                    index === 0 ? FaGlobeAfrica : FaHandshake;
                  const colorClass =
                    index === 0 ? "text-green-700" : "text-red-500";
                  const titleColorClass =
                    index === 0 ? "text-green-800" : "text-red-600";

                  return (
                    <div
                      key={item.id}
                      className="flex-1 flex items-center gap-4"
                    >
                      <IconComponent className={`${colorClass} text-3xl`} />
                      <div>
                        <h2
                          className={`text-xl font-bold ${titleColorClass} mb-1`}
                        >
                          {item.title}
                        </h2>
                        <p className="text-gray-700">{item.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {aboutContent.items.length > 2 && (
                <div className="flex flex-col md:flex-row gap-6">
                  {aboutContent.items.slice(2, 4).map((item, index) => {
                    const IconComponent = index === 0 ? FaUsers : FaBullhorn;
                    const colorClass =
                      index === 0 ? "text-green-700" : "text-red-500";
                    const titleColorClass =
                      index === 0 ? "text-green-800" : "text-red-600";

                    return (
                      <div
                        key={item.id}
                        className="flex-1 flex items-center gap-4"
                      >
                        <IconComponent className={`${colorClass} text-3xl`} />
                        <div>
                          <h2
                            className={`text-xl font-bold ${titleColorClass} mb-1`}
                          >
                            {item.title}
                          </h2>
                          <p className="text-gray-700">{item.content}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* About the Fair */}
          {aboutContent.section.metadata?.about_fair_content && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-2xl font-semibold text-green-800 mb-4">
                About the Fair
              </h3>
              <div className="text-gray-700 whitespace-pre-line">
                {aboutContent.section.metadata.about_fair_content}
              </div>
            </div>
          )}
        </section>
      )}

      <FooterSection />
    </div>
  );
};

export default About;
