import React from 'react';
import { 
  ClockIcon, 
  SparklesIcon, 
  RocketLaunchIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { FaRegSmile, FaRegLightbulb, FaRegStar } from 'react-icons/fa';

interface ComingSoonProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'feature' | 'section';
  showProgress?: boolean;
  progressPercentage?: number;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  title = "Coming Soon",
  description = "We're working hard to bring you something amazing. Stay tuned!",
  icon,
  variant = 'default',
  showProgress = false,
  progressPercentage = 75
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'feature':
        return {
          container: "bg-gradient-to-br from-red-50 to-pink-50 border border-red-200",
          icon: "text-red-600",
          title: "text-red-900",
          description: "text-red-700"
        };
      case 'section':
        return {
          container: "bg-gradient-to-br from-green-50 to-red-50 border border-green-200",
          icon: "text-green-600",
          title: "text-green-900",
          description: "text-green-700"
        };
      default:
        return {
          container: "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200",
          icon: "text-green-600",
          title: "text-green-900",
          description: "text-green-700"
        };
    }
  };

  const styles = getVariantStyles();

  const defaultIcon = (
    <div className="relative">
      <RocketLaunchIcon className="w-16 h-16 animate-bounce" />
      <SparklesIcon className="w-6 h-6 absolute -top-2 -right-2 text-yellow-500 animate-pulse" />
    </div>
  );

  return (
    <div className={`rounded-2xl p-8 text-center ${styles.container} shadow-lg`}>
      {/* Floating Elements */}
      <div className="relative overflow-hidden">
        <div className="absolute top-4 left-4 opacity-20">
          <FaRegStar className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute top-8 right-6 opacity-20">
          <FaRegLightbulb className="w-4 h-4 animate-pulse" />
        </div>
        <div className="absolute bottom-6 left-8 opacity-20">
          <FaRegSmile className="w-4 h-4 animate-bounce" style={{ animationDuration: '2s' }} />
        </div>
        <div className="absolute bottom-4 right-4 opacity-20">
          <HeartIcon className="w-4 h-4 animate-pulse" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className={`mx-auto mb-6 ${styles.icon}`}>
          {icon || defaultIcon}
        </div>

        {/* Title */}
        <h2 className={`text-3xl font-bold mb-4 ${styles.title}`}>
          {title}
        </h2>

        {/* Description */}
        <p className={`text-lg mb-6 ${styles.description} max-w-md mx-auto`}>
          {description}
        </p>

        {/* Progress Bar (if enabled) */}
        {showProgress && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Development Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-red-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white/50 rounded-lg p-4 backdrop-blur-sm">
            <ClockIcon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            <h3 className="font-semibold text-gray-800 mb-1">In Development</h3>
            <p className="text-sm text-gray-600">Our team is working hard</p>
          </div>
          <div className="bg-white/50 rounded-lg p-4 backdrop-blur-sm">
            <SparklesIcon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            <h3 className="font-semibold text-gray-800 mb-1">Amazing Features</h3>
            <p className="text-sm text-gray-600">Something special is brewing</p>
          </div>
          <div className="bg-white/50 rounded-lg p-4 backdrop-blur-sm">
            <RocketLaunchIcon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            <h3 className="font-semibold text-gray-800 mb-1">Launch Soon</h3>
            <p className="text-sm text-gray-600">Get ready for takeoff</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8">
          <button className="bg-gradient-to-r from-green-500 to-red-500 hover:from-green-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
            <ClockIcon className="w-5 h-5 inline mr-2" />
            Stay Updated
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon; 