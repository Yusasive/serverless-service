import { z } from 'zod';
import { UserRole } from '../repository/UserRepository';
import parsePhoneNumber from 'libphonenumber-js'

// Base schema with common fields
const baseProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().refine((val) => {
    try {
      const phoneNumber = parsePhoneNumber(val);
      return phoneNumber && phoneNumber.isValid();
    } catch (error) {
      return false;
    }
  }, {
    message: 'Invalid phone number',
  }),
});

// Attendee schema (base fields only)
export const attendeeProfileSchema = baseProfileSchema;

// Exhibitor schema (base + exhibitor fields)
export const exhibitorProfileSchema = baseProfileSchema.extend({
  boothPreference: z.string().optional(),
  boothType: z.string().min(1, 'Sector is required'),
  company: z.string().optional(),
});

// Legacy schema for backward compatibility
export const profileSchema = baseProfileSchema.extend({
  local: z.string().optional(),
  boothPreference: z.string().optional(),
  boothType: z.string().optional(),
  company: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type AttendeeProfileFormData = z.infer<typeof attendeeProfileSchema>;
export type ExhibitorProfileFormData = z.infer<typeof exhibitorProfileSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
  staffId: z.string().optional(),
  role: z.nativeEnum(UserRole)
}).refine((data) => {
  // If role is staff, staffId is required
  if (data.role === UserRole.STAFF) {
    return data.staffId && data.staffId.length > 0;
  }
  return true;
}, {
  message: "Staff ID is required for staff login",
  path: ["staffId"]
});

export type LoginFormData = {
  email: string;
  password: string;
  staffId?: string;
  role: UserRole;
} & {
  submit?: string;
};

// Schema for form validation (phone without country code)
export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirm_password: z.string().min(1, 'Confirm your password'),
  phone: z.string().refine((val) => {
    try {
      const phoneNumber = parsePhoneNumber(val);
      return phoneNumber && phoneNumber.isValid();
    } catch (error) {
      return false;
    }
  }, {
    message: 'Invalid phone number',
  }),
  company_name: z.string().optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

export type RegisterFormData = z.infer<typeof registerSchema> & {
  submit?: string;
};

// Forgot password schemas
export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const verificationCodeSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema> & {
  submit?: string;
};

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema> & {
  submit?: string;
};

export type VerificationCodeFormData = z.infer<typeof verificationCodeSchema> & {
  submit?: string;
};
