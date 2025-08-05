import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  ContentRepository,
  Testimonial,
} from "../../../repository/ContentRepository";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import SuccessDialog from "../../../components/common/SuccessDialog";
import ErrorDialog from "../../../components/common/ErrorDialog";

const TestimonialsManagement: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [formData, setFormData] = useState<{
    name: string;
    title: string;
    content: string;
    date: string;
    is_active: boolean;
    display_order: number;
    image_file?: File;
    image_preview?: string;
    image_removed?: boolean;
  }>({
    name: "",
    title: "",
    content: "",
    date: "",
    is_active: true,
    display_order: 0,
    image_file: undefined,
    image_preview: "",
    image_removed: false,
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      console.log("Loading testimonials...");
      const testimonials = await ContentRepository.getAllTestimonials();
      console.log("Loaded testimonials:", testimonials);
      setTestimonials(testimonials || []);
    } catch (error) {
      console.error("Failed to load testimonials:", error);
      setErrorMessage(
        `Failed to load testimonials: ${error instanceof Error ? error.message : "Unknown error"}. Please check your network connection and try again.`
      );
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };
  const MAX_SIZE_MB = 5;
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  const validateImageFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(", ")}`;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File size too large. Maximum allowed size is ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleCreate = () => {
    setEditingTestimonial(null);
    setFormData({
      name: "",
      title: "",
      content: "",
      image_file: undefined,
      image_preview: "",
      date: "",
      is_active: true,
      display_order: testimonials.length,
    });
    setIsModalOpen(true);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image_file: undefined,
      image_preview: "",
      image_removed: true,
    }));
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      title: testimonial.title,
      content: testimonial.content,
      image_file: undefined,
      image_preview: testimonial.image_base64 || "",
      date: testimonial.date || "",
      is_active: testimonial.is_active,
      display_order: testimonial.display_order,
      image_removed: false,
    });
    console.log("Edit Testimonial:", testimonial);
    setIsModalOpen(true);
  };

  const handleDelete = (testimonial: Testimonial) => {
    setConfirmMessage(
      `Are you sure you want to delete the testimonial from "${testimonial.name}"? This action cannot be undone.`
    );
    setConfirmAction(() => async () => {
      try {
        await ContentRepository.deleteTestimonial(testimonial.id);
        setSuccessMessage("Testimonial deleted successfully!");
        setShowSuccessDialog(true);
        loadTestimonials();
      } catch (error) {
        console.error("Failed to delete testimonial:", error);
        setErrorMessage("Failed to delete testimonial. Please try again.");
        setShowErrorDialog(true);
      }
    });
    setShowConfirmDialog(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      setErrorMessage(error);
      setShowErrorDialog(true);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        image_file: file,
        image_preview: base64String,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload: any = {
        name: formData.name,
        title: formData.title,
        content: formData.content,
        date: formData.date || "",
        is_active: formData.is_active,
        display_order: formData.display_order,
      };

      if (formData.image_preview?.startsWith("data:image")) {
        payload.image_base64 = formData.image_preview;
      }

      if (formData.image_removed) {
        payload.image_removed = true;
      }

      if (editingTestimonial) {
        await ContentRepository.updateTestimonial(
          editingTestimonial.id,
          payload
        );
        setSuccessMessage("Testimonial updated successfully!");
      } else {
        await ContentRepository.createTestimonial(payload);
        setSuccessMessage("Testimonial created successfully!");
      }

      setIsModalOpen(false);
      setShowSuccessDialog(true);
      loadTestimonials();
    } catch (error) {
      console.error("Failed to save testimonial:", error);
      setErrorMessage("Failed to save testimonial. Please try again.");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && testimonial.is_active) ||
      (filterActive === "inactive" && !testimonial.is_active);
    return matchesSearch && matchesFilter;
  });

  if (loading && testimonials.length === 0) {
    return (
      <LoadingOverlay isLoading={true} message="Loading testimonials..." />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingOverlay isLoading={loading} message="Processing..." />

      {/* Dialogs */}
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
                Testimonials Management
              </h1>
              <p className="text-gray-600">
                Manage customer testimonials and reviews
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon className="h-5 w-5" />
              Add Testimonial
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                <StarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Testimonials
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {testimonials.length}
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
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {testimonials.filter((t) => t.is_active).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">
                  {testimonials.filter((t) => !t.is_active).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        {filteredTestimonials.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <StarIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No testimonials found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first testimonial.
            </p>
            <button
              onClick={handleCreate}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Add Testimonial
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {testimonial.image_base64 && (
                        <img
                          src={testimonial.image_base64}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                    {testimonial.date && (
                      <p className="text-xs text-gray-500 mb-3">
                        Date: {testimonial.date}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Testimonial"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Testimonial"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-4 italic">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs border-t border-gray-200 pt-4">
                  <span className="text-gray-500">
                    Order: {testimonial.display_order}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full font-medium ${
                      testimonial.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {testimonial.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingTestimonial
                  ? "Edit Testimonial"
                  : "Add New Testimonial"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Customer name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title/Position
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Job title or company"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testimonial Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="What did they say about your service?"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />

                  {formData.image_preview && (
                    <div className="mt-4 relative">
                      <p className="text-sm text-gray-600 mb-1">Preview:</p>
                      <img
                        key={formData.image_preview}
                        src={formData.image_preview}
                        alt="Preview"
                        className="h-48 w-auto rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        title="Remove Image"
                        className="absolute top-0 right-0 bg-white p-1 rounded-full shadow hover:bg-red-50"
                      >
                        <TrashIcon className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    placeholder="e.g., January 2024"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
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
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label
                  htmlFor="is_active"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Active (visible on website)
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  {editingTestimonial
                    ? "Update Testimonial"
                    : "Create Testimonial"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManagement;
