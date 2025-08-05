import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import {
  ContentItem,
  ContentRepository,
  ContentSection,
} from "@/repository/ContentRepository";

const EventSection: React.FC = () => {
  const [section, setSection] = useState<ContentSection | null>(null);
  const [events, setEvents] = useState<ContentItem[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await ContentRepository.getEventsContent();
        if (res) {
          if (res.section?.is_active) {
            setSection(res.section);

            const activeItems = res.items.filter(
              (item: ContentItem) => item.is_active
            );
            setEvents(activeItems);
          } else {
            setSection(null);
            setEvents([]);
          }
        }
      } catch (error) {
        console.error("Failed to load event content:", error);
      }
    };

    fetchEvents();
  }, []);

  if (!section) return null;

  return (
    <section id="event-section" className="py-20 bg-primary-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wider text-primary-900 font-semibold">
              Event Schedule
            </p>
            <h2 className="text-4xl font-bold mt-2">
              {section.title || "Upcoming Events"}
            </h2>
          </div>
        </div>

        <div className="space-y-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row"
            >
              <img
                src={event.image_url}
                alt={event.title}
                className="w-80 h-56 object-cover"
              />
              <div className="flex-1 p-6">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
              </div>
              <div className="md:w-1/4 border-t md:border-t-0 md:border-l border-gray-200 p-6 flex flex-col justify-center gap-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-primary-500 mt-1" />
                  <span className="text-sm">
                    {event.metadata?.location}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-primary-500 mt-1" />
                  <span className="text-sm">
                    {event.metadata?.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventSection;
