import React, { useState, useEffect } from "react";
import { ContentRepository } from "../../../repository/ContentRepository";
import { ContentSection } from "../../../repository/ContentRepository";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import SuccessDialog from "../../../components/common/SuccessDialog";
import ErrorDialog from "../../../components/common/ErrorDialog";

const FooterManagement: React.FC = () => {
  const [footerData, setFooterData] = useState<{
    section: ContentSection | null;
  }>({ section: null });
  const [loading, setLoading] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadFooterContent();
  }, []);

  const loadFooterContent = async () => {
    try {
      setLoading(true);
      const data = await ContentRepository.getFooterContent();
      setFooterData(data);
    } catch (error) {
      console.error("Failed to load footer content:", error);
      setErrorMessage("Failed to load footer content");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const updateFooterSection = async (sectionData: any) => {
    try {
      setLoading(true);
      if (footerData.section) {
        await ContentRepository.updateContentSection(
          footerData.section.id,
          sectionData
        );
        setSuccessMessage("Footer content updated successfully!");
        setShowSuccessDialog(true);
        await loadFooterContent();
      }
    } catch (error) {
      console.error("Failed to update footer content:", error);
      setErrorMessage("Failed to update footer content");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !footerData.section) {
    return (
      <LoadingOverlay isLoading={true} message="Loading footer content..." />
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
            Footer Content Management
          </h1>
          <p className="text-gray-600">
            Manage footer information, contact details, and social media links
          </p>
        </div>

        {footerData.section && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Footer Information
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const sectionData = {
                  title: formData.get("title") as string,
                  content: formData.get("content") as string,
                  metadata: {
                    copyright_text: formData.get("copyright_text") as string,
                    address: formData.get("address") as string,
                    phone: formData.get("phone") as string,
                    email: formData.get("email") as string,
                    social_links: {
                      facebook: formData.get("facebook") as string,
                      twitter: formData.get("twitter") as string,
                      linkedin: formData.get("linkedin") as string,
                      instagram: formData.get("instagram") as string,
                    },
                  },
                  is_active: footerData.section?.is_active || true,
                  display_order: footerData.section?.display_order || 10,
                };
                updateFooterSection(sectionData);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={footerData.section.title}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={footerData.section.metadata?.phone || ""}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Description
                </label>
                <textarea
                  name="content"
                  defaultValue={footerData.section.content}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Copyright Text
                </label>
                <input
                  type="text"
                  name="copyright_text"
                  defaultValue={
                    footerData.section.metadata?.copyright_text || ""
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  defaultValue={footerData.section.metadata?.address || ""}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={footerData.section.metadata?.email || ""}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Social Media Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      defaultValue={
                        footerData.section.metadata?.social_links?.facebook ||
                        ""
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://facebook.com/lagoschamber"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      defaultValue={
                        footerData.section.metadata?.social_links?.twitter || ""
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://twitter.com/lagoschamber"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      defaultValue={
                        footerData.section.metadata?.social_links?.linkedin ||
                        ""
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://linkedin.com/company/lagoschamber"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      defaultValue={
                        footerData.section.metadata?.social_links?.instagram ||
                        ""
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://instagram.com/lagoschamber"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Update Footer Content
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default FooterManagement;
