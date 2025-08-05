import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserController } from "@/controllers/UserController";
import { attendeeProfileSchema, exhibitorProfileSchema, ProfileFormData } from "@/types/formSchemas";
import { z } from "zod";
import ErrorDialog from "@/components/common/ErrorDialog";
import SuccessDialog from "@/components/common/SuccessDialog";
import { CreateUserProfileRequest } from "../../../repository/UserRepository";
import { useUser } from "@/context/UserContext";
import { User } from "@/types/user.type";
import { countriesList, getStatesForCountry, getCountryCodeByName } from "@/data/countries";
import PhoneInput from "@/components/common/PhoneInput";


interface CompleteProfileProps {
  onComplete: () => void;
  isExhibitor?: boolean;
}

export default function CompleteProfile({ onComplete, isExhibitor = false }: CompleteProfileProps) {
  const { setUser, user } = useUser();
  const userController = UserController.getInstance();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    email: user?.email || "",
    phone: user?.phone || "",
    company: user?.company || "",
    local: user?.local || "",
    boothPreference: user?.boothPreference || "",
    boothType: user?.boothType || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState("");
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successDialogMessage, setSuccessDialogMessage] = useState("");

  // Get available states based on selected country
  const availableStates = formData.country ? getStatesForCountry(getCountryCodeByName(formData.country)) : [];

  const getBoothTypeOptions = () => {
    return [
      'Food, Drinks, Agriculture & Allied Products',
      'Real Estate, Building Furniture & Fittings',
      'ICT & Electronics Products',
      'Corporate Organizations & Government Agencies',
      'Household Cosmetics & Textile Products',
      'Transport and Allied/Power Products',
      'Conglomerate',
      'Publication, Healthcare & Sport Products',
      'Commercial Premium',
      // Add more booth types as needed 
    ];
  };

  const boothTypeOptions = getBoothTypeOptions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Use appropriate schema based on user type
      if (isExhibitor) {
        const validatedData = exhibitorProfileSchema.parse(formData);
        await submitProfile(validatedData);
      } else {
        const validatedData = attendeeProfileSchema.parse(formData);
        await submitProfile(validatedData);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ submit: "Failed to update profile. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitProfile = async (validatedData: any) => {
    if (!user) {
      setIsErrorDialogOpen(true);
      setErrorDialogMessage("Session expired. Please log in again.");
      return;
    }

    const updatedUser: CreateUserProfileRequest = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      address: validatedData.address,
      city: validatedData.city,
      state: validatedData.state,
      country: validatedData.country,
      local: validatedData.local,
      boothPreference: validatedData.boothPreference,
      boothType: validatedData.boothType,
      email: user.email,
      phone: user.phone,
      user_type: user.userType,
    };

    const response = await userController.createProfile(updatedUser);
    if (response.success && response.data) {
      const updatedUserData: User = {
        ...response.data,
      };

      setUser(updatedUserData);
      setSuccessDialogMessage("Profile updated successfully");
      setIsSuccessDialogOpen(true);
    } else {
      setErrors({ submit: response.error || "Failed to update profile. Please try again." });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };
      
      // Reset state when country changes
      if (name === 'country') {
        newData.state = '';
      }
      
      return newData;
    });
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Memoize the phone onChange function to prevent infinite re-renders
  const handlePhoneChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: "" }));
    }
  }, [errors.phone]);

  const handleSuccessDialogClose = () => {
    setIsSuccessDialogOpen(false);
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 p-4" style={{ paddingTop: 'calc(2rem + 5vh)' }}>
      <ErrorDialog
        message={errorDialogMessage}
        isOpen={isErrorDialogOpen}
        onClose={() => setIsErrorDialogOpen(false)}
      />
      <SuccessDialog
        message={successDialogMessage}
        isOpen={isSuccessDialogOpen}
        onRedirect={handleSuccessDialogClose}
        autoRedirect={true}
        buttonText="Continue"
      />

      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 z-20" style={{ top: 'calc(-2.5rem - 3vh)' }}>
          <img
            src="/images/litf_logo.png"
            alt="LITF Logo"
            className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-md bg-white p-1 hover:cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <div className="col-span-full h-8 md:h-8 lg:h-12" />

        <div className="md:col-span-2">
          <h2 className="text-xl md:text-2xl font-bold text-primary-600 mb-2">Complete Your Profile</h2>
          <p className="text-gray-500 mb-4 md:mb-6 text-sm md:text-base">Please fill in your details to continue.</p>
        </div>

        {/* Left Side Form */}
        <div className="space-y-3 md:space-y-4">
          <div>
            <label className="text-sm text-gray-600">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              className={`w-full border rounded-md px-3 md:px-4 py-2 md:py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm md:text-base ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className={`w-full border rounded-md px-3 md:px-4 py-2 md:py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm md:text-base ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full border rounded-md px-3 md:px-4 py-2 md:py-2 mt-1 bg-gray-100 text-gray-500 text-sm md:text-base"
            />
          </div>

          <PhoneInput
            value={formData.phone}
            onChange={handlePhoneChange}
            label="Phone"
            placeholder="Enter phone number"
            error={errors.phone}
          />
        </div>

        {/* Right Side Form */}
        <div className="space-y-3 md:space-y-4">
          <div>
            <label className="text-sm text-gray-600">Street Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              className={`w-full border rounded-md px-3 md:px-4 py-2 md:py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm md:text-base ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              className={`w-full border rounded-md px-3 md:px-4 py-2 md:py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm md:text-base ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-600">State</label>
            {availableStates.length > 0 ? (
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 md:px-4 py-2 md:py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm md:text-base ${
                  errors.state ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select state</option>
                {availableStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder={formData.country ? "Enter state/province" : "Select country first"}
                disabled={!formData.country}
                className={`w-full border rounded-md px-3 md:px-4 py-2 md:py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm md:text-base ${
                  errors.state ? "border-red-500" : "border-gray-300"
                } ${!formData.country ? "bg-gray-100 text-gray-500" : ""}`}
              />
            )}
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-600">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 md:px-4 py-2 md:py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm md:text-base ${
                errors.country ? "border-red-500" : "border-gray-300"
              }`}
            >
              {countriesList.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">{errors.country}</p>
            )}
          </div>
        </div>

        {isExhibitor && (
          <>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company"
                className="w-full border rounded-md px-3 md:px-4 py-2 md:py-2 mt-1 bg-gray-100 text-gray-500 text-sm md:text-base cursor-not-allowed"
                disabled
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Sector</label>
              <select
                  name="boothType"
                  value={formData.boothType}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 md:px-4 py-2 md:py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm md:text-base ${
                    errors.boothType ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select sector</option>
                  {boothTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.boothType && (
                  <p className="text-red-500 text-xs mt-1">{errors.boothType}</p>
                )}
            </div>

            {/* Notice about sector selection */}
            <div className="md:col-span-2">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 md:p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">Important Notice</h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p className="mb-2">
                        The sector you select will determine the location and types of booths available for booking. 
                        This selection affects your placement within the trade fair.
                      </p>
                      <p>
                        <strong>Need to change your sector?</strong> Please contact our admin team at{' '}
                        <a 
                          href="mailto:info@lagosinternationaltradefair.com" 
                          className="text-amber-900 underline hover:text-amber-800"
                        >
                          info@lagosinternationaltradefair.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booth Preference Section */}
            {/* <div className="md:col-span-2">
              <label className="text-sm text-gray-600 mb-2 block">Booth Preference</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="boothPreference"
                    value="indoor"
                    checked={formData.boothPreference === "indoor"}
                    onChange={handleChange}
                    className="mr-2 text-primary-600 focus:ring-primary-400"
                  />
                  <span className="text-sm">Indoor Hall</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="boothPreference"
                    value="outdoor"
                    checked={formData.boothPreference === "outdoor"}
                    onChange={handleChange}
                    className="mr-2 text-primary-600 focus:ring-primary-400"
                  />
                  <span className="text-sm">Outdoor Sectors</span>
                </label>
              </div>
              {errors.boothPreference && (
                <p className="text-red-500 text-xs mt-1">{errors.boothPreference}</p>
              )}
            </div> */}
            
          </>
        )}

        <div className="md:col-span-2 mt-4 md:mt-6">
          {errors.submit && (
            <div className="text-red-500 text-sm text-center mb-4">{errors.submit}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 md:py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            onClick={handleSubmit}
          >
            {isSubmitting ? "Saving..." : "Complete Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
