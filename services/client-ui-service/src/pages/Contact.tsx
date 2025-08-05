import React, { useState, useEffect } from "react";
import NavigationHeader from "@/components/navigation/NavigationHeader";
import { useUser } from "@/context/UserContext";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaGlobe,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import FooterSection from "@/components/layouts/FooterSection";
import { ContentRepository } from "@/repository/ContentRepository";
import LoadingOverlay from "@/components/common/LoadingOverlay";

interface ContactContent {
  section: {
    id: string;
    title: string;
    content: string;
    metadata?: {
      main_office?: {
        address: string;
        phone: string;
        email: string;
        working_hours: string;
      };
      support_office?: {
        address: string;
        phone: string;
        email: string;
        working_hours: string;
      };
    };
  } | null;
  items: any[];
}

const Contact: React.FC = () => {
  const { user } = useUser();
  const [contactContent, setContactContent] = useState<ContactContent>({
    section: null,
    items: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContactContent();
  }, []);

  const loadContactContent = async () => {
    try {
      setLoading(true);
      const data = await ContentRepository.getContentBySection("contact-page");
      setContactContent(data);
    } catch (error) {
      console.error("Failed to load contact content:", error);
      // Fallback to default content if CMS fails
      setContactContent({ section: null, items: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <NavigationHeader isAuthenticated={!!user} />

      <LoadingOverlay
        isLoading={loading}
        message="Loading contact information..."
      />

      {/* Hero Section */}
      <div className="relative w-full h-80 flex items-center justify-center bg-gradient-to-r from-green-900/90 to-green-700/80">
        <div className="absolute inset-0 bg-[url('/images/background1.png')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-extrabold mb-2 drop-shadow-lg">
            {contactContent.section?.title || "Contact Us"}
          </h1>
          <p className="text-lg md:text-2xl font-medium max-w-2xl mx-auto drop-shadow">
            {contactContent.section?.content ||
              "We're here to help you connect, exhibit, and grow at the Lagos International Trade Fair."}
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <section className="max-w-2xl mx-auto -mt-16 bg-white rounded-3xl shadow-xl p-8 md:p-12 relative z-20">
        {/* Main Office Information */}
        {contactContent.section?.metadata?.main_office && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-green-800">
              Main Office Contact
            </h2>
            <div className="mb-4">
              <p className="mb-1">
                {contactContent.section.metadata.main_office.address}
              </p>
            </div>
            <div className="mb-8 flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex items-start gap-4">
                <FaPhoneAlt className="text-green-700 text-2xl mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">Phone</h3>
                  <p className="mb-2">
                    {contactContent.section.metadata.main_office.phone}
                  </p>
                </div>
              </div>
              <div className="flex-1 flex items-start gap-4">
                <FaEnvelope className="text-red-500 text-2xl mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">Email</h3>
                  <a
                    href={`mailto:${contactContent.section.metadata.main_office.email}`}
                    className="text-primary-700 hover:underline"
                  >
                    {contactContent.section.metadata.main_office.email}
                  </a>
                </div>
              </div>
            </div>
            {contactContent.section.metadata.main_office.working_hours && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Working Hours</h3>
                <p>
                  {contactContent.section.metadata.main_office.working_hours}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Support Office Information */}
        {contactContent.section?.metadata?.support_office && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-green-800">
              Support Office Contact
            </h2>
            <div className="mb-4">
              <p className="mb-1">
                {contactContent.section.metadata.support_office.address}
              </p>
            </div>
            <div className="mb-8 flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex items-start gap-4">
                <FaPhoneAlt className="text-green-700 text-2xl mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">Phone</h3>
                  <p className="mb-2">
                    {contactContent.section.metadata.support_office.phone}
                  </p>
                </div>
              </div>
              <div className="flex-1 flex items-start gap-4">
                <FaEnvelope className="text-red-500 text-2xl mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">Email</h3>
                  <a
                    href={`mailto:${contactContent.section.metadata.support_office.email}`}
                    className="text-primary-700 hover:underline"
                  >
                    {contactContent.section.metadata.support_office.email}
                  </a>
                </div>
              </div>
            </div>
            {contactContent.section.metadata.support_office.working_hours && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Working Hours</h3>
                <p>
                  {contactContent.section.metadata.support_office.working_hours}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Fallback content if no CMS data */}
        {!contactContent.section && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-green-800">
              Trade Promotion Contact
            </h2>
            <p className="mb-1">The Director, Trade Promotion</p>
            <p className="mb-1">Lagos Chamber of Commerce and Industry</p>
            <p className="mb-1">1st Floor, Commerce House</p>
            <p className="mb-1">
              1, Idowu Taylor Street, Victoria Island, Lagos.
            </p>
            <div className="mb-8 flex flex-col md:flex-row gap-8 mt-4">
              <div className="flex-1 flex items-start gap-4">
                <FaPhoneAlt className="text-green-700 text-2xl mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">Phone</h3>
                  <p className="mb-2">0700LAGOSCHAMBER (07005246724)</p>
                </div>
              </div>
              <div className="flex-1 flex items-start gap-4">
                <FaEnvelope className="text-red-500 text-2xl mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">Email</h3>
                  <a
                    href="mailto:litf@lagoschamber.com"
                    className="text-primary-700 hover:underline"
                  >
                    litf@lagoschamber.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Social Media</h3>
          <div className="flex items-center gap-6">
            <a
              href="https://facebook.com/lagosinternationaltradefair"
              className="flex items-center gap-2 text-blue-700 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="text-2xl" /> Facebook
            </a>
            <a
              href="https://instagram.com/lagos_tradefair"
              className="flex items-center gap-2 text-pink-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-2xl" /> Instagram
            </a>
          </div>
          <div className="flex items-center gap-6 mt-2">
            <a
              href="https://x.com/lagos_tradefair"
              className="flex items-center gap-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaXTwitter className="text-2xl" /> X.com
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Websites</h3>
          <div className="flex flex-col gap-2">
            <a
              href="https://www.lagosinternationaltradefair.com"
              className="flex items-center gap-2 text-green-700 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGlobe className="text-2xl" />{" "}
              www.lagosinternationaltradefair.com
            </a>
            <a
              href="https://www.lagoschamber.com"
              className="flex items-center gap-2 text-green-700 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGlobe className="text-2xl" /> www.lagoschamber.com
            </a>
          </div>
        </div>
      </section>
      <FooterSection />
    </div>
  );
};

export default Contact;
