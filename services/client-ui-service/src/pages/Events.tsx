import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import NavigationHeader from "../components/navigation/NavigationHeader";
import FooterSection from "../components/layouts/FooterSection";
import {
  ContentItem,
  ContentRepository,
  ContentSection,
} from "@/repository/ContentRepository";
import { useUser } from "@/context/UserContext";

const Events: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [section, setSection] = useState<ContentSection | null>(null);
  const [events, setEvents] = useState<ContentItem[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  const isAuthenticated = !!user;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
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
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.metadata?.location
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

   
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.metadata?.date || a.created_at);
      const dateB = new Date(b.metadata?.date || b.created_at);

      switch (sortBy) {
        case "date_asc":
          return dateA.getTime() - dateB.getTime();
        case "date_desc":
          return dateB.getTime() - dateA.getTime();
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "title_desc":
          return b.title.localeCompare(a.title);
        default:
          return dateB.getTime() - dateA.getTime();
      }
    });

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory, sortBy]);

  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
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

  return (
    <div className="pt-[72px] min-h-screen bg-gray-50">
      <NavigationHeader isAuthenticated={isAuthenticated} />

      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">All Events</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Discover and participate in all the exciting events we have lined
              up for you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="title_asc">Title A-Z</option>
                  <option value="title_desc">Title Z-A</option>
                </select>
              </div>
            </div>
          </div>
 
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        </div>
      </section>
 
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16"> 
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No Events Found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "No events are currently available."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSortBy("date_desc");
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  {event.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-sm font-medium text-primary-600">
                          Event
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {event.title}
                    </h3>

                    {event.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      {event.metadata?.date && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <FaCalendarAlt className="w-4 h-4" />
                          <span className="text-sm">
                            {formatEventDate(event.metadata.date)}
                          </span>
                        </div>
                      )}

                      {event.metadata?.time && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <FaClock className="w-4 h-4" />
                          <span className="text-sm">{event.metadata.time}</span>
                        </div>
                      )}

                      {event.metadata?.location && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <FaMapMarkerAlt className="w-4 h-4" />
                          <span className="text-sm">
                            {event.metadata.location}
                          </span>
                        </div>
                      )}
                    </div>

                    <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Events;
