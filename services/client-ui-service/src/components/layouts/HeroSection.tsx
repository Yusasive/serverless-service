import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import { calculateTimeLeft } from "../../utils/utils";
import {
  ContentItem,
  ContentSection,
  ContentRepository,
} from "../../repository/ContentRepository";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const HeroSection: React.FC = () => {
  const [section, setSection] = useState<ContentSection | null>(null);
  const [slides, setSlides] = useState<ContentItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const navigate = useNavigate();

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      const response = await ContentRepository.getHeroContent();
      if (response?.section) {
        setSection(response.section);
      }

      const activeSlides =
        response?.items?.filter((item: ContentItem) => item.is_active) || [];

      setSlides(activeSlides);
    } catch (error) {
      console.error("Failed to load hero content:", error);
    }
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBookBoothClick = () => {
    navigate("/select-role");
  };

  if (slides.length === 0) return null;

  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between min-h-[90vh] py-8 md:py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white px-6 md:px-16 overflow-x-hidden">
      <div className="flex-1 z-10 max-w-xl mb-8 md:mb-0">
        {/* {section && (
          <div className="mb-6 md:mb-10 text-center md:text-left">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-100">
              {section.title}
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-300">
              {section.content}
            </p>
          </div>
        )} */}

        {/* Slide Content */}
        <div className="relative h-[300px] overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute w-full transition-all duration-1000 ${
                current === index
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-full"
              }`}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {slide.title}{" "}
                <span className="bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                  {slide.metadata?.highlight || ""}
                </span>
                <br />
                {slide.metadata?.subtitle}
              </h1>
              <p className="text-base md:text-lg mt-4 text-gray-300">
                {slide.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 md:mt-8">
          <div className="flex items-center text-sm md:text-lg mb-4 flex-wrap">
            <FaCalendarAlt className="mr-2 text-primary-400 flex-shrink-0" />
            <span className="break-words">
              {section?.metadata?.event_date} • {section?.metadata?.location}
            </span>
          </div>

          <div className="bg-black bg-opacity-60 px-2 py-3 md:p-6 rounded-2xl flex gap-2 md:gap-6 text-center shadow-lg w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto">
            {["Days", "Hours", "Minutes", "Seconds"].map((label, i) => {
              const value = [
                timeLeft.days,
                timeLeft.hours,
                timeLeft.minutes,
                timeLeft.seconds,
              ][i];
              return (
                <div key={label} className="flex-1 min-w-0">
                  <p
                    className={`text-lg sm:text-2xl md:text-4xl lg:text-5xl font-extrabold drop-shadow-lg ${
                      label === "Days" ? "text-red-500" : "text-primary-500"
                    }`}
                  >
                    {value}
                  </p>
                  <p className="uppercase text-[10px] sm:text-xs md:text-lg font-semibold tracking-wider">
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleBookBoothClick}
          className="mt-6 border-2 border-primary-500 text-white hover:bg-primary-700 px-6 py-3 rounded-full md:text-base font-bold"
        >
          {section?.metadata?.button_text || "Register as a Participant →"}
        </button>
      </div>

      <div className="hidden md:flex flex-1 justify-center items-center z-10">
        <div className="relative w-[500px] h-[400px] lg:w-[650px] lg:h-[500px] xl:w-[750px] xl:h-[600px] overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ${
                current === index
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-full"
              }`}
            >
              <div
                className={`w-full h-full overflow-hidden shadow-xl ${
                  index === 0
                    ? "rounded-[40%] border-4 border-primary-600 rotate-6"
                    : index === 1
                      ? "rounded-[30%] border-4 border-primary-500 rotate-12"
                      : "rounded-[20%] border-4 border-primary-400 -rotate-12"
                }`}
              >
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-0 left-0 w-full h-full border-[3px] ${
                    index === 0
                      ? "border-primary-400 rounded-[40%] animate-spin-slow"
                      : index === 1
                        ? "border-primary-300 rounded-[30%] animate-spin-slow"
                        : "border-primary-200 rounded-[20%] animate-bounce-slow"
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
