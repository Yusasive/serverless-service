import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  TagIcon,
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

// Define section-specific field configurations
const SECTION_CONFIGS = {
  hero: {
    name: "Hero Section",
    sectionFields: ["event_date", "location", "button_text"],
    itemFields: ["highlight", "subtitle"],
    hideItems: false,
    description: "",
  },
  about: {
    name: "About Section",
    sectionFields: ["image_url", "button_text"],
    itemFields: [], // Partners don't need extra metadata
    hideItems: false,
    description: "",
  },
  features: {
    name: "Features Section",
    sectionFields: [],
    itemFields: [], // Features are simple title/description
    hideItems: false,
    description: "",
  },
  events: {
    name: "Events Section",
    sectionFields: ["subtitle"],
    itemFields: ["date", "time", "location"],
    hideItems: false,
    description: "",
  },
  footer: {
    name: "Footer Section",
    sectionFields: [
      "copyright_text",
      "address",
      "phone",
      "email",
      "social_links",
    ],
    itemFields: [],
    description: "No items needed",
    hideItems: true,
  },

  "contact-page": {
    name: "Contact Page",
    sectionFields: ["main_office", "support_office"],
    itemFields: [],
    description: "No items needed",
    hideItems: true,
  },
  "about-page": {
    name: "About Page",
    sectionFields: [
      "mission",
      "vision",
      "established",
      "incorporated",
      "about_fair_content",
    ],
    itemFields: [],
    description: "No items needed",
    hideItems: true,
  },
};

