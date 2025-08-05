import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import QRCodePopup from '@/components/common/QRCodePopup';
import { 
  QrCodeIcon, 
  UserPlusIcon, 
  CheckIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { 
  FaQrcode, 
  FaUserFriends, 
  FaShareAlt, 
  FaCopy,
  FaWhatsapp,
  FaTelegram,
  FaTwitter,
  FaFacebook
} from 'react-icons/fa';

interface InvitationLink {
  id: string;
  url: string;
  createdAt: Date;
  clicks: number;
}

const OverviewTab: React.FC = () => {
  const { user } = useUser();
  const [showQRCode, setShowQRCode] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [invitationLinks, setInvitationLinks] = useState<InvitationLink[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Generate visitor QR code data
  const generateVisitorQRData = () => {
    if (!user) return null;
    
    return {
      type: 'visitor',
      visitorId: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      timestamp: new Date().toISOString(),
      event: 'LITF 2025',
      location: user.address?.[0]?.city || 'Lagos, Nigeria'
    };
  };

  // Generate invitation link
  const generateInvitationLink = () => {
    const baseUrl = window.location.origin;
    const referralCode = `REF-${user?._id}-${Date.now().toString(36)}`;
    const invitationUrl = `${baseUrl}/register?ref=${referralCode}&role=ATTENDEE`;
    
    const newLink: InvitationLink = {
      id: referralCode,
      url: invitationUrl,
      createdAt: new Date(),
      clicks: 0
    };
    
    setInvitationLinks(prev => [newLink, ...prev]);
    return newLink;
  };

  // Copy link to clipboard
  const copyToClipboard = async (text: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(linkId);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // Share via social media
  const shareViaSocial = (platform: string, url: string, text: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    };
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  // Mock referral statistics (in a real app, this would come from the backend)
  const referralStats = {
    totalInvites: invitationLinks.length,
    successfulRegistrations: Math.floor(invitationLinks.length * 0.3), // 30% conversion rate
    totalClicks: invitationLinks.reduce((sum, link) => sum + link.clicks, 0),
    rewardsEarned: Math.floor(invitationLinks.length * 0.3 * 100) // ₦100 per successful registration
  };

  const qrData = generateVisitorQRData();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to LITF 2025, {user?.firstName}!
            </h2>
            <p className="text-gray-600 mb-4">
              Get ready for an amazing trade fair experience. Generate your QR code and invite friends to join!
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span>April 11, 2025</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 mr-1" />
                <span>Lagos International Trade Fair Complex</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                <span>10:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Code Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaQrcode className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Your QR Code</h3>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            Generate your personal QR code for easy check-in at the trade fair. This code contains your visitor information.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => setShowQRCode(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <QrCodeIcon className="w-5 h-5 mr-2" />
              Generate QR Code
            </button>
            
            <div className="text-xs text-gray-500 text-center">
              Your QR code will be scanned at the entrance for quick registration
            </div>
          </div>
        </div>

        {/* Invite Friends Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaUserFriends className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Invite Friends</h3>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            Share your invitation link with friends and family. Help them join the amazing LITF 2025 experience!
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => setShowInviteDialog(true)}
              className="w-full bg-gradient-to-r from-green-500 to-red-500 hover:from-green-600 hover:to-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              <UserPlusIcon className="w-5 h-5 mr-2" />
              Create Invitation Link
            </button>
            
            <div className="text-xs text-gray-500 text-center">
              Earn rewards for each friend who registers using your link
            </div>
          </div>
        </div>
      </div>

      {/* Invitation Links History */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaShareAlt className="w-5 h-5 mr-2 text-red-600" />
          Your Invitation Links
        </h3>
        
        {invitationLinks.length > 0 ? (
          <div className="space-y-4">
            {invitationLinks.map((link) => (
              <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">Link #{link.id.slice(-6)}</span>
                    <span className="text-xs text-gray-500">
                      Created {link.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {link.clicks} clicks
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="text"
                    value={link.url}
                    readOnly
                    className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded px-3 py-2"
                  />
                  <button
                    onClick={() => copyToClipboard(link.url, link.id)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                    title="Copy link"
                  >
                    {copiedLink === link.id ? (
                      <CheckIcon className="w-4 h-4 text-green-600" />
                    ) : (
                      <FaCopy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Share via:</span>
                  <button
                    onClick={() => shareViaSocial('whatsapp', link.url, 'Join me at LITF 2025! Use my invitation link:')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                    title="Share on WhatsApp"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => shareViaSocial('telegram', link.url, 'Join me at LITF 2025! Use my invitation link:')}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Share on Telegram"
                  >
                    <FaTelegram className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => shareViaSocial('twitter', link.url, 'Join me at LITF 2025! Use my invitation link:')}
                    className="p-2 text-blue-400 hover:bg-blue-50 rounded transition-colors"
                    title="Share on Twitter"
                  >
                    <FaTwitter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => shareViaSocial('facebook', link.url, 'Join me at LITF 2025! Use my invitation link:')}
                    className="p-2 text-blue-700 hover:bg-blue-50 rounded transition-colors"
                    title="Share on Facebook"
                  >
                    <FaFacebook className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto mb-4 w-16 h-16 text-gray-300">
              <FaShareAlt className="w-full h-full" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700">No invitation links yet</h4>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              Create an invitation link from the "Invite Friends" card to share with others. Your links will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Referral Statistics */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaUserFriends className="w-5 h-5 mr-2 text-red-600" />
          Referral Statistics
        </h3>
        
        {invitationLinks.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{referralStats.totalInvites}</div>
                <div className="text-sm text-gray-600">Total Invites</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{referralStats.successfulRegistrations}</div>
                <div className="text-sm text-gray-600">Registrations</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{referralStats.totalClicks}</div>
                <div className="text-sm text-gray-600">Total Clicks</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">₦{referralStats.rewardsEarned}</div>
                <div className="text-sm text-gray-600">Rewards Earned</div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-red-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">🎉 Referral Rewards Program</h4>
              <p className="text-sm text-green-700">
                Earn ₦100 for each friend who successfully registers using your invitation link. 
                Rewards can be used for event merchandise or future registrations!
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto mb-4 w-16 h-16 text-gray-300">
              <FaUserFriends className="w-full h-full" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700">Start inviting friends to see your stats!</h4>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              Your referral statistics and rewards will appear here once your links are used.
            </p>
             <button
              onClick={() => setShowInviteDialog(true)}
              className="mt-6 bg-gradient-to-r from-green-500 to-red-500 hover:from-green-600 hover:to-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
            >
              <UserPlusIcon className="w-5 h-5 mr-2" />
              Create Your First Invitation Link
            </button>
          </div>
        )}
      </div>

      {/* Event Information */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">What to Expect</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Network with industry leaders and professionals</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Explore innovative products and services</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Attend informative seminars and workshops</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Discover new business opportunities</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Important Reminders</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Bring your QR code for quick entry</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Arrive 30 minutes before the event starts</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Bring business cards for networking</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Check the event schedule for updates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* QR Code Popup */}
      <QRCodePopup
        isOpen={showQRCode}
        onClose={() => setShowQRCode(false)}
        data={qrData}
        title="Your Visitor QR Code"
        size={300}
      />

      {/* Invitation Dialog */}
      {showInviteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Invite Friends
              </h2>
              <button
                onClick={() => setShowInviteDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Create a unique invitation link to share with your friends and family. They'll get a special registration experience!
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => {
                    const newLink = generateInvitationLink();
                    copyToClipboard(newLink.url, newLink.id);
                    setShowInviteDialog(false);
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-red-500 hover:from-green-600 hover:to-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
                >
                  Generate & Copy Link
                </button>
                
                <div className="text-center">
                  <button
                    onClick={() => setShowInviteDialog(false)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
