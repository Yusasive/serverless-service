import React, { useState, useEffect } from "react";
import { User } from "../../../types/user.type";
import { UserController } from "../../../controllers/UserController";
import { useUser } from "../../../context/UserContext";
import ResetPasswordModal from "../../../components/common/ResetPasswordModal";
import SuccessDialog from "../../../components/common/SuccessDialog";

interface AccountSettingsProps {
  user: User;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user }) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.twoFactorEnabled ?? false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { refreshUser } = useUser();
  const userController = UserController.getInstance();

  useEffect(() => {
    setTwoFactorEnabled(user.twoFactorEnabled ?? false);
  }, [user.twoFactorEnabled]);

  const handleTwoFactorToggle = async () => {
    setIsUpdating(true);
    try {
      const newValue = !twoFactorEnabled;
      const result = await userController.updateTwoFactor(newValue);
      
      if (result.success) {
        setTwoFactorEnabled(newValue);
        await refreshUser();
      } else {
        console.error('Failed to update two-factor authentication:', result.error);

      }
    } catch (error) {
      console.error('Error updating two-factor authentication:', error);

    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetPassword = async (oldPassword: string, newPassword: string) => {
    try {
      const result = await userController.changePassword(oldPassword, newPassword);
      
      if (result.success) {
        setShowResetPasswordModal(false);
        setShowSuccessDialog(true);
      } else {
        throw new Error(result.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-5xl mx-auto space-y-12">
      {/* ACCOUNT SECTION */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">User Name</label>
            <input
              value={`${user.firstName} ${user.lastName}`}
              readOnly
              className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              value={user.email}
              readOnly
              className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">Verification Options</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input 
                  type="checkbox" 
                  className="accent-primary" 
                  defaultChecked
                  disabled
                /> 
                Email
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY SECTION */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Security Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Login Verification</label>
            <span className="text-sm text-gray-500">Standard verification enabled</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Two-Factor Authentication</label>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={twoFactorEnabled}
                  onChange={handleTwoFactorToggle}
                  disabled={isUpdating}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
              <span className="text-sm text-gray-500">
                {twoFactorEnabled ? '2FA is currently enabled' : '2FA is currently disabled'}
                {isUpdating && <span className="text-xs text-gray-400 ml-2">(Updating...)</span>}
              </span>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">Additional Setup Options</label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="accent-primary" /> Require Personal Details
            </label>
          </div>
        </div>
      </section>

      {/* NOTIFICATION SECTION */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Notifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">Notification Preferences</label>
            <div className="flex flex-col gap-3 text-sm text-gray-700">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-primary" /> Allow all Notifications
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-primary" /> Disable all Notifications
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-primary" /> Notification Sounds
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIONS */}
      <div className="flex justify-end gap-4 border-t pt-6">
        {/* <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium">
          Deactivate Account
        </button> */}
        <button 
          onClick={() => setShowResetPasswordModal(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          Change Password
        </button>
      </div>

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        onClose={() => setShowResetPasswordModal(false)}
        onSubmit={handleResetPassword}
      />

      <SuccessDialog
        isOpen={showSuccessDialog}
        message="Password changed successfully"
        onRedirect={() => {
          userController.logout();
          window.location.href = '/login';
        }}
        autoRedirect={true}
        buttonText="Continue"
      />
    </div>
  );
};

export default AccountSettings;