const WebsiteContent: React.FC = () => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<ContentSection | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<ContentSection | null>(
    null
  );
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
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

  const [sectionFormData, setSectionFormData] = useState({
    section_key: "",
    title: "",
    content: "",
    metadata: {} as any,
    is_active: true,
    display_order: 0,
    image_file: null as File | null,
    image_preview: "",
    image_url: "",
  });

  const [isUploading, setIsUploading] = useState(false);

  const [itemFormData, setItemFormData] = useState<{
    title: string;
    description: string;
    image_url: string;
    link_url: string;
    is_active: boolean;
    display_order: number;
    metadata: any;
    image_file: File | null;
    image_preview: string;
  }>({
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    metadata: {},
    is_active: true,
    display_order: 1,
    image_file: null,
    image_preview: "",
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      console.log("Loading content...");

      const [sectionsData, itemsData] = await Promise.all([
        ContentRepository.getAllContentSections(),
        ContentRepository.getAllContentItems(),
      ]);

      console.log("Loaded sections:", sectionsData);
      console.log("Loaded items:", itemsData);

      setSections(sectionsData || []);
      setItems(itemsData || []);
    } catch (error) {
      console.error("Failed to load content:", error);
      setErrorMessage(
        `Failed to load content: ${error instanceof Error ? error.message : "Unknown error"}. Please check your network connection and try again.`
      );
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const getSectionConfig = (sectionKey: string) => {
    return (
      SECTION_CONFIGS[sectionKey as keyof typeof SECTION_CONFIGS] || {
        name: "Custom Section",
        sectionFields: [],
        itemFields: [],
      }
    );
  };

  const handleCreateSection = () => {
    setEditingSection(null);
    setSectionFormData({
      section_key: "",
      title: "",
      content: "",
      metadata: {},
      is_active: true,
      display_order: sections.length,
      image_file: null,
      image_preview: "",
      image_url: "",
    });
    setIsModalOpen(true);
  };

  const handleEditSection = (section: ContentSection) => {
    setEditingSection(section);
    setSectionFormData({
      section_key: section.section_key,
      title: section.title,
      content: section.content,
      metadata: section.metadata || {},
      is_active: section.is_active,
      display_order: section.display_order,
      image_file: null,
      image_preview: section.metadata?.image_url || "",
      image_url: section.metadata?.image_url || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteSection = (section: ContentSection) => {
    setConfirmMessage(
      `Are you sure you want to delete the section "${section.title}"? This action cannot be undone.`
    );
    setConfirmAction(() => async () => {
      try {
        await ContentRepository.deleteContentSection(section.id);
        setSuccessMessage("Section deleted successfully!");
        setShowSuccessDialog(true);
        loadContent();
      } catch (error) {
        console.error("Failed to delete section:", error);
        setErrorMessage("Failed to delete section. Please try again.");
        setShowErrorDialog(true);
      }
    });
    setShowConfirmDialog(true);
  };

  const handleCreateItem = (section: ContentSection) => {
    setSelectedSection(section);
    setEditingItem(null);
    setItemFormData({
      title: "",
      description: "",
      image_url: "",
      link_url: "",
      metadata: {},
      is_active: true,
      display_order: getSectionItems(section.id).length,
      image_file: null,
      image_preview: "",
    });
    setIsItemModalOpen(true);
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
        setItemFormData((prev) => ({
          ...prev,
          image_file: file,
          image_preview: preview,
        }));
      };
      reader.readAsDataURL(file);

      // Upload to S3
      const uploadResult = await s3Service.uploadImage(file, "content-images");

      if (uploadResult.success && uploadResult.url) {
        setSectionFormData((prev) => ({
          ...prev,
          image_url: uploadResult.url as string,
          metadata: {
            ...prev.metadata,
            image_url: uploadResult.url as string,
          },
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

  const handleSectionFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
        setSectionFormData((prev) => ({
          ...prev,
          image_file: file,
          image_preview: preview,
        }));
      };
      reader.readAsDataURL(file);

      // Upload to S3
      const uploadResult = await s3Service.uploadImage(file, "content-images");

      if (uploadResult.success && uploadResult.url) {
        setSectionFormData((prev) => ({
          ...prev,
          image_url: uploadResult.url as string,
          metadata: {
            ...prev.metadata,
            image_url: uploadResult.url as string,
          },
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

  const handleEditItem = (item: ContentItem) => {
    const section = sections.find((s) => s.id === item.section_id);
    setSelectedSection(section || null);
    setEditingItem(item);
    setItemFormData({
      title: item.title,
      description: item.description || "",
      image_url: item.image_url || "",
      link_url: item.link_url || "",
      metadata: item.metadata || {},
      is_active: item.is_active,
      display_order: item.display_order,
      image_file: null,
      image_preview: item.image_url || "",
    });
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = (item: ContentItem) => {
    setConfirmMessage(
      `Are you sure you want to delete the item "${item.title}"? This action cannot be undone.`
    );
    setConfirmAction(() => async () => {
      try {
        await ContentRepository.deleteContentItem(item.id);
        setSuccessMessage("Item deleted successfully!");
        setShowSuccessDialog(true);
        loadContent();
      } catch (error) {
        console.error("Failed to delete item:", error);
        setErrorMessage("Failed to delete item. Please try again.");
        setShowErrorDialog(true);
      }
    });
    setShowConfirmDialog(true);
  };

  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { image_file, image_preview, ...sanitizedData } = sectionFormData;

      const sectionData = {
        ...sanitizedData,
        metadata: {
          ...sanitizedData.metadata,
          ...(sectionFormData.image_url && {
            image_url: sectionFormData.image_url,
          }),
        },
      };

      if (editingSection) {
        await ContentRepository.updateContentSection(
          editingSection.id,
          sectionData
        );
        setSuccessMessage("Section updated successfully!");
      } else {
        await ContentRepository.createContentSection(sectionData);
        setSuccessMessage("Section created successfully!");
      }
      setIsModalOpen(false);
      setShowSuccessDialog(true);
      loadContent();
    } catch (error) {
      console.error("Failed to save section:", error);
      setErrorMessage("Failed to save section. Please try again.");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { image_file, image_preview, ...sanitizedData } = itemFormData;

      const itemData = {
        ...sanitizedData,
        section_id: selectedSection?.id || editingItem?.section_id || "",
      };

      if (editingItem) {
        await ContentRepository.updateContentItem(editingItem.id, itemData);
        setSuccessMessage("Item updated successfully!");
      } else {
        await ContentRepository.createContentItem(itemData);
        setSuccessMessage("Item created successfully!");
      }

      setIsItemModalOpen(false);
      setShowSuccessDialog(true);
      loadContent();
    } catch (error) {
      console.error("Failed to save item:", error);
      setErrorMessage("Failed to save item. Please try again.");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const getSectionItems = (sectionId: string) => {
    return items.filter((item) => item.section_id === sectionId);
  };

  const filteredSections = sections.filter((section) => {
    // Hide about-page and event sections from WebsiteContent management
    if (
      section.section_key === "about-page" ||
      section.section_key === "events"
    ) {
      return false;
    }

    const matchesSearch =
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.section_key.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && section.is_active) ||
      (filterActive === "inactive" && !section.is_active);
    return matchesSearch && matchesFilter;
  });

  const renderSectionMetadataFields = (sectionKey: string) => {
    const config = getSectionConfig(sectionKey);

    return config.sectionFields.map((field) => {
      switch (field) {
        case "event_date":
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date
              </label>
              <input
                type="text"
                value={sectionFormData.metadata[field] || ""}
                onChange={(e) =>
                  setSectionFormData({
                    ...sectionFormData,
                    metadata: {
                      ...sectionFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., November 7th – 16th, 2025"
              />
            </div>
          );
        case "location":
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={sectionFormData.metadata[field] || ""}
                onChange={(e) =>
                  setSectionFormData({
                    ...sectionFormData,
                    metadata: {
                      ...sectionFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Tafawa Balewa Square, Lagos"
              />
            </div>
          );
        case "button_text":
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={sectionFormData.metadata[field] || ""}
                onChange={(e) =>
                  setSectionFormData({
                    ...sectionFormData,
                    metadata: {
                      ...sectionFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Book a Booth →"
              />
            </div>
          );
        case "image_url":
          return (
            <div key={field} className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Section Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleSectionFileChange}
                disabled={isUploading}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
              />
              {isUploading && (
                <div className="mt-2 text-sm text-blue-600">
                  Uploading image...
                </div>
              )}
              {sectionFormData.image_preview && (
                <div className="mt-3">
                  <img
                    src={sectionFormData.image_preview}
                    alt="Section preview"
                    className="w-full max-w-md h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          );
        case "subtitle":
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={sectionFormData.metadata[field] || ""}
                onChange={(e) =>
                  setSectionFormData({
                    ...sectionFormData,
                    metadata: {
                      ...sectionFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Event Schedule"
              />
            </div>
          );
        case "copyright_text":
          return (
            <div key={field} className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Copyright Text
              </label>
              <input
                type="text"
                value={sectionFormData.metadata[field] || ""}
                onChange={(e) =>
                  setSectionFormData({
                    ...sectionFormData,
                    metadata: {
                      ...sectionFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., © 2025 Lagos Chamber of Commerce and Industry"
              />
            </div>
          );
        case "social_links":
          return (
            <div key={field} className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Media Links
              </label>
              <div className="grid grid-cols-2 gap-4">
                {["facebook", "twitter", "linkedin", "instagram"].map(
                  (social) => (
                    <div key={social}>
                      <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                        {social}
                      </label>
                      <input
                        type="url"
                        value={sectionFormData.metadata[field]?.[social] || ""}
                        onChange={(e) =>
                          setSectionFormData({
                            ...sectionFormData,
                            metadata: {
                              ...sectionFormData.metadata,
                              [field]: {
                                ...sectionFormData.metadata[field],
                                [social]: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={`https://${social}.com/lagoschamber`}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          );
        case "mission":
          return (
            <div key={field} className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mission Statement
              </label>
              <textarea
                value={sectionFormData.metadata[field] || ""}
                onChange={(e) =>
                  setSectionFormData({
                    ...sectionFormData,
                    metadata: {
                      ...sectionFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter organization mission statement"
              />
            </div>
          );
        case "vision":
          return (
            <div key={field} className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vision Statement
              </label>
              <textarea
                value={sectionFormData.metadata[field] || ""}
                onChange={(e) =>
                  setSectionFormData({
                    ...sectionFormData,
                    metadata: {
                      ...sectionFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter organization vision statement"
              />
            </div>
          );
        case "established":
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Established Year
              </label>
              <input
                type="text"
                value={sectionFormData.metadata[field] || ""}
                onChange={(e) =>
                  setSectionFormData({
                    ...sectionFormData,
                    metadata: {
                      ...sectionFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 1888"
              />
            </div>
          );
        case "incorporated":
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incorporated Year
              </label>
              <input
                type="text"
                value={sectionFormData.metadata[field] || ""}
                onChange={(e) =>
                  setSectionFormData({
                    ...sectionFormData,
                    metadata: {
                      ...sectionFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 1950"
              />
            </div>
          );
        case "main_office":
        case "support_office":
          return (
            <div key={field} className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {field.replace("_", " ")} Details
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg">
                {["address", "phone", "email", "working_hours"].map(
                  (subField) => (
                    <div
                      key={subField}
                      className={
                        subField === "address" || subField === "working_hours"
                          ? "col-span-full"
                          : ""
                      }
                    >
                      <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                        {subField.replace("_", " ")}
                      </label>
                      <input
                        type={subField === "email" ? "email" : "text"}
                        value={
                          sectionFormData.metadata[field]?.[subField] || ""
                        }
                        onChange={(e) =>
                          setSectionFormData({
                            ...sectionFormData,
                            metadata: {
                              ...sectionFormData.metadata,
                              [field]: {
                                ...sectionFormData.metadata[field],
                                [subField]: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={`Enter ${subField.replace("_", " ")}`}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          );
        default:
          return null;
      }
    });
  };

  const renderItemMetadataFields = (sectionKey: string) => {
    const config = getSectionConfig(sectionKey);

    return config.itemFields.map((field) => {
      switch (field) {
        case "highlight":
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Highlight Text
              </label>
              <input
                type="text"
                value={itemFormData.metadata[field] || ""}
                onChange={(e) =>
                  setItemFormData({
                    ...itemFormData,
                    metadata: {
                      ...itemFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Life's Special"
              />
            </div>
          );
        case "subtitle":
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={itemFormData.metadata[field] || ""}
                onChange={(e) =>
                  setItemFormData({
                    ...itemFormData,
                    metadata: {
                      ...itemFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Moments"
              />
            </div>
          );
        case "date":
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date
              </label>
              <input
                type="text"
                value={itemFormData.metadata[field] || ""}
                onChange={(e) =>
                  setItemFormData({
                    ...itemFormData,
                    metadata: {
                      ...itemFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 7th November 2025"
              />
            </div>
          );
        case "time":
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Time
              </label>
              <input
                type="text"
                value={itemFormData.metadata[field] || ""}
                onChange={(e) =>
                  setItemFormData({
                    ...itemFormData,
                    metadata: {
                      ...itemFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 10 AM to 10 PM"
              />
            </div>
          );
        case "location":
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Location
              </label>
              <input
                type="text"
                value={itemFormData.metadata[field] || ""}
                onChange={(e) =>
                  setItemFormData({
                    ...itemFormData,
                    metadata: {
                      ...itemFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Tafawa Balewa Square, Lagos, Nigeria"
              />
            </div>
          );
        case "link_type":
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link Type
              </label>
              <select
                value={itemFormData.metadata[field] || ""}
                onChange={(e) =>
                  setItemFormData({
                    ...itemFormData,
                    metadata: {
                      ...itemFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select link type</option>
                <option value="quick_links">Quick Links</option>
                <option value="services">Services</option>
                <option value="resources">Resources</option>
                <option value="legal">Legal</option>
              </select>
            </div>
          );
        case "link_group":
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link Group
              </label>
              <input
                type="text"
                value={itemFormData.metadata[field] || ""}
                onChange={(e) =>
                  setItemFormData({
                    ...itemFormData,
                    metadata: {
                      ...itemFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Company, Membership, Events"
              />
            </div>
          );
        case "section_type":
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Type
              </label>
              <select
                value={itemFormData.metadata[field] || ""}
                onChange={(e) =>
                  setItemFormData({
                    ...itemFormData,
                    metadata: {
                      ...itemFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select section type</option>
                <option value="history">History</option>
                <option value="leadership">Leadership</option>
                <option value="achievements">Achievements</option>
                <option value="values">Values</option>
              </select>
            </div>
          );
        case "order":
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Order
              </label>
              <input
                type="number"
                value={itemFormData.metadata[field] || ""}
                onChange={(e) =>
                  setItemFormData({
                    ...itemFormData,
                    metadata: {
                      ...itemFormData.metadata,
                      [field]: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 1, 2, 3"
                min="1"
              />
            </div>
          );
        case "office_type":
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Office Type
              </label>
              <select
                value={itemFormData.metadata[field] || ""}
                onChange={(e) =>
                  setItemFormData({
                    ...itemFormData,
                    metadata: {
                      ...itemFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select office type</option>
                <option value="main">Main Office</option>
                <option value="branch">Branch Office</option>
                <option value="regional">Regional Office</option>
              </select>
            </div>
          );
        case "department":
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                value={itemFormData.metadata[field] || ""}
                onChange={(e) =>
                  setItemFormData({
                    ...itemFormData,
                    metadata: {
                      ...itemFormData.metadata,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Membership, Events, Administration"
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  if (loading && sections.length === 0) {
    return <LoadingOverlay isLoading={true} message="Loading content..." />;
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
                Website Content Management
              </h1>
              <p className="text-gray-600">
                Manage your website sections and content items
              </p>
            </div>
            <button
              onClick={handleCreateSection}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon className="h-5 w-5" />
              Add New Section
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search sections..."
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
                <svg
                  className="w-6 h-6 text-blue-600"
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
                <p className="text-sm font-medium text-gray-600">
                  Total Sections
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    sections.filter(
                      (s) => !["about-page", "events"].includes(s.section_key)
                    ).length
                  }
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
                  Active Sections
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    sections.filter(
                      (s) => !["about-page", "events"].includes(s.section_key)
                    ).length
                  }
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
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    items.filter((item) => {
                      const section = sections.find(
                        (s) => s.id === item.section_id
                      );
                      return (
                        section &&
                        !["about-page", "events"].includes(section.section_key)
                      );
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {filteredSections.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No sections found
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by creating your first content section.
              </p>
              <button
                onClick={handleCreateSection}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                Create Section
              </button>
            </div>
          ) : (
            filteredSections.map((section) => {
              const sectionItems = getSectionItems(section.id);
              const config = getSectionConfig(section.section_key);

              return (
                <div
                  key={section.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Section Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-semibold text-gray-900">
                            {section.title}
                          </h2>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                            {section.section_key}
                          </span>
                          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full">
                            {config.name}
                          </span>
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              section.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {section.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{section.content}</p>

                        {/* Display section metadata */}
                        {section.metadata &&
                          Object.keys(section.metadata).length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
                              {Object.entries(section.metadata).map(
                                ([key, value]) =>
                                  key !== "image_base64" && (
                                    <div
                                      key={key}
                                      className="flex items-center gap-2 text-sm"
                                    >
                                      {key === "event_date" && (
                                        <CalendarDaysIcon className="w-4 h-4 text-blue-500" />
                                      )}
                                      {key === "location" && (
                                        <MapPinIcon className="w-4 h-4 text-green-500" />
                                      )}
                                      {key === "button_text" && (
                                        <TagIcon className="w-4 h-4 text-purple-500" />
                                      )}
                                      <span className="text-gray-500 capitalize">
                                        {key.replace("_", " ")}:
                                      </span>
                                      <span className="text-gray-700 font-medium">
                                        {String(value)}
                                      </span>
                                    </div>
                                  )
                              )}

                              {/* Display section image if available */}
                              {section.metadata.image_url && (
                                <div className="col-span-full">
                                  <div className="flex items-center gap-2 text-sm mb-2">
                                    <PhotoIcon className="w-4 h-4 text-indigo-500" />
                                    <span className="text-gray-500">
                                      Section Image:
                                    </span>
                                  </div>
                                  <img
                                    src={section.metadata.image_url}
                                    alt={section.title}
                                    className="w-32 h-20 object-cover rounded border"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.style.display = "none";
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          )}

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Display Order: {section.display_order}</span>
                          <span>Items: {sectionItems.length}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditSection(section)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Section"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Section"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section Items */}

                  {config.description || config.hideItems ? (
                    <div className="p-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800 text-sm">
                          {config.description}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-gray-900">
                          Content Items ({sectionItems.length})
                        </h3>
                        <button
                          onClick={() => handleCreateItem(section)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                        >
                          <PlusIcon className="h-4 w-4" />
                          Add Item
                        </button>
                      </div>

                      {sectionItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {sectionItems.map((item) => (
                            <div
                              key={item.id}
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                                  {item.title}
                                </h4>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleEditItem(item)}
                                    className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                                    title="Edit Item"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(item)}
                                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                    title="Delete Item"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Display item metadata based on section type */}
                              {item.metadata &&
                                Object.keys(item.metadata).length > 0 && (
                                  <div className="text-xs text-gray-500 mb-2 space-y-1">
                                    {Object.entries(item.metadata).map(
                                      ([key, value]) => (
                                        <p
                                          key={key}
                                          className="flex items-center gap-1"
                                        >
                                          {key === "location" && (
                                            <MapPinIcon className="w-4 h-4 text-blue-500" />
                                          )}
                                          {key === "date" && (
                                            <CalendarDaysIcon className="w-4 h-4 text-green-500" />
                                          )}
                                          {key === "time" && (
                                            <ClockIcon className="w-4 h-4 text-orange-500" />
                                          )}
                                          {key === "highlight" && (
                                            <TagIcon className="w-4 h-4 text-purple-500" />
                                          )}
                                          {key === "subtitle" && (
                                            <TagIcon className="w-4 h-4 text-indigo-500" />
                                          )}
                                          <span className="capitalize">
                                            {key.replace("_", " ")}:
                                          </span>
                                          <span className="font-medium">
                                            {String(value)}
                                          </span>
                                        </p>
                                      )
                                    )}
                                  </div>
                                )}

                              {item.description && (
                                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                                  {item.description}
                                </p>
                              )}

                              {item.image_url && (
                                <div className="mb-3">
                                  <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-20 object-cover rounded border"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.style.display = "none";
                                    }}
                                  />
                                </div>
                              )}

                              <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500">
                                  Order: {item.display_order}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full font-medium ${
                                    item.is_active
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {item.is_active ? "Active" : "Inactive"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <PhotoIcon className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 mb-4">
                            No items in this section
                          </p>
                          <button
                            onClick={() => handleCreateItem(section)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Add your first item
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Section Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingSection ? "Edit Section" : "Create New Section"}
              </h3>
              {sectionFormData.section_key && (
                <p className="text-sm text-gray-600 mt-1">
                  Type: {getSectionConfig(sectionFormData.section_key).name}
                </p>
              )}
            </div>

            <form onSubmit={handleSectionSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Key *
                  </label>
                  <select
                    value={sectionFormData.section_key}
                    onChange={(e) =>
                      setSectionFormData({
                        ...sectionFormData,
                        section_key: e.target.value,
                        metadata: {},
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select section type</option>
                    <option value="hero">Hero Section</option>
                    <option value="about">About Section</option>
                    <option value="features">Features Section</option>
                    <option value="events">Events Section</option>
                    <option value="footer">Footer Section</option>
                    <option value="contact-page">Contact Page</option>
                    <option value="custom">Custom Section</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={sectionFormData.display_order}
                    onChange={(e) =>
                      setSectionFormData({
                        ...sectionFormData,
                        display_order: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={sectionFormData.title}
                  onChange={(e) =>
                    setSectionFormData({
                      ...sectionFormData,
                      title: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Section title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={sectionFormData.content}
                  onChange={(e) =>
                    setSectionFormData({
                      ...sectionFormData,
                      content: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Section content description"
                  required
                />
              </div>

              {/* Dynamic Section Metadata Fields */}
              {sectionFormData.section_key && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Section-Specific Fields
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderSectionMetadataFields(sectionFormData.section_key)}
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="section_active"
                  checked={sectionFormData.is_active}
                  onChange={(e) =>
                    setSectionFormData({
                      ...sectionFormData,
                      is_active: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label
                  htmlFor="section_active"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Active
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  {editingSection ? "Update Section" : "Create Section"}
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

      {/* Item Modal */}
      {isItemModalOpen && selectedSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingItem ? "Edit Item" : "Create New Item"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Section: {selectedSection.title} (
                {getSectionConfig(selectedSection.section_key).name})
              </p>
            </div>

            <form onSubmit={handleItemSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={itemFormData.title}
                    onChange={(e) =>
                      setItemFormData({
                        ...itemFormData,
                        title: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Item title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={itemFormData.display_order}
                    onChange={(e) =>
                      setItemFormData({
                        ...itemFormData,
                        display_order: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={itemFormData.description}
                  onChange={(e) =>
                    setItemFormData({
                      ...itemFormData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Item description"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                />
                {isUploading && (
                  <div className="mt-2 text-sm text-blue-600">
                    Uploading image...
                  </div>
                )}

                {itemFormData.image_preview && (
                  <img
                    src={itemFormData.image_preview}
                    alt="Preview"
                    className="w-full h-32 object-cover mt-2 rounded border"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link URL
                </label>
                <input
                  type="url"
                  value={itemFormData.link_url}
                  onChange={(e) =>
                    setItemFormData({
                      ...itemFormData,
                      link_url: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              {selectedSection.section_key && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Item-Specific Fields for{" "}
                    {getSectionConfig(selectedSection.section_key).name}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderItemMetadataFields(selectedSection.section_key)}
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="item_active"
                  checked={itemFormData.is_active}
                  onChange={(e) =>
                    setItemFormData({
                      ...itemFormData,
                      is_active: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label
                  htmlFor="item_active"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Active
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  {editingItem ? "Update Item" : "Create Item"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
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

export default WebsiteContent;
