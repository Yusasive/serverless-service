import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import {
  ContentRepository,
  ContentSection,
  ContentItem,
} from "../../../repository/ContentRepository";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import SuccessDialog from "../../../components/common/SuccessDialog";
import ErrorDialog from "../../../components/common/ErrorDialog";
import { S3UploadService } from "../../../services/S3UploadService";

const EventsManagement: React.FC = () => {
  const [section, setSection] = useState<ContentSection | null>(null);
  const [events, setEvents] = useState<ContentItem[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ContentItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isUploading, setIsUploading] = useState(false);

  // Dialog states
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [eventFormData, setEventFormData] = useState<{
    title: string;
    description: string;
    image_url: string;
    link_url: string;
    is_active: boolean;
    display_order: number;
    metadata: {
      date: string;
      time: string;
      location: string;
      category: string;
      organizer: string;
      contact_email: string;
      guests: string;
    };
    image_file: File | null;
    image_preview: string;
  }>({
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    is_active: true,
    display_order: 0,
    metadata: {
      date: "",
      time: "",
      location: "",
      category: "",
      organizer: "",
      contact_email: "",
      guests: "",
    },
    image_file: null,
    image_preview: "",
  });

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

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

    if (filterActive !== "all") {
      filtered = filtered.filter((event) =>
        filterActive === "active" ? event.is_active : !event.is_active
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, filterActive]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await ContentRepository.getEventsContent();

      if (res) {
        setSection(res.section);
        const allEvents = res.items || [];
        const sortedEvents = allEvents.sort((a, b) => {
          if (a.display_order !== b.display_order) {
            return a.display_order - b.display_order;
          }
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        setEvents(sortedEvents);
      }
    } catch (error) {
      console.error("Failed to load events:", error);
      setErrorMessage("Failed to load events. Please try again.");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setEventFormData({
      title: "",
      description: "",
      image_url: "",
      link_url: "",
      is_active: true,
      display_order: events.length,
      metadata: {
        date: "",
        time: "",
        location: "",
        category: "",
        organizer: "",
        contact_email: "",
        guests: ",",
      },
      image_file: null,
      image_preview: "",
    });
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: ContentItem) => {
    setEditingEvent(event);
    setEventFormData({
      title: event.title,
      description: event.description || "",
      image_url: event.image_url || "",
      link_url: event.link_url || "",
      is_active: event.is_active,
      display_order: event.display_order,
      metadata: {
        date: event.metadata?.date || "",
        time: event.metadata?.time || "",
        location: event.metadata?.location || "",
        category: event.metadata?.category || "",
        organizer: event.metadata?.organizer || "",
        contact_email: event.metadata?.contact_email || "",
        guests: event.metadata?.guests || "",
      },
      image_file: null,
      image_preview: event.image_url || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (event: ContentItem) => {
    setConfirmMessage(
      `Are you sure you want to delete the event "${event.title}"? This action cannot be undone.`
    );
    setConfirmAction(() => async () => {
      try {
        await ContentRepository.deleteContentItem(event.id);
        setSuccessMessage("Event deleted successfully!");
        setShowSuccessDialog(true);
        loadEvents();
      } catch (error) {
        console.error("Failed to delete event:", error);
        setErrorMessage("Failed to delete event. Please try again.");
        setShowErrorDialog(true);
      }
    });
    setShowConfirmDialog(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const s3Service = S3UploadService.getInstance();
    const validation = s3Service.validateImageFile(file);

    if (!validation.isValid) {
      setErrorMessage(validation.error || "Invalid file");
      setShowErrorDialog(true);
      return;
    }

    try {
      setIsUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setEventFormData((prev) => ({
          ...prev,
          image_file: file,
          image_preview: preview,
        }));
      };
      reader.readAsDataURL(file);

      // Upload to S3
      const uploadResult = await s3Service.uploadImage(file, "content-images");

      if (uploadResult.success && uploadResult.url) {
        setEventFormData((prev) => ({
          ...prev,
          image_url: uploadResult.url as string,
        }));
        setSuccessMessage("Image uploaded successfully!");
        setShowSuccessDialog(true);
      } else {
        setErrorMessage(uploadResult.error || "Failed to upload image");
        setShowErrorDialog(true);
      }
    } catch (error) {
      setErrorMessage("Failed to upload image. Please try again.");
      setShowErrorDialog(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!section) {
      setErrorMessage("Events section not found. Please try again.");
      setShowErrorDialog(true);
      return;
    }

    try {
      setLoading(true);

      const { image_file, image_preview, ...sanitizedData } = eventFormData;

      const eventData = {
        ...sanitizedData,
        section_id: section.id,
      };

      if (editingEvent) {
        await ContentRepository.updateContentItem(editingEvent.id, eventData);
        setSuccessMessage("Event updated successfully!");
      } else {
        await ContentRepository.createContentItem(eventData);
        setSuccessMessage("Event created successfully!");
      }

      setIsModalOpen(false);
      setShowSuccessDialog(true);
      loadEvents();
    } catch (error) {
      console.error("Failed to save event:", error);
      setErrorMessage("Failed to save event. Please try again.");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading && events.length === 0) {
    return <LoadingOverlay isLoading={true} message="Loading events..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingOverlay isLoading={loading} message="Processing..." />

      <ConfirmDialog
        isOpen={showConfirmDialog}
        message={confirmMessage}
        onConfirm={() => {
          confirmAction();
          setShowConfirmDialog(false);
        }}
        onCancel={() => setShowConfirmDialog(false)}
      />

      <SuccessDialog
        isOpen={showSuccessDialog}
        message={successMessage}
        onRedirect={() => setShowSuccessDialog(false)}
        buttonText="Continue"
        showButton={true}
      />

      <ErrorDialog
        isOpen={showErrorDialog}
        message={errorMessage}
        onClose={() => setShowErrorDialog(false)}
        buttonText="Try Again"
        showButton={true}
      />

      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Events Management
              </h1>
              <p className="text-gray-600">
                Create, edit, and manage all events
              </p>
            </div>
            <button
              onClick={handleCreateEvent}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon className="h-5 w-5" />
              Add New Event
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "active", "inactive"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterActive(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterActive === filter
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter((event) => event.is_active).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    events.filter((event) => {
                      if (!event.metadata?.date) return false;
                      return new Date(event.metadata.date) >= new Date();
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <CalendarDaysIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No events found" : "No events yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Get started by creating your first event."}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreateEvent}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                >
                  Create Event
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Events ({filteredEvents.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Event Image */}
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <PhotoIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                              {event.title}
                            </h4>
                            {event.description && (
                              <p className="text-gray-600 mb-3 line-clamp-2">
                                {event.description}
                              </p>
                            )}

                            {/* Event Metadata */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
                              {event.metadata?.date && (
                                <div className="flex items-center gap-1">
                                  <CalendarDaysIcon className="w-4 h-4" />
                                  <span>{formatDate(event.metadata.date)}</span>
                                </div>
                              )}
                              {event.metadata?.time && (
                                <div className="flex items-center gap-1">
                                  <ClockIcon className="w-4 h-4" />
                                  <span>{event.metadata.time}</span>
                                </div>
                              )}
                              {event.metadata?.location && (
                                <div className="flex items-center gap-1">
                                  <MapPinIcon className="w-4 h-4" />
                                  <span>{event.metadata.location}</span>
                                </div>
                              )}
                              {event.metadata?.category && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium text-gray-700">
                                    Category:
                                  </span>
                                  <span>{event.metadata.category}</span>
                                </div>
                              )}
                              {event.metadata?.organizer && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium text-gray-700">
                                    Organizer:
                                  </span>
                                  <span>{event.metadata.organizer}</span>
                                </div>
                              )}
                              {event.metadata?.contact_email && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium text-gray-700">
                                    Email:
                                  </span>
                                  <span>{event.metadata.contact_email}</span>
                                </div>
                              )}
                              {event.metadata?.guests && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium text-gray-700">
                                    Guests:
                                  </span>
                                  <span>{event.metadata.guests}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Order: {event.display_order}</span>
                              <span
                                className={`px-2 py-1 rounded-full font-medium ${
                                  event.is_active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {event.is_active ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Event"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Event"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h3>
            </div>

            <form onSubmit={handleEventSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={eventFormData.title}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        title: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={eventFormData.metadata.date}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        metadata: {
                          ...eventFormData.metadata,
                          date: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Time
                  </label>
                  <input
                    type="time"
                    value={eventFormData.metadata.time}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        metadata: {
                          ...eventFormData.metadata,
                          time: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Location
                  </label>
                  <input
                    type="text"
                    value={eventFormData.metadata.location}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        metadata: {
                          ...eventFormData.metadata,
                          location: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter event location"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Description
                  </label>
                  <textarea
                    value={eventFormData.description}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter event description"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                  />
                  {isUploading && (
                    <div className="mt-2 text-sm text-blue-600">
                      Uploading image...
                    </div>
                  )}
                  {eventFormData.image_preview && (
                    <div className="mt-3">
                      <img
                        src={eventFormData.image_preview}
                        alt="Event preview"
                        className="w-full max-w-md h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={eventFormData.metadata.category || ""}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        metadata: {
                          ...eventFormData.metadata,
                          category: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter event category"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organizer
                  </label>
                  <input
                    type="text"
                    value={eventFormData.metadata.organizer || ""}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        metadata: {
                          ...eventFormData.metadata,
                          organizer: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter organizer name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={eventFormData.metadata.contact_email || ""}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        metadata: {
                          ...eventFormData.metadata,
                          contact_email: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter contact email"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guest(s)
                  </label>
                  <input
                    type="text"
                    value={eventFormData.metadata.guests || ""}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        metadata: {
                          ...eventFormData.metadata,
                          guests: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter guest names"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={eventFormData.display_order}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        display_order: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={eventFormData.is_active}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        is_active: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_active"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Active Event
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {editingEvent ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManagement;
