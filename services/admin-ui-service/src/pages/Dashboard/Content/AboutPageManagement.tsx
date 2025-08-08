import React, { useState, useEffect } from "react";
import { ContentRepository } from "../../../repository/ContentRepository";
import {
  ContentSection,
  ContentItem,
} from "../../../repository/ContentRepository";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import SuccessDialog from "../../../components/common/SuccessDialog";
import ErrorDialog from "../../../components/common/ErrorDialog";
import { S3UploadService } from "../../../services/S3UploadService";
import {
  InformationCircleIcon,
  CalendarIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

const AboutPageManagement: React.FC = () => {
  const [aboutPageData, setAboutPageData] = useState<{
    section: ContentSection | null;
    items: ContentItem[];
  }>({ section: null, items: [] });
  const [loading, setLoading] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [, setEditingItem] = useState<ContentItem | null>(null);
  const [aboutSection, setAboutSection] = useState<ContentSection | null>(null);
  const [aboutItems, setAboutItems] = useState<ContentItem[]>([]);
  const [, setIsLoading] = useState(false); // Renamed from loading to avoid conflict

  useEffect(() => {
    loadAboutPageContent();
  }, []);

  const loadAboutPageContent = async () => {
    try {
      setLoading(true);
      const data = await ContentRepository.getAboutPageContent();
      setAboutPageData(data);
      setAboutSection(data.section);
      setAboutItems(data.items);
    } catch (error) {
      console.error("Failed to load about page content:", error);
      setErrorMessage("Failed to load about page content");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const updateAboutPageSection = async (sectionData: any) => {
    try {
      setLoading(true);
      if (aboutPageData.section) {
        await ContentRepository.updateContentSection(
          aboutPageData.section.id,
          sectionData
        );
        setSuccessMessage("About page content updated successfully!");
        setShowSuccessDialog(true);
        await loadAboutPageContent();
      }
    } catch (error) {
      console.error("Failed to update about page content:", error);
      setErrorMessage("Failed to update about page content");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, itemIndex: number) => {
    const s3Service = S3UploadService.getInstance();
    const validation = s3Service.validateImageFile(file);

    if (!validation.isValid) {
      setErrorMessage(validation.error || "Invalid file");
      setShowErrorDialog(true);
      return null;
    }

    try {
      setIsUploading(true);
      console.log(`Starting upload for feature ${itemIndex + 1}:`, file.name);

      const uploadResult = await s3Service.uploadImage(
        file,
        "about-page-images"
      );
      console.log(
        `S3 upload successful for feature ${itemIndex + 1}:`,
        uploadResult.url
      );

      // Update the specific item's image_url in the state
      setAboutItems((prevItems) => {
        const updatedItems = prevItems.map((item, index) => {
          if (index === itemIndex) {
            const updatedItem = { ...item, image_url: uploadResult.url };
            console.log(
              `Updated imageUrl for feature ${itemIndex + 1}:`,
              updatedItem.image_url
            );
            return updatedItem;
          }
          return item;
        });
        console.log(`All items after update:`, updatedItems);
        return updatedItems;
      });

      // Also update editingItem if it's the same item being edited
      setEditingItem((prev) => {
        if (
          prev &&
          aboutItems[itemIndex] &&
          prev.id === aboutItems[itemIndex].id
        ) {
          const updatedEditingItem = { ...prev, image_url: uploadResult.url };
          console.log(
            `Updated editingItem imageUrl:`,
            updatedEditingItem.image_url
          );
          return updatedEditingItem;
        }
        return prev;
      });

      setShowSuccessDialog(true);
      setSuccessMessage("Image uploaded successfully");
      return uploadResult.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      setErrorMessage(
        `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setShowErrorDialog(true);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = async (imageUrl: string): Promise<boolean> => {
    try {
      const s3Service = S3UploadService.getInstance();
      await s3Service.deleteImage(imageUrl);
      setSuccessMessage("Image deleted successfully!");
      setShowSuccessDialog(true);
      return true;
    } catch (error) {
      console.error("Failed to delete image:", error);
      setErrorMessage("Failed to delete image. Please try again.");
      setShowErrorDialog(true);
      return false;
    }
  };

  // Placeholder for handleSaveContentItem, will be replaced by the change
  const handleSaveContentItem = async (item: ContentItem) => {
    try {
      setIsLoading(true);

      // Create the data object with proper field mapping
      const itemData = {
        title: item.title,
        description: item.description,
        image_url: item.image_url, // Use the updated image_url from state
        link_url: item.link_url || "",
        metadata: item.metadata || {},
        is_active: item.is_active,
        display_order: item.display_order,
        section_id: aboutSection?.id || "",
      };

      console.log(
        `Feature ${item.display_order} - Final itemData being sent:`,
        itemData
      );

      await ContentRepository.updateContentItem(item.id, itemData);

      // Refresh the data
      await loadAboutData();

      setShowSuccessDialog(true);
      setSuccessMessage("Content updated successfully");
    } catch (error) {
      console.error("Error updating content:", error);
      setShowErrorDialog(true);
      setErrorMessage(
        `Failed to update content: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for loadAboutData, will be replaced by the change
  const loadAboutData = async () => {
    try {
      setIsLoading(true);
      const data = await ContentRepository.getAboutPageContent();
      setAboutSection(data.section);
      setAboutItems(data.items);
    } catch (error) {
      console.error("Failed to load about data:", error);
      setErrorMessage("Failed to load about data");
      setShowErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading && !aboutPageData.section) {
    return (
      <LoadingOverlay
        isLoading={true}
        message="Loading about page content..."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingOverlay isLoading={loading} message="Processing..." />

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            About Page Content Management
          </h1>
          <p className="text-gray-600">
            Manage about page content including mission, vision, organizational
            details, and about the fair content
          </p>
        </div>

        {aboutPageData.section && (
          <div className="space-y-8">
            {/* About Page Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                About Page Information
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);

                  const handleFormSubmission = async () => {
                    let heroImageUrl =
                      aboutPageData.section?.metadata?.hero_image_url || "";

                    const heroImageFile = formData.get("hero_image") as File;
                    if (heroImageFile && heroImageFile.size > 0) {
                      const uploadedUrl = await handleImageUpload(
                        heroImageFile,
                        -1
                      ); // -1 indicates not a feature item
                      if (uploadedUrl) {
                        if (heroImageUrl) {
                          await handleImageDelete(heroImageUrl);
                        }
                        heroImageUrl = uploadedUrl;
                      } else {
                        return;
                      }
                    }

                    const sectionData = {
                      title: formData.get("title") as string,
                      content: formData.get("content") as string,
                      metadata: {
                        mission: formData.get("mission") as string,
                        vision: formData.get("vision") as string,
                        established: formData.get("established") as string,
                        incorporated: formData.get("incorporated") as string,
                        about_fair_content: formData.get(
                          "about_fair_content"
                        ) as string,
                        hero_image_url: heroImageUrl,
                      },
                      is_active: aboutPageData.section?.is_active || true,
                      display_order: aboutPageData.section?.display_order || 11,
                    };
                    updateAboutPageSection(sectionData);
                  };

                  handleFormSubmission();
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={aboutPageData.section.title}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Description
                  </label>
                  <textarea
                    name="content"
                    defaultValue={aboutPageData.section.content}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Hero Image Upload */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Image (Optional)
                  </label>
                  <input
                    type="file"
                    name="hero_image"
                    accept="image/*"
                    disabled={isUploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                  />
                  {isUploading && (
                    <div className="mt-2 text-sm text-blue-600">
                      Uploading image...
                    </div>
                  )}
                  {aboutPageData.section?.metadata?.hero_image_url && (
                    <div className="mt-3">
                      <img
                        src={aboutPageData.section.metadata.hero_image_url}
                        alt="Hero image preview"
                        className="w-full max-w-md h-48 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          const heroImageUrl =
                            aboutPageData.section?.metadata?.hero_image_url;
                          if (
                            heroImageUrl &&
                            (await handleImageDelete(heroImageUrl))
                          ) {
                            if (aboutPageData.section) {
                              const updatedMetadata = {
                                ...aboutPageData.section.metadata,
                                hero_image_url: undefined,
                              };
                              await ContentRepository.updateContentSection(
                                aboutPageData.section.id,
                                {
                                  ...aboutPageData.section,
                                  metadata: updatedMetadata,
                                }
                              );
                              await loadAboutPageContent();
                            }
                          }
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove Hero Image
                      </button>
                    </div>
                  )}
                </div>

                {/* Organization Details */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Organization Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CalendarIcon className="w-4 h-4 inline mr-1" />
                        Established Year
                      </label>
                      <input
                        type="text"
                        name="established"
                        defaultValue={
                          aboutPageData.section.metadata?.established || ""
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., 1888"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CalendarIcon className="w-4 h-4 inline mr-1" />
                        Incorporated Year
                      </label>
                      <input
                        type="text"
                        name="incorporated"
                        defaultValue={
                          aboutPageData.section.metadata?.incorporated || ""
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., 1950"
                      />
                    </div>

                    <div className="col-span-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mission Statement
                      </label>
                      <textarea
                        name="mission"
                        defaultValue={
                          aboutPageData.section.metadata?.mission || ""
                        }
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter organization mission"
                      />
                    </div>

                    <div className="col-span-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vision Statement
                      </label>
                      <textarea
                        name="vision"
                        defaultValue={
                          aboutPageData.section.metadata?.vision || ""
                        }
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter organization vision"
                      />
                    </div>
                  </div>
                </div>

                {/* About the Fair Content - Rich Text Editor */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-green-50 to-blue-50">
                  <div className="flex items-center gap-2 mb-6">
                    <InformationCircleIcon className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      About the Fair Content
                    </h3>
                  </div>

                  <div className="bg-blue-100 border-l-4 border-blue-500 rounded-r-lg p-4 mb-6">
                    <div className="flex items-start">
                      <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium mb-1">
                          Rich Text Content Editor
                        </p>
                        <p className="text-sm text-blue-700">
                          This content will be displayed exactly as formatted in
                          the "About the Fair" section. Use line breaks and
                          formatting as needed for optimal presentation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Fair Description Content
                    </label>
                    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-700 font-medium">
                            Formatting Guidelines
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span>• Bullet points</span>
                            <span>↵ Line breaks</span>
                            <span>¶ Paragraphs</span>
                          </div>
                        </div>
                      </div>
                      <textarea
                        name="about_fair_content"
                        defaultValue={
                          aboutPageData.section.metadata?.about_fair_content
                        }
                        rows={22}
                        className="w-full border-0 px-4 py-4 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y text-sm leading-relaxed text-gray-800"
                        placeholder="Enter detailed content about the fair..."
                        style={{
                          fontFamily: "system-ui, -apple-system, sans-serif",
                          minHeight: "400px",
                        }}
                      />
                    </div>
                    <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="flex items-center gap-2 text-green-700">
                          <span className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></span>
                          <span className="font-medium">
                            Preserves line breaks
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-700">
                          <span className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></span>
                          <span className="font-medium">
                            Supports bullet points
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-700">
                          <span className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></span>
                          <span className="font-medium">
                            Maintains paragraph spacing
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Update About Page Content
                  </button>
                </div>
              </form>
            </div>

            {/* Feature Boxes Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Feature Boxes Management
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage the 4 feature boxes displayed on the About Us page
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Feature Box 1 - Globe Africa */}
                <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 text-sm font-bold">
                        1
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-green-800">
                      Feature Box 1 (Globe Icon - Green)
                    </h3>
                  </div>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);

                      let imageUrl =
                        aboutItems.find((item) => item.display_order === 1)
                          ?.image_url || "";

                      const imageFile = formData.get("feature1_image") as File;
                      if (imageFile && imageFile.size > 0) {
                        const uploadedUrl = await handleImageUpload(
                          imageFile,
                          0
                        ); // Index 0 for Feature 1
                        if (uploadedUrl) {
                          console.log(
                            "S3 upload successful for feature 1:",
                            uploadedUrl
                          );
                          if (imageUrl) {
                            await handleImageDelete(imageUrl);
                          }
                          imageUrl = uploadedUrl;
                          console.log(
                            "Updated imageUrl for feature 1:",
                            imageUrl
                          );
                        } else {
                          return;
                        }
                      }

                      try {
                        setIsLoading(true); // Use setIsLoading here

                        let existingItem = aboutItems.find(
                          (item) => item.display_order === 1
                        );

                        const itemData = {
                          title: formData.get("feature1_title") as string,
                          description: formData.get(
                            "feature1_content"
                          ) as string,
                          image_url: imageUrl,
                          display_order: 1,
                          is_active: true,
                          section_id: aboutSection?.id,
                        };

                        console.log(
                          "Feature 1 - Final itemData being sent:",
                          itemData
                        );

                        if (existingItem) {
                          await ContentRepository.updateContentItem(
                            existingItem.id,
                            itemData
                          );
                        } else {
                          await ContentRepository.createContentItem(itemData);
                        }

                        setSuccessMessage(
                          "Feature box 1 updated successfully!"
                        );
                        setShowSuccessDialog(true);
                        await loadAboutPageContent(); // Reload content after update
                      } catch (error) {
                        console.error("Failed to update feature box 1:", error);
                        setErrorMessage("Failed to update feature box 1");
                        setShowErrorDialog(true);
                      } finally {
                        setIsLoading(false); // Use setIsLoading here
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        name="feature1_title"
                        defaultValue={
                          aboutItems.find((item) => item.display_order === 1)
                            ?.title
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="feature1_content"
                        defaultValue={
                          aboutItems.find((item) => item.display_order === 1)
                            ?.description ||
                          "Held annually since 1981, attracting exhibitors and visitors from all over the world."
                        }
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Feature Image (Optional)
                      </label>
                      <input
                        type="file"
                        name="feature1_image"
                        accept="image/*"
                        disabled={isUploading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-indigo-500 disabled:opacity-50"
                      />
                      {isUploading && (
                        <div className="mt-2 text-sm text-blue-600">
                          Uploading image...
                        </div>
                      )}
                      {aboutItems.find((item) => item.display_order === 1)
                        ?.image_url && (
                        <div className="mt-3">
                          <img
                            src={
                              aboutItems.find(
                                (item) => item.display_order === 1
                              )?.image_url
                            }
                            alt="Feature 1 preview"
                            className="w-full max-w-md h-32 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              const imageUrl = aboutItems.find(
                                (item) => item.display_order === 1
                              )?.image_url;
                              if (
                                imageUrl &&
                                (await handleImageDelete(imageUrl))
                              ) {
                                // Update the item to remove image_url
                                const existingItem = aboutItems.find(
                                  (item) => item.display_order === 1
                                );
                                if (existingItem) {
                                  await ContentRepository.updateContentItem(
                                    existingItem.id,
                                    {
                                      ...existingItem,
                                      image_url: undefined,
                                    }
                                  );
                                  await loadAboutPageContent();
                                }
                              }
                            }}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                          >
                            Remove Image
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {isUploading ? "Uploading..." : "Update Feature 1"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Feature Box 2 - Handshake */}
                <div className="border border-gray-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-700 text-sm font-bold">2</span>
                    </div>
                    <h3 className="text-lg font-medium text-red-800">
                      Feature Box 2 (Handshake Icon - Red)
                    </h3>
                  </div>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);

                      let imageUrl =
                        aboutItems.find((item) => item.display_order === 2)
                          ?.image_url || "";

                      // Handle image upload if a new file is selected
                      const imageFile = formData.get("feature2_image") as File;
                      if (imageFile && imageFile.size > 0) {
                        const uploadedUrl = await handleImageUpload(
                          imageFile,
                          1
                        ); // Index 1 for Feature 2
                        if (uploadedUrl) {
                          console.log(
                            "S3 upload successful for feature 2:",
                            uploadedUrl
                          );
                          // Delete old image if it exists
                          if (imageUrl) {
                            await handleImageDelete(imageUrl);
                          }
                          imageUrl = uploadedUrl;
                          console.log(
                            "Updated imageUrl for feature 2:",
                            imageUrl
                          );
                        } else {
                          return; // Stop if upload failed
                        }
                      }

                      try {
                        setIsLoading(true); // Use setIsLoading here
                        let existingItem = aboutItems.find(
                          (item) => item.display_order === 2
                        );

                        const itemData = {
                          title: formData.get("feature2_title") as string,
                          description: formData.get(
                            "feature2_content"
                          ) as string,
                          image_url: imageUrl,
                          display_order: 2,
                          is_active: true,
                          section_id: aboutSection?.id,
                        };

                        console.log(
                          "Feature 2 - Final itemData being sent:",
                          itemData
                        );

                        if (existingItem) {
                          await ContentRepository.updateContentItem(
                            existingItem.id,
                            itemData
                          );
                        } else {
                          await ContentRepository.createContentItem(itemData);
                        }

                        setSuccessMessage(
                          "Feature box 2 updated successfully!"
                        );
                        setShowSuccessDialog(true);
                        await loadAboutPageContent(); // Reload content after update
                      } catch (error) {
                        console.error("Failed to update feature box 2:", error);
                        setErrorMessage("Failed to update feature box 2");
                        setShowErrorDialog(true);
                      } finally {
                        setIsLoading(false); // Use setIsLoading here
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        name="feature2_title"
                        defaultValue={
                          aboutItems.find((item) => item.display_order === 2)
                            ?.title || "Business & Networking"
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="feature2_content"
                        defaultValue={
                          aboutItems.find((item) => item.display_order === 2)
                            ?.description ||
                          "A hub for top organizations, policy makers, and professionals to connect and collaborate."
                        }
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Feature Image (Optional)
                      </label>
                      <input
                        type="file"
                        name="feature2_image"
                        accept="image/*"
                        disabled={isUploading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
                      />
                      {isUploading && (
                        <div className="mt-2 text-sm text-blue-600">
                          Uploading image...
                        </div>
                      )}
                      {aboutItems.find((item) => item.display_order === 2)
                        ?.image_url && (
                        <div className="mt-3">
                          <img
                            src={
                              aboutItems.find(
                                (item) => item.display_order === 2
                              )?.image_url
                            }
                            alt="Feature 2 preview"
                            className="w-full max-w-md h-32 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              const imageUrl = aboutItems.find(
                                (item) => item.display_order === 2
                              )?.image_url;
                              if (
                                imageUrl &&
                                (await handleImageDelete(imageUrl))
                              ) {
                                // Update the item to remove image_url
                                const existingItem = aboutItems.find(
                                  (item) => item.display_order === 2
                                );
                                if (existingItem) {
                                  await ContentRepository.updateContentItem(
                                    existingItem.id,
                                    {
                                      ...existingItem,
                                      image_url: undefined,
                                    }
                                  );
                                  await loadAboutPageContent();
                                }
                              }
                            }}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                          >
                            Remove Image
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {isUploading ? "Uploading..." : "Update Feature 2"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Feature Box 3 - Users */}
                <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 text-sm font-bold">
                        3
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-green-800">
                      Feature Box 3 (Users Icon - Green)
                    </h3>
                  </div>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);

                      let imageUrl =
                        aboutItems.find((item) => item.display_order === 3)
                          ?.image_url || "";

                      // Handle image upload if a new file is selected
                      const imageFile = formData.get("feature3_image") as File;
                      if (imageFile && imageFile.size > 0) {
                        const uploadedUrl = await handleImageUpload(
                          imageFile,
                          2
                        ); // Index 2 for Feature 3
                        if (uploadedUrl) {
                          console.log(
                            "S3 upload successful for feature 3:",
                            uploadedUrl
                          );
                          // Delete old image if it exists
                          if (imageUrl) {
                            await handleImageDelete(imageUrl);
                          }
                          imageUrl = uploadedUrl;
                          console.log(
                            "Updated imageUrl for feature 3:",
                            imageUrl
                          );
                        } else {
                          return; // Stop if upload failed
                        }
                      }

                      try {
                        setIsLoading(true); // Use setIsLoading here
                        let existingItem = aboutItems.find(
                          (item) => item.display_order === 3
                        );

                        const itemData = {
                          title: formData.get("feature3_title") as string,
                          description: formData.get(
                            "feature3_content"
                          ) as string,
                          image_url: imageUrl,
                          display_order: 3,
                          is_active: true,
                          section_id: aboutSection?.id,
                        };

                        console.log(
                          "Feature 3 - Final itemData being sent:",
                          itemData
                        );

                        if (existingItem) {
                          await ContentRepository.updateContentItem(
                            existingItem.id,
                            itemData
                          );
                        } else {
                          await ContentRepository.createContentItem(itemData);
                        }

                        setSuccessMessage(
                          "Feature box 3 updated successfully!"
                        );
                        setShowSuccessDialog(true);
                        await loadAboutPageContent(); // Reload content after update
                      } catch (error) {
                        console.error("Failed to update feature box 3:", error);
                        setErrorMessage("Failed to update feature box 3");
                        setShowErrorDialog(true);
                      } finally {
                        setIsLoading(false); // Use setIsLoading here
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        name="feature3_title"
                        defaultValue={
                          aboutItems.find((item) => item.display_order === 3)
                            ?.title || "Diverse Participation"
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="feature3_content"
                        defaultValue={
                          aboutItems.find((item) => item.display_order === 3)
                            ?.description ||
                          "Open to local and foreign exhibitors, with growing interest and attendance every year."
                        }
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Feature Image (Optional)
                      </label>
                      <input
                        type="file"
                        name="feature3_image"
                        accept="image/*"
                        disabled={isUploading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                      />
                      {isUploading && (
                        <div className="mt-2 text-sm text-blue-600">
                          Uploading image...
                        </div>
                      )}
                      {aboutItems.find((item) => item.display_order === 3)
                        ?.image_url && (
                        <div className="mt-3">
                          <img
                            src={
                              aboutItems.find(
                                (item) => item.display_order === 3
                              )?.image_url
                            }
                            alt="Feature 3 preview"
                            className="w-full max-w-md h-32 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              const imageUrl = aboutItems.find(
                                (item) => item.display_order === 3
                              )?.image_url;
                              if (
                                imageUrl &&
                                (await handleImageDelete(imageUrl))
                              ) {
                                const existingItem = aboutItems.find(
                                  (item) => item.display_order === 3
                                );
                                if (existingItem) {
                                  await ContentRepository.updateContentItem(
                                    existingItem.id,
                                    {
                                      ...existingItem,
                                      image_url: undefined,
                                    }
                                  );
                                  await loadAboutPageContent();
                                }
                              }
                            }}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                          >
                            Remove Image
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {isUploading ? "Uploading..." : "Update Feature 3"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Feature Box 4 - Bullhorn */}
                <div className="border border-gray-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-700 text-sm font-bold">4</span>
                    </div>
                    <h3 className="text-lg font-medium text-red-800">
                      Feature Box 4 (Bullhorn Icon - Red)
                    </h3>
                  </div>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);

                      let imageUrl =
                        aboutItems.find((item) => item.display_order === 4)
                          ?.image_url || "";

                      const imageFile = formData.get("feature4_image") as File;
                      if (imageFile && imageFile.size > 0) {
                        const uploadedUrl = await handleImageUpload(
                          imageFile,
                          3
                        ); // Index 3 for Feature 4
                        if (uploadedUrl) {
                          console.log(
                            "S3 upload successful for feature 4:",
                            uploadedUrl
                          );
                          if (imageUrl) {
                            await handleImageDelete(imageUrl);
                          }
                          imageUrl = uploadedUrl;
                          console.log(
                            "Updated imageUrl for feature 4:",
                            imageUrl
                          );
                        } else {
                          return;
                        }
                      }

                      try {
                        setIsLoading(true); // Use setIsLoading here
                        let existingItem = aboutItems.find(
                          (item) => item.display_order === 4
                        );

                        const itemData = {
                          title: formData.get("feature4_title") as string,
                          description: formData.get(
                            "feature4_content"
                          ) as string,
                          image_url: imageUrl,
                          display_order: 4,
                          is_active: true,
                          section_id: aboutSection?.id,
                        };

                        console.log(
                          "Feature 4 - Final itemData being sent:",
                          itemData
                        );

                        if (existingItem) {
                          await ContentRepository.updateContentItem(
                            existingItem.id,
                            itemData
                          );
                        } else {
                          await ContentRepository.createContentItem(itemData);
                        }

                        setSuccessMessage(
                          "Feature box 4 updated successfully!"
                        );
                        setShowSuccessDialog(true);
                        await loadAboutPageContent(); // Reload content after update
                      } catch (error) {
                        console.error("Failed to update feature box 4:", error);
                        setErrorMessage("Failed to update feature box 4");
                        setShowErrorDialog(true);
                      } finally {
                        setIsLoading(false); // Use setIsLoading here
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        name="feature4_title"
                        defaultValue={
                          aboutItems.find((item) => item.display_order === 4)
                            ?.title || "Wide Publicity"
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="feature4_content"
                        defaultValue={
                          aboutItems.find((item) => item.display_order === 4)
                            ?.description
                        }
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Feature Image (Optional)
                      </label>
                      <input
                        type="file"
                        name="feature4_image"
                        accept="image/*"
                        disabled={isUploading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
                      />
                      {isUploading && (
                        <div className="mt-2 text-sm text-blue-600">
                          Uploading image...
                        </div>
                      )}
                      {aboutItems.find((item) => item.display_order === 4)
                        ?.image_url && (
                        <div className="mt-3">
                          <img
                            src={
                              aboutItems.find(
                                (item) => item.display_order === 4
                              )?.image_url
                            }
                            alt="Feature 4 preview"
                            className="w-full max-w-md h-32 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              const imageUrl = aboutItems.find(
                                (item) => item.display_order === 4
                              )?.image_url;
                              if (
                                imageUrl &&
                                (await handleImageDelete(imageUrl))
                              ) {
                                const existingItem = aboutItems.find(
                                  (item) => item.display_order === 4
                                );
                                if (existingItem) {
                                  await ContentRepository.updateContentItem(
                                    existingItem.id,
                                    {
                                      ...existingItem,
                                      image_url: undefined,
                                    }
                                  );
                                  await loadAboutPageContent();
                                }
                              }
                            }}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                          >
                            Remove Image
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {isUploading ? "Uploading..." : "Update Feature 4"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPageManagement;
