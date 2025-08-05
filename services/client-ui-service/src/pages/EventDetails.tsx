import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaShare,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaCopy,
  FaArrowLeft,
  FaTimes,
} from "react-icons/fa";
import NavigationHeader from "../components/navigation/NavigationHeader";
import FooterSection from "../components/layouts/FooterSection";
import { ContentItem, ContentRepository } from "@/repository/ContentRepository";
import { useUser } from "@/context/UserContext";

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [event, setEvent] = useState<ContentItem | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const isAuthenticated = !!user;

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);

        const res = await ContentRepository.getEventsContent();
        if (res && res.items) {
          const allEvents = res.items.filter(
            (item: ContentItem) => item.is_active
          );
          const currentEvent = allEvents.find(
            (item: ContentItem) => item.id === id
          );

          if (currentEvent) {
            setEvent(currentEvent);
            const otherEvents = allEvents.filter(
              (item: ContentItem) => item.id !== id
            );
            const shuffled = otherEvents.sort(() => 0.5 - Math.random());
            setRelatedEvents(shuffled.slice(0, 3));
          } else {
            console.error("Event not found");
          }
        }
      } catch (error) {
        console.error("Failed to load event details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        full: date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        short: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
    } catch {
      return { full: dateString, short: dateString };
    }
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = event?.title || "Event";

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
          "_blank"
        );
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(url);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error("Failed to copy URL:", err);
        }
        break;
    }
  };

  if (loading) {
    return (
      <div className="pt-[72px] min-h-screen bg-gray-50">
        <NavigationHeader isAuthenticated={isAuthenticated} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="pt-[72px] min-h-screen bg-gray-50">
        <NavigationHeader isAuthenticated={isAuthenticated} />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/events")}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Browse All Events
          </button>
        </div>
      </div>
    );
  }

  const eventDate = event.metadata?.date
    ? formatEventDate(event.metadata.date)
    : null;

  return (
    <div className="pt-[72px] min-h-screen bg-gray-50">
      <NavigationHeader isAuthenticated={isAuthenticated} />

      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/events")}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Events</span>
          </button>
        </div>
      </div>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg"
                />
              ) : (
                <div className="w-full h-64 lg:h-80 bg-gradient-to-r from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                  <FaCalendarAlt className="w-16 h-16 text-primary-400" />
                </div>
              )}
            </div>

            <div className="order-1 lg:order-2">
              <div className="mb-4">
                <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  Event
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {event.title}
              </h1>

              {event.description && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {event.description}
                </p>
              )}

              <div className="space-y-4 mb-8">
                {event.metadata?.category && (
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 text-xl font-bold">
                        🏷️
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">Category</div>
                      <div className="text-gray-600">
                        {event.metadata.category}
                      </div>
                    </div>
                  </div>
                )}

                {event.metadata?.organizer && (
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 text-xl font-bold">
                        🏛️
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">Organizer</div>
                      <div className="text-gray-600">
                        {event.metadata.organizer}
                      </div>
                    </div>
                  </div>
                )}

                {event.metadata?.contact_email && (
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 text-xl font-bold">
                        ✉️
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">Contact Email</div>
                      <a
                        href={`mailto:${event.metadata.contact_email}`}
                        className="text-primary-600 hover:underline"
                      >
                        {event.metadata.contact_email}
                      </a>
                    </div>
                  </div>
                )}

                {event.metadata?.guest && (
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 text-xl font-bold">
                        👤
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">Guest Speaker</div>
                      <div className="text-gray-600">
                        {event.metadata.guest}
                      </div>
                    </div>
                  </div>
                )}

                {eventDate && (
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FaCalendarAlt className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Date</div>
                      <div className="text-gray-600">{eventDate.full}</div>
                    </div>
                  </div>
                )}

                {event.metadata?.time && (
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FaClock className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Time</div>
                      <div className="text-gray-600">{event.metadata.time}</div>
                    </div>
                  </div>
                )}

                {event.metadata?.location && (
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FaMapMarkerAlt className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Location</div>
                      <div className="text-gray-600">
                        {event.metadata.location}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  <FaShare className="w-4 h-4" />
                  Share Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {relatedEvents.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Related Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedEvents.map((relatedEvent) => {
                const relatedDate = relatedEvent.metadata?.date
                  ? formatEventDate(relatedEvent.metadata.date)
                  : null;
                return (
                  <div
                    key={relatedEvent.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                    onClick={() => navigate(`/events/${relatedEvent.id}`)}
                  >
                    {relatedEvent.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={relatedEvent.image_url}
                          alt={relatedEvent.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {relatedEvent.title}
                      </h3>
                      {relatedDate && (
                        <div className="flex items-center gap-2 text-gray-500 mb-4">
                          <FaCalendarAlt className="w-4 h-4" />
                          <span className="text-sm">{relatedDate.short}</span>
                        </div>
                      )}
                      <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                        View Details →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Share Event</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleShare("facebook")}
                className="flex items-center gap-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaFacebook className="w-5 h-5" />
                Facebook
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="flex items-center gap-3 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
                Twitter
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="flex items-center gap-3 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <FaLinkedin className="w-5 h-5" />
                LinkedIn
              </button>
              <button
                onClick={() => handleShare("whatsapp")}
                className="flex items-center gap-3 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaWhatsapp className="w-5 h-5" />
                WhatsApp
              </button>
            </div>

            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => handleShare("copy")}
                className={`w-full flex items-center justify-center gap-3 p-3 rounded-lg transition-all ${
                  copySuccess
                    ? "bg-green-200 text-green-700"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                <FaCopy className="w-5 h-5" />
                {copySuccess ? "Link Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterSection />
    </div>
  );
};

export default EventDetails;
