import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import NavigationHeader from "../components/navigation/NavigationHeader";
import HeroSection from "../components/layouts/HeroSection";
import FooterSection from "../components/layouts/FooterSection";
import AboutSection from "../components/layouts/AboutSection";
import EventSection from "../components/layouts/EventSection";
import { useUser } from "@/context/UserContext";
import { useLocation } from "react-router-dom";
import TestimonialsSection from "../components/layouts/TestimonialSection";
import FeatureSection from "../components/layouts/FeatureSection";

export default function Home() {
  const { user } = useUser();
  const [showScroll, setShowScroll] = useState(false);
  const isAuthenticated = !!user;
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.state?.scrollToEvent) {
      document
        .getElementById("event-section")
        ?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (location.state?.scrollToTestimonials) {
      document
        .getElementById("testimonial-section")
        ?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pt-[72px]">
      <NavigationHeader isAuthenticated={isAuthenticated} />
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeatureSection />

      {/* Event Section */}
      <EventSection />

      {/* About Section */}
      <AboutSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Footer CTA */}
      <FooterSection />

      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg z-50"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
