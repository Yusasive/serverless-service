import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaBars, FaTimes, FaUserCircle, FaChevronDown, FaThLarge, FaSpinner } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserController } from '../../controllers/UserController';
import { useUser } from '@/context/UserContext';

interface NavigationHeaderProps {
  isAuthenticated: boolean;
}

const Navbar: React.FC<NavigationHeaderProps> = ({ isAuthenticated }) => {
  const { setUser } = useUser();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userController = UserController.getInstance();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const handleGetStarted = () => navigate('/help');
  const handleProfile = () => {
    if (user?.userType === 'EXHIBITOR') {
      navigate('/exhibitor/profile');
    } else if (user?.userType === 'ATTENDEE') {
      navigate('/attendee/profile');
    } else if (user?.userType === 'STAFF') {
      navigate('/staff/profile');
    }
  };

  const handleDashboard = () => {
    if (user?.userType === 'EXHIBITOR') {
      navigate('/exhibitor/dashboard');
    } else if (user?.userType === 'ATTENDEE') {
      navigate('/attendee/dashboard');
    } else if (user?.userType === 'STAFF') {
      navigate('/staff/dashboard');
    }
  };
  
  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await userController.logout();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleEvent = () => {
    if (location.pathname === '/') {
      const eventSection = document.getElementById('event-section');
      if (eventSection) {
        eventSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollToEvent: true } });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Event", onClick: handleEvent },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center mr-12">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-3 group"
              >
                <img 
                  src="/images/litf_logo.png" 
                  alt="Logo" 
                  className="w-20 h-15 transition-transform duration-200 group-hover:scale-105" 
                />
                <span className="hidden sm:block text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                  LITF
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick ? item.onClick : () => navigate(item.href)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Button */}
              <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200">
                <FaSearch className="w-4 h-4" />
              </button>

              {isAuthenticated ? (
                /* Authenticated User Menu */
                <div className="relative" ref={profileMenuRef}>
                  <button 
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <FaUserCircle className="text-white text-lg" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium">Account</span>
                    <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleProfile}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                      >
                        <FaUserCircle className="w-4 h-4 mr-3" />
                        Profile Settings
                      </button>
                      <button
                        onClick={handleDashboard}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                      >
                        <FaThLarge className="w-4 h-4 mr-3" />
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
                        disabled={isSigningOut}
                      >
                        {isSigningOut ? (
                          <FaSpinner className="w-4 h-4 mr-3 animate-spin" />
                        ) : (
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        )}
                        {isSigningOut ? 'Signing out...' : 'Sign Out'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest User Actions */
                <div className="hidden sm:flex items-center space-x-3">
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => navigate('/select-role')}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Get Started Button */}
              {/* <button 
                onClick={handleGetStarted}
                className="hidden md:flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm"
              >
                Get Started
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button> */}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="bg-white border-t border-gray-100 px-4 py-4 space-y-2">
            {/* Mobile Navigation Links */}
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else {
                    navigate(item.href);
                  }
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                {item.label}
              </button>
            ))}

            {/* Mobile Auth Actions */}
            {!isAuthenticated && (
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <button 
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-red-500 border border-gray-200 hover:border-red-300 rounded-lg transition-all duration-200"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => {
                    navigate('/select-role');
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-all duration-200"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Get Started */}
            <div className="pt-2">
              <button 
                onClick={() => {
                  handleGetStarted();
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
              >
                Get Started
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;