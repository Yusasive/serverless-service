import React, { useEffect, useState } from "react";
import { ContentItem, ContentRepository } from "@/repository/ContentRepository";

import {
  SparklesIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChatBubbleBottomCenterTextIcon,
  BuildingOffice2Icon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const fallbackIcons: Record<string, React.ElementType> = {
  keynote: AcademicCapIcon,
  workshop: ChatBubbleBottomCenterTextIcon,
  panel: ChatBubbleBottomCenterTextIcon,
  network: UserGroupIcon,
  venue: BuildingOffice2Icon,
  people: UsersIcon,
  certificate: SparklesIcon,
};

const FeatureSection: React.FC = () => {
  const [features, setFeatures] = useState<ContentItem[]>([]);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await ContentRepository.getContentBySection("features");

        if (res && res.items) {
          const activeItems = res.items
            .filter((item: ContentItem) => item.is_active)
            .sort(
              (a: ContentItem, b: ContentItem) =>
                a.display_order - b.display_order
            );
          setFeatures(activeItems);
        }
      } catch (error) {
        console.error("Failed to load features:", error);
      }
    };

    fetchFeatures();
  }, []);

  if (features.length === 0) return null;

  return (
    <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary-900 mb-4">
            Why Attend This Event?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience world-class learning, networking, and fun. Here’s what
            you can expect:
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((item) => {
            const Icon =
              fallbackIcons[
                Object.keys(fallbackIcons).find((key) =>
                  item.title.toLowerCase().includes(key)
                ) || ""
              ] || SparklesIcon;

            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity"></div>

                {item.image_url ? (
                  <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-6 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors">
                    <Icon className="h-8 w-8 text-primary-600 group-hover:text-primary-800" />
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
