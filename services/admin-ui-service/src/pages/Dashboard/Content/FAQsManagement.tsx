import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { ContentRepository, FAQ } from "../../../repository/ContentRepository";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import SuccessDialog from "../../../components/common/SuccessDialog";
import ErrorDialog from "../../../components/common/ErrorDialog";

const FAQsManagement: React.FC = () => {
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    category: "general",
    question: "",
    answer: "",
    metadata: {},
    is_active: true,
    display_order: 0,
  });

  const categories = [
    { value: "general", label: "General", color: "bg-blue-100 text-blue-800" },
    {
      value: "booth-booking",
      label: "Booth Booking",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "payment",
      label: "Payment",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "event-info",
      label: "Event Information",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "registration",
      label: "Registration",
      color: "bg-pink-100 text-pink-800",
    },
    {
      value: "support",
      label: "Support",
      color: "bg-indigo-100 text-indigo-800",
    },
  ];

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      console.log("Loading FAQs...");
      const faqs = await ContentRepository.getAllFAQs();
      console.log("Loaded FAQs:", faqs);
      setFAQs(faqs || []);
    } catch (error) {
      console.error("Failed to load FAQs:", error);
      setErrorMessage(
        `Failed to load FAQs: ${error instanceof Error ? error.message : "Unknown error"}. Please check your network connection and try again.`
      );
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingFAQ(null);
    setFormData({
      category: "general",
      question: "",
      answer: "",
      metadata: {},
      is_active: true,
      display_order: faqs.length,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      metadata: faq.metadata || {},
      is_active: faq.is_active,
      display_order: faq.display_order,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (faq: FAQ) => {
    setConfirmMessage(
      `Are you sure you want to delete this FAQ: "${faq.question}"? This action cannot be undone.`
    );
    setConfirmAction(() => async () => {
      try {
        await ContentRepository.deleteFAQ(faq.id);
        setSuccessMessage("FAQ deleted successfully!");
        setShowSuccessDialog(true);
        loadFAQs();
      } catch (error) {
        console.error("Failed to delete FAQ:", error);
        setErrorMessage("Failed to delete FAQ. Please try again.");
        setShowErrorDialog(true);
      }
    });
    setShowConfirmDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingFAQ) {
        await ContentRepository.updateFAQ(editingFAQ.id, formData);
        setSuccessMessage("FAQ updated successfully!");
      } else {
        await ContentRepository.createFAQ(formData);
        setSuccessMessage("FAQ created successfully!");
      }
      setIsModalOpen(false);
      setShowSuccessDialog(true);
      loadFAQs();
    } catch (error) {
      console.error("Failed to save FAQ:", error);
      setErrorMessage("Failed to save FAQ. Please try again.");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFAQsByCategory = (category: string) => {
    return faqs.filter((faq) => faq.category === category);
  };

  const getCategoryColor = (category: string) => {
    return (
      categories.find((c) => c.value === category)?.color ||
      "bg-gray-100 text-gray-800"
    );
  };

  const getCategoryLabel = (category: string) => {
    return categories.find((c) => c.value === category)?.label || category;
  };

  if (loading && faqs.length === 0) {
    return <LoadingOverlay isLoading={true} message="Loading FAQs..." />;
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
                FAQs Management
              </h1>
              <p className="text-gray-600">
                Manage frequently asked questions and answers
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon className="h-5 w-5" />
              Add FAQ
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All ({faqs.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat.value
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.label} ({getFAQsByCategory(cat.value).length})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <QuestionMarkCircleIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total FAQs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {faqs.length}
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
                  {faqs.filter((f) => f.is_active).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.length}
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
                  {faqs.filter((f) => !f.is_active).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ List */}
        {filteredFAQs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <QuestionMarkCircleIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No FAQs found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by creating your first FAQ.
            </p>
            <button
              onClick={handleCreate}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Create FAQ
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full ${getCategoryColor(faq.category)}`}
                        >
                          {getCategoryLabel(faq.category)}
                        </span>
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full ${
                            faq.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {faq.is_active ? "Active" : "Inactive"}
                        </span>
                        <span className="text-xs text-gray-500">
                          Order: {faq.display_order}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                        }
                        className="text-left w-full"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 hover:text-green-600 transition-colors">
                          {faq.question}
                        </h3>
                      </button>
                      {expandedFAQ === faq.id && (
                        <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(faq)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit FAQ"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(faq)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete FAQ"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
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
                {editingFAQ ? "Edit FAQ" : "Add New FAQ"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question
                </label>
                <textarea
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="What is your question?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Provide a detailed answer..."
                  required
                />
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
                  {editingFAQ ? "Update FAQ" : "Create FAQ"}
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

export default FAQsManagement;
