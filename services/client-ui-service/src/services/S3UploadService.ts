import { USER_BASE_URL } from "@/common/TextStrings";

export interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export class S3UploadService {
  private static instance: S3UploadService;
  private baseUrl: string;

  private constructor() {
    if (import.meta.env.VITE_ENVIRONMENT === 'dev' || import.meta.env.VITE_ENVIRONMENT === 'prod') {
        this.baseUrl = import.meta.env.VITE_SERVICE_BASE_URL + '/user';
      } else {
        this.baseUrl = USER_BASE_URL;
      }
  }

  public static getInstance(): S3UploadService {
    if (!S3UploadService.instance) {
      S3UploadService.instance = new S3UploadService();
    }
    return S3UploadService.instance;
  }

  async uploadImage(file: File, folder: string = 'uploads'): Promise<UploadResponse> {
    try {
      // Convert file to base64
      const base64 = await this.fileToBase64(file);

      // Upload to backend endpoint that will handle S3 upload
      const response = await fetch(`${this.baseUrl}/upload/image`, {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file: base64,
          filename: file.name,
          contentType: file.type,
          folder: folder
        })
      });

      const result = await response.json();

      if (response.ok && result.message === 'success' && result.data?.url) {
        return {
          success: true,
          url: result.data.url
        };
      } else {
        return {
          success: false,
          error: result.message || 'Upload failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  async deleteImage(imageUrl: string): Promise<UploadResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/upload/delete`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: imageUrl })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return {
          success: true
        };
      } else {
        return {
          success: false,
          error: result.error || 'Delete failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed'
      };
    }
  }

  // Helper method to validate file
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size must be less than 5MB'
      };
    }

    return { isValid: true };
  }
} 